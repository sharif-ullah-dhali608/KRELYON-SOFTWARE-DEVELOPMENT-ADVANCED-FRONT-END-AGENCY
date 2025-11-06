// ==========================================================
// === RUN ALL ANIMATIONS ONCE THE PAGE LOADS
// ==========================================================

// 1. Run the canvas particle animation
document.addEventListener("DOMContentLoaded", initializeContactCanvasAnimation);

// 2. Run the "Framer Motion" style scroll-in animation
document.addEventListener("DOMContentLoaded", initializeContactScrollAnimation);

// 3. Add basic logic to the contact form
document.addEventListener("DOMContentLoaded", initializeContactForm);

/*
 * ==================================
 * 1. CONTACT CANVAS "STRING" ANIMATION
 * (Copied from products.js)
 * ==================================
 */
function initializeContactCanvasAnimation() {
  const canvas = document.getElementById("contact-canvas");
  if (!canvas) {
    console.warn("Contact canvas not found, skipping animation.");
    return;
  }

  const ctx = canvas.getContext("2d");
  let particles = [];

  // --- Configuration ---
  const particleCount = 60;
  const maxDistance = 120;
  const particleSpeed = 0.3;
  const particleColor = "rgba(255, 255, 255, 0.5)"; // Dot color
  const lineColor = "rgba(255, 255, 255, 0.08)"; // Line color
  // ---------------------

  function setCanvasSize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * particleSpeed;
      this.vy = (Math.random() - 0.5) * particleSpeed;
      this.radius = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }
  }

  function init() {
    setCanvasSize();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 0.5;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connect();
    requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener("resize", init);
}

/*
 * ==================================
 * 2. CONTACT SECTION "FADE IN" ANIMATION
 * (Updated for two-column layout)
 * ==================================
 */
function initializeContactScrollAnimation() {
  if (typeof gsap === "undefined") {
    console.error("GSAP not loaded, skipping contact scroll animation");
    return;
  }

  const gridLeft = document.querySelector(".contact-grid-left");
  const gridRight = document.querySelector(".contact-grid-right");

  if (!gridLeft || !gridRight) return;

  // Get the children to animate
  const children = [gridLeft, gridRight];

  // Set initial state: hidden
  gsap.set(children, { opacity: 0, y: 30 });

  // Create the scroll trigger
  gsap.to(children, {
    opacity: 1,
    y: 0,
    stagger: 0.2, // Animate left, then right
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 60%", // Start a bit later
      toggleActions: "play none none none", // Play once
    },
  });
}

/*
 * ==================================
 * 3. BASIC CONTACT FORM LOGIC
 * ==================================
 */
function initializeContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Stop the page from reloading

    // You can add your form submission logic here
    // (e.g., send data to Netlify, Formspree, or your backend)

    // For now, just log the data and show an alert
    const formData = new FormData(form);
    console.log("Form submitted!");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    alert("Thank you for your message! We'll be in touch soon.");
    form.reset(); // Clear the form
  });
}
