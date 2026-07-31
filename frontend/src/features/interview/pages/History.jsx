import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview.js';
import "../styles/home.scss";

function History() {
    const { reports, loading, getReports } = useInterview();
    const navigate = useNavigate();

    useEffect(() => {
        getReports()
    }, [])

    if (loading) return <div>Loading...</div>

    return (
        <div>
            {reports?.length > 0 ? (
                <section className="recent-reports">
                    <h2>My Recent Interview Plans</h2>
                    <ul className="reports-list">
                        {reports.map((report) => {
                            const score = report.matchScore * 100;
                            return (
                                <li
                                    key={report._id}
                                    className="report-item"
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <h3>{report.title || "Untitled Position"}</h3>
                                    <p className="report-meta">
                                        Generated on {new Date(report.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className={`match-score ${
                                        score >= 80 ? "score--high" :
                                        score >= 60 ? "score--mid" : "score--low"
                                    }`}>
                                        Match Score: {score.toFixed(0)}%
                                    </p>
                                    {(report.skillGaps || []).map((gap, i) => (
                                        <span key={i} className={`skill-tag skill-tag--${gap?.severity || 'low'}`}>
                                            {gap?.skill || 'Unknown Skill'}
                                        </span>
                                    ))}
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ) : (
                <p>No reports found.</p>
            )}
        </div>
    );
}

export default History;