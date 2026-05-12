import React from "react";

const About = () => {
  const features = [
    {
      iconClass: "fas fa-clinic-medical",
      title: "Clinic Management",
      description:
        "Streamline your clinic operations with our comprehensive management tools, reducing administrative burden and increasing efficiency.",
    },
    {
      iconClass: "fas fa-user-injured",
      title: "Patient Care",
      description:
        "Enhance patient experience with seamless appointment scheduling, secure record management, and improved communication channels.",
    },
    {
      iconClass: "fas fa-chart-line",
      title: "Analytics & Reporting",
      description:
        "Make informed, data-driven decisions with comprehensive reporting and real-time analytics tailored to your clinic's needs.",
    },
  ];

  const missions = [
    {
      iconClass: "fas fa-bullseye",
      title: "Our Mission",
      description:
        "To provide healthcare providers with comprehensive, user-friendly tools that streamline operations, enhance patient care, and enable data-driven decisions for better health outcomes.",
    },
    {
      iconClass: "fas fa-eye",
      title: "Our Vision",
      description:
        "To be the leading healthcare management platform that connects clinics, patients, and healthcare professionals in a seamless digital ecosystem across the Philippines.",
    },
  ];

  return (
    <section id="about" style={styles.section}>
      {/* BACKGROUND ARCHITECTURE — blue strata, tilted panels */}
      <div style={styles.bgPlate1}></div>
      <div style={styles.bgPlate2}></div>
      <div style={styles.bgPlate3}></div>

      <div style={styles.container}>
        {/* HEADER — broken grid, floating title */}
        <div style={styles.headerBlock}>
          <div style={styles.titleBadge}>
            <span style={styles.badgeText}>est. 2026</span>
          </div>
          <h1 style={styles.title}>
            <span style={styles.titleChar}>F</span>
            <span style={styles.titleChar}>I</span>
            <span style={styles.titleChar}>N</span>
            <span style={styles.titleChar}>A</span>
            <span style={styles.titleChar}>L</span>
<span style={{ ...styles.titleChar, marginLeft: "8px" }}>              H
            </span>
            <span style={styles.titleChar}>E</span>
            <span style={styles.titleChar}>A</span>
            <span style={styles.titleChar}>L</span>
            <span style={styles.titleChar}>T</span>
            <span style={styles.titleChar}>H</span>
          </h1>
          <div style={styles.titleRule}></div>
          <p style={styles.headerText}>
            FinalHealth is a comprehensive healthcare management platform
            designed to streamline clinic operations, enhance patient care, and
            improve overall healthcare delivery across the Philippines.
          </p>
          {/* diagonal accent */}
          <div style={styles.headerDiagonal}></div>
        </div>

        {/* MISSION / VISION — 3D overlapping blocks, blue/white only */}
        <div style={styles.mvContainer}>
          <div style={styles.mvLeft}>
            <div style={styles.mvCard1}>
              <div style={styles.mvIconBox}>
                <i className={missions[0].iconClass} style={styles.mvIcon}></i>
              </div>
              <h2 style={styles.mvTitle}>{missions[0].title}</h2>
              <p style={styles.mvText}>{missions[0].description}</p>
              <div style={styles.mvSignature}>—</div>
            </div>
            {/* floating slab behind */}
            <div style={styles.mvSlab1}></div>
          </div>

          <div style={styles.mvRight}>
            <div style={styles.mvCard2}>
              <div style={styles.mvIconBoxAlt}>
                <i className={missions[1].iconClass} style={styles.mvIcon}></i>
              </div>
              <h2 style={styles.mvTitle}>{missions[1].title}</h2>
              <p style={styles.mvText}>{missions[1].description}</p>
              <div style={styles.mvSignature}>—</div>
            </div>
            <div style={styles.mvSlab2}></div>
          </div>
          // connecting beam
          <div style={styles.mvBridge}></div>
        </div>

        {/* FEATURES — fragmented, angular, layered */}
        <div style={styles.featureZone}>
          <div style={styles.featureOrbit}>
            <h3 style={styles.featureSuperTitle}>
              <span style={styles.superNumber}>3</span> core pillars
            </h3>
          </div>

          <div style={styles.featureGrid}>
            {features.map((item, i) => (
              <div key={i} style={styles.featureCard(i)}>
                <div style={styles.featureIndex}>{0 + i + 1}</div>
                <div style={styles.featureIconContainer}>
                  <i className={item.iconClass} style={styles.featureIcon}></i>
                  <div style={styles.iconBack}></div>
                </div>
                <h4 style={styles.featureTitle}>{item.title}</h4>
                <p style={styles.featureDesc}>{item.description}</p>
                <div style={styles.featureRibbon}></div>
              </div>
            ))}
          </div>
        </div>

        {/* TAGLINE — brutalist cut, bold, oversized */}
        <div style={styles.taglineWrap}>
          <div style={styles.taglineInner}>
            <div style={styles.taglineAccent}></div>
            <span style={styles.taglineLead}>✦</span>
            <h5 style={styles.taglineMain}>
              TRANSFORMING
              <br />
              HEALTHCARE DELIVERY
            </h5>
            <p style={styles.taglineParagraph}>
              FinalHealth bridges the gap between healthcare providers and
              patients through innovative technology, creating a more efficient
              and accessible healthcare system for everyone.
            </p>
          </div>
          <div style={styles.taglineBlockRight}></div>
        </div>

        {/* FLOATING COUNTER — pure graphic */}
        <div style={styles.counterObject}>
          <span style={styles.counterNumber}>+200</span>
          <span style={styles.counterLabel}>clinics onboard</span>
        </div>
      </div>

      <style jsx>{`
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
        section {
          overflow-x: clip;
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-8px) rotate(0.5deg); }
        }
        .mission-card:hover, .vision-card:hover {
          animation: float 4s infinite alternate;
        }
      `}</style>
    </section>
  );
};

