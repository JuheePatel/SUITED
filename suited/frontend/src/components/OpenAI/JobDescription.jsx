import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { FileText, Loader2 } from "lucide-react";
import { analyzeJobDescription } from "./services/openai";

export default function JobDescription() {
  const [description, setDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!description.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeJobDescription(description);
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing job description:", error);
      setError("Failed to analyze the job description. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-secondary shadow-custom">
        <CardHeader>
          <CardTitle className="text-xl text-accent flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Job Description Analysis
          </CardTitle>
          <p className="text-sm text-foreground/80">
            Paste the job description to get AI-powered insights and resume
            optimization suggestions
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-48 p-4 bg-primary text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            placeholder="Paste the job description here..."
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !description.trim()}
            className="w-full px-6 py-2 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Job Description"
            )}
          </button>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="bg-secondary shadow-custom">
          <CardHeader>
            <CardTitle className="text-xl text-accent">
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground/80">
                {analysis}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
