import React, { useState } from "react";
import { Card, CardContent } from "./OpenAI/ui/card";
import JobDescription from "./OpenAI/JobDescription.jsx";
import ChatWithAI from "./OpenAI/ChatWithAI.jsx";
import UploadResume from "./OpenAI/UploadResume.jsx";
import ResumeTransformDemo from "./OpenAI/ResumeTransformDemo.jsx";
import { Upload, FileText, MessageSquare } from "lucide-react";
import "./Tailored.css";

function LandingPage({ onNavigate }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-accent">
          Welcome to SUITED
        </h1>
        <p className="text-xl text-foreground/80">
          Transform your career journey with AI-powered resume optimization
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card
          className="bg-secondary shadow-custom cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onNavigate("upload")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <Upload className="w-12 h-12 text-accent mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">
              Upload Resume
            </h2>
            <p className="text-sm text-foreground/80">
              Upload your existing resume for AI-powered transformation
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-secondary shadow-custom cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onNavigate("job")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <FileText className="w-12 h-12 text-accent mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">
              Job Description
            </h2>
            <p className="text-sm text-foreground/80">
              Paste a job description to tailor your resume
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-secondary shadow-custom cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onNavigate("chat")}
        >
          <CardContent className="p-6 text-center space-y-4">
            <MessageSquare className="w-12 h-12 text-accent mx-auto" />
            <h2 className="text-xl font-semibold text-foreground">
              Chat with SUITED
            </h2>
            <p className="text-sm text-foreground/80">
              Get AI assistance in building your perfect resume
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [uploadedResume, setUploadedResume] = useState(null);

  const handleUploadComplete = (file) => {
    setUploadedResume(file);
    setCurrentView("transform");
  };

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage onNavigate={setCurrentView} />;
      case "upload":
        return <UploadResume onUploadComplete={handleUploadComplete} />;
      case "job":
        return <JobDescription />;
      case "chat":
        return <ChatWithAI />;
      case "transform":
        return <ResumeTransformDemo resume={uploadedResume} />;
      default:
        return <LandingPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="custom-theme">
      <div className="min-h-screen bg-primary py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {currentView !== "landing" && (
            <button
              onClick={() => setCurrentView("landing")}
              className="mb-6 px-4 py-2 text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
            >
              ← Back to Home
            </button>
          )}
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default App;
