import React, { useState } from "react";

function SkillAssessmentResult({ isComplete, results }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!isComplete) return null;

  // Calculate the index of the first and last items for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get the items to display based on pagination
  const currentItems = results?.SKARankList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle next and previous page clicks
  const nextPage = () => {
    if (currentPage < Math.ceil(results.SKARankList.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: "#FFD700" }}>Thank You!</h2>
      <p style={{ color: "#FFD700" }}>
        Your skills have been successfully submitted. Based on your profile,
        here are some career suggestions:
      </p>
      {results && results.SKARankList.length > 0 ? (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Rank</th>
                <th style={styles.th}>Occupation Title</th>
                <th style={styles.th}>Annual Wages</th>
                <th style={styles.th}>Education</th>
                <th style={styles.th}>Outlook</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((occupation, index) => (
                <tr key={index} style={styles.trHover}>
                  <td style={styles.td}>{occupation.Rank}</td>
                  <td style={styles.td}>
                    <a
                      href={`https://www.onetonline.org/link/summary/${occupation.OnetCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.link}
                    >
                      {occupation.OccupationTitle}
                    </a>
                  </td>
                  <td style={styles.td}>
                    ${occupation.AnnualWages.toLocaleString()}
                  </td>
                  <td style={styles.td}>{occupation.TypicalEducation}</td>
                  <td style={styles.td}>{occupation.Outlook}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.pagination}>
            <button
              style={{
                ...styles.paginationButton,
                ...(currentPage === 1 ? styles.paginationButtonDisabled : {}),
              }}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span style={styles.paginationText}>Page {currentPage}</span>
            <button
              style={{
                ...styles.paginationButton,
                ...(currentPage ===
                Math.ceil(results.SKARankList.length / itemsPerPage)
                  ? styles.paginationButtonDisabled
                  : {}),
              }}
              onClick={nextPage}
              disabled={
                currentPage ===
                Math.ceil(results.SKARankList.length / itemsPerPage)
              }
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No matching careers found based on your skills.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    height: "100px",
    margin: "20px auto",
    fontFamily: "'Arial', sans-serif",
    padding: "20px",
    scroll: "auto",
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
    backgroundColor: "#FFD700",
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    color: "white",
  },
  trHover: {
    transition: "background-color 0.2s ease-in-out",
  },
  link: {
    color: "white",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationText: {
    margin: "0 10px",
    fontSize: "16px",
    color: "white",
  },
};

export default SkillAssessmentResult;
