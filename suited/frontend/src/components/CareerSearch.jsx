import React, { useState, useEffect } from "react";
import "./CareerSearch.css";
import { fetchData, postData } from "../api";

const CareerSearch = () => {
  const styles = {
    root: {
      "--primary": "#0A1931",
      "--secondary": "#1A2942",
      "--accent": "#FFD700",
      "--text": "#FFFFFF",
      "--cardBg": "rgba(26, 41, 66, 0.7)",
      background: "var(--primary)",
      color: "var(--text)",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      height: "100px",
    },
    container: {
      margin: "0 auto",
      padding: "20px",
      maxWidth: "1200px",
      height: "100px",
    },
    heading: {
      textAlign: "center",
      color: "var(--accent)",
      fontSize: "28px",
    },
    searchContainer: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      marginBottom: "40px",
      flexWrap: "wrap",
    },
    searchSection: {
      flex: "1",
      background: "var(--cardBg)",
      padding: "20px",
      borderRadius: "15px",
      border: "1px solid rgba(255, 215, 0, 0.1)",
      backdropFilter: "blur(10px)",
    },
    sectionHeading: {
      color: "var(--accent)",
      marginBottom: "20px",
      fontSize: "1.2rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    label: {
      color: "var(--text)",
      fontSize: "0.9rem",
    },
    input: {
      width: "100%",
      padding: "10px",
      background: "rgba(255, 255, 255, 0.1)",
      border: "2px solid var(--accent)",
      borderRadius: "25px",
      color: "var(--text)",
      marginTop: "5px",
    },
    select: {
      width: "100%",
      padding: "10px",
      background: "rgba(255, 255, 255, 0.1)",
      border: "2px solid var(--accent)",
      borderRadius: "25px",
      color: "var(--text)",
      marginTop: "5px",
    },
    button: {
      padding: "12px",
      background: "var(--accent)",
      color: "var(--primary)",
      border: "none",
      borderRadius: "25px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.3s ease",
    },
    resultsContainer: {
      marginTop: "40px",
    },
    results: {
      background: "var(--cardBg)",
      padding: "20px",
      borderRadius: "15px",
      marginTop: "20px",
      position: "relative",
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "rgba(255, 255, 255, 0.1)",
      border: "none",
      color: "var(--text)",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      transition: "all 0.3s ease",
    },
  };
  const [industries, setIndustries] = useState([]);
  const [keywordResults, setKeywordResults] = useState([]);
  const [industryResults, setIndustryResults] = useState([]);
  const [militaryResults, setMilitaryResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [keywordPage, setKeywordPage] = useState(5);
  const [industryPage, setIndustryPage] = useState(5);
  const [militaryPage, setMilitaryPage] = useState(5);

  const resultsPerPage = 5;

  useEffect(() => {
    const loadIndustries = async () => {
      try {
        setLoading(true);
        const data = await fetchData('/career_search.php?param=industriesList'); // pass the full endpoint or query
        setIndustries(data.industry);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadIndustries();
  }, []);

  const handleKeywordSearch = async (e) => {
    e.preventDefault();
    const keyword = e.target.keyword.value.trim();
    setLoading(true);
    setKeywordResults([]);
    setError(null);

    try {
      const data = await postData(`career_search.php?param=Keyword&keyword=${encodeURIComponent(keyword)}`);
      setKeywordResults(data.career);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIndustrySearch = async (e) => {
    e.preventDefault();
    const industryCode = e.target.industry.value;
    setLoading(true);
    setIndustryResults([]);
    setError(null);

    try {
      const data = await postData(`career_search.php?param=industries&code=${encodeURIComponent(industryCode)}`);
      setIndustryResults(data.career);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMilitarySearch = async (e) => {
    e.preventDefault();
    const branch = e.target.militaryBranch.value;
    const moc = e.target.moc.value.trim();
    setLoading(true);
    setMilitaryResults([]);
    setError(null);

    try {
      const data = await fetchData(`career_search.php?param=military&keyword=${encodeURIComponent(moc)}`);

      let filteredCareers = data.career;
      if (branch !== "all") {
        filteredCareers = data.career.filter(
          (career) =>
            career.military_jobs[branch.toLowerCase().replace(" ", "_")]
        );
      }

      setMilitaryResults(filteredCareers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const clearResults = (type = null) => {
    if (type === "keyword" || type === null) {
      setKeywordResults([]);
      setKeywordPage(resultsPerPage);
    }
    if (type === "industry" || type === null) {
      setIndustryResults([]);
      setIndustryPage(resultsPerPage);
    }
    if (type === "military" || type === null) {
      setMilitaryResults([]);
      setMilitaryPage(resultsPerPage);
    }
  };

  const showMore = (setPage, page, results) => {
    setPage(results.length);
  };

  const showLess = (setPage) => {
    setPage(resultsPerPage);
  };

  const displayResults = (results, page, type) => {
    if (!results || results.length === 0) return <div></div>;

    return (
      <>
        {results.slice(0, page).map((career, index) => (
          <div key={index} className="career">
            <h3>{career.title}</h3>
            <p>
              <strong>O*NET Code:</strong> {career.code}
            </p>
            {career.percent_employed && (
              <p>
                <strong>Percent Employed:</strong> {career.percent_employed}%
              </p>
            )}
            {career.preparation_needed && (
              <p>
                <strong>Preparation Needed:</strong> {career.preparation_needed}
              </p>
            )}
            {career.pay_grade && (
              <p>
                <strong>Pay Grade:</strong> {career.pay_grade}
              </p>
            )}
            <p>
              <strong>Tags:</strong> {formatTags(career.tags)}
            </p>
            <p>
              <strong>Military Branch Careers:</strong>{" "}
              {formatMilitaryJobs(career.military_jobs)}
            </p>
            <a href={career.href} target="_blank" rel="noopener noreferrer">
              More Information
            </a>
          </div>
        ))}
      </>
    );
  };

  const formatTags = (tags) => {
    const formatted = [];
    if (tags.bright_outlook) formatted.push("Bright Outlook");
    if (tags.green) formatted.push("Green");
    if (tags.apprenticeship) formatted.push("Registered Apprenticeship");
    return formatted.join(", ") || "None";
  };

  const formatMilitaryJobs = (militaryJobs) => {
    const branches = [];
    for (const [key, value] of Object.entries(militaryJobs)) {
      if (value) {
        const formattedKey = key
          .replace("_", " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
        branches.push(formattedKey);
      }
    }
    return branches.join(", ") || "None";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Career Search for Veterans</h1>

      {/* Search Forms */}
      <div className="search-container">
        {/* Keyword Search */}
        <section className="search-section">
          <h2>Keyword Search</h2>
          <form onSubmit={handleKeywordSearch} id="keyword-search-form">
            <label htmlFor="keyword">Keyword:</label>
            <input
              type="text"
              id="keyword"
              name="keyword"
              required
              placeholder="Enter keyword, e.g.: architect"
            />
            <button type="submit">Search</button>
          </form>
        </section>
        <section className="search-section">
          <h2>Industry Search</h2>
          <form onSubmit={handleIndustrySearch} id="industry-search-form">
            <label htmlFor="industry">Industry:</label>
            <select id="industry" name="industry" required>
              <option value="">Select an Industry</option>
              {industries.map((ind, index) => (
                <option key={index} value={ind.code}>
                  {ind.title}
                </option>
              ))}
            </select>
            <button type="submit"> Search Careers</button>
          </form>
        </section>

        {/* Military Search */}
        <section className="search-section">
          <h2>Military Search</h2>
          <form onSubmit={handleMilitarySearch} id="military-search-form">
            <label htmlFor="military-branch">Military Branch:</label>
            <select name="militaryBranch" required>
              <option value="">Select a Branch</option>
              <option value="all">All</option>
              <option value="Army">Army</option>
              <option value="Navy">Navy</option>
              <option value="Air Force">Air Force</option>
              <option value="Marine Corps">Marine Corps</option>
              <option value="Coast Guard">Coast Guard</option>
            </select>
            <label htmlFor="moc">Military Occupational Code (MOC):</label>
            <input
              type="text"
              id="moc"
              name="moc"
              required
              placeholder="Enter MOC, e.g.: 11B"
            />
            <button type="submit">Search</button>
          </form>
        </section>
      </div>
      {error && <div className="error" style={{ color: "red", textAlign: "center", marginTop: "-5px" }}>Failed to search career. Please try again.</div>}

      {/* Clear All Button */}
      <div className="clear-all-btn-container">
        <button onClick={() => clearResults()} className="clear-all-btn">
          Clear All Results
        </button>
      </div>

      {/* Results Section */}
      <div className="results-container">
        {/* Keyword Results */}
        <div className="results">
          <div className="results-header-container">
            <h3 className="results-header">Keyword Search Results</h3>
            {keywordResults && keywordResults.length > 0 && (
              <div
                className="clear-btn"
                onClick={() => clearResults("keyword")}
              >
                &#10005;
              </div>
            )}
          </div>
          {displayResults(keywordResults, keywordPage, "keyword")}
          <div>
            {keywordResults &&
              keywordPage === resultsPerPage &&
              keywordResults.length > resultsPerPage && (
                <div className="pagination">
                  <button
                    onClick={() =>
                      showMore(setKeywordPage, keywordPage, keywordResults)
                    }
                  >
                    See More ({keywordResults.length - resultsPerPage} more
                    results)
                  </button>
                </div>
              )}
            {keywordPage > resultsPerPage && (
              <div className="pagination">
                <button onClick={() => showLess(setKeywordPage)}>
                  See Less
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Industry Results */}
        <div className="results">
          <div className="results-header-container">
            <h3 className="results-header">Industry Search Results</h3>
            {industryResults && industryResults.length > 0 && (
              <div
                className="clear-btn"
                onClick={() => clearResults("industry")}
              >
                &#10005;
              </div>
            )}
          </div>
          {displayResults(industryResults, industryPage, "industry")}
          <div>
            {industryResults &&
              industryPage === resultsPerPage &&
              industryResults.length > resultsPerPage && (
                <div className="pagination">
                  <button
                    onClick={() =>
                      showMore(setIndustryPage, industryPage, industryResults)
                    }
                  >
                    See More ({industryResults.length - resultsPerPage} more
                    results)
                  </button>
                </div>
              )}
            {industryPage > resultsPerPage && (
              <div className="pagination">
                <button onClick={() => showLess(setIndustryPage)}>
                  See Less
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Military Results */}
        <div className="results">
          <div className="results-header-container">
            <h3 className="results-header">Military Search Results</h3>
            {militaryResults && militaryResults.length > 0 && (
              <div
                className="clear-btn"
                onClick={() => clearResults("military")}
              >
                &#10005;
              </div>
            )}
          </div>

          {displayResults(militaryResults, militaryPage, "military")}
          <div>
            {militaryResults &&
              militaryPage === resultsPerPage &&
              militaryResults.length > resultsPerPage && (
                <div className="pagination">
                  <button
                    onClick={() =>
                      showMore(setMilitaryPage, militaryPage, militaryResults)
                    }
                  >
                    See More ({militaryResults.length - resultsPerPage} more
                    results)
                  </button>
                </div>
              )}
            {militaryPage > resultsPerPage && (
              <div className="pagination">
                <button onClick={() => showLess(setMilitaryPage)}>
                  See Less
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loader">
          <div className="spinner"></div>Loading
        </div>
      )}
    </div>
  );
};

export default CareerSearch;
