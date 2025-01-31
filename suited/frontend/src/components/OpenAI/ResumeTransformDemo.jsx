import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { anonymizeResume } from "./services/openaiJson.js";
import { User, Briefcase, GraduationCap, Award } from "lucide-react";

export default function ResumeTransformDemo({ resume }) {
  const [activeTab, setActiveTab] = useState("original");
  const [formattedResume, setFormattedResume] = useState({
    personalInfo: { name: "", email: "", phone: "", location: "" },
    experience: [],
    education: { university: "", degree: "", year: "" },
    skills: [],
    candidateId: "",
    competencyArea: "",
    competencyMetrics: {
      technical: "",
      leadership: "",
      problemSolving: "",
      communication: "",
    },
    transformedSkills: { technical: [], core: [] },
    transformedExperience: { level: "", totalYears: "", achievements: [] },
  });
  const [loading, setLoading] = useState(false);

  const fetchFormattedResume = async () => {
    setLoading(true);
    try {
      const result = await anonymizeResume(resume, activeTab);

      setFormattedResume((prevState) => ({
        ...prevState,
        ...result,
        personalInfo: {
          ...prevState.personalInfo,
          ...result.personalInfo,
        },
        education: {
          ...prevState.education,
          ...result.education,
        },
        competencyMetrics: {
          ...prevState.competencyMetrics,
          ...result.competencyMetrics,
        },
        transformedSkills: {
          ...prevState.transformedSkills,
          ...result.transformedSkills,
        },
        transformedExperience: {
          ...prevState.transformedExperience,
          ...result.transformedExperience,
        },
      }));
    } catch (error) {
      console.error("Error fetching formatted resume:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormattedResume();
  }, [activeTab, resume]);

  return (
    <Card className="w-full max-w-4xl bg-secondary shadow-custom">
      <CardHeader>
        <CardTitle className="text-xl text-accent">
          Resume Transformation Preview
        </CardTitle>
        <p className="text-sm text-foreground/80">
          Switch between the traditional resume and the anonymized profile to
          see how bias-related information is removed.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-primary">
            <TabsTrigger value="original">Traditional Resume</TabsTrigger>
            <TabsTrigger value="transformed">Anonymized Profile</TabsTrigger>
          </TabsList>
          {loading && (
            <div className="flex justify-center items-center space-x-3 py-2">
              <div className="w-6 h-6 border-2 border-solid border-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-white-600">Loading...</p>
            </div>
          )}

          {!loading && formattedResume && activeTab == "original" && (
            <TabsContent value="original">
              <div className="p-6 space-y-6 border border-border/20 rounded-lg bg-card/50">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <User className="w-6 h-6 text-accent self-start mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {formattedResume.personalInfo.name || "N/A"}
                      </h3>
                      <p className="text-sm text-foreground/80">
                        {formattedResume.personalInfo.email || "N/A"}
                      </p>
                      <p className="text-sm text-foreground/80">
                        {formattedResume.personalInfo.phone || "N/A"}
                      </p>
                      <p className="text-sm text-foreground/80">
                        {formattedResume.personalInfo.location || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold text-foreground">
                        Experience
                      </h3>
                    </div>
                    {formattedResume.experience.length > 0 ? (
                      formattedResume.experience.map((job, index) => (
                        <div key={index} className="pl-6 space-y-1">
                          <h4 className="font-medium text-foreground">
                            {job.title || "N/A"} at {job.company || "N/A"}
                          </h4>
                          <p className="text-sm text-foreground/80">
                            {job.duration || "N/A"}
                          </p>
                          {job.responsibilities &&
                          job.responsibilities.length > 0 ? (
                            <ul className="list-disc list-inside text-sm text-foreground/80">
                              {job.responsibilities.map((resp, idx) => (
                                <li key={idx}>{resp}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-foreground/80">
                              No responsibilities listed.
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-foreground/80">
                        No experience data available.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold text-foreground">
                        Education
                      </h3>
                    </div>
                    <div className="pl-6">
                      <p className="font-medium text-foreground">
                        {formattedResume.education.degree || "N/A"}
                      </p>
                      <p className="text-sm text-foreground/80">
                        {formattedResume.education.university || "N/A"},{" "}
                        {formattedResume.education.year || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold text-foreground">Skills</h3>
                    </div>
                    {formattedResume.skills.length > 0 ? (
                      <ul className="pl-6 list-disc list-inside text-sm text-foreground/80">
                        {formattedResume.skills
                          .flatMap((skill) => skill.split(","))
                          .map((individualSkill, index) => (
                            <li key={index}>
                              {individualSkill.trim() || "N/A"}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-foreground/80">
                        No skills data available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
          {!loading && formattedResume && activeTab == "transformed" && (
            <TabsContent value="transformed">
              <div className="p-6 space-y-6 border border-border/20 rounded-lg bg-card/50">
                <p className="text-sm text-foreground/80 bg-primary/50 p-2 rounded">
                  This is the anonymized profile view. Personal information and
                  bias-inducing details have been removed.
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold text-foreground">
                        Candidate ID
                      </h3>
                    </div>
                    <p className="text-sm text-foreground/80">
                      {formattedResume.candidateId || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold text-foreground">
                        Competency Area
                      </h3>
                    </div>
                    <p className="text-sm text-foreground/80">
                      {formattedResume.competencyArea || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold text-foreground">Skills</h3>
                    </div>
                    {formattedResume.skills &&
                    formattedResume.skills.technical?.length > 0 ? (
                      <ul className="pl-6 list-disc list-inside text-sm text-foreground/80">
                        {formattedResume.skills.technical.map(
                          (skill, index) => (
                            <li key={index}>{skill}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-foreground/80">
                        No technical skills data available.
                      </p>
                    )}
                    {formattedResume.skills &&
                    formattedResume.skills.core?.length > 0 ? (
                      <ul className="pl-6 list-disc list-inside text-sm text-foreground/80">
                        {formattedResume.skills.core.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-foreground/80">
                        No core skills data available.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold text-foreground">
                        Experience
                      </h3>
                    </div>
                    <p className="text-sm text-foreground/80">
                      {formattedResume.experience?.level || "N/A"} (
                      {formattedResume.experience?.totalYears || "N/A"} years)
                    </p>
                    {formattedResume.experience &&
                    formattedResume.experience.achievements?.length > 0 ? (
                      <ul className="pl-6 list-disc list-inside text-sm text-foreground/80">
                        {formattedResume.experience.achievements.map(
                          (achievement, index) => (
                            <li key={index}>{achievement}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-foreground/80">
                        No achievements data available.
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5 text-accent" />
                      <h3 className="font-semibold text-foreground">
                        Competency Metrics
                      </h3>
                    </div>
                    {formattedResume.competencyMetrics ? (
                      <ul className="pl-6 list-disc list-inside text-sm text-foreground/80">
                        <li>
                          Technical:{" "}
                          {formattedResume.competencyMetrics.technical || "N/A"}
                          %
                        </li>
                        <li>
                          Leadership:{" "}
                          {formattedResume.competencyMetrics.leadership ||
                            "N/A"}
                          %
                        </li>
                        <li>
                          Problem Solving:{" "}
                          {formattedResume.competencyMetrics.problemSolving ||
                            "N/A"}
                          %
                        </li>
                        <li>
                          Communication:{" "}
                          {formattedResume.competencyMetrics.communication ||
                            "N/A"}
                          %
                        </li>
                      </ul>
                    ) : (
                      <p className="text-sm text-foreground/80">
                        No competency metrics data available.
                      </p>
                    )}
                  </div>
                  <div className="p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-foreground">
                      Why This Matters
                    </h4>
                    <p className="text-sm text-foreground/80">
                      Removing names, locations, and dates helps hiring managers
                      focus on skills and achievements, reducing unconscious
                      bias.
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button className="px-4 py-2 text-white bg-blue-500 rounded-lg">
                      Download Anonymized Profile
                    </button>
                    <button className="px-4 py-2 text-blue-500 border rounded-lg">
                      Learn About Bias Reduction
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
