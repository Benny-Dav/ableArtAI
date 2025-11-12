import { createClient } from "@supabase/supabase-js";
import Replicate from "replicate";
import { NextResponse } from "next/server";

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// Validate environment variables
if (!REPLICATE_API_TOKEN) throw new Error("Replicate token missing");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase service role key missing");
if (!SUPABASE_URL) throw new Error("Supabase URL missing");

// Initialize clients
const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });
const supabaseServer = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    { 
        auth: { 
            persistSession: false,
            autoRefreshToken: false
        }
    }
);

// Helper function to download image to buffer
async function downloadImageToBuffer(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

// Helper function to poll prediction until complete
async function pollPrediction(predictionId: string) {
    let prediction = await replicate.predictions.get(predictionId);
    
    // Poll while processing
    while (prediction.status === "starting" || prediction.status === "processing") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        prediction = await replicate.predictions.get(predictionId);
    }
    
    if (prediction.status === "failed") {
        throw new Error(`Generation failed: ${prediction.error}`);
    }
    
    if (prediction.status === "canceled") {
        throw new Error("Generation was canceled");
    }
    
    return prediction;
}

// Main POST handler
export async function POST(request: Request) {
    try {
        // Parse request body
        const body = await request.json();
        const { prompt, imageUrl, theme, userId } = body;
        
        // Validate inputs
        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }
        
        if (!prompt && !imageUrl) {
            return NextResponse.json({ error: "Either prompt or imageUrl is required" }, { status: 400 });
        }
        
        // Check user credits
        const { data: user, error: userError } = await supabaseServer
            .from('users')
            .select('credits')
            .eq('id', userId)
            .single();
            
        if (userError || !user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        if (user.credits <= 0) {
            return NextResponse.json({ error: "No credits available" }, { status: 403 });
        }
        
        // Build the prompt with theme if provided
        let fullPrompt = prompt || "A beautiful image";
        console.log("Original prompt:", prompt);
        console.log("Selected theme:", theme);
        
        if (theme) {
            if(theme.toLowerCase() === 'africon'){
                console.log("Using AFRICON special prompt");
                // fullPrompt = "Create a full-body semi-realistic version of me that closely resembles my real appearance as in the attached image. I'm wearing a white t-shirt with the word 'AFRICON' only, written in bold blue letters on the front, fitted jeans of any color, and closed-toe footwear such as heels, sneakers, or regular shoes. I have on a graduation cap and a black graduation sash only with a minimal blue kente pattern at the ends. The background should be plain white. Maintain facial likeness accurately to the reference image. Prioritize realistic skin texture, hair detail, and natural body proportions."
                fullPrompt="Create a semi-realistic full body image of the person in the reference photo standing beside an androgynous humanoid AI companion. The AI should have a sleek, human-like design with subtle synthetic details — smooth brown skin, expressive eyes, human-like height and body proportions and a warm, approachable face that conveys friendliness and collaboration. The robot is wearing a white t-shirt with the word ‘AFRICON’ written in bold blue letters on the front, fitted jeans, and high-top sneakers. The t-shirt should have a minimal blue kente pattern on the sleeve edges. The human and AI should appear happy and connected, showing a sense of partnership — for example, a handshake, a side-by-side pose with the robot’s hand on the person’s shoulder, or a shared smile. Maintain facial likeness accurately to the reference image. Prioritize realistic skin texture, hair detail, and natural proportions. Use soft, natural lighting and a minimalist professional background."
            }
            else if(theme.toLowerCase()==='realistic'){
                console.log('Using Realistic style theme');
                fullPrompt=`${fullPrompt}, ${"Ensure absolute realism. Maintain facial likeness accurately to the reference image. Prioritize realistic skin texture, hair detail, and natural body proportions."}`
            }
            else {
                console.log("Using regular theme style");
                fullPrompt = `${fullPrompt}, ${theme.toLowerCase()} style"`;
            }
        }
        console.log("Final prompt being sent:", fullPrompt);

        // Save initial request to requests table
        console.log("Saving initial request...");
        const { data: requestRecord, error: requestError } = await supabaseServer
            .from('requests')
            .insert({
                user_id: userId,
                prompt: fullPrompt,
                theme: theme || null,
                input_image_url: imageUrl || null,
                status: 'pending',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (requestError) {
            console.error("Failed to save request:", requestError);
        } else {
            console.log("Request saved:", requestRecord?.id);
        }

        // Create Replicate prediction
        const prediction = await replicate.predictions.create({
            version: "858e56734846d24469ed35a07ca2161aaf4f83588d7060e32964926e1b73b7be", // nano-banana model
            input: {
                prompt: fullPrompt,
                // nano-banana uses image_input (array) instead of image
                ...(imageUrl && { image_input: [imageUrl] }),
                aspect_ratio: imageUrl ? "match_input_image" : "1:1",
                output_format: "jpg" // nano-banana outputs jpg by default
            }
        });
        
        console.log(`Prediction created: ${prediction.id}`);
        
        // Wait for completion
        const completedPrediction = await pollPrediction(prediction.id);
        
        // Get generated image URL - nano-banana returns single URL, not array
        const generatedImageUrl = completedPrediction.output;
        if (!generatedImageUrl || typeof generatedImageUrl !== 'string') {
            console.error("Unexpected output format:", completedPrediction.output);
            throw new Error("No valid image URL in prediction output");
        }
        
        // Download image
        const imageBuffer = await downloadImageToBuffer(generatedImageUrl);
        
        // Create storage path
        const timestamp = Date.now();
        const fileName = `${userId}/${timestamp}-${prediction.id}.jpg`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseServer
            .storage
            .from('generatedImagesBucket')
            .upload(fileName, imageBuffer, {
                contentType: 'image/jpeg',
                cacheControl: '3600',
                upsert: false
            });
            
        if (uploadError) {
            throw new Error(`Upload failed: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: publicUrlData } = supabaseServer
            .storage
            .from('generatedImagesBucket')
            .getPublicUrl(fileName);
            
        // Save to database with better error handling
        console.log("Attempting to save to generations table...");
        const { data: generation, error: dbError } = await supabaseServer
            .from('generations')
            .insert({
                user_id: userId,
                input_prompt: prompt || "AI generated image",
                theme: theme || null,
                input_image_url: imageUrl || null,
                generated_image_url: generatedImageUrl,
                storage_url: publicUrlData.publicUrl,
                storage_path: fileName,
                replicate_id: prediction.id,
                created_at: new Date().toISOString()
            })
            .select()
            .single();
            
        if (dbError) {
            console.error("Database save failed - Table might not exist or RLS blocking:", dbError);
            // Return the error details in response for debugging
        } else {
            console.log("Successfully saved to generations table:", generation?.id);
        }

        // Update request status to completed
        if (requestRecord?.id) {
            const { error: updateError } = await supabaseServer
                .from('requests')
                .update({ 
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    generation_id: generation?.id
                })
                .eq('id', requestRecord.id);

            if (updateError) {
                console.error("Failed to update request status:", updateError);
            } else {
                console.log("Request status updated to completed");
            }
        }
        
        // Deduct credit using service role (bypasses RLS)
        console.log("Attempting to deduct credits...");
        const { error: creditError } = await supabaseServer
            .from('users')
            .update({ credits: user.credits - 1 })
            .eq('id', userId);
            
        if (creditError) {
            console.error("Credit deduction failed - RLS might be blocking:", creditError);
        } else {
            console.log("Credits deducted successfully");
        }
        
        // Return success response with debug info
        return NextResponse.json({
            success: true,
            predictionId: prediction.id,
            generationId: generation?.id,
            imageUrl: publicUrlData.publicUrl,
            replicateUrl: generatedImageUrl,
            status: completedPrediction.status,
            creditsRemaining: creditError ? user.credits : user.credits - 1,
            // Include debug info
            dbSaveError: dbError ? dbError.message : null,
            creditError: creditError ? creditError.message : null
        }, { status: 201 });
        
    } catch (error: any) {
        console.error("Generation error:", error);
        return NextResponse.json({
            error: error.message || "Image generation failed",
            details: error.toString()
        }, { status: 500 });
    }
}