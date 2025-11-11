// --- GSAP Fallback Function ---
// --- GSAP Fallback Function ---
function runAnimations() {
  // GSAP load hoyeche kina check korun
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP failed to load. Skipping animations.");
    document.getElementById("preloader-bg").style.display = "none";
    document.getElementById("preloader-circle").style.display = "none";
    document.getElementById("main-content").style.visibility = "visible";
    document.getElementById("main-header").style.opacity = "1";

    document
      .querySelectorAll(
        ".anim-fade-in, .stat-item, .project-card, .service-card, .tech-logo"
      )
      .forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "none";
      });
    // --- GSAP FAIL HOLO, KINTU TAB JS CHALATE HOBE ---
    initializeTabLogic();
    initializeMobileMenu();
    initializeAccordion();
    initializeScroller();
    initializeVideoModal();
    initializeMegaMenu(); // Fallback version cholbe
    initializeAboutDropdown(); // <-- ADD THIS LINE
    return; // Ar kono GSAP chalaben na
  }

  // --- GSAP Load Hole, Nicher Code Cholbe ---

  gsap.registerPlugin(ScrollTrigger);

  // --- 1. প্রি-লোডার অ্যানিমেশন ---
  const preloaderBg = document.getElementById("preloader-bg");
  const preloaderCircle = document.getElementById("preloader-circle");
  const mainContent = document.getElementById("main-content");
  const header = document.getElementById("main-header");
  const tl = gsap.timeline();

  tl.to(preloaderCircle, { scale: 1, duration: 0.5, ease: "power2.out" })
    .to(preloaderCircle, { scale: 50, duration: 1.5, ease: "power3.inOut" })
    .to(
      preloaderBg,
      {
        opacity: 0,
        duration: 1,
        onComplete: () => (preloaderBg.style.display = "none"),
      },
      "-=1.5"
    )
    .to(
      preloaderCircle,
      {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          preloaderCircle.style.display = "none";
          mainContent.style.visibility = "visible";
        },
      },
      "-=1"
    )
    /* --- হিরো সেকশন অ্যানিমেশন (Navbar ফিক্স) --- */
    .to(header, { opacity: 1, duration: 1 }, "-=0.5")
    .to(".hero .anim-line-inner", {
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
    })
    .to(".hero .anim-fade", { opacity: 1, duration: 1, stagger: 0.2 }, "-=0.8");

  // --- 2. স্ক্রলড নেভবার ---
  window.addEventListener("scroll", () => {
    const header = document.getElementById("main-header");
    if (document.body.classList.contains("nav-open-no-scroll")) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled-nav");
    } else {
      header.classList.remove("scrolled-nav");
    }
  });

  // --- 3. FAQ Accordion ---
  initializeAccordion();

  /* --- 4. ফুল প্রজেক্ট অ্যানিমেশন --- */

  // সেকশনের হেডার (সবগুলো - ekhon "Creative Agency" title o include korbe)
  gsap.utils.toArray(".anim-line-inner").forEach((line) => {
    gsap.from(line, {
      y: "110%",
      duration: 1,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: line.closest("h1, h2"), // Target the parent heading
        start: "top 85%",
      },
    });
  });

  /* * --- নতুন: Stats Counter Animation (Code Fixed) --- * */
  gsap.utils.toArray(".stat-item").forEach((item) => {
    const stat = item.querySelector("h3");
    if (!stat) return;

    const endValue = stat.getAttribute("data-count");
    if (endValue === null) return;

    const suffix = stat.innerText.replace(/[0-9]/g, ""); // "M+" ba "+"

    let counter = { val: 0 }; // 0 theke shuru

    gsap.to(counter, {
      // .from() er bodole .to()
      val: endValue, // data-count porjonto count hobe
      duration: 2,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
      },
      onUpdate: () => {
        // Protibar update e text change hobe
        stat.textContent = Math.ceil(counter.val) + suffix;
      },
    });

    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
      },
    });
  });

  // Projects সেকশন (Staggered)
  gsap.to(".project-card", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15,
    scrollTrigger: {
      trigger: ".project-grid",
      start: "top 85%",
    },
  });

  // Services সেকশন (Staggered)
  gsap.to(".service-card", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15,
    scrollTrigger: {
      trigger: ".service-grid",
      start: "top 85%",
    },
  });

  // Tech Stack সেকশন (Staggered)
  gsap.to(".tech-logo", {
    opacity: 1,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".tech-logo-grid",
      start: "top 85%",
    },
  });

  // Single Fade-in (Ekhon "Creative Agency" content o include korbe)
  gsap.utils.toArray(".anim-fade-in").forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
      },
    });
  });

  /* --- 5. Product Hover Interaction --- */
  initializeProductHover();

  /* --- 6. Process Tabs Interaction (Video theke) --- */
  initializeTabLogic();

  /* --- 7. Mobile Menu Logic --- */
  initializeMobileMenu();

  /* --- 8. Client Scroller (ক্লিক করলে থামবে) --- */
  initializeScroller();

  /* --- 9. Video Modal Logic (Notun) --- */
  initializeVideoModal(); // <-- ADD THIS LINE

  initializeMegaMenu();

  initializeAboutDropdown();
}

