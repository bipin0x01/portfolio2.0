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

// Image placeholder functionality
function initImagePlaceholders() {
  const images = document.querySelectorAll("img");
  
  images.forEach((img) => {
    img.addEventListener("error", function () {
      this.src = createPlaceholder(this);
    });
  });
}

function createPlaceholder(img) {
  const width = img.width || 300;
  const height = img.height || 200;
  const text = getPlaceholderText(img);

  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `)}`;
}

function getPlaceholderText(img) {
  const src = img.src || "";
  const alt = img.alt || "";
  const className = img.className || "";

  if (src.includes("profile") || className.includes("profile"))
    return "Profile Image";
  if (src.includes("project") || className.includes("project"))
    return "Project Image";
  if (src.includes("skill") || className.includes("skill")) return "Skill Icon";
  if (src.includes("blog") || className.includes("blog")) return "Blog Image";

  return "Image";
}