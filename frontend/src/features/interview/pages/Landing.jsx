import React from "react";
import { Link } from "react-router-dom";
import "../styles/Landing.scss";
import {
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChartBar,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

function Landing() {
  const features = [
  {
    icon: <HiOutlineDocumentText />,
    title: "Resume Analysis",
    text: "Upload your resume and identify strengths, missing skills, and areas to improve."
  },
  {
    icon: <HiOutlineBriefcase />,
    title: "Job Match",
    text: "Compare your profile with any job description and understand recruiter expectations."
  },
  {
    icon: <HiOutlineAcademicCap />,
    title: "Interview Roadmap",
    text: "Receive a structured preparation plan tailored to your target role."
  },
  {
    icon: <HiOutlineChatBubbleLeftRight />,
    title: "Interview Practice",
    text: "Practice technical, behavioral, and HR interview questions."
  },
  {
    icon: <HiOutlineChartBar />,
    title: "Progress Tracking",
    text: "Monitor your preparation and stay focused on your goals."
  },
  {
    icon: <HiOutlineBuildingOffice2 />,
    title: "Company Preparation",
    text: "Prepare specifically for Google, Amazon, Microsoft, TCS, Infosys and more."
  }
];

  return (
    <div className="landing">

      {/* Navbar */}

      <nav className="navbar">

  <div className="brand">

    <img
      src="/logo.png"
      alt="Career Navigator"
      className="brand-logo"
    />

    <div className="brand-text">
      <h1>Career <span>Navigator</span></h1>
      <p>Interview Preparation Platform</p>
    </div>

  </div>

  <div className="nav-buttons">
    <Link to="/login" className="btn secondary">
      Login
    </Link>

    <Link to="/register" className="btn primary">
      Get Started
    </Link>
  </div>

</nav>

      {/* Hero */}

      <section className="hero">

        <div className="hero-content">

          <span className="tag">
            Interview Preparation Platform
          </span>

          <h1>
            Land Your Next Job
            <br />
            With Confidence.
          </h1>

          <p>
            Career Navigator helps students and developers prepare for interviews
            through personalized roadmaps, resume analysis, and interview practice.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn primary">
              Start Preparing
            </Link>

            <a href="#features" className="btn outline">
              Explore Features
            </a>
          </div>

        </div>

        <div className="hero-image">
         <img src="/hero.png" alt="Hero" className="heroimage"/>
        </div>

      </section>

      {/* Features */}

      <section className="features" id="features">

        <h2>Everything You Need to Prepare</h2>

        <div className="feature-grid">

          {features.map((feature, index) => (

            <div className="feature-card" key={index}>

              <div className="icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>

            </div>

          ))}

        </div>

      </section>

      {/* How It Works */}

      <section className="steps">

        <h2>How It Works</h2>

        <div className="step-container">

          <div className="step">
            <span>1</span>
            <h3>Paste Job Description</h3>
          </div>

          <div className="step">
            <span>2</span>
            <h3>Upload Resume</h3>
          </div>

          <div className="step">
            <span>3</span>
            <h3>Create Interview Plan</h3>
          </div>

          <div className="step">
            <span>4</span>
            <h3>Start Preparing</h3>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Landing;