// --- Helper functions (GSAP fail holeo cholbe) ---

function initializeAccordion() {
  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const content = item.querySelector(".accordion-content");
      item.classList.toggle("active");
      if (item.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = "0";
      }
    });
  });
}

function initializeProductHover() {
  const productItems = document.querySelectorAll(".product-item");
  const previewImages = document.querySelectorAll(".product-image-preview img");

  productItems.forEach((item, index) => {
    const targetImageId = item.dataset.image;
    const targetImage = document.querySelector(
      `.product-image-preview img[data-id="${targetImageId}"]`
    );

    item.addEventListener("mouseenter", () => {
      productItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      previewImages.forEach((img) => img.classList.remove("visible"));

      if (targetImage) {
        targetImage.classList.add("visible");
      }
    });
  });
}

function initializeTabLogic() {
  const processTabs = document.querySelectorAll(".process-tab-item");
  const processPanels = document.querySelectorAll(".process-content-panel");

  processTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetPanelId = tab.dataset.target;
      const targetPanel = document.getElementById(targetPanelId);

      processTabs.forEach((t) => t.classList.remove("active"));
      processPanels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
}

// function initializeMobileMenu() {
//     const mobileToggle = document.querySelector('.mobile-nav-toggle');
//     const mobileNav = document.getElementById('mobile-nav');
//     const mobileNavClose = document.getElementById('mobile-nav-close');
//     function openMenu() {
//         document.body.classList.add('nav-open-no-scroll');
//         mobileNav.classList.add('open');
//     }
//     function closeMenu() {
//         document.body.classList.remove('nav-open-no-scroll');
//         mobileNav.classList.remove('open');
//     }
//     mobileToggle.addEventListener('click', () => {
//         if (document.body.classList.contains('nav-open-no-scroll')) {
//             closeMenu();
//         }
//         else {
//             openMenu();
//         }
//     });
//     mobileNavClose.addEventListener('click', closeMenu);
// }

function initializeScroller() {
  const scrollerContainer = document.getElementById("client-scroller");
  const scrollerTrack = document.getElementById("scroller-track");

  if (scrollerContainer && scrollerTrack) {
    scrollerContainer.addEventListener("click", () => {
      scrollerTrack.classList.toggle("paused");
    });
  }
}
function initializeVideoModal() {
  const videoTrigger = document.querySelector(".creative-agency-video-box");
  const modal = document.getElementById("video-modal");
  const closeModalBtn = document.getElementById("video-modal-close");
  // Ekhon eta "video" element
  const videoPlayer = document.getElementById("video-iframe");

  if (!videoTrigger || !modal || !closeModalBtn || !videoPlayer) {
    console.warn("Video modal elements not found.");
    return;
  }

  // Function to open the modal
  function openModal(e) {
    e.preventDefault();
    modal.classList.add("active");
    videoPlayer.muted = true; // Autoplay-er jonno browser e mute thaka valo
    videoPlayer.play(); // Video play korun
  }

  // Function to close the modal
  function closeModal() {
    modal.classList.remove("active");
    videoPlayer.pause(); // Video pause korun
    videoPlayer.currentTime = 0; // Video prothom a niye jan
  }

  // Add event listeners
  videoTrigger.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);

  // Background e click korle bondho hobe
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// --- GSAP Fallback সহ Script চালানো ---
window.addEventListener("load", runAnimations);
