// ==========================================================
// === RUN ALL ANIMATIONS ONCE THE PAGE LOADS
// ==========================================================

// This runs the FAQ dropdown logic
// document.addEventListener("DOMContentLoaded", initializeAnimationAccordion);

// This runs the NEW "MyProject Suite" canvas animation
document.addEventListener("DOMContentLoaded", initializeSuiteCanvasAnimation);

// This runs the "Framer Motion" scroll animation for the SUITE
document.addEventListener("DOMContentLoaded", initializeSuiteScrollAnimation);

// ✅ THIS RUNS THE NEW "FRAMER MOTION" SCROLL ANIMATION FOR THE FAQ
document.addEventListener("DOMContentLoaded", initializeFaqScrollAnimation);

// --- Wait for the main script (index.js) to finish loading ---
document.addEventListener("mainContentLoaded", () => {
  // 1. Run the Video Hero animation
  initializeProductPageAnimations();

  // 2. Run the FAQ Canvas "String" animation
  initializeHeroCanvasAnimation();
});

// Fallback if the main event doesn't fire
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // Check if index.js has already run and set the class
    if (!document.body.classList.contains("gsap-loaded")) {
      console.warn("Fallback: Firing product scripts.");
      initializeProductPageAnimations();
      initializeHeroCanvasAnimation();
    }
  }, 2000); // 2-second fallback
});

/*
 * ==================================
 * 1. VIDEO HERO ANIMATION LOGIC
 * (GSAP "scale and pin" animation)
 * ==================================
 */
function initializeProductPageAnimations() {
  if (typeof gsap === "undefined") {
    console.error("GSAP not loaded, skipping product animations");
    return;
  }

  const heroContainer = document.querySelector(".product-hero-container");
  if (!heroContainer) {
    return; // Not on the product page
  }

  // --- 1a. Hero Scale/Pin Animation ---
  gsap
    .timeline({
      scrollTrigger: {
        trigger: heroContainer,
        start: "top top",
        end: "+=1500",
        scrub: 1,
        pin: true,
      },
    })
    .to(".product-hero-video-wrapper", {
      scale: 0.7,
      borderRadius: "30px",
      y: "-10%",
      ease: "power1.inOut",
    })
    .to(
      ".product-hero-content",
      {
        opacity: 0,
        ease: "power1.inOut",
      },
      "<"
    );

  // --- 1b. Hero Text Intro Animation ---
  gsap.to(".product-hero-content .anim-line-inner", {
    y: 0,
    duration: 1,
    stagger: 0.15,
    ease: "power3.out",
    delay: 0.5,
  });

  gsap.to(".product-hero-content .anim-fade-in", {
    opacity: 1,
    duration: 1,
    delay: 1,
  });
}

/*
 * ==================================
 * 2. FAQ CANVAS "STRING" ANIMATION
 * (This code creates the moving lines)
 * ==================================
 */
function initializeHeroCanvasAnimation() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) {
    console.warn("Hero canvas not found, skipping animation.");
    return;
  }

  const ctx = canvas.getContext("2d");
  let particles = [];

  // --- Configuration ---
  const particleCount = 60; // How many dots
  const maxDistance = 120; // How close to draw a line
  const particleSpeed = 0.3; // How fast they move
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
      this.radius = Math.random() * 1.5 + 0.5; // Small dots
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear screen

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    connect(); // Draw lines

    requestAnimationFrame(animate);
  }

  // --- Run it ---
  init();
  animate();
  // Re-initialize on window resize
  window.addEventListener("resize", init);
}

/*
 * ==================================
 * 3. FAQ ACCORDION LOGIC (FIXED)
 * (Handles click-to-open)
 * ==================================
 */





// function initializeAnimationAccordion() {
//   const items = document.querySelectorAll(".faq-item");
//   if (!items.length) return;

//   items.forEach((item) => {
//     const btn = item.querySelector(".faq-question");
//     const answer = item.querySelector(".faq-answer");
//     if (!btn || !answer) return;

//     // form এর ভিতরে থাকলে submit না হয়—HTML না ছুঁয়ে JS দিয়েই ঠিক করে দিচ্ছি
//     btn.setAttribute("type", "button");

//     // শুরুতেই বন্ধ
//     answer.style.maxHeight = "0px";

