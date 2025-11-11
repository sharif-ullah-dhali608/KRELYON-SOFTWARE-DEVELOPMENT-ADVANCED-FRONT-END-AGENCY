
function initializeMegaMenu() {
            // Check if GSAP is loaded
            if (typeof gsap === 'undefined') {
                console.error("GSAP not loaded for Mega Menu.");
                // Fallback for non-GSAP
                const toggle = document.getElementById('services-toggle');
                const menu = document.getElementById('services-menu');
                if (toggle && menu) {
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        toggle.classList.toggle('active');
                        menu.classList.toggle('open');
                        
                        // Simple show/hide
                        menu.style.opacity = menu.classList.contains('open') ? '1' : '0';
                        menu.style.transform = menu.classList.contains('open') ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(10px)';
                        menu.style.visibility = menu.classList.contains('open') ? 'visible' : 'hidden';
                    });
                }
                return; // GSAP na thakle ekhane shesh
            }
            
            // --- GSAP Version (Video er moto) ---
            const toggle = document.getElementById('services-toggle');
            const menu = document.getElementById('services-menu');
            
            if (!toggle || !menu) {
                console.warn('Mega menu elements not found.');
                return;
            }
            
            // Protti item select korun
            const menuItems = gsap.utils.toArray(".mega-menu-item");
            
            // Ekta timeline toiri korun ja shurute paused thakbe
            const tl = gsap.timeline({ paused: true });

            // Video er moto animation
            tl.to(menu, { 
                opacity: 1, 
                transform: 'translateX(-50%) translateY(0)', // Slide up
                duration: 0.3,
                ease: 'power2.out'
              })
              .to(menuItems, { // Column er bodole item
                opacity: 1,
                y: 0,
                stagger: 0.04, // Prottek item 0.04s por por ashbe
                duration: 0.3,
                ease: 'power2.out'
              }, "-=0.2"); // Ageyr animation shesh howar 0.2s age shuru hobe

            
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                toggle.classList.toggle('active');
                menu.classList.toggle('open');
                
                // Timeline play ba reverse korun
                if (menu.classList.contains('open')) {
                    tl.play();
                } else {
                    // Shob item hide kore reverse korun
                    gsap.to(menuItems, {opacity: 0, y: 15, duration: 0.01}); // Reset item state
                    tl.reverse();
                }
            });
            
            // Bahire click korle menu bondho korun
            document.addEventListener('click', (e) => {
                if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                    if (menu.classList.contains('open')) {
                        toggle.classList.remove('active');
                        menu.classList.remove('open');
                        gsap.to(menuItems, {opacity: 0, y: 15, duration: 0.01}); // Reset item state
                        tl.reverse();
                    }
                }
            });
        }

        function initializeMobileMenu() {
            const mobileToggle = document.querySelector('.mobile-nav-toggle');
            const mobileNav = document.getElementById('mobile-nav');
            const mobileNavClose = document.getElementById('mobile-nav-close');
            
            // --- 1. Main Menu Toggle ---
            function openMenu() {
                document.body.classList.add('nav-open-no-scroll'); 
                mobileNav.classList.add('open');
            }
            function closeMenu() {
                document.body.classList.remove('nav-open-no-scroll'); 
                mobileNav.classList.remove('open');
                
                // মেন্যু বন্ধ করার সময় সব সাব-মেন্যুও বন্ধ করে দিন
                document.querySelectorAll('.mobile-nav-item-with-sub.active').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.mobile-sub-menu').style.maxHeight = '0';
                });
            }
            
            if (mobileToggle && mobileNav && mobileNavClose) {
                mobileToggle.addEventListener('click', () => {
                    if (document.body.classList.contains('nav-open-no-scroll')) {
                        closeMenu();
                    } else {
                        openMenu();
                    }
                });
                mobileNavClose.addEventListener('click', closeMenu);
            }

            // === 2. আপডেটেড সাব-মেন্যু টগল (Services, About Us, ইত্যাদি সবকিছুর জন্য) ===
            
            // .mobile-nav-sub-toggle ক্লাসের সব বাটন খুঁজে বের করুন
            const allSubToggles = document.querySelectorAll('.mobile-nav-sub-toggle');
            
            // প্রতিটি বাটনের জন্য আলাদাভাবে
            allSubToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const parent = toggle.parentElement;
                    const subMenu = parent.querySelector('.mobile-sub-menu');
                    
                    // এই বাটনটি বাদে অন্য সব খোলা সাব-মেন্যু বন্ধ করুন
                    document.querySelectorAll('.mobile-nav-item-with-sub.active').forEach(activeParent => {
                        if (activeParent !== parent) { // যদি এটা সেই বাটন না হয় যেটা ক্লিক করা হয়েছে
                            activeParent.classList.remove('active');
                            activeParent.querySelector('.mobile-sub-menu').style.maxHeight = '0';
                        }
                    });

                    // এখন যেটিতে ক্লিক করা হয়েছে সেটিকে টগল করুন
                    parent.classList.toggle('active');
                    
                    if (parent.classList.contains('active')) {
                        // খুলুন
                        subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
                    } else {
                        // বন্ধ করুন
                        subMenu.style.maxHeight = '0';
                    }
                });
            });
        }



        // =============================================
// === 9. Helper Function: About Us Dropdown ===
// =============================================
function initializeAboutDropdown() {
    const toggle = document.getElementById('about-toggle');
    const menu = document.getElementById('about-menu');
    
    if (!toggle || !menu) {
        console.warn('About Us dropdown elements not found.');
        return;
    }

    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        
        // --- অন্য সব ড্রপডাউন বন্ধ করুন (ঐচ্ছিক, কিন্তু ভালো অভ্যাস) ---
        // সার্ভিসেস মেনু বন্ধ করুন
        const servicesMenu = document.getElementById('services-menu');
        const servicesToggle = document.getElementById('services-toggle');
        if (servicesMenu && servicesMenu.classList.contains('open')) {
            servicesMenu.classList.remove('open');
            servicesToggle.classList.remove('active');
            
            // GSAP অ্যানিমেশন থাকলে রিভার্স করুন
            if (typeof gsap !== 'undefined' && typeof megaMenuTL !== 'undefined') {
                gsap.to(".mega-menu-item", {opacity: 0, y: 15, duration: 0.01});
                megaMenuTL.reverse();
            }
        }
        // --- অন্য মেনু বন্ধ করা শেষ ---

        // বর্তমান "About" মেনুটি টগল করুন
        const isOpen = menu.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
    });
    
    // বাইরে ক্লিক করলে মেনু বন্ধ করুন
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('open');
            toggle.classList.remove('active');
        }
    });
}