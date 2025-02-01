import React, { useState, useEffect } from "react";
import SkillAssessmentResult from "./SkillAssessmentResult";
import { fetchData, postData } from "../api";

const SkillAssessment = () => {
  const styles = {
    container: {
      maxWidth: "800px",
      padding: "20px",
      paddingTop: "0px",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    progressBar: {
      width: "100%",
      backgroundColor: "#e0e0e0",
      borderRadius: "5px",
      marginBottom: "20px",
    },
    progress: {
      height: "10px",
      backgroundColor: "var(--accent)",
      borderRadius: "5px",
    },
    question: {
      marginBottom: "20px",
      padding: "15px",
      minWidth: "800px",
    },
    label: {
      display: "block",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s, border-color 0.3s",
    },
    labelHover: {
      backgroundColor: "#f9f9f9",
      borderColor: "#007BFF",
    },
    button: {
      display: "inline-block",
      width: "48%",
      padding: "15px",
      fontSize: "1.2em",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      textAlign: "center",
      transition: "background-color 0.3s",
    },
    congratsMessage: {
      display: "none",
      fontSize: "2em",
      textAlign: "center",
      marginTop: "20px",
      color: "#28a745",
    },
    errorMessage: {
      color: "#dc3545",
      textAlign: "center",
      marginTop: "20px",
    },
    container: {
      maxWidth: "800px",
      margin: "20px auto",
      fontFamily: "'Arial', sans-serif",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      fontSize: "14px",
    },
    th: {
      border: "1px solid #ddd",
      padding: "10px",
      backgroundColor: "#f4f4f4",
      color: "#333",
      fontWeight: "bold",
      textAlign: "left",
    },
    td: {
      border: "1px solid #ddd",
      padding: "10px",
      textAlign: "left",
      color: "#555",
    },
    trHover: {
      transition: "background-color 0.2s ease-in-out",
    },
    tr: {
      "&:hover": {
        backgroundColor: "#f9f9f9",
      },
    },
    link: {
      color: "#0077cc",
      textDecoration: "underline",
      fontWeight: "bold",
    },
    radioButton: {
      appearance: "none",
      width: "20px",
      height: "20px",
      border: "2px solid #ffc107", // Yellow border
      borderRadius: "50%",
      backgroundColor: "#fff",
      cursor: "pointer",
      outline: "none",
      transition: "background-color 0.3s, border-color 0.3s",
      marginRight: "10px",
    },
    radioButtonChecked: {
      backgroundColor: "#ffc107", // Yellow background when selected
    },
  };
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await fetchData("fetch_skills.php");

        if (data.Skills && Array.isArray(data.Skills)) {
          const formattedQuestions = data.Skills.map((skill) => ({
            ElementId: skill.ElementId,
            ElementName: skill.ElementName,
            question: skill.Question,
            options: [
              { text: skill.AnchorFirst || "Beginner", value: skill.DataPoint20 },
              { text: skill.AnchorSecond || "Basic", value: skill.DataPoint35 },
              { text: skill.AnchorThird || "Skilled", value: skill.DataPoint50 },
              { text: skill.AnchorFourth || "Advanced", value: skill.DataPoint65 },
              { text: skill.AnchorLast || "Expert", value: skill.DataPoint80 },
            ],
          }));
          setQuestions(formattedQuestions);
          setAnswers(Array(formattedQuestions.length).fill(null));
          setError("")
        } else {
          throw new Error("Invalid data format from the API.");
        }
      } catch (err) {
        setError(`Failed to load questions: ${err.message}`);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(Array(questions.length).fill(null));
    }
  }, [questions]);

  const handleNext = () => {
    if (answers[currentQuestionIndex] === null) {
      setError(
        `Please answer Question ${currentQuestionIndex + 1} before proceeding.`
      );
      return;
    }
    setError("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (answers.includes(null)) {
        setError("Please complete all questions before submitting.");
      } else {
        submitSkills();
      }
    }
  };

  const handleBack = () => {
    setError("");
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswer = (value) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = value;
      return updatedAnswers;
    });
  };

  const submitSkills = async () => {
    try {
      const formattedData = {
        SKAValueList: answers.map((dataValue, index) => ({
          ElementId: questions[index].ElementId,
          DataValue: dataValue,
        })),
      };
      console.log("Formatted Data: ", formattedData);
      const response = await postData("get_skills.php", formattedData);
      setResults(response);
      setIsComplete(true);
    } catch (err) {
      setError(`Failed to submit skills: ${err.message}`);
      console.error(err);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    return (
      <div style={styles.question}>
        <p>
          <strong>
            Question: {currentQuestionIndex + 1} {question.ElementName}:
          </strong>
        </p>
        <p style={{ marginBottom: "20px" }}>
          <strong>{question.question}</strong>
        </p>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {question.options.map((option, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name={`q${currentQuestionIndex}`}
                  value={option.value}
                  checked={answers[currentQuestionIndex] === option.value}
                  onChange={() => handleAnswer(option.value)}
                  style={{
                    ...styles.radioButton,
                    ...(answers[currentQuestionIndex] === option.value
                      ? styles.radioButtonChecked
                      : {}),
                  }}
                />
                <span
                  style={{
                    marginLeft: "10px",
                    fontSize: "16px",
                    color: "white",
                  }}
                >
                  {option.text}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (isComplete) {
    return <SkillAssessmentResult isComplete={isComplete} results={results} />;
  }

  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: "10px" }}>Get Skills</h1>
      <p
        style={{
          color: "var(--accent)",
          fontWeight: "bold",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        Select your skill level for each category
      </p>
      {questions.length === 0 && error == "" && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            position: "fixed",
            left: "42%",
          }}
        >
          <div className="loader">
            <div className="spinner"></div>Loading Question
          </div>
        </div>
      )}
      {questions.length !== 0 && (
        <>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progress, width: `${progress}%` }}></div>
          </div>
          <form style={{ display: "flex", flexDirection: "column" }}>
            {renderQuestion()}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                type="button"
                style={{ ...styles.button, ...styles.backButton }}
                disabled={currentQuestionIndex === 0}
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="button"
                style={{ ...styles.button, ...styles.nextButton }}
                onClick={handleNext}
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </form>
        </>
      )}
      {error && <div style={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default SkillAssessment;