//     btn.addEventListener("click", () => {
//       const isOpen = item.classList.contains("active");

//       // আগে সব বন্ধ করি
//       items.forEach((it) => {
//         it.classList.remove("active");
//         const ans = it.querySelector(".faq-answer");
//         if (ans) ans.style.maxHeight = "0px";
//       });

//       // যেটায় ক্লিক হলো, ওটা যদি আগে বন্ধ থাকে তাহলে খুলবো; নাহলে বন্ধই থাকবে
//       if (!isOpen) {
//         item.classList.add("active");
//         // কন্টেন্ট যত লম্বা, ঠিক ততটাই খুলবে
//         answer.style.maxHeight = answer.scrollHeight + "px";
//       }
//     });
//   });

//   // রিসাইজ হলে ওপেন আইটেমের height রিক্যালকুলেট
//   window.addEventListener("resize", () => {
//     const open = document.querySelector(".faq-item.active .faq-answer");
//     if (open) open.style.maxHeight = open.scrollHeight + "px";
//   });
// }

/*
 * ==================================
 * 4. NEW: SUITE CANVAS "STRING" ANIMATION
 * (Copied from initializeHeroCanvasAnimation)
 * ==================================
 */
function initializeSuiteCanvasAnimation() {
  // 1. TARGET THE NEW CANVAS ID
  const canvas = document.getElementById("suite-canvas");
  if (!canvas) {
    console.warn("Suite canvas not found, skipping animation.");
    return;
  }

  const ctx = canvas.getContext("2d");
  let particles = [];

  // --- Configuration ---
  const particleCount = 60; // How many dots
  const maxDistance = 120; // How close to draw a line
  const particleSpeed = 0.3; // How fast they move

  // 2. UPDATED COLORS TO MATCH PURPLE THEME
  const particleColor = "rgba(233, 213, 255, 0.5)"; // Light purple dot
  const lineColor = "rgba(168, 85, 247, 0.15)"; // Faint purple line
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
      this.radius = Math.random() * 1.5 + 0.5; // Small dots
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear screen

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    connect(); // Draw lines

    requestAnimationFrame(animate);
  }

  // --- Run it ---
  init();
  animate();
  // Re-initialize on window resize
  window.addEventListener("resize", init);
}

/*
 * ==================================
 * 5. NEW: SUITE SECTION "FADE IN" ANIMATION
 * (This creates the "Framer Motion" style scroll effect)
 * ==================================
 */
function initializeSuiteScrollAnimation() {
  if (typeof gsap === "undefined") {
    console.error("GSAP not loaded, skipping suite scroll animation");
    return;
  }

  const suiteContent = document.querySelector(".suite-content");
  if (!suiteContent) return;

  // Get the children to animate
  const children = [
    suiteContent.querySelector("h1"),
    suiteContent.querySelector("p"),
    suiteContent.querySelector(".cta-button"),
  ];

  // Set initial state: hidden
  gsAP.set(children, { opacity: 0, y: 30 });

  // Create the scroll trigger
  gsap.to(children, {
    opacity: 1,
    y: 0,
    stagger: 0.2, // Animate one after the other
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".suite-section",
      start: "top 70%", // Start when 70% of the way down the page
      toggleActions: "play none none none", // Play once
    },
  });
}

/*
 * ==================================
 * 6. NEW: FAQ SECTION "FADE IN" ANIMATION
 * (This applies the same effect to the FAQ)
 * ==================================
 */
function initializeFaqScrollAnimation() {
  if (typeof gsap === "undefined") {
    console.error("GSAP not loaded, skipping faq scroll animation");
    return;
  }

  const faqContent = document.querySelector(".faq-content");
  if (!faqContent) return;

  // Get the children to animate
  const children = [
    faqContent.querySelector(".slide-title"),
    faqContent.querySelector(".faq-accordion"),
  ];

  // Set initial state: hidden
  gsap.set(children, { opacity: 0, y: 30 });

  // Create the scroll trigger
  gsap.to(children, {
    opacity: 1,
    y: 0,
    stagger: 0.2, // Animate one after the other
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".faq-section",
      start: "top 70%", // Start when 70% of the way down the page
      toggleActions: "play none none none", // Play once
    },
  });
}
