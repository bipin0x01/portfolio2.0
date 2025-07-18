var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName("txt-rotate");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-rotate");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);

  // Initialize image placeholders
  initImagePlaceholders();
};

particlesJS.load("particles-js", "assets/js/particlesjs-config.json");

// View Toggle Functionality
let isResumeMode = false;

function toggleView() {
  const viewToggle = document.getElementById("viewToggle");
  const heroContainer = document.querySelector(".hero-container");
  const floatingSwitch = document.getElementById("floatingModeSwitch");

  isResumeMode = !isResumeMode;

  if (isResumeMode) {
    // Switch to Resume Mode
    viewToggle.classList.add("active");
    viewToggle.querySelector(".toggle-text").textContent = "Interactive";

    // Store original hero content if not already stored
    if (!window.originalHeroContent) {
      window.originalHeroContent = heroContainer.innerHTML;
    }

    // Load resume content
    loadResumeContent();

    // Update navbar background for resume mode
    document.querySelector(".modern-navbar").classList.add("resume-navbar");

    // Hide all sections except resume
    hideAllSections();

    // Show floating switch after a delay
    setTimeout(() => {
      if (floatingSwitch) {
        floatingSwitch.classList.add("show");
      }
    }, 1000);
  } else {
    // Switch to Interactive Mode
    viewToggle.classList.remove("active");
    viewToggle.querySelector(".toggle-text").textContent = "Resume";

    // Restore original hero content
    if (window.originalHeroContent) {
      heroContainer.innerHTML = window.originalHeroContent;
    }

    // Remove navbar background for interactive mode
    document.querySelector(".modern-navbar").classList.remove("resume-navbar");

    // Show all sections
    showAllSections();

    // Hide floating switch
    if (floatingSwitch) {
      floatingSwitch.classList.remove("show");
    }
  }
}

function hideAllSections() {
  // Hide all sections except the hero section (which contains resume) and navbar
  const sectionsToHide = [
    ".skills-section",
    ".projects-section",
    ".blog-section",
    ".contact-section",
    ".timeline-section",
    "footer",
  ];

  sectionsToHide.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = "none";
    }
  });

  // Ensure navbar is visible in resume mode
  const navbar = document.querySelector(".modern-navbar");
  if (navbar) {
    navbar.style.display = "block";
    navbar.style.position = "fixed";
    navbar.style.zIndex = "1000";
  }
}

function showAllSections() {
  // Show all sections
  const sectionsToShow = [
    ".skills-section",
    ".projects-section",
    ".blog-section",
    ".contact-section",
    ".timeline-section",
    "footer",
  ];

  sectionsToShow.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = "block";
    }
  });

  // Ensure navbar is properly restored
  const navbar = document.querySelector(".modern-navbar");
  if (navbar) {
    navbar.style.display = "block";
    navbar.style.position = "fixed";
    navbar.style.zIndex = "1000";
  }
}

function switchToInteractive() {
  const viewToggle = document.getElementById("viewToggle");
  const heroContainer = document.querySelector(".hero-container");
  const floatingSwitch = document.getElementById("floatingModeSwitch");

  isResumeMode = false;

  // Switch to Interactive Mode
  viewToggle.classList.remove("active");
  viewToggle.querySelector(".toggle-text").textContent = "Resume";

  // Restore original hero content
  if (window.originalHeroContent) {
    heroContainer.innerHTML = window.originalHeroContent;
  }

  // Remove navbar background for interactive mode
  document.querySelector(".modern-navbar").classList.remove("resume-navbar");

  // Hide floating switch
  if (floatingSwitch) {
    floatingSwitch.classList.remove("show");
  }

  // Show all sections
  showAllSections();
}

function loadResumeContent() {
  fetch("HeroBannerResume.html")
    .then((response) => response.text())
    .then((html) => {
      const heroContainer = document.querySelector(".hero-container");
      const resumeDiv = document.createElement("div");
      resumeDiv.className = "resume-mode";
      resumeDiv.innerHTML = html;

      // Store the original hero content
      if (!window.originalHeroContent) {
        window.originalHeroContent = heroContainer.innerHTML;
      }

      // Replace the hero content with resume content
      heroContainer.innerHTML = resumeDiv.innerHTML;

      // Add event listeners for resume buttons
      addResumeEventListeners();
    })
    .catch((error) => {
      console.error("Error loading resume content:", error);
    });
}

