import React, { useState } from "react";
import "./App.css";
import CareerSearch from "./components/CareerSearch.jsx";
import SkillAssessment from "./components/SkillAssessment.jsx";
import MarketForm from "./components/MarketForm.jsx";
import JobSearch from "./components/JobSearch.jsx";
import Tailored from "./components/Tailored.jsx";

const styles = {
  root: {
    "--primary": "#0A1931",
    "--accent": "#FFD700",
    "--text": "#FFFFFF",
    "--card-bg": "rgba(26, 41, 66, 0.95)",
  },
  suitedContainer: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px",
    border: "3px solid var(--accent)",
    borderRadius: "12px",
    backgroundColor: "var(--card-bg)",
    boxShadow: "0 0 10px var(--accent)",
  },
  container: {
    display: "flex",
    gap: "8px",
  },
  box: {
    width: "40px",
    height: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
    color: "var(--text)",
    backgroundColor: "transparent",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "transform 0.3s ease, text-shadow 0.3s ease",
    position: "relative",
  },
  line: {
    position: "absolute",
    right: "-4px",
    top: 0,
    width: "1px",
    height: "100%",
    backgroundColor: "var(--accent)",
  },
  modal: {
    display: "flex",
    position: "fixed",
    zIndex: 1000,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#00000059",
    justifyContent: "center",
    alignItems: "center",
  },
  subModal: {
    display: "flex",
    position: "fixed",
    zIndex: 1000,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#00000059",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  subModalContent: {
    backgroundColor: "#0A1931",
    width: "100%",
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    border: "1px solid var(--accent)",
    borderRadius: "6px",
  },
  modalContent: {
    backgroundColor: "#0A1931",
    padding: "30px",
    border: "1px solid var(--accent)",
    width: "80%",
    maxWidth: "500px",
    borderRadius: "10px",
    position: "relative",
  },
  close: {
    position: "absolute",
    right: "10px",
    top: "5px",
    color: "#aaa",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
    backgroundColor: "#0A1931",
  },
};

const App = () => {
  const [modalContent, setModalContent] = useState("");
  const [subModalContent, setSubModalContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubModalVisible, setIsSubModalVisible] = useState(false);
  const [hoveredBox, setHoveredBox] = useState(null);

  const handleBoxClick = (letter) => {
    if (letter === "S") {
      setModalContent(
        <div style={styles.optionsContainer}>
          <button
            style={styles.optionButton}
            onClick={() => {
              setSubModalContent(<SkillAssessment />);
              setIsSubModalVisible(true);
              setIsModalVisible(false);
            }}
          >
            Skill Assessment
          </button>
          <button
            style={styles.optionButton}
            onClick={() => {
              setSubModalContent(<CareerSearch />);
              setIsSubModalVisible(true);
              setIsModalVisible(false);
            }}
          >
            Career Search
          </button>
        </div>
      );
      setIsModalVisible(true);
    } else {
      let content;

      switch (letter) {
        case "U":
          content = <MarketForm />;
          break;
        case "I":
          content = <JobSearch />;
          break;
        case "T":
          content = <Tailored />;
          break;
        case "E":
          content = (
            <>
              <h2>Execute</h2>
              <p>Apply for jobs and follow up on applications</p>
            </>
          );
          break;
        case "D":
          content = (
            <>
              <h2>Daily Journaling</h2>
              <p>Track your job search progress and reflect on your journey</p>
            </>
          );
          break;
        default:
          break;
      }

      setSubModalContent(content);
      setIsSubModalVisible(true);
    }
  };

  const closeMainModal = () => {
    setIsModalVisible(false);
  };

  const closeSubModal = () => {
    setIsSubModalVisible(false);
  };

  return (
    <div style={styles.root}>
      <div style={styles.suitedContainer}>
        <div style={styles.container}>
          {"S U I T E D".split(" ").map((letter, index, array) => (
            <div
              key={letter}
              style={{
                ...styles.box,
                transform: hoveredBox === letter ? "scale(1.1)" : "scale(1)",
                textShadow:
                  hoveredBox === letter ? "0 0 10px var(--accent)" : "none",
              }}
              onMouseEnter={() => setHoveredBox(letter)}
              onMouseLeave={() => setHoveredBox(null)}
              onClick={() => handleBoxClick(letter)}
            >
              {letter}
              {index < array.length - 1 && <span style={styles.line}></span>}
            </div>
          ))}
        </div>
      </div>

      {isModalVisible && (
        <div style={styles.modal} onClick={closeMainModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span style={styles.close} onClick={closeMainModal}>
              &times;
            </span>
            {modalContent}
          </div>
        </div>
      )}

      {isSubModalVisible && (
        <div style={styles.modal} onClick={closeSubModal}>
          <div
            style={styles.subModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <span style={styles.close} onClick={closeSubModal}>
              &times;
            </span>
            {subModalContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
