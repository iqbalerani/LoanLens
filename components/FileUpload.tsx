
import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (base64: string, mimeType: string, fileName: string) => void;
  selectedFileName: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFileName }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      onFileSelect(base64, file.type, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    if (!fileInputRef.current) {
      alert('Error: File input not available. Please refresh the page.');
      return;
    }

    try {
      fileInputRef.current.click();
    } catch (error) {
      console.error('Error triggering file input:', error);
      alert('Error opening file picker. Please try again.');
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-[2.5rem] p-10 transition-all duration-500 text-center flex flex-col items-center justify-center h-full min-h-[400px] ${
        isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[0.98]' 
          : 'border-white/10 bg-white/[0.02] hover:border-indigo-500/50 hover:bg-white/[0.04] group'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) processFile(file); }}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden" 
        accept="image/*,application/pdf"
      />
      
      {selectedFileName ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 transform rotate-12 transition-transform group-hover:rotate-6">
              <i className="fa-solid fa-file-invoice text-4xl"></i>
            </div>
            <div className="absolute -top-3 -right-3 bg-indigo-400 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-lg border border-white/20">
              Validated
            </div>
          </div>
          <p className="text-white font-extrabold text-xl mb-2 max-w-[280px] truncate">{selectedFileName}</p>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-10">Document Loaded</p>
          <button
            onClick={handleBrowseClick}
            className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border border-white/10"
          >
            Replace Asset
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white/5 text-white/20 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/10 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-12 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-700">
            <i className="fa-solid fa-cloud-arrow-up text-4xl"></i>
          </div>
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Source Documents</h3>
          <p className="text-white/40 text-sm font-medium mb-12 max-w-[300px] mx-auto leading-relaxed">
            Upload pay stubs, bank ledgers or tax filings for AI-driven verification.
          </p>
          <button
            onClick={handleBrowseClick}
            className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 border border-white/10"
          >
            Browse Assets
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