function addResumeEventListeners() {
  const downloadBtn = document.querySelector(".download-btn");
  const printBtn = document.querySelector(".print-btn");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", downloadResume);
  }

  if (printBtn) {
    printBtn.addEventListener("click", printResume);
  }
}

function downloadResume() {
  // Create a downloadable version of the resume
  const resumeContent = document.querySelector(".resume-mode");
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
        <html>
            <head>
                <title>Bipin Thapa - Resume</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    .resume-header { background: #10b981; color: white; padding: 20px; }
                    .resume-content { padding: 20px; }
                    .section-title { color: #10b981; border-bottom: 2px solid #e5e7eb; }
                    .experience-item { margin-bottom: 20px; }
                    .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                ${resumeContent.outerHTML}
            </body>
        </html>
    `);
  printWindow.document.close();
  printWindow.print();
}

function printResume() {
  window.print();
}

// Initialize view toggle
document.addEventListener("DOMContentLoaded", function () {
  const viewToggle = document.getElementById("viewToggle");
  if (viewToggle) {
    viewToggle.addEventListener("click", toggleView);
  }

  // Add theme toggle functionality
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Add hamburger menu functionality
  const hamburger = document.getElementById("hamburger");
  const navbarNav = document.querySelector(".navbar-nav");

  if (hamburger && navbarNav) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navbarNav.classList.toggle("active");
    });
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".modern-navbar");
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});

// Title rotator functionality
function initTitleRotator() {
  const rotator = document.querySelector(".title-rotator");
  if (!rotator) return;

  const titles = JSON.parse(rotator.getAttribute("data-rotate"));
  const period = parseInt(rotator.getAttribute("data-period")) || 2000;
  let currentIndex = 0;

  function rotateTitle() {
    rotator.textContent = titles[currentIndex];
    currentIndex = (currentIndex + 1) % titles.length;
  }

  rotateTitle();
  setInterval(rotateTitle, period);
}

// Initialize title rotator when DOM is loaded
document.addEventListener("DOMContentLoaded", initTitleRotator);

// Theme toggle functionality
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const themeToggle = document.getElementById("themeToggle");
  const icon = themeToggle.querySelector("i");

  if (document.body.classList.contains("dark-theme")) {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
}

// Image placeholder functionality
function initImagePlaceholders() {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("error", function () {
      // Create placeholder based on image class or context
      const placeholder = createPlaceholder(this);
      this.src = placeholder;
      this.alt = "Image not available";
    });
  });
}

function createPlaceholder(img) {
  const className = img.className;
  const alt = img.alt || "";

  // Create SVG placeholder based on image type
  if (
    className.includes("profile-image") ||
    className.includes("resume-avatar") ||
    className.includes("author-avatar")
  ) {
    // Profile image placeholder
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#e5e7eb"/>
        <circle cx="100" cy="80" r="30" fill="#9ca3af"/>
        <path d="M 50 140 Q 100 120 150 140" stroke="#9ca3af" stroke-width="3" fill="none"/>
        <text x="100" y="190" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="12">Profile Image</text>
      </svg>
    `)}`;
  } else if (className.includes("project-image")) {
    // Project image placeholder
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="250" fill="#f3f4f6"/>
        <rect x="50" y="50" width="300" height="150" fill="#e5e7eb" stroke="#d1d5db" stroke-width="2"/>
        <text x="200" y="140" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="16" font-weight="bold">Project Preview</text>
        <text x="200" y="160" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="12">Image not available</text>
      </svg>
    `)}`;
  } else if (
    className.includes("skill-icon") ||
    alt.toLowerCase().includes("skill")
  ) {
    // Skill icon placeholder
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="60" fill="#f3f4f6" rx="8"/>
        <text x="30" y="35" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="10" font-weight="bold">${
          alt || "Skill"
        }</text>
      </svg>
    `)}`;
  } else if (className.includes("blog-image")) {
    // Blog image placeholder
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="#f3f4f6"/>
        <rect x="30" y="30" width="240" height="140" fill="#e5e7eb" stroke="#d1d5db" stroke-width="1"/>
        <text x="150" y="110" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14" font-weight="bold">Blog Image</text>
        <text x="150" y="130" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="10">Image not available</text>
      </svg>
    `)}`;
  } else {
    // Generic placeholder
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#f3f4f6"/>
        <text x="100" y="80" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="12">Image</text>
        <text x="100" y="100" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="10">Not Available</text>
      </svg>
    `)}`;
  }
}