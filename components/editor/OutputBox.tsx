import EditorBoxLayout from "./layout";
import { Image, Download, X, ZoomIn } from "lucide-react";
import { useState } from "react";

interface OutputBoxProps {
  generatedImage: string | null;
}

export default function OutputBox({ generatedImage }: OutputBoxProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      // If it's a Supabase storage URL, download directly
      if (generatedImage.includes('supabase')) {
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `generated-image-${Date.now()}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // For external URLs, try to fetch and download
      const response = await fetch(generatedImage, {
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(generatedImage, '_blank');
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
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="text-white" size={32} />
                </div>
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
                <span className="w-20 h-20 flex items-center justify-center bg-gray-700 rounded-full">
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

      {/* Lightbox */}
      {isLightboxOpen && generatedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            // Close if clicking the backdrop
            if (e.target === e.currentTarget) {
              setIsLightboxOpen(false);
            }
          }}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X size={32} />
            </button>
            <img
              src={generatedImage}
              alt="Generated result - full size"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
