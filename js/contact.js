// ==========================================================
// ===         FULL CONTACT.JS CODE (FINAL)
// ==========================================================

// 1. Run the canvas particle animation
document.addEventListener("DOMContentLoaded", initializeContactCanvasAnimation);

// 2. Run the "Framer Motion" style scroll-in animation
document.addEventListener("DOMContentLoaded", initializeContactScrollAnimation);

// 3. Add ADVANCED logic (with validation) to the contact form
document.addEventListener("DOMContentLoaded", initializeContactForm);

/*
 * ==================================
 * 1. CONTACT CANVAS "STRING" ANIMATION
 * (Apnar code)
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
 * (Apnar code)
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
 * 3. ADVANCED CONTACT FORM LOGIC (Validation o Modal shoho)
 * (Updated with Name Validation)
 * ==================================
 */
function initializeContactForm() {
  // === 1. Shob proyojoniyo element select kora ===
  const form = document.getElementById("contact-form");
  if (!form) return; // Form na thakle kichu korbe na

  const successModal = document.getElementById("success-modal");
  const errorModal = document.getElementById("error-modal");
  const modalCloseButtons = document.querySelectorAll(".modal-close");
  
  // Form Inputs
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const budgetInput = document.getElementById("budget");
  const timelineInput = document.getElementById("timeline");
  const messageInput = document.getElementById("message");

  // Shobgulo required field-er ekti list
  const requiredFields = [nameInput, emailInput, budgetInput, timelineInput, messageInput];

  // === 2. Modal Kholar ebong Bondho Korar Function ===
  function openModal(modal) {
    if (modal) {
      modal.classList.add("is-visible");
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove("is-visible");
    }
  }

  // Shob close button-e click event add kora
  modalCloseButtons.forEach(button => {
    button.addEventListener("click", function() {
      const modalId = this.getAttribute("data-target");
      closeModal(document.querySelector(modalId));
    });
  });

  // Modal-er bahire (overlay) click korle bondho howar logic
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", function(event) {
      if (event.target === this) {
        closeModal(this);
      }
    });
  });

  // === 3. Helper Functions (Validation-er jonno) ===
  
  // Email format check korar helper function
  function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
  
  // Name format check korar helper function (Shudhu letter o space allowed)
  function isValidName(name) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
  }

  // === 4. Form Validation Function ===
  function validateForm() {
    let isValid = true; // Prothome dhore newa hocche form-ti valid
    
    // Ag'er shob error remove kora
    requiredFields.forEach(input => {
      if (input) {
        input.closest('.form-group').classList.remove('is-invalid');
      }
    });

    // --- Name Check (UPDATED) ---
    if (nameInput) {
      const nameValue = nameInput.value.trim();
      if (nameValue === "") {
        // 1. Check korche khali kina
        isValid = false;
        nameInput.closest('.form-group').classList.add('is-invalid');
      } else if (!isValidName(nameValue)) {
        // 2. Check korche shudhu letter ache kina (e.g., "+++" ba "123" dhorbe)
        isValid = false;
        nameInput.closest('.form-group').classList.add('is-invalid');
      }
    }
    
    // --- Email Check ---
    if (emailInput) {
      if (emailInput.value.trim() === "") {
        isValid = false;
        emailInput.closest('.form-group').classList.add('is-invalid');
      } else if (!isValidEmail(emailInput.value)) { // Email format check
        isValid = false;
        emailInput.closest('.form-group').classList.add('is-invalid');
      }
    }

    // --- Budget Check ---
    if (budgetInput && budgetInput.value === "") {
      isValid = false;
      budgetInput.closest('.form-group').classList.add('is-invalid');
    }

    // --- Timeline Check ---
    if (timelineInput && timelineInput.value === "") {
      isValid = false;
      timelineInput.closest('.form-group').classList.add('is-invalid');
    }

    // --- Message Check ---
    if (messageInput && messageInput.value.trim() === "") {
      isValid = false;
      messageInput.closest('.form-group').classList.add('is-invalid');
    }

    return isValid;
  }

  // === 5. Form Submit Event Listener ===
  form.addEventListener("submit", function(event) {
    event.preventDefault(); // Browser-er default submission bondho kora
    
    const isFormValid = validateForm();
    
    if (isFormValid) {
      // --- JODI VALID HOY: Success Modal Dekhano ---
      console.log("Form valid. Submit kora hocche...");
      
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.textContent = "Submitting...";
      submitButton.disabled = true;

      // 1 second por success modal dekhano (simulation)
      setTimeout(() => {
        openModal(successModal);
        form.reset(); // Form clear kora
        requiredFields.forEach(input => {
          if (input) {
            input.closest('.form-group').classList.remove('is-invalid');
          }
        });
        submitButton.textContent = "Submit";
        submitButton.disabled = false;
      }, 1000);
      
    } else {
      // --- JODI INVALID HOY: Error Modal Dekhano ---
      console.log("Form invalid.");
      openModal(errorModal);
    }
  });
}