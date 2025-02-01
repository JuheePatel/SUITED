import jsPDF from "jspdf";

const downloadPDF = (formattedResume, activeTab) => {
  const pdf = new jsPDF("p", "mm", "a4");

  const margin = 10;
  const pageWidth = 210; // A4 paper size
  let currentY = margin;

  // Helper function to add text with wrapping
  const addText = (text, fontSize = 12, bold = false) => {
    const lineHeight = 6;
    const maxWidth = pageWidth - 2 * margin;
    const lines = pdf.splitTextToSize(text, maxWidth);
    if (bold) {
      pdf.setFont("helvetica", "bold");
    } else {
      pdf.setFont("helvetica", "normal");
    }
    pdf.setFontSize(fontSize);
    lines.forEach(line => {
      pdf.text(line, margin, currentY);
      currentY += lineHeight;
    });
  };

  // Add title
  pdf.setFontSize(18);
  const headerTitle = activeTab === "original" ? "Original Resume" : "Anonymized Resume";
  pdf.text(headerTitle, pageWidth / 2 - 30, currentY);
  currentY += 20;

  // Add Personal Info for Original or Candidate ID for Anonymized
  if (activeTab === "original") {
    addText("Personal Information", 14, true);
    addText(`Name: ${formattedResume.personalInfo?.name || "N/A"}`);
    addText(`Email: ${formattedResume.personalInfo?.email || "N/A"}`);
    addText(`Phone: ${formattedResume.personalInfo?.phone || "N/A"}`);
  } else if (activeTab === "transformed") {
    addText("Candidate ID", 14, true);
    addText(`${formattedResume.candidateId || "N/A"}`);
  }
  currentY += 10;

  // Add Competency Area (only for transformed profile)
  if (activeTab === "transformed") {
    addText("Competency Area", 14, true);
    addText(formattedResume.competencyArea || "N/A");
    currentY += 10;
  }

  // Add Experience (handle transformed structure)
  addText("Experience", 14, true);
  if (activeTab === "transformed") {
    if (formattedResume.experience && formattedResume.experience.level) {
      addText(`${formattedResume.experience.level || "N/A"} (${formattedResume.experience.totalYears || "N/A"} years)`);
      if (formattedResume.experience.achievements && formattedResume.experience.achievements.length > 0) {
        formattedResume.experience.achievements.forEach((achievement, index) => {
          addText(`- ${achievement}`);
        });
      } else {
        addText("- No achievements listed.");
      }
    } else {
      addText("No experience data available.");
    }
  } else {
    if (formattedResume.experience && formattedResume.experience.length > 0) {
      formattedResume.experience.forEach((job) => {
        addText(`Title: ${job.title || "N/A"} at ${job.company || "N/A"}`);
        addText(`Duration: ${job.duration || "N/A"}`);
        if (job.responsibilities?.length > 0) {
          job.responsibilities.forEach((resp) => {
            addText(`- ${resp}`);
          });
        } else {
          addText("- No responsibilities listed.");
        }
      });
    } else {
      addText("No experience data available.");
    }
  }
  currentY += 10;

  // Add Skills (handle transformed structure)
  addText("Skills", 14, true);
  if (activeTab === "transformed") {
    if (formattedResume.skills) {
      // Technical Skills
      if (formattedResume.skills.technical && formattedResume.skills.technical.length > 0) {
        formattedResume.skills.technical.forEach((skill, index) => {
          addText(`- ${skill}`);
        });
      } else {
        addText("No technical skills data available.");
      }
      // Core Skills
      if (formattedResume.skills.core && formattedResume.skills.core.length > 0) {
        formattedResume.skills.core.forEach((skill, index) => {
          addText(`- ${skill}`);
        });
      } else {
        addText("No core skills data available.");
      }
    } else {
      addText("No skills data available.");
    }
  } else {
    if (formattedResume.skills && formattedResume.skills.length > 0) {
      formattedResume.skills.forEach((skill) => {
        addText(`- ${skill}`);
      });
    } else {
      addText("No skills data available.");
    }
  }
  currentY += 10;

  // Add Education
  addText("Education", 14, true);
  addText(`Degree: ${formattedResume.education?.degree || "N/A"}`);
  addText(`University: ${formattedResume.education?.university || "N/A"}`);
  addText(`Year: ${formattedResume.education?.year || "N/A"}`);
  currentY += 10;

  // Add Competency Metrics (only for transformed profile)
  if (activeTab === "transformed" && formattedResume.competencyMetrics) {
    addText("Competency Metrics", 14, true);
    addText(`Technical: ${formattedResume.competencyMetrics.technical || "N/A"}%`);
    addText(`Leadership: ${formattedResume.competencyMetrics.leadership || "N/A"}%`);
    addText(`Problem Solving: ${formattedResume.competencyMetrics.problemSolving || "N/A"}%`);
    addText(`Communication: ${formattedResume.competencyMetrics.communication || "N/A"}%`);
    currentY += 10;
  }

  // Save the PDF
  pdf.save(`${headerTitle.replace(/\s+/g, '-')}.pdf`);
};

export default downloadPDF;
