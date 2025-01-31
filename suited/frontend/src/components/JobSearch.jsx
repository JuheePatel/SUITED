import React, { useState } from "react";
import { postData } from "../api";
import "./JobSearch.css";

const JobSearch = () => {
  const [response, setResponse] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const validateInputs = () => {
    const errors = {};
    if (!jobTitle.trim()) {
      errors.jobTitle = "Job title is required.";
    }
    if (!location.trim()) {
      errors.location = "Location is required.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendRequest = async (pageNumber = 1) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const result = await postData("job_search.php", {
        jobTitle,
        location,
        page: pageNumber,
      });
      setResponse(result);
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Failed to fetch job listings. Please try again.");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      setResponse(null);
      setErrors({});
      setPage(1);
      sendRequest(1);
    }
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    sendRequest(nextPage);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      sendRequest(prevPage);
    }
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: "10px" }}>Job Search</h1>
      <form
        autoComplete="off"
        acceptCharset="utf-8"
        method="get"
        action="/jobs"
        role="search"
        id="search-main"
        onSubmit={handleSubmit}
      >
        {/* Job Title Field */}
        <div className="form-group">
          <label htmlFor="s" className="label-container">
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path d="M12 2C9.79 2 8 3.79 8 6V7H5C3.9 7 3 7.9 3 9V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9C21 7.9 20.1 7 19 7H16V6C16 3.79 14.21 2 12 2ZM12 4C13.1 4 14 4.9 14 6V7H10V6C10 4.9 10.9 4 12 4ZM5 9H19V19H5V9Z" />
            </svg>
            What
          </label>
          <input
            id="s"
            name="s"
            value={jobTitle}
            onChange={(e) => {
                setErrors({});
                setJobTitle(e.target.value);
            }}
            type="search"
            placeholder="Job title, keywords or company"
            required
            autoFocus
          />
          {errors.jobTitle && <p className="error-text">{errors.jobTitle}</p>}
        </div>

        {/* Location Field */}
        <div className="form-group">
          <label htmlFor="l" className="label-container">
            <svg
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2C8.69 2 6 4.69 6 8C6 10.68 7.65 13.07 9.95 15.45L12 18L14.05 15.45C16.35 13.07 18 10.68 18 8C18 4.69 15.31 2 12 2ZM12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10Z" />
            </svg>
            Where
          </label>
          <input
            id="l"
            name="l"
            value={location}
            onChange={(e) => {
                setErrors({});
                setLocation(e.target.value)
            }}
            type="search"
            placeholder="City or state"
            required
          />
          {errors.location && <p className="error-text">{errors.location}</p>}
        </div>
        <div className="form-group">
          <button
            id="next-button"
            type="submit"
            className="btn btn-primary btn-l"
            disabled={loading}
          >
            {"Search"}
          </button>
        </div>
        {errorMsg && (
          <div className="error" style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {errorMsg}
          </div>
        )}
      </form>
      {response && response.hits && (
        <div className="total-results">
          <p>Total Results: {response.hits}</p>
        </div>
      )}
      {loading && (
        <div className="loader">
          <div className="spinner"></div>Loading
        </div>
      )}
      {/* Display Job Results */}
      {response && response.jobs && !loading && (
        <div className="job-results">
          {response.jobs.map((job, index) => (
            <div key={index} className="job-card">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">
                <strong>Company:</strong> {job.company}
              </p>
              <p className="job-location">
                <strong>Location:</strong> {job.locations}
              </p>
              <p className="job-date">
                <strong>Posted:</strong>{" "}
                {new Date(job.date).toLocaleDateString()}
              </p>
              <p
                className="job-description"
                dangerouslySetInnerHTML={{ __html: job.description }}
              ></p>
              <button
                onClick={() =>
                  window.open(job.url, "_blank", "noopener,noreferrer")
                }
                className="viewJobButton"
              >
                View Job
              </button>
            </div>
          ))}
          {/* Pagination Buttons */}
          <div className="pagination">
            <button
              onClick={handlePreviousPage}
              className="btn btn-primary"
              disabled={page === 1 || loading}
            >
              Previous Page
            </button>
            <button
              onClick={handleNextPage}
              className="btn btn-primary"
              disabled={loading}
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;
