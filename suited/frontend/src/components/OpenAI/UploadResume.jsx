import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Upload } from 'lucide-react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set the correct worker source dynamically
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();


export default function UploadResume({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type === "application/pdf") {
      extractTextFromPDF(file);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      extractTextFromWord(file);
    } else {
      alert("Unsupported file format. Please upload a PDF, DOC, or DOCX file.");
    }
  };

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        text += pageText + "\n";
      }

      onUploadComplete(text);
    };
    reader.readAsArrayBuffer(file);
  };

  const extractTextFromWord = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
        onUploadComplete(result.value);
      } catch (error) {
        console.error("Error extracting text from Word file:", error);
        alert("Failed to extract text from the uploaded Word file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Card className="bg-secondary shadow-custom">
      <CardHeader>
        <CardTitle className="text-xl text-accent">Upload Your Resume</CardTitle>
        <p className="text-sm text-foreground/80">Upload your resume in PDF or Word format</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-accent bg-accent/10' : 'border-accent/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-accent mx-auto mb-4 cursor-pointer" />
          <p className="text-foreground/80">
            {isDragging ? 'Drop your file here' : 'Drag and drop your resume here, or click to browse'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
          />
        </div>
        <div className="text-center text-sm text-foreground/60">
          Supported formats: PDF, DOC, DOCX
        </div>
      </CardContent>
    </Card>
  );
}
