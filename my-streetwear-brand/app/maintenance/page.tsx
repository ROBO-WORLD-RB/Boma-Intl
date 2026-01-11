"use client";

import { motion } from "framer-motion";

export default function MaintenancePage() {
    return (
        <div className="maintenance-container">
            {/* Background gradient orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />

            <div className="content">
                {/* Logo/Brand */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="brand"
                >
                    <span className="brand-text">BOMA</span>
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="headline"
                >
                    We&apos;re building something powerful
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="subtitle"
                >
                    Our platform is currently under maintenance. We&apos;ll be live soon.
                </motion.p>

                {/* Pulse loader animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="loader-container"
                >
                    <div className="pulse-ring" />
                    <div className="pulse-ring pulse-ring-2" />
                    <div className="pulse-ring pulse-ring-3" />
                    <div className="loader-core" />
                </motion.div>

                {/* Status text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="status"
                >
                    <div className="status-dot" />
                    <span>Maintenance in progress</span>
                </motion.div>
            </div>

            <style jsx>{`
        .maintenance-container {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        /* Animated background orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          animation: float 15s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          bottom: -100px;
          right: -100px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -10s;
          opacity: 0.15;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }

        .content {
          text-align: center;
          z-index: 10;
          max-width: 800px;
        }

        .brand {
          margin-bottom: 3rem;
        }

        .brand-text {
          font-family: var(--font-oswald), sans-serif;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 700;
          letter-spacing: 0.5em;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
        }

        .headline {
          font-family: var(--font-oswald), sans-serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 1.5rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-family: var(--font-inter), sans-serif;
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 4rem;
          line-height: 1.6;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Pulse loader */
        .loader-container {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 3rem;
        }

        .pulse-ring {
          position: absolute;
          inset: 0;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          animation: pulse 2s ease-out infinite;
        }

        .pulse-ring-2 {
          animation-delay: 0.4s;
        }

        .pulse-ring-3 {
          animation-delay: 0.8s;
        }

        .loader-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          animation: corePulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes corePulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
        }

        /* Status indicator */
        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-family: var(--font-inter), sans-serif;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: statusBlink 2s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
        }

        @keyframes statusBlink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .maintenance-container {
            padding: 1.5rem;
          }

          .brand {
            margin-bottom: 2rem;
          }

          .subtitle {
            margin-bottom: 3rem;
          }

          .loader-container {
            width: 60px;
            height: 60px;
            margin-bottom: 2rem;
          }

          .loader-core {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
        </div>
    );
}
