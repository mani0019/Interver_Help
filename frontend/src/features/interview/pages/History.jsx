import React from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview.js';
import "../styles/home.scss";

function History() {
    const { reports,report } = useInterview();
    const navigate = useNavigate();
     const safeReport = {
        technicalQuestions: report?.technicalQuestions || [],
        behavioralQuestions: report?.behavioralQuestions || [],
        preparationPlan: report?.preparationPlan || [],
        skillGaps: report?.skillGaps || [],
        matchScore: Math.round((report?.matchScore || 0) * 100),
    }

    return (
        <div>
            {reports?.length > 0 && (
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

                                    <p
                                        className={`match-score ${
                                            score >= 80
                                                ? "score--high"
                                                : score >= 60
                                                ? "score--mid"
                                                : "score--low"
                                        }`}
                                    >
                                        Match Score: {score.toFixed(0)}%
                                    </p>
                                    {safeReport.skillGaps.map((gap, i) => (
                                <span
                                    key={i}
                                    className={`skill-tag skill-tag--${gap?.severity || 'low'}`}
                                >
                                    {gap?.skill || 'Unknown Skill'}
                                </span>
                            ))}
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}
        </div>
    );
}

export default History;