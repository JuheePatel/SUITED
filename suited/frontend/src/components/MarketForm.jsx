import React, { useState } from "react";
import "./MarketForm.css";

const MarketForm = () => {
  const [location, setLocation] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_TOKEN = import.meta.env.VITE_CARRERONESTOP_API_KEY;
  const USER_ID = import.meta.env.VITE_USER_ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setResult(null);
    setLoading(true);

    if (!location || !jobTitle) {
      setErrorMsg("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    try {
      const endpoint = `https://api.careeronestop.org/v1/occupation/${USER_ID}/${encodeURIComponent(
        jobTitle
      )}/${encodeURIComponent(location)}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setResult(data);
    } catch (error) {
      console.log(error.message)
      setErrorMsg("Failed to fetch Market listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marketContainer">
      <h1 className="header" style={{ marginBottom: "15px" }}>
        Understand the Market
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Location Field */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                color: "white",
              }}
              aria-hidden="true"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 4.63 7 13 7 13s7-8.37 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5z" />
            </svg>
            <label htmlFor="location">Location*</label>
          </div>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Examples: 0 (US), 'Chicago, IL', 'IL', or ZIP code"
            required
          />
        </div>
        {/* Job Title Field */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{
                width: "20px",
                height: "20px",
                marginRight: "8px",
                color: "white",
              }}
              aria-hidden="true"
            >
              <path d="M12 2L1 7l11 5 9-4.5v5.11C19.67 12.07 16.94 12 16 12c-2.67 0-8 1.34-8 4v2h16v-2c0-1.34-1.94-2.58-5.08-3.21l5.08-2.55V7L12 2zm0 13c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
            </svg>
            <label htmlFor="jobTitle" style={{ marginTop: "10px" }}>
              Job Title or O*NET Code*
            </label>
          </div>
          <input
            type="text"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Type a job title or O*NET code (e.g. 29-1171)"
            required
          />
        </div>
        <button type="submit" className="form-button">
          Send Request
        </button>
      </form>
      {errorMsg && (
        <div className="error" style={{ color: "red", marginTop: "13px" }}>
          {errorMsg}
        </div>
      )}
      {loading && (
        <div className="loader">
          <div className="spinner"></div>Loading
        </div>
      )}
      {/* Display Results */}
      {result &&
        result.OccupationDetail &&
        result.OccupationDetail.length > 0 && (
          <div className="job-results">
            {result.OccupationDetail.map((occupation, index) => (
              <div key={index} className="card">
                <h2 style={{ fontSize: "16px" }}>{occupation.OnetTitle}</h2>
                <p className="desc">
                  <strong>O*NET Code:</strong> {occupation.OnetCode}
                </p>
                <p className="desc">
                  <strong>Description:</strong> {occupation.OnetDescription}
                </p>
                <p className="desc">
                  <strong>Bright Outlook:</strong> {occupation.BrightOutlook}
                </p>
                <p className="desc">
                  <strong>Location:</strong> {occupation.Location}
                </p>
                {occupation.COSVideoURL && (
                  <button
                    onClick={() =>
                      window.open(
                        occupation.COSVideoURL,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="marketButton"
                  >
                    Watch Video
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default MarketForm;
