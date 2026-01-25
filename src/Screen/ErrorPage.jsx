import React, { useEffect } from 'react';

const ErrorPage = ({ exitSession }) => {
  // Create particles for background effect when component mounts
  useEffect(() => {
    createParticles();
  }, []);

  const createParticles = () => {
    const container = document.querySelector('.error_particles_container');
    const colors = ['#1a3a82', '#2c52b3', '#3a66d1', '#647ed6'];
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('error_particle');
      
      // Random properties
      const size = Math.random() * 20 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 20 + 10;
      
      // Apply styles
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.left = `${left}%`;
      particle.style.bottom = '-100px';
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      container.appendChild(particle);
    }
  };

  return (
    <div className="error_page_wrapper">
      <style jsx>{`
        .error_page_wrapper {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fb;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        
        .error_container {
          max-width: 500px;
          text-align: center;
          padding: 2rem;
          animation: error_fadeIn 0.6s ease-in-out;
          position: relative;
          z-index: 2;
        }
        
        @keyframes error_fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .error_icon {
          width: 200px;
          margin: 0 auto;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 10px 15px rgba(0, 51, 153, 0.1));
        }
        
        .error_heading {
          color: #1a3a82;
          margin-bottom: 1rem;
          font-size: 2rem;
          font-weight: 600;
        }
        
        .error_message {
          color: #687083;
          margin-bottom: 2rem;
          font-size: 1.1rem;
          line-height: 1.5;
        }
        
        .error_home_button {
          background: linear-gradient(45deg, #1a3a82, #2c52b3);
          color: white;
          border: none;
          padding: 0.9rem 2rem;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(26, 58, 130, 0.3);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        
        .error_home_button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(26, 58, 130, 0.4);
        }
        
        .error_home_button:active {
          transform: translateY(0);
          box-shadow: 0 4px 8px rgba(26, 58, 130, 0.3);
        }
        
        .error_home_icon {
          width: 20px;
          height: 20px;
        }
        
        .error_particles_container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }
        
        .error_particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.3;
          animation: error_float 15s infinite linear;
        }
        
        @keyframes error_float {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-100vh) rotate(360deg); }
        }
      `}</style>
      
      <div className="error_particles_container"></div>
      
      <div className="error_container">
        <svg className="error_icon" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#1a3a82', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#3a66d1', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="#f2f4ff" stroke="url(#errorGradient)" strokeWidth="5" />
          <path d="M100 50 C 120 50, 140 70, 140 100 C 140 130, 120 150, 100 150 C 80 150, 60 130, 60 100 C 60 70, 80 50, 100 50 Z" fill="white" stroke="url(#errorGradient)" strokeWidth="2" />
          <circle cx="80" cy="90" r="7" fill="#1a3a82" />
          <circle cx="120" cy="90" r="7" fill="#1a3a82" />
          <path d="M70 120 Q 100 140, 130 120" fill="none" stroke="#1a3a82" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 40 L 80 60 M 80 40 L 60 60" stroke="#ff5252" strokeWidth="5" strokeLinecap="round" />
          <path d="M120 40 L 140 60 M 140 40 L 120 60" stroke="#ff5252" strokeWidth="5" strokeLinecap="round" />
        </svg>
        
        <h1 className="error_heading">Oops! Something Went Wrong</h1>
        
        <button className="error_home_button" onClick={exitSession}>
          <svg className="error_home_icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