// ——————————————————————————————————
//  B L U E   &   W H I T E   O N L Y
//  sculptural, tense, non‑symmetric
// ——————————————————————————————————
const styles = {
  section: {
    backgroundColor: "#f2f7ff", // arctic mist
    color: "#021c3b", // midnight navy
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    padding: "40px 20px 100px",
    position: "relative",
    width: "100%",
    lineHeight: 1.5,
    isolation: "isolate",
  },

  // background architectural plates — tilted, overlapping
  bgPlate1: {
    position: "absolute",
    top: "5%",
    left: "-5%",
    width: "45%",
    height: "380px",
    backgroundColor: "#e0edfc",
    transform: "rotate(8deg)",
    opacity: 0.5,
    zIndex: 0,
  },
  bgPlate2: {
    position: "absolute",
    bottom: "15%",
    right: "-3%",
    width: "55%",
    height: "500px",
    backgroundColor: "#cbe0fa",
    transform: "rotate(-12deg)",
    opacity: 0.35,
    zIndex: 0,
  },
  bgPlate3: {
    position: "absolute",
    top: "45%",
    right: "20%",
    width: "30%",
    height: "220px",
    backgroundColor: "#b2d4fc",
    transform: "rotate(25deg)",
    opacity: 0.25,
    zIndex: 0,
  },

  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 10,
  },

  // ---------- HEADER : deconstructed, brutalist influence ----------
  headerBlock: {
    position: "relative",
    marginBottom: "110px",
    paddingTop: "40px",
  },
  titleBadge: {
    display: "inline-block",
    border: "1.5px solid #021c3b",
    padding: "6px 18px",
    fontSize: "0.9rem",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "#021c3b",
    marginBottom: "32px",
    background: "transparent",
  },
  badgeText: {
    fontWeight: 400,
  },
  title: {
    fontSize: "clamp(3.2rem, 12vw, 5.8rem)",
    fontWeight: 650,
    lineHeight: 0.95,
    margin: "0 0 16px -4px",
    color: "#021c3b",
    display: "flex",
    flexWrap: "wrap",
    letterSpacing: "-0.03em",
  },
  titleChar: {
    display: "inline-block",
    marginRight: "2px",
  },
  titleRule: {
    width: "120px",
    height: "8px",
    backgroundColor: "#2563eb",
    margin: "24px 0 32px",
    border: "none",
  },
  headerText: {
    fontSize: "1.35rem",
    maxWidth: "700px",
    color: "#1c4c6e",
    fontWeight: 350,
    lineHeight: 1.6,
    position: "relative",
    zIndex: 3,
    borderLeft: "4px solid #2563eb",
    paddingLeft: "28px",
    marginLeft: "8px",
  },
  headerDiagonal: {
    position: "absolute",
    bottom: "-30px",
    right: "40px",
    width: "180px",
    height: "2px",
    backgroundColor: "#2563eb",
    transform: "rotate(-8deg)",
    opacity: 0.35,
  },

  // ---------- MISSION / VISION : layered, interlocking, dynamic ----------
  mvContainer: {
    display: "flex",
    flexWrap: "wrap",
    position: "relative",
    marginBottom: "130px",
    justifyContent: "space-between",
  },
  mvLeft: {
    position: "relative",
    width: "calc(50% - 20px)",
    minWidth: "300px",
  },
  mvRight: {
    position: "relative",
    width: "calc(50% - 20px)",
    minWidth: "300px",
    marginTop: "60px", // asymmetry
  },
  mvCard1: {
    backgroundColor: "#ffffff",
    padding: "48px 40px",
    border: "none",
    boxShadow: "20px 20px 0 #0a3e6d",
    position: "relative",
    zIndex: 20,
  },
  mvCard2: {
    backgroundColor: "#ffffff",
    padding: "48px 40px",
    border: "none",
    boxShadow: "-20px 20px 0 #1e4b7a",
    position: "relative",
    zIndex: 20,
  },
  mvIconBox: {
    width: "80px",
    height: "80px",
    backgroundColor: "#021c3b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "36px",
  },
  mvIconBoxAlt: {
    width: "80px",
    height: "80px",
    backgroundColor: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "36px",
  },
  mvIcon: {
    fontSize: "2.4rem",
    color: "#ffffff",
  },
  mvTitle: {
    fontSize: "2rem",
    fontWeight: 550,
    color: "#021c3b",
    marginBottom: "18px",
    letterSpacing: "-0.02em",
  },
  mvText: {
    color: "#2c4c6b",
    fontSize: "1.02rem",
    lineHeight: 1.7,
  },
  mvSignature: {
    marginTop: "32px",
    fontSize: "2rem",
    color: "#2563eb",
    fontWeight: 200,
  },
  mvSlab1: {
    position: "absolute",
    bottom: "-20px",
    left: "30px",
    width: "90%",
    height: "100%",
    backgroundColor: "#c4daf5",
    zIndex: 5,
  },
  mvSlab2: {
    position: "absolute",
    bottom: "-20px",
    right: "30px",
    width: "90%",
    height: "100%",
    backgroundColor: "#c4daf5",
    zIndex: 5,
  },
  mvBridge: {
    position: "absolute",
    bottom: "0",
    left: "50%",
    transform: "translateX(-50%)",
    width: "40%",
    height: "4px",
    backgroundColor: "#2563eb",
    opacity: 0.35,
    zIndex: 30,
  },

  // ---------- FEATURES : angular, index numerals, offset ----------
  featureZone: {
    marginBottom: "110px",
    position: "relative",
  },
  featureOrbit: {
    marginBottom: "40px",
  },
  featureSuperTitle: {
    fontSize: "1.5rem",
    fontWeight: 400,
    textTransform: "uppercase",
    letterSpacing: "8px",
    color: "#2563eb",
    borderBottom: "2px solid #021c3b",
    display: "inline-block",
    paddingBottom: "12px",
  },
  superNumber: {
    fontSize: "2.8rem",
    fontWeight: 700,
    color: "#021c3b",
    marginRight: "6px",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
    alignItems: "stretch",
  },
  featureCard: (i) => ({
    backgroundColor: i % 2 === 0 ? "#ffffff" : "#f4fafe",
    padding: "42px 30px",
    border: "1px solid #ffffff",
    boxShadow: i === 1 ? "15px 15px 0 #021c3b" : "none",
    position: "relative",
    transition: "transform 0.25s",
    transform: i === 2 ? "translateY(-12px)" : "none",
  }),
  featureIndex: {
    position: "absolute",
    top: "12px",
    right: "24px",
    fontSize: "3.2rem",
    fontWeight: 700,
    color: "#e7f0fe",
    zIndex: 1,
    lineHeight: 1,
  },
  featureIconContainer: {
    position: "relative",
    width: "60px",
    height: "60px",
    marginBottom: "30px",
  },
  featureIcon: {
    fontSize: "2.2rem",
    color: "#2563eb",
    position: "relative",
    zIndex: 10,
  },
  iconBack: {
    position: "absolute",
    top: "6px",
    left: "6px",
    width: "48px",
    height: "48px",
    backgroundColor: "#021c3b",
    opacity: 0.1,
    zIndex: 5,
  },
  featureTitle: {
    fontSize: "1.6rem",
    fontWeight: 550,
    color: "#021c3b",
    marginBottom: "16px",
    position: "relative",
    zIndex: 10,
  },
  featureDesc: {
    color: "#2a4d6e",
    fontSize: "0.98rem",
    lineHeight: 1.7,
    position: "relative",
    zIndex: 10,
  },
  featureRibbon: {
    position: "absolute",
    bottom: "16px",
    left: "0",
    width: "30%",
    height: "4px",
    backgroundColor: "#2563eb",
  },

  // ---------- TAGLINE : deconstructed, monumental ----------
  taglineWrap: {
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    position: "relative",
    marginTop: "60px",
    border: "2px solid #021c3b",
    boxShadow: "12px 12px 0 #0a3e6d",
  },
  taglineInner: {
    flex: "1 1 60%",
    padding: "60px 48px",
    position: "relative",
    zIndex: 10,
  },
  taglineAccent: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100px",
    height: "100px",
    backgroundColor: "#2563eb",
    opacity: 0.1,
    clipPath: "polygon(0 0, 100% 0, 0 100%)",
  },
  taglineLead: {
    fontSize: "2.8rem",
    color: "#2563eb",
    display: "block",
    marginBottom: "16px",
  },
  taglineMain: {
    fontSize: "clamp(2rem, 6vw, 3.2rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    color: "#021c3b",
    marginBottom: "24px",
    letterSpacing: "-0.02em",
  },
  taglineParagraph: {
    fontSize: "1.15rem",
    maxWidth: "540px",
    color: "#2a4d6e",
    lineHeight: 1.7,
  },
  taglineBlockRight: {
    flex: "0 0 120px",
    backgroundColor: "#021c3b",
    minHeight: "100px",
  },

  // ---------- FLOATING COUNTER : unexpected object ----------
  counterObject: {
    position: "absolute",
    bottom: "-30px",
    right: "40px",
    backgroundColor: "#ffffff",
    padding: "28px 32px",
    border: "1px solid #021c3b",
    boxShadow: "8px 8px 0 #2563eb",
    textAlign: "right",
    zIndex: 40,
  },
  counterNumber: {
    display: "block",
    fontSize: "3rem",
    fontWeight: 700,
    color: "#021c3b",
    lineHeight: 1,
  },
  counterLabel: {
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "3px",
    color: "#2563eb",
  },
};

export default About;