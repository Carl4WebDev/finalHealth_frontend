import React, { useEffect } from "react";

const Features = () => {
  const features = [
    {
      iconClass: "fas fa-calendar-check",
      title: "Appointment Management",
      description: "Schedule, view, and manage patient appointments with our intuitive calendar system designed for healthcare workflows.",
      badge: "Essential"
    },
    {
      iconClass: "fas fa-file-medical",
      title: "Patient Records & History",
      description: "Access and update patient medical records, prescriptions, and test results with bank-level security and privacy controls.",
      badge: "Secure"
    },
    {
      iconClass: "fas fa-tachometer-alt",
      title: "Clinic Dashboard",
      description: "Get a comprehensive overview of operations, schedules, and key statistics at a glance with customizable widgets.",
      badge: "Overview"
    },
    {
      iconClass: "fas fa-prescription-bottle-alt",
      title: "Medical Notes & Prescriptions",
      description: "Create comprehensive notes and generate prescriptions efficiently with templates and auto-completion features.",
      badge: "Efficient"
    },
    {
      iconClass: "fas fa-user-friends",
      title: "Doctor-Secretary Access",
      description: "Enable seamless collaboration between doctors and administrative staff for efficient patient management.",
      badge: "Collaborative"
    },
    {
      iconClass: "fas fa-chart-bar",
      title: "Reports & Analytics",
      description: "Generate detailed reports on appointments, patient visits, and activity summaries to inform data-driven decisions.",
      badge: "Insights"
    }
  ];

  useEffect(() => {
    // Interactive hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.feature-icon');
        if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
      });
      
      card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.feature-icon');
        if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
      });
    });
    
    // Add click effect to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
          alert('Demo request sent! We\'ll contact you shortly.');
        }, 150);
      });
    }
    
    // Add scroll animation
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);
    
    featureCards.forEach(card => {
      card.style.animationPlayState = 'paused';
      observer.observe(card);
    });
    
    return () => {
      // Cleanup event listeners
      featureCards.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
      if (ctaButton) {
        ctaButton.removeEventListener('click', () => {});
      }
    };
  }, []);

  return (
    <section id="features" style={styles.featuresSection}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.platformHeader}>
          <h1 style={styles.platformTitle}>All the Tools You Need in One Platform</h1>
          <p style={styles.platformDescription}>
            Comprehensive features designed specifically for healthcare providers and clinic management
          </p>
          <div style={styles.headerDecoration}>
            <div style={styles.decorationDot}></div>
            <div style={{...styles.decorationDot, backgroundColor: '#2563eb'}}></div>
            <div style={{...styles.decorationDot, backgroundColor: '#1e40af'}}></div>
          </div>
        </div>

        {/* Features Grid */}
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{
              ...styles.featureCard,
              animationDelay: `${0.1 * (index + 1)}s`
            }}>
              <div className="medical-indicator" style={styles.medicalIndicator}></div>
              <div style={{
                ...styles.featureBadge,
                backgroundColor: getBadgeColor(index).bg,
                color: getBadgeColor(index).text,
                borderColor: getBadgeColor(index).border
              }}>
                {feature.badge}
              </div>
              <div style={styles.featureContent}>
                <div className="feature-icon" style={{
                  ...styles.featureIcon,
                  background: getIconGradient(index)
                }}>
                  <i className={feature.iconClass}></i>
                </div>
                <h3 className="feature-title" style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section - Light Blue Theme */}
        <div style={styles.ctaSection}>
          <div style={styles.ctaOverlayBefore}></div>
          <div style={styles.ctaOverlayAfter}></div>
          <h2 style={styles.ctaTitle}>Ready to Transform Your Clinic?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of healthcare providers who have streamlined their operations with our all-in-one platform.
          </p>
          <a href="#" className="cta-button" style={styles.ctaButton}>Start Your Free Trial</a>
        </div>
      </div>

      <style jsx>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500&display=swap');
        
        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        
        .feature-card:hover {
          transform: translateY(-15px) !important;
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15) !important;
        }
        
        .feature-card:hover .feature-title::after {
          width: 60px !important;
        }
        
        .cta-button:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15) !important;
          background: #f8fafc !important;
          color: #0284c7 !important;
        }
      `}</style>
    </section>
  );
};

// Helper functions for dynamic styling - ALL BLUE NOW
const getIconGradient = (index) => {
  const gradients = [
    'linear-gradient(135deg, #0284c7, #0369a1)',
    'linear-gradient(135deg, #0ea5e9, #0284c7)',
    'linear-gradient(135deg, #38bdf8, #0ea5e9)',
    'linear-gradient(135deg, #0369a1, #075985)',
    'linear-gradient(135deg, #0284c7, #1e40af)',
    'linear-gradient(135deg, #0ea5e9, #2563eb)'
  ];
  return gradients[index];
};

const getBadgeColor = (index) => {
  const colors = [
    { bg: 'rgba(2, 132, 199, 0.1)', text: '#0284c7', border: 'rgba(2, 132, 199, 0.2)' },
    { bg: 'rgba(14, 165, 233, 0.1)', text: '#0ea5e9', border: 'rgba(14, 165, 233, 0.2)' },
    { bg: 'rgba(56, 189, 248, 0.1)', text: '#38bdf8', border: 'rgba(56, 189, 248, 0.2)' },
    { bg: 'rgba(3, 105, 161, 0.1)', text: '#0369a1', border: 'rgba(3, 105, 161, 0.2)' },
    { bg: 'rgba(2, 132, 199, 0.1)', text: '#0284c7', border: 'rgba(2, 132, 199, 0.2)' },
    { bg: 'rgba(14, 165, 233, 0.1)', text: '#0ea5e9', border: 'rgba(14, 165, 233, 0.2)' }
  ];
  return colors[index];
};

// Styles - ALL BLUE THEME
const styles = {
  featuresSection: {
    fontFamily: "'Poppins', sans-serif",
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f2ff 100%)',
    color: '#334155',
    lineHeight: 1.6,
    padding: '40px 20px',
    minHeight: '100vh'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  platformHeader: {
    textAlign: 'center',
    marginBottom: '60px',
    position: 'relative'
  },
  platformTitle: {
    fontSize: '3.2rem',
    background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '20px',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    position: 'relative',
    display: 'inline-block'
  },
  platformDescription: {
    fontSize: '1.3rem',
    color: '#475569',
    maxWidth: '700px',
    margin: '30px auto 0',
    fontWeight: 300
  },
  headerDecoration: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
    gap: '15px'
  },
  decorationDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#0284c7'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px',
    marginBottom: '60px'
  },
featureCard: {
  background: 'white',
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(2, 132, 199, 0.08)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  border: '1px solid rgba(2, 132, 199, 0.1)',
  opacity: 0,
  animation: 'floatIn 0.6s ease forwards'
},
  medicalIndicator: {
    position: 'absolute',
    width: '8px',
    height: '8px',
    background: '#0ea5e9',
    borderRadius: '50%',
    top: '20px',
    left: '20px',
    animation: 'pulse 1.5s infinite'
  },
  featureBadge: {
    position: 'absolute',
    top: '25px',
    right: '25px',
    padding: '5px 15px',
    borderRadius: '50px',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    border: '1px solid'
  },
  featureContent: {
    padding: '35px',
    position: 'relative'
  },
  featureIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '25px',
    fontSize: '2rem',
    color: 'white',
    boxShadow: '0 10px 20px rgba(2, 132, 199, 0.2)',
    transition: 'transform 0.3s ease'
  },
  featureTitle: {
    fontSize: '1.5rem',
    color: '#0c4a6e',
    marginBottom: '15px',
    fontWeight: 600,
    position: 'relative',
    display: 'inline-block'
  },
  featureDescription: {
    color: '#475569',
    fontSize: '1.05rem',
    lineHeight: 1.7
  },
  // CTA Section - LIGHT BLUE THEME (no purple)
  ctaSection: {
    background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
    borderRadius: '25px',
    padding: '60px 40px',
    textAlign: 'center',
    color: 'white',
    boxShadow: '0 20px 40px rgba(2, 132, 199, 0.25)',
    marginTop: '40px',
    position: 'relative',
    overflow: 'hidden'
  },
  ctaOverlayBefore: {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200px',
    height: '200px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%'
  },
  ctaOverlayAfter: {
    content: '""',
    position: 'absolute',
    bottom: '-30%',
    left: '-30%',
    width: '150px',
    height: '150px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%'
  },
  ctaTitle: {
    fontSize: '2.2rem',
    marginBottom: '20px',
    fontWeight: 600,
    position: 'relative',
    zIndex: 2
  },
  ctaSubtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto 30px',
    position: 'relative',
    zIndex: 2
  },
  ctaButton: {
    display: 'inline-block',
    background: 'white',
    color: '#0284c7',
    padding: '16px 40px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1.1rem',
    letterSpacing: '0.5px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 2,
    border: '2px solid transparent'
  }
};

export default Features;