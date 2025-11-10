import EditorBoxLayout from "./layout";
import { Image, Download, X, ZoomIn } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";


interface OutputBoxProps {
  generatedImage: string | null;
}

export default function OutputBox({ generatedImage }: OutputBoxProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [genLoading, setGenLoading] =  useState(false);

  const handleDownload = async () => {
    if (!generatedImage) return;
  
    try {
      // 1️⃣ If it's from Supabase storage (has bucket path)
      if (generatedImage.includes("supabase")) {
        // Extract the file path (you can store it directly in state if available)
        const filePath = generatedImage.split("/generatedImagesBucket/")[1];
        if (!filePath) throw new Error("Invalid Supabase file path");
  
        // 2️⃣ Download file using Supabase Storage API
        const { data, error } = await supabase
          .storage
          .from("generatedImagesBucket")
          .download(filePath);
  
        if (error) throw error;
  
        // 3️⃣ Convert blob to downloadable link
        const url = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filePath.split("/").pop() || `generated-image-${Date.now()}.webp`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
  
        return;
      }
  
      // 4️⃣ Fallback for external URLs (fetch + blob)
      const response = await fetch(generatedImage, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image");
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(generatedImage, "_blank"); // fallback open
    }
  };

  return (
    <>
      <EditorBoxLayout
        boxTitle="Output Gallery"
        headerIcon={Image}
        iconProps={{ color: "#808080", size: 24, strokeWidth: 2 }}
      >
        <div className="border border-dashed border-gray-600 bg-gray-900 h-full rounded-lg p-4 w-full flex flex-col">
          {generatedImage ? (
            <div className="flex flex-col h-full">
              <div className="flex justify-center items-center h-full relative group">
                <img
                  src={generatedImage}
                  alt="Generated result"
                  className="max-h-[400px] w-auto rounded-md object-contain shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => window.open(generatedImage, '_blank')}
                />
                
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-4 text-gray-400 h-full">
              <div className="flex justify-center items-center">
                <span className={`w-20 h-20 flex items-center justify-center bg-gray-700 rounded-full ${genLoading && ('animate-pulse border-2 border-primary-400')}`}>
                  <Image size={40} color="#9CA3AF" />
                </span>
              </div>
              <p className="text-center text-sm">
                Generated images will appear here
              </p>
            </div>
          )}
        </div>
      </EditorBoxLayout>

      
    </>
  );
}
