import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const apps = [
  { id: "recycle", name: "Recycle Bin", type: "recycle" },
  { id: "achievements", name: "Achievements", type: "achievements" },
  { id: "computer", name: "This PC", type: "computer" },
  { id: "education", name: "Education", type: "education" },
  { id: "projects", name: "File Explorer", type: "folder" },
  { id: "photos", name: "Photos", type: "photos" },
  { id: "terminal", name: "Windows Terminal", type: "terminal" },
  { id: "skillsApp", name: "Projects", type: "code" },
  { id: "ai", name: "Ask Sathwik AI", type: "ai" },
  { id: "resume", name: "Resume.pdf", type: "pdf" },
  { id: "about", name: "About Me", type: "user" },
  { id: "skills", name: "Skills", type: "skills" },
];

function App() {
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [time, setTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Windows 11 Boot Screen State (First visit check per session)
  const [isBooting, setIsBooting] = useState(() => {
    return !sessionStorage.getItem("hasBooted");
  });

  const [wifiOn, setWifiOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [saverOn, setSaverOn] = useState(false);
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(100);

  useEffect(() => {
    if (isBooting) {
      const bootTimer = setTimeout(() => {
        setIsBooting(false);
        sessionStorage.setItem("hasBooted", "true");
      }, 2000);
      return () => clearTimeout(bootTimer);
    }
  }, [isBooting]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const openWindow = (id) => {
    setWindows((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });

    setActiveWindow(id);
    setStartOpen(false);
    setQuickSettingsOpen(false);
    setSearchQuery("");
  };

  const closeWindow = (id) => {
    setWindows((prev) => {
      const remaining = prev.filter((window) => window !== id);

      if (activeWindow === id) {
        setActiveWindow(
          remaining.length ? remaining[remaining.length - 1] : null,
        );
      }

      return remaining;
    });
  };

  const minimizeWindow = (id) => {
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const toggleWindow = (id) => {
    if (!windows.includes(id)) {
      openWindow(id);
      return;
    }

    if (activeWindow === id) {
      minimizeWindow(id);
    } else {
      setActiveWindow(id);
    }
  };

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps;
    return apps.filter((app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div
      className="desktop"
      onClick={() => {
        setStartOpen(false);
        setQuickSettingsOpen(false);
      }}
    >
      {/* WINDOWS 11 BOOT SCREEN ANIMATION */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            className="win-boot-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="win-boot-content">
              <div className="win-boot-logo-grid">
                <span className="win-boot-square"></span>
                <span className="win-boot-square"></span>
                <span className="win-boot-square"></span>
                <span className="win-boot-square"></span>
              </div>
              <div className="win-boot-spinner">
                <div className="win-spinner-circle"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND */}
      <div className="wallpaper-glow glow-a"></div>
      <div className="wallpaper-glow glow-b"></div>

      {/* DESKTOP CONTENT */}
      <div className="desktop-content">
        {/* DESKTOP ICONS */}
        <div className="desktop-icons" onClick={(e) => e.stopPropagation()}>
          {apps.map((app) => (
            <DesktopIcon
              key={app.id}
              app={app}
              onOpen={() => openWindow(app.id)}
            />
          ))}
        </div>

        {/* HERO */}
        <motion.div
          className="desktop-hero"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-greeting">⊞ Windows 11 Portfolio Edition</div>

          <h1>
            Sathwik
            <span> Chelloju</span>
          </h1>

          <p>AI/ML STUDENT • FULL-STACK DEVELOPER • CREATIVE DESIGNER</p>
        </motion.div>
      </div>

      {/* WINDOWS */}
      <AnimatePresence>
        {windows.map((id) => {
          const app = apps.find((item) => item.id === id) || {
            name: "Window",
            type: "folder",
          };

          return (
            <AppWindow
              key={id}
              app={app}
              active={activeWindow === id}
              onFocus={() => setActiveWindow(id)}
              onClose={() => closeWindow(id)}
              onMinimize={() => minimizeWindow(id)}
            >
              <WindowContent id={id} openWindow={openWindow} />
            </AppWindow>
          );
        })}
      </AnimatePresence>

      {/* START MENU / SEARCH FLYOUT */}
      <AnimatePresence>
        {startOpen && (
          <motion.div
            className="start-menu"
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="start-search">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search apps, files and settings"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <h3>{searchQuery.trim() ? "Results" : "Pinned"}</h3>

            <div className="start-grid">
              {filteredApps.map((app) => (
                <button key={app.id} onClick={() => openWindow(app.id)}>
                  <div className="start-grid-icon">
                    <WinIcon type={app.type} />
                  </div>
                  {app.name}
                </button>
              ))}
              {filteredApps.length === 0 && (
                <p className="no-search-results">No results found</p>
              )}
            </div>

            <div className="start-footer">
              <div className="start-profile">
                <span className="profile-avatar">SC</span>
                <strong>Sathwik Chelloju</strong>
              </div>

              <span className="power-button">⏻</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUICK SETTINGS FLYOUT */}
      <AnimatePresence>
        {quickSettingsOpen && (
          <motion.div
            className="quick-settings-flyout"
            initial={{ opacity: 0, y: 15, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="qs-grid">
              <button
                className={`qs-tile ${wifiOn ? "active" : ""}`}
                onClick={() => setWifiOn(!wifiOn)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                  <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                  <line x1="12" y1="20" x2="12.01" y2="20"></line>
                </svg>
                <span>Wi-Fi</span>
              </button>

              <button
                className={`qs-tile ${soundOn ? "active" : ""}`}
                onClick={() => setSoundOn(!soundOn)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
                <span>Sound</span>
              </button>

              <button
                className={`qs-tile ${saverOn ? "active" : ""}`}
                onClick={() => setSaverOn(!saverOn)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
                  <line x1="23" y1="13" x2="23" y2="11"></line>
                </svg>
                <span>Saver</span>
              </button>
            </div>

            <div className="qs-slider-group">
              <div className="qs-slider-label">
                <span>Volume</span>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              />
            </div>

            <div className="qs-slider-group">
              <div className="qs-slider-label">
                <span>Brightness</span>
                <span>{brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(e.target.value)}
              />
            </div>

            <div className="qs-footer">
              <span>Sathwik Windows 11 Pro</span>
              <span className="qs-connected">Connected</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TASKBAR */}
      <Taskbar
        apps={apps}
        windows={windows}
        activeWindow={activeWindow}
        startOpen={startOpen}
        quickSettingsOpen={quickSettingsOpen}
        onStart={(e) => {
          e.stopPropagation();
          setSearchQuery("");
          setStartOpen((prev) => !prev);
          setQuickSettingsOpen(false);
        }}
        onSearchClick={(e) => {
          e.stopPropagation();
          setSearchQuery("");
          setStartOpen(true);
          setQuickSettingsOpen(false);
        }}
        onQuickSettings={(e) => {
          e.stopPropagation();
          setQuickSettingsOpen((prev) => !prev);
          setStartOpen(false);
        }}
        onOpen={toggleWindow}
        time={time}
      />
    </div>
  );
}

/* =========================================
   WINDOWS VECTOR ICONS COMPONENT
========================================= */

function WinIcon({ type }) {
  switch (type) {
    case "recycle":
      return (
        <div className="win-ico recycle-bin-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>
      );
    case "achievements":
      return (
        <div className="win-ico achievements-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
          </svg>
        </div>
      );
    case "computer":
      return (
        <div className="win-ico computer-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        </div>
      );
    case "education":
      return (
        <div className="win-ico education-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="6"></circle>
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
          </svg>
        </div>
      );
    case "folder":
      return (
        <div className="win-ico folder-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      );
    case "photos":
      return (
        <div className="win-ico photos-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
      );
    case "terminal":
      return (
        <div className="win-ico terminal-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
        </div>
      );
    case "code":
      return (
        <div className="win-ico code-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
      );
    case "ai":
      return (
        <div className="win-ico ai-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
          </svg>
        </div>
      );
    case "pdf":
      return (
        <div className="win-ico pdf-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
      );
    case "user":
      return (
        <div className="win-ico user-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      );
    case "skills":
      return (
        <div className="win-ico skills-tile">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="1" x2="9" y2="4"></line>
            <line x1="15" y1="1" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="23"></line>
            <line x1="15" y1="20" x2="15" y2="23"></line>
            <line x1="20" y1="9" x2="23" y2="9"></line>
            <line x1="20" y1="14" x2="23" y2="14"></line>
            <line x1="1" y1="9" x2="4" y2="9"></line>
            <line x1="1" y1="14" x2="4" y2="14"></line>
          </svg>
        </div>
      );
    default:
      return <span>📁</span>;
  }
}

/* =========================================
   DESKTOP ICON
========================================= */

function DesktopIcon({ app, onOpen }) {
  return (
    <motion.button
      className="desktop-icon"
      whileTap={{ scale: 0.94 }}
      onDoubleClick={onOpen}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      title={`Open ${app.name}`}
    >
      <div className="desktop-icon-outer">
        <div className="desktop-icon-image">
          <WinIcon type={app.type} />
        </div>
        {app.id !== "recycle" && <div className="shortcut-arrow"></div>}
      </div>

      <span>{app.name}</span>
    </motion.button>
  );
}

/* =========================================
   WINDOW
========================================= */

function AppWindow({ app, active, onFocus, onClose, onMinimize, children }) {
  const [maximized, setMaximized] = useState(app.id === "photos"); // Opens Photos larger by default

  return (
    <div
      className={`window-positioner ${maximized ? "maximized-window" : ""} ${app.id === "photos" ? "large-photos-window" : ""}`}
    >
      <motion.div
        className={`app-window ${
          active ? "active-window" : ""
        } ${maximized ? "maximized" : ""}`}
        initial={{
          opacity: 0,
          scale: 0.92,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          scale: 0.92,
        }}
        transition={{
          duration: 0.2,
        }}
        onMouseDown={onFocus}
        style={{
          zIndex: active ? 100 : 20,
        }}
      >
        {/* TITLE BAR */}
        <div className="window-titlebar">
          <div className="window-title">
            <span className="win-title-icon">
              <WinIcon type={app.type} />
            </span>
            <span>{app.name}</span>
          </div>

          <div className="window-controls">
            {/* MINIMIZE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              aria-label="Minimize"
            >
              −
            </button>

            {/* MAXIMIZE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMaximized(!maximized);
              }}
              aria-label="Maximize"
            >
              {maximized ? "❐" : "□"}
            </button>

            {/* CLOSE */}
            <button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* WINDOW BODY */}
        <div className="window-body">{children}</div>
      </motion.div>
    </div>
  );
}

/* =========================================
   WINDOW CONTENT
========================================= */

function WindowContent({ id, openWindow }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(null);
  const [explorerTab, setExplorerTab] = useState("home");
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState("All");
  const [projectSearch, setProjectSearch] = useState("");

  const photoList = [
    { title: "Attended Hackathon at Tech Mahindra", src: "/TECHM.jpeg" },
    {
      title: "Proudly receiving the award from our respected Principal ",
      src: "/Team1.jpg",
    },
    {
      title: "Appreciation from the Principal — motivation to achieve more.",
      src: "/principal.jpg",
    },
    { title: "Hackathon Winning Team", src: "/Team2.jpg" },
    { title: "Attended Ai Days Workshop", src: "/AIDAYS.jpeg" },
    { title: "Professional mindset. Personal growth.", src: "/profile.jpeg" },
  ];

  const projectList = [
    {
      title: "InterviewMate",
      category: "Full-Stack",
      status: "Live",
      desc: "AI-powered interview preparation platform that helps users practice interviews, improve communication, and prepare for different job roles.",
      tech: [
        "Spring Boot",
        "Java",
        "REST APIs",
        "MySQL",
        "Spring Security",
        "AI/ML",
        "Full-Stack Development",
        "HTML",
        "CSS",
        "JS",
      ],
      features: [
        "Simulated AI-powered mock interviews for various job roles",
        "Real-time communication evaluation and feedback",
        "Secure user authentication and session handling",
        "Comprehensive dashboard to track performance over time",
      ],
      linkType: "live",
      linkUrl: "https://interviewai-frontend-zh92.onrender.com/index.html",
    },
    {
      title: "Food Delivery Application",
      category: "Full-Stack",
      status: "Live",
      desc: "A full-stack food ordering platform developed using Java Servlets, JDBC, MySQL, HTML, CSS, and JavaScript, implementing user authentication, restaurant/food management, cart, and order processing.",
      tech: ["Java Servlets", "JDBC", "MySQL", "HTML", "CSS", "JavaScript"],
      features: [
        "User registration and role-based authentication",
        "Dynamic restaurant listing and menu browsing",
        "Cart management and seamless order checkout processing",
        "Admin control panel for restaurant and food management",
      ],
      linkType: "github",
      linkUrl: "https://github.com/SathwikChelloju/FoodDeliveryApplication",
    },
    {
      title: "Windows Theme Portfolio",
      category: "Frontend",
      status: "Live",
      desc: "Windows 11-inspired interactive portfolio built with React, featuring animated desktop icons, windows, taskbar, terminal, resume viewer, and AI assistant UI.",
      tech: [
        "React.js",
        "JavaScript",
        "CSS",
        "Framer Motion",
        "Responsive UI",
        "Component-Based Development",
      ],
      features: [
        "Authentic Windows 11 desktop, taskbar, and start menu UI",
        "Draggable and manageable application windows with framer motion",
        "Integrated interactive terminal and resume viewer",
        "Custom AI assistant widget",
      ],
      linkType: "live",
      linkUrl: "https://sathwik-portfolio-windows.vercel.app/",
    },
    {
      title: "Agriculture Voice Bot",
      category: "ML Projects",
      status: "Live",
      desc: "AI-powered voice assistant for agriculture that helps farmers get information through voice interaction.",
      tech: [
        "Python",
        "AI/ML",
        "NLP",
        "Speech Recognition",
        "Text-to-Speech",
        "Voice Bot Development",
      ],
      features: [
        "Voice-activated query processing for agricultural insights",
        "Natural Language Processing for intent matching and responses",
        "Speech-to-text and text-to-speech conversion pipelines",
        "Farming recommendations based on localized data inputs",
      ],
      linkType: "github",
      linkUrl: "https://github.com/SathwikChelloju/Agriculture_Voice_Bot",
    },
    {
      title: "Air Pollution Tracking",
      category: "Python Projects",
      status: "Live",
      desc: "Real-time air quality monitoring application that fetches pollution data through APIs and displays AQI and pollutant levels.",
      tech: ["Python", "FastAPI", "API Integration", "Data Processing"],
      features: [
        "Live air quality data fetching from external environmental APIs",
        "FastAPI backend handling async requests and processing",
        "Clear AQI status breakdown and pollutant level calculations",
        "Scalable architecture for rapid data querying",
      ],
      linkType: "github",
      linkUrl: "https://github.com/SathwikChelloju/AirPollutionTracking",
    },
  ];

  const filteredProjects = useMemo(() => {
    return projectList.filter((p) => {
      const matchesFilter = filter === "All" || p.category === filter;
      const matchesSearch =
        p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.desc.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.tech.some((t) =>
          t.toLowerCase().includes(projectSearch.toLowerCase()),
        );
      return matchesFilter && matchesSearch;
    });
  }, [filter, projectSearch]);

  if (id === "computer" || id === "projects") {
    const sidebarItems = [
      { id: "home", name: "Home", type: "computer", target: null },
      { id: "about", name: "About Me", type: "user", target: "about" },
      {
        id: "fileExplorerFolder",
        name: "File Explorer",
        type: "folder",
        target: "computer",
      },
      {
        id: "projectsFolder",
        name: "Projects",
        type: "code",
        target: "skillsApp",
      },
      { id: "photosFolder", name: "Photos", type: "photos", target: "photos" },
      { id: "skills", name: "Skills", type: "skills", target: "skills" },
      {
        id: "achievements",
        name: "Achievements",
        type: "achievements",
        target: "achievements",
      },
      {
        id: "education",
        name: "Education",
        type: "education",
        target: "education",
      },
      { id: "resume", name: "Resume", type: "pdf", target: "resume" },
    ];

    const gridItems = [
      { id: "about", name: "About Me", type: "user", target: "about" },
      {
        id: "fileExplorerFolder",
        name: "File Explorer",
        type: "folder",
        target: "computer",
      },
      {
        id: "projectsFolder",
        name: "Projects",
        type: "code",
        target: "skillsApp",
      },
      { id: "photosFolder", name: "Photos", type: "photos", target: "photos" },
      { id: "skills", name: "Skills", type: "skills", target: "skills" },
      {
        id: "achievements",
        name: "Achievements",
        type: "achievements",
        target: "achievements",
      },
      {
        id: "education",
        name: "Education",
        type: "education",
        target: "education",
      },
      { id: "resume", name: "Resume", type: "pdf", target: "resume" },
    ];

    const activeSidebarItem = sidebarItems.find((i) => i.id === explorerTab);

    return (
      <div className="explorer-window-layout">
        {/* LEFT SIDEBAR */}
        <div className="explorer-sidebar">
          <div className="explorer-sidebar-section-title">QUICK ACCESS</div>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`explorer-sidebar-btn ${explorerTab === item.id ? "active" : ""}`}
              onClick={() => {
                setExplorerTab(item.id);
                setSelectedItem(null);
              }}
            >
              <span className="explorer-sb-icon">
                <WinIcon type={item.type} />
              </span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* RIGHT MAIN PANEL */}
        <div className="explorer-main-panel">
          {/* TOP BREADCRUMB BAR */}
          <div className="explorer-breadcrumb-bar">
            <button
              className="explorer-nav-arrow"
              onClick={() => setExplorerTab("home")}
            >
              ‹
            </button>
            <div className="explorer-breadcrumb-path">
              <span>This PC</span>
              <span className="breadcrumb-sep">&gt;</span>
              <span className="breadcrumb-current">Sathwik's Portfolio</span>
              {explorerTab !== "home" && (
                <>
                  <span className="breadcrumb-sep">&gt;</span>
                  <span className="breadcrumb-current">
                    {activeSidebarItem?.name}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="explorer-content-body">
            {explorerTab === "home" ? (
              <div className="explorer-grid-container">
                {gridItems.map((grid) => (
                  <div
                    key={grid.id}
                    className={`explorer-grid-item ${selectedItem === grid.id ? "selected" : ""}`}
                    onClick={() => setSelectedItem(grid.id)}
                    onDoubleClick={() => openWindow(grid.target)}
                  >
                    <div className="explorer-grid-icon-box">
                      <WinIcon type={grid.type} />
                    </div>
                    <span className="explorer-grid-label">{grid.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="explorer-folder-detail-view">
                <div className="explorer-detail-icon-box">
                  <WinIcon type={activeSidebarItem?.type} />
                </div>
                <h3>{activeSidebarItem?.name}</h3>
                <p>Double click or click open to launch application.</p>
                <button
                  className="explorer-open-app-btn"
                  onClick={() => openWindow(activeSidebarItem?.target)}
                >
                  Open
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (id === "photos") {
    const [zoomLevel, setZoomLevel] = useState(1);

    const nextPhoto = (e) => {
      e.stopPropagation();
      setZoomLevel(1);
      setSelectedPhotoIdx((prev) => (prev + 1) % photoList.length);
    };

    const prevPhoto = (e) => {
      e.stopPropagation();
      setZoomLevel(1);
      setSelectedPhotoIdx(
        (prev) => (prev - 1 + photoList.length) % photoList.length,
      );
    };

    const handleZoomIn = (e) => {
      e.stopPropagation();
      setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = (e) => {
      e.stopPropagation();
      setZoomLevel((prev) => Math.max(prev - 0.25, 1));
    };

    return (
      <div className="content-page photos-hub">
        <div className="photos-top-banner">
          <h2>Photo Gallery</h2>
          <p className="proj-count-text">
            Click any photo to open gallery viewer
          </p>
        </div>

        <div className="photos-grid-container">
          {photoList.map((photo, idx) => (
            <div
              key={idx}
              className="photo-card"
              onClick={() => {
                setZoomLevel(1);
                setSelectedPhotoIdx(idx);
              }}
            >
              <div className="photo-thumb-wrap">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="photo-thumb"
                />
              </div>
              <span className="photo-title">{photo.title}</span>
            </div>
          ))}
        </div>

        {selectedPhotoIdx !== null && (
          <div
            className="gallery-modal-overlay"
            onClick={() => setSelectedPhotoIdx(null)}
          >
            <div
              className="gallery-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="gallery-arrow-btn left-arrow"
                onClick={prevPhoto}
              >
                ‹
              </button>

              <div className="gallery-display-box">
                {/* ABSOLUTELY POSITIONED TOP CONTROLS */}
                <div className="gallery-inner-header-controls">
                  <div className="gallery-zoom-group">
                    <button
                      className="gallery-zoom-btn"
                      onClick={handleZoomOut}
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <span className="gallery-zoom-indicator">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      className="gallery-zoom-btn"
                      onClick={handleZoomIn}
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="gallery-close-btn-fixed"
                    onClick={() => setSelectedPhotoIdx(null)}
                    title="Close / Cancel"
                  >
                    ✕ Close / Cancel
                  </button>
                </div>

                <div className="gallery-img-scroll-viewport">
                  <img
                    src={photoList[selectedPhotoIdx].src}
                    alt={photoList[selectedPhotoIdx].title}
                    className="gallery-active-img"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                </div>

                <div className="gallery-caption">
                  <h4>{photoList[selectedPhotoIdx].title}</h4>
                  <span>
                    {selectedPhotoIdx + 1} of {photoList.length}
                  </span>
                </div>
              </div>

              <button
                className="gallery-arrow-btn right-arrow"
                onClick={nextPhoto}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (id === "skillsApp") {
    if (selectedProject) {
      return (
        <div className="content-page project-detail-page">
          <div className="project-detail-top-bar">
            <button
              className="back-btn"
              onClick={() => setSelectedProject(null)}
            >
              ← Back to Projects
            </button>
          </div>

          <div className="project-detail-title-row">
            <div className="proj-title-with-link">
              <h1>{selectedProject.title}</h1>
              <a
                href={selectedProject.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="proj-external-link-btn"
              >
                {selectedProject.linkType === "live"
                  ? "🌐 Live Demo ↗"
                  : "💻 GitHub ↗"}
              </a>
            </div>
          </div>

          <div className="project-detail-header">
            <span className="proj-cat-badge">{selectedProject.category}</span>
            <span className="proj-live-badge">{selectedProject.status}</span>
          </div>

          <div className="proj-section-box">
            <h3>Description</h3>
            <p>{selectedProject.desc}</p>
          </div>

          <div className="proj-section-box">
            <h3>Key Features</h3>
            <ul className="proj-features-list">
              {selectedProject.features.map((f, idx) => (
                <li key={idx}>✦ {f}</li>
              ))}
            </ul>
          </div>

          <div className="proj-section-box">
            <h3>Technologies Used</h3>
            <div className="skill-list">
              {selectedProject.tech.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="content-page projects-hub">
        <div className="projects-top-banner">
          <div>
            <h2>Software Projects</h2>
            <p className="proj-count-text">
              Showing {filteredProjects.length} of {projectList.length} verified
              projects
            </p>
          </div>
          <div className="proj-search-wrapper">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search projects..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="proj-filter-tabs">
          {[
            "All",
            "Full-Stack",
            "Frontend",
            "ML Projects",
            "Python Projects",
          ].map((tab) => (
            <button
              key={tab}
              className={`filter-tab-btn ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="projects-list-container">
          {filteredProjects.map((p) => (
            <div key={p.title} className="project-card-row">
              <div className="proj-info-left">
                <div className="proj-title-line">
                  <strong>{p.title}</strong>
                  <span className="proj-status-pill">{p.status}</span>
                </div>
                <div className="proj-tech-pills">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="proj-action-right">
                <button
                  className="explore-proj-btn"
                  onClick={() => setSelectedProject(p)}
                >
                  Explore →
                </button>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && (
            <p className="no-search-results">No projects match your filter.</p>
          )}
        </div>
      </div>
    );
  }

  if (id === "about") {
    return (
      <div className="content-page about-hub">
        <div className="about-profile-header">
          <div className="about-avatar-box">
            <img
              src="/profile.jpeg"
              alt="Sathwik Chelloju"
              className="about-profile-img"
            />
          </div>
          <div className="about-profile-info">
            <h2>Sathwik Chelloju</h2>
            <p className="about-role-text">
              AI/ML Student | Full-Stack Developer | Creative Designer
            </p>
            <p className="about-tagline-text">
              Building intelligent AI models, full-stack web platforms, and
              intuitive digital designs.
            </p>
            <div className="about-social-btns">
              <a
                href="https://www.linkedin.com/in/sathwikchelloju-dev/"
                target="_blank"
                rel="noreferrer"
                className="about-social-btn"
              >
                🔗 LinkedIn
              </a>
              <a
                href="https://github.com/SathwikChelloju"
                target="_blank"
                rel="noreferrer"
                className="about-social-btn"
              >
                💻 GitHub
              </a>
              <a
                href="mailto:chellojusathwik2005@gmail.com"
                className="about-social-btn"
              >
                ✉️ Contact
              </a>
            </div>
          </div>
        </div>

        <div className="about-focus-card">
          <span className="about-focus-icon">✨</span>
          <div>
            <h3>Focus Area</h3>
            <p>
              Building practical AI applications combining ML, information
              retrieval, Generative AI and software engineering.
            </p>
          </div>
        </div>

        <div className="about-section-block">
          <h3>Education</h3>
          <div className="about-edu-card">
            <div className="about-edu-top">
              <h4>JNTUH Affiliated College</h4>
              <span className="about-edu-year">2022 – 2026</span>
            </div>
            <p className="about-edu-degree">
              B.Tech in Computer Science Engineering (AI & Machine Learning)
            </p>
            <p className="about-edu-grade">CGPA: 8.5 / 10</p>
          </div>
        </div>
      </div>
    );
  }

  if (id === "skills") {
    const skillGroups = {
      Languages: ["Java", "Python", "JavaScript", "SQL"],
      Backend: [
        "Spring Boot",
        "Spring MVC",
        "Spring Data JPA",
        "Spring Security",
        "REST APIs",
        "JDBC",
      ],
      Frontend: ["React", "HTML", "CSS"],
      Database: ["MySQL"],
      Tools: [
        "Git",
        "GitHub",
        "Maven",
        "Postman",
        "VS Code",
        "Eclipse",
        "Render",
      ],
    };

    return (
      <div className="content-page">
        <h2>Skills & Technologies</h2>
        {Object.entries(skillGroups).map(([group, skills]) => (
          <div className="skill-group" key={group}>
            <h3>{group}</h3>
            <div className="skill-list">
              {skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (id === "education") {
    return (
      <div className="content-page">
        <h2>Education</h2>
        <div className="timeline">
          <div className="timeline-item">
            <span>🎓</span>
            <div>
              <h3>Bachelor of Technology - JNTUH Affiliated College</h3>
              <p>
                Computer Science Engineering — Artificial Intelligence & Machine
                Learning
              </p>
              <strong>CGPA: 8.5</strong>
            </div>
          </div>
          <br />
          <div className="timeline-item">
            <span>🎓</span>
            <div>
              <h3>Intermediate - MPC</h3>
              <p>MPC</p>
              <strong>CGPA: 9.01</strong>
            </div>
          </div>
          <br />
          <div className="timeline-item">
            <span>🎓</span>
            <div>
              <h3>SSC - State Board</h3>
              <p>Regular SSC</p>
              <strong>CGPA: 10.0</strong>
            </div>
          </div>
        </div>
        <div className="education-note">
          Passionate about software engineering, artificial intelligence and
          building real-world products.
        </div>
      </div>
    );
  }

  if (id === "achievements") {
    const achievementList = [
      {
        title: "Full Stack Developer Intern",
        subtitle: "TAP ACADEMY",
        org: "TAP ACADEMY",
        track: "Gained Knowledge on JAVA FullStack",
        scale: "Professional Certificate",
        img: "/TAP.jpg",
      },
      {
        title: "Introduction to LLM",
        subtitle: "Large Language Models",
        org: "NPTEL",
        track: "Large Language Models",
        scale: "Professional Certificate",
        img: "/LLM.jpg",
      },
      {
        title: "Hackthon Winner",
        subtitle: "First Price in College Hackathon",
        org: "JNTUH Affiliated College",
        track: "HACKATHON",
        scale: "Hackathon Award",
        img: "/first price.jpg",
      },
      {
        title: "AI Days 2025",
        subtitle: "AI Days Hackathon at Tech Mahindra",
        org: "Viswam AI",
        track: "AI Days Hackathon at Tech Mahindra",
        scale: "Participation Certificate",
        img: "/AI.jpg",
      },
      {
        title: "Introductio to ML",
        subtitle: "Machine Learning",
        org: "NPTEL",
        track: "Machine Learning",
        scale: "Professional Certificate",
        img: "/ML.jpg",
      },
      {
        title: "Smart India Hackathon",
        subtitle: "Participated in SIH",
        org: "AICTE",
        track: "Smart India Hackathon",
        scale: "Hackathon Award",
        img: "/SIH.jpg",
      },
    ];

    return (
      <div className="content-page achievements-hub">
        <div className="achievements-top-banner">
          <h2>Certificates & Achievements</h2>
          <p className="proj-count-text">
            Click any certificate card to view full preview
          </p>
        </div>

        <div className="achievements-grid-container">
          {achievementList.map((item, idx) => (
            <div
              key={idx}
              className="achievement-card-preview-img"
              onClick={() => setSelectedAchievement(item)}
            >
              <div className="ach-thumb-wrapper">
                <img
                  src={item.img}
                  alt={item.title}
                  className="ach-thumb-img"
                />
                <div className="ach-thumb-overlay">
                  <span>View Certificate</span>
                </div>
              </div>
              <div className="ach-preview-body-img">
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedAchievement && (
          <div
            className="achievement-modal-overlay"
            onClick={() => setSelectedAchievement(null)}
          >
            <div
              className="achievement-modal-content-img"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="ach-modal-close"
                onClick={() => setSelectedAchievement(null)}
              >
                ✕
              </button>
              <h2>{selectedAchievement.title}</h2>
              <div className="ach-modal-img-container">
                <img
                  src={selectedAchievement.img}
                  alt={selectedAchievement.title}
                  className="ach-modal-big-img"
                />
              </div>
              <div className="ach-modal-details-grid">
                <div>
                  <span className="ach-detail-label">Organization</span>
                  <strong className="ach-detail-val">
                    {selectedAchievement.org}
                  </strong>
                </div>
                <div>
                  <span className="ach-detail-label">Track</span>
                  <strong className="ach-detail-val">
                    {selectedAchievement.track}
                  </strong>
                </div>
                <div>
                  <span className="ach-detail-label">Scale</span>
                  <strong className="ach-detail-val">
                    {selectedAchievement.scale}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (id === "resume") {
    const handleDownload = () => {
      const link = document.createElement("a");
      link.href = "/SathwikResume.pdf";
      link.download = "Sathwik_Chelloju_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="resume-window">
        {/* PDF VIEWER TOP TOOLBAR */}
        <div className="pdf-top-toolbar">
          <span className="pdf-filename">Sathwik_Chelloju_Resume.pdf</span>
          <div className="pdf-top-actions">
            <span className="pdf-zoom-indicator">100%</span>
            <button
              className="pdf-top-btn"
              title="Pop out"
              onClick={() => window.open("/SathwikResume.pdf", "_blank")}
            >
              ↗
            </button>
            <button
              className="pdf-top-btn"
              title="Download"
              onClick={handleDownload}
            >
              📥 Download
            </button>
          </div>
        </div>

        {/* PDF VIEWER SECONDARY TOOLBAR */}
        <div className="resume-toolbar">
          <div className="pdf-nav-group">
            <span>📄 Sathwik_Chelloju_Resume.pdf</span>
          </div>
          <div className="pdf-page-controls">
            <button className="pdf-ctrl-btn">⟨</button>
            <span>1 / 1</span>
            <button className="pdf-ctrl-btn">⟩</button>
            <span className="toolbar-divider"></span>
            <button className="pdf-ctrl-btn">−</button>
            <span>95%</span>
            <button className="pdf-ctrl-btn">+</button>
          </div>
          <div className="resume-toolbar-actions">
            <button title="Print" onClick={() => window.print()}>
              🖨️
            </button>
            <button title="Download" onClick={handleDownload}>
              📥
            </button>
          </div>
        </div>

        {/* RESUME VIEWER WITH EMBEDDED REAL PDF */}
        <div className="resume-paper-container">
          <iframe
            src="/SathwikResume.pdf#toolbar=0&view=FitH"
            title="SathwikResume PDF"
            className="resume-pdf-iframe"
          />
        </div>
      </div>
    );
  }

  if (id === "terminal") {
    return <Terminal />;
  }

  if (id === "ai") {
    return <AIAssistant openWindow={openWindow} />;
  }

  return (
    <div className="content-page">
      <h2>Recycle Bin</h2>
      <p>Items in the recycle bin are empty.</p>
    </div>
  );
}

/* =========================================
   TERMINAL
========================================= */

function Terminal() {
  const [history, setHistory] = useState([
    { type: "output", text: "Microsoft Windows [Version 10.0.22631.3527]" },
    { type: "output", text: "(c) Microsoft Corporation. All rights reserved." },
    { type: "output", text: "" },
    {
      type: "output",
      text: "┌──────────────────────────────────────────────────┐",
      color: "cyan",
    },
    {
      type: "output",
      text: "│       SATHWIK CHELLOJU — Portfolio Terminal      │",
      color: "cyan-bold",
    },
    {
      type: "output",
      text: "│       AI/ML Student | Full-Stack Developer       │",
      color: "cyan",
    },
    {
      type: "output",
      text: "│       Type 'help' to see available commands.     │",
      color: "white",
    },
    {
      type: "output",
      text: "└──────────────────────────────────────────────────┘",
      color: "cyan",
    },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      const newHistory = [
        ...history,
        { type: "input", text: `PS C:\\Users\\Sathwik> ${input}` },
      ];

      if (cmd === "help") {
        newHistory.push(
          { type: "output", text: "Available commands:" },
          {
            type: "output",
            text: "  whoami    - Display personal profile info",
          },
          {
            type: "output",
            text: "  skills    - List technical skills and tech stack",
          },
          {
            type: "output",
            text: "  projects  - Show featured portfolio projects",
          },
          { type: "output", text: "  education - View educational background" },
          { type: "output", text: "  clear     - Clear the terminal screen" },
          {
            type: "output",
            text: "  date      - Display current date and time",
          },
        );
      } else if (cmd === "whoami") {
        newHistory.push(
          { type: "output", text: "Name: Sathwik Chelloju" },
          {
            type: "output",
            text: "Role: AI/ML Student & Full-Stack Developer",
          },
          { type: "output", text: "Location: Hyderabad, Telangana, India" },
        );
      } else if (cmd === "skills") {
        newHistory.push(
          {
            type: "output",
            text: "Programming: ",
            color: "yellow",
            inlineText: "Java, Python, JavaScript, SQL",
          },
          {
            type: "output",
            text: "Backend: ",
            color: "yellow",
            inlineText: "Spring Boot, Spring MVC, REST APIs, JDBC",
          },
          {
            type: "output",
            text: "Frontend: ",
            color: "yellow",
            inlineText: "React.js, HTML5, CSS3, Responsive UI",
          },
          {
            type: "output",
            text: "Databases: ",
            color: "yellow",
            inlineText: "MySQL, SQL",
          },
          {
            type: "output",
            text: "Tools & DevOps: ",
            color: "yellow",
            inlineText: "Git, GitHub, Maven, Postman, VS Code",
          },
        );
      } else if (cmd === "projects") {
        newHistory.push(
          { type: "output", text: "► InterviewMate [Live]", color: "blue" },
          {
            type: "output",
            text: "  AI-powered mock interview preparation platform built with Spring Boot & Java.",
          },
          {
            type: "output",
            text: "► Food Delivery Application [Live]",
            color: "blue",
          },
          {
            type: "output",
            text: "  Full-stack ordering platform using Java Servlets, JDBC, and MySQL.",
          },
          {
            type: "output",
            text: "► Agriculture Voice Bot [Live]",
            color: "blue",
          },
          {
            type: "output",
            text: "  AI voice assistant helping farmers with speech recognition & NLP.",
          },
          {
            type: "output",
            text: "► Air Pollution Tracking [Live]",
            color: "blue",
          },
          {
            type: "output",
            text: "  Real-time AQI and pollutant level tracking using FastAPI and Python.",
          },
        );
      } else if (cmd === "education") {
        newHistory.push(
          {
            type: "output",
            text: "B.Tech in CSE (AI & Machine Learning) — JNTUH Affiliated College (2022–2026) | CGPA: 8.5",
          },
          { type: "output", text: "Intermediate MPC — CGPA: 9.01" },
          { type: "output", text: "SSC State Board — CGPA: 10.0" },
        );
      } else if (cmd === "clear") {
        setHistory([]);
        setInput("");
        return;
      } else if (cmd === "date") {
        newHistory.push({ type: "output", text: new Date().toString() });
      } else if (cmd !== "") {
        newHistory.push({
          type: "output",
          text: `'${input}' is not recognized as an internal or external command. Type 'help'.`,
        });
      }

      setHistory(newHistory);
      setInput("");
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-scroll-area">
        {history.map((h, i) => (
          <div key={i} className={`term-line ${h.type}`}>
            {h.color === "yellow" && h.inlineText ? (
              <>
                <span className="term-label-yellow">{h.text}</span>
                <span className="term-val-white">{h.inlineText}</span>
              </>
            ) : (
              h.text
            )}
          </div>
        ))}
        <div className="term-input-row">
          <span className="term-prompt">PS C:\Users\Sathwik&gt;</span>
          <input
            type="text"
            className="term-input-box"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================
   AI ASSISTANT
========================================= */
function AIAssistant({ openWindow }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! 👋 I'm Sathwik's portfolio assistant. Ask me about his skills, projects, education, or achievements.",
      action: null,
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleClearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Hi! 👋 I'm Sathwik's portfolio assistant. Ask me about his skills, projects, education, or achievements.",
        action: null,
      },
    ]);
  };

  const handleSend = (queryText) => {
    const text = queryText || inputVal;
    if (!text.trim() || isTyping) return;

    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      let botReply = {
        sender: "bot",
        text: "I'm not quite sure about that. Try asking about his skills, projects, or education!",
        action: null,
      };

      const lower = text.toLowerCase();

      if (
        lower.includes("sathwik") ||
        lower.includes("who is") ||
        lower.includes("tell about")
      ) {
        botReply = {
          sender: "bot",
          text: "Sathwik Chelloju is a 22-year-old AI/ML student, Full-Stack Developer, and creative designer completing his B.Tech in CSE (AI & ML) at a JNTUH Affiliated College (2022–2026).",
          action: { label: "Open About Me", target: "about" },
        };
      } else if (lower.includes("skill") || lower.includes("tech")) {
        botReply = {
          sender: "bot",
          text: "Sathwik is skilled in Java, Python, Spring Boot, React.js, SQL, and building AI/ML solutions.",
          action: { label: "Open Skills", target: "skills" },
        };
      } else if (
        lower.includes("project") ||
        lower.includes("interviewmate") ||
        lower.includes("food delivery")
      ) {
        botReply = {
          sender: "bot",
          text: "Sathwik has built several full-stack and AI applications, including InterviewMate (AI Mock Interview platform), a Food Delivery App, and an Agriculture Voice Bot.",
          action: { label: "Open Projects", target: "skillsApp" },
        };
      } else if (
        lower.includes("achievement") ||
        lower.includes("certificate") ||
        lower.includes("hackathon")
      ) {
        botReply = {
          sender: "bot",
          text: "Sathwik has earned multiple certifications from NPTEL (LLMs & ML), interned at TAP Academy, and won college hackathons.",
          action: { label: "Open Achievements", target: "achievements" },
        };
      } else if (
        lower.includes("education") ||
        lower.includes("college") ||
        lower.includes("cgpa")
      ) {
        botReply = {
          sender: "bot",
          text: "Sathwik is pursuing his B.Tech in Computer Science Engineering (AI & Machine Learning) at a JNTUH Affiliated College with an 8.5 CGPA.",
          action: { label: "Open Education", target: "education" },
        };
      } else if (lower.includes("resume") || lower.includes("cv")) {
        botReply = {
          sender: "bot",
          text: "You can view or download Sathwik's official professional resume directly from his portfolio viewer.",
          action: { label: "Open Resume", target: "resume" },
        };
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, botReply]);
    }, 1500);
  };

  return (
    <div className="ai-window">
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-avatar">✨</div>
          <div>
            <h2>Ask Sathwik AI</h2>
            <p>Interactive Portfolio Assistant</p>
          </div>
        </div>
        <button
          className="ai-clear-btn"
          onClick={handleClearChat}
          title="Clear Chat & Reset"
        >
          🗑️ Clear Chat
        </button>
      </div>

      <div className="ai-chat-body">
        {messages.map((m, idx) => (
          <div key={idx} className={`ai-chat-row ${m.sender}`}>
            {m.sender === "bot" && <div className="ai-bot-ico">🤖</div>}
            <div className={`ai-bubble ${m.sender}`}>
              <p>{m.text}</p>
              {m.action && (
                <button
                  className="ai-action-chip"
                  onClick={() => openWindow(m.action.target)}
                >
                  {m.action.label} →
                </button>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="ai-chat-row bot">
            <div className="ai-bot-ico">🤖</div>
            <div className="ai-bubble bot typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && !isTyping && (
        <div className="ai-suggestions">
          <button onClick={() => handleSend("Who is Sathwik?")}>
            Who is Sathwik?
          </button>
          <button onClick={() => handleSend("What skills does Sathwik have?")}>
            What skills does Sathwik have?
          </button>
          <button onClick={() => handleSend("Tell me about his projects")}>
            Tell me about his projects
          </button>
          <button onClick={() => handleSend("What are his achievements?")}>
            What are his achievements?
          </button>
        </div>
      )}

      <div className="ai-input">
        <input
          placeholder="Ask about Sathwik, projects, skills..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isTyping}
        />
        <button onClick={() => handleSend()} disabled={isTyping}>
          →
        </button>
      </div>
    </div>
  );
}

/* =========================================
   TASKBAR
========================================= */

Taskbar.defaultProps = {
  apps: [],
  windows: [],
};

function Taskbar({
  apps,
  windows,
  activeWindow,
  startOpen,
  quickSettingsOpen,
  onStart,
  onSearchClick,
  onQuickSettings,
  onOpen,
  time,
}) {
  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = time.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const dockApps = apps.filter(
    (app) => app.id !== "recycle" && app.id !== "ai",
  );

  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <div className="weather-widget">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
          <div>
            <strong>31°C</strong>
            <small>Mostly cloudy</small>
          </div>
        </div>
      </div>

      <div className="taskbar-apps">
        <button
          className={`taskbar-app start-win-btn ${startOpen ? "taskbar-active" : ""}`}
          onClick={onStart}
          title="Start"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#0078d4"
            stroke="#0078d4"
            strokeWidth="1"
          >
            <rect x="3" y="3" width="8" height="8" rx="1"></rect>
            <rect x="13" y="3" width="8" height="8" rx="1"></rect>
            <rect x="13" y="13" width="8" height="8" rx="1"></rect>
            <rect x="3" y="13" width="8" height="8" rx="1"></rect>
          </svg>
        </button>

        <button
          className="taskbar-app search-trigger-btn"
          onClick={onSearchClick}
          title="Search"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span className="search-placeholder-text">Search</span>
        </button>

        {dockApps.map((app) => (
          <button
            key={app.id}
            className={`taskbar-app ${
              windows.includes(app.id) && activeWindow === app.id
                ? "taskbar-active"
                : ""
            }`}
            onClick={() => onOpen(app.id)}
            title={app.name}
          >
            <span className="taskbar-mini-ico">
              <WinIcon type={app.type} />
            </span>
          </button>
        ))}

        <button
          className={`taskbar-ai-pill ${
            windows.includes("ai") && activeWindow === "ai"
              ? "taskbar-active"
              : ""
          }`}
          onClick={() => onOpen("ai")}
          title="Ask Sathwik AI"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
          </svg>
          <span>Ask Sathwik</span>
        </button>
      </div>

      <div className="system-tray" onClick={onQuickSettings}>
        <span className="tray-icon" title="Show hidden icons">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </span>
        <span className="tray-icon tray-lang">ENG US</span>
        <span className="tray-icon" title="Network">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
        </span>
        <span className="tray-icon" title="Volume">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
        </span>
        <span className="tray-icon" title="Battery">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
            <line x1="23" y1="13" x2="23" y2="11"></line>
          </svg>
        </span>

        <div className="clock">
          <strong>{formattedTime}</strong>
          <small>{formattedDate}</small>
        </div>
      </div>
    </div>
  );
}

/* =========================================
   SMALL COMPONENTS
========================================= */

function Info({ title, value }) {
  return (
    <div className="info-card">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Project({ number, title, description, technologies }) {
  return (
    <div className="project-item">
      <span className="project-number">{number}</span>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <span className="project-tech">{technologies}</span>
      </div>
      <span className="project-arrow">↗</span>
    </div>
  );
}

export default App;
