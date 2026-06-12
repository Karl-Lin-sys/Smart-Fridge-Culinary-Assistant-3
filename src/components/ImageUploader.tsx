import { UploadCloud, Camera } from "lucide-react";
import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
}

export function ImageUploader({ onImageSelected, isAnalyzing }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
        isDragging ? 'border-amber-500 bg-amber-50' : 'border-gray-300 bg-white hover:border-amber-400 hover:bg-gray-50'
      } ${isAnalyzing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
          <Camera className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Snap your open fridge</h3>
          <p className="text-sm text-gray-500">
            Drag & drop an image here, or click to upload
          </p>
        </div>
        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl rounded-xl z-10 backdrop-blur-sm">
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-lg border border-gray-100">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-800">Analyzing ingredients...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
