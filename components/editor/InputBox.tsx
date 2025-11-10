'use client'
import { Brain, Plus, Zap, Upload, X, Sparkles, Image as ImageIcon } from "lucide-react";
import EditorBoxLayout from "./layout";
import { useState, useCallback, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "@/utils/supabase/client";
import { useCredits } from "../hooks/useCredits";

interface InputBoxProps {
  setGeneratedImage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function InputBox({ setGeneratedImage }: InputBoxProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [genLoading, setGenLoading] = useState(false);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { refreshCredits } = useCredits();
  const userId = user?.id;

  const themes = [
    { 
      id: 1, 
      theme: "Realistic", 
      description: "Realistic style",
      icon: "🎨"
    },
    { 
      id: 2, 
      theme: "Anime", 
      description: "Japanese animation style",
      icon: "⚡"
    },
    { 
      id: 3, 
      theme: "Photoshoot", 
      description: "Professional photography",
      icon: "📸"
    },
    { 
      id: 4, 
      theme: "Africon", 
      description: "African cultural themes",
      icon: "🌍"
    }
  ]

  // Drag and drop handlers
  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files && files.length > 0) {
      handleFileProcessing(files[0]);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    // Check file format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPEG, PNG, or WebP image';
    }

    return null;
  };

  const handleFileProcessing = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploadedFile(file);
    setError(null);
    setSuccess(`Successfully uploaded ${file.name}`);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  // Function to poll for prediction status
  const pollForResult = async (id: string) => {
    const maxAttempts = 60; // Maximum 60 attempts (1 minute)
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`/api/generate/${id}`);
        const data = await response.json();

        if (data.status === 'succeeded' && data.output) {
          return data.output[0]; // Return the generated image URL
        } else if (data.status === 'failed') {
          throw new Error('Generation failed');
        }

        // Wait 1 second before next poll
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      } catch (err) {
        console.error('Polling error:', err);
        throw err;
      }
    }
    throw new Error('Generation timed out');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (genLoading) return;
  
    setError(null);
    setGenLoading(true);
  
    try {
      // ✅ Check login
      if (!userId) {
        setError("Please log in to generate images");
        setGenLoading(false);
        return;
      }
  
      // ✅ Validate prompt or upload
      if (!prompt && !uploadedFile) {
        setError("Please enter a prompt or upload an image");
        setGenLoading(false);
        return;
      }
  
      let imageUrl = null;
  
      // ✅ Upload user image (if provided)
      if (uploadedFile) {
        const fileName = `${userId}/${Date.now()}-${uploadedFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('useruploads')
          .upload(fileName, uploadedFile);
  
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          setError("Failed to upload image");
          setGenLoading(false);
          return;
        }
  
        const { data: publicUrlData } = supabase
          .storage
          .from('useruploads')
          .getPublicUrl(uploadData.path);
  
        imageUrl = publicUrlData.publicUrl;
      }
  
      // ✅ Call your API route
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || "A beautiful AI-generated image",
          imageUrl,
          theme: selectedTheme,
          userId,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }
  
      // ✅ Show the result
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        console.log("✅ Image generated:", data.imageUrl);
        
        // Refresh credits in navbar
        refreshCredits();
      } else {
        setError("Something went wrong — no image returned");
      }
  
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setGenLoading(false);
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcessing(file);
    }
  };

  const clearImage = () => {
    setUploadedFile(null);
    setPreviewImage(null);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <EditorBoxLayout 
      boxTitle="Create Your Image" 
      headerIcon={Brain} 
      iconProps={{ color: "#cb50ff", size: 24, strokeWidth: 2 }}
    >
      <div className="w-full space-y-6">
        <form onSubmit={handleGenerate} className="space-y-6" id="inputForm">
          
          {/* Success Message */}
          {success && (
            <div className="bg-success-500/10 border border-success-500/20 rounded-lg p-4 flex items-center gap-3 animate-slide-in">
              <Sparkles className="text-success-500" size={18} />
              <p className="text-success-400 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4 flex items-center gap-3 animate-slide-in">
              <X className="text-error-500 flex-shrink-0" size={18} />
              <p className="text-error-400 text-sm">{error}</p>
            </div>
          )}

          {/* File Upload Area */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Upload Image (Optional)
            </label>
            
            {!previewImage ? (
              <div
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={triggerFileInput}
                className={`relative cursor-pointer transition-all duration-200 ${
                  isDragActive 
                    ? 'border-primary-400 bg-primary-500/5 scale-105' 
                    : 'border-primary-500/50 hover:border-primary-400 hover:bg-primary-500/5'
                } border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-4`}
              >
                <div className={`p-4 rounded-full transition-colors ${
                  isDragActive ? 'bg-primary-500/20' : 'bg-gray-800'
                }`}>
                  <Upload className={`transition-colors ${
                    isDragActive ? 'text-primary-400' : 'text-primary-500'
                  }`} size={32} />
                </div>
                
                <div className="text-center">
                  <p className="text-white font-medium mb-1">
                    {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    or <span className="text-primary-400">click to browse</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Supports JPEG, PNG, WebP • Max 10MB
                  </p>
                </div>
                
                <input 
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative w-fit">
                <div className="relative overflow-hidden rounded-xl border-2 border-primary-500/30">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="max-w-sm max-h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-error-500 hover:bg-error-600 text-white rounded-full p-2 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1">
                  <p className="text-white text-sm flex items-center gap-2">
                    <ImageIcon size={14} />
                    {uploadedFile?.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          {selectedTheme !== "Africon" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Describe Your Vision
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="textarea-field w-full h-24"
                placeholder="Describe what you want to generate... (e.g., A vibrant sunset over mountains with dramatic clouds)"
              />
            </div>
          )}

          {/* Theme Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Choose Style
            </label>
            <div className="sm:grid sm:grid-cols-2 space-x-3 space-y-2 lg:flex gap-3">
              {themes.map((theme) => (
                <button 
                  key={theme.id} 
                  type="button" 
                  onClick={() => setSelectedTheme(selectedTheme === theme.theme ? '' : theme.theme)}
                  className={`p-1 px-3 rounded-2xl text-left transition-all duration-200 border ${
                    selectedTheme === theme.theme 
                      ? 'border-primary-500 bg-primary-500/10 shadow-glow' 
                      : 'hover:border-primary-500/50'
                  }`}
                >
                  <div className="flex items-center "> 
                      <p className="font-base text-white">{theme.theme}</p>
                                     
                 </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status Messages */}
          {genLoading && (
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="text-primary-400 text-sm font-medium">Generating your image...</p>
                <p className="text-gray-400 text-xs">This may take up to 30 seconds</p>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button 
            type="submit"
            disabled={genLoading || (!prompt && !uploadedFile)}
            className="btn-primary w-full flex items-center justify-center gap-3 group relative "
          >
            <Zap className="group-hover:animate-pulse" size={20} /> 
            {genLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </button>

        </form>
      </div>
    </EditorBoxLayout>
  )
}