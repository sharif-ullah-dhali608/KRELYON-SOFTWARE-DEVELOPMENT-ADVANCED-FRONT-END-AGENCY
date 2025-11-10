      /* --- Page Load Animations --- */
        function runPageAnimations() {
            if (typeof gsap === 'undefined') {
                console.error("GSAP failed to load. Skipping animations.");
                document.getElementById('main-content').style.visibility = 'visible';
                document.getElementById('main-header').style.opacity = '1';
                document.querySelector('.apply-hero-content').style.opacity = '1';
                return;
            }

             gsap.registerPlugin(ScrollTrigger);

             const tl = gsap.timeline();
            tl.to(document.getElementById('preloader-circle'), { scale: 1, duration: 0.5, ease: 'power2.out' })
              .to(document.getElementById('preloader-circle'), { scale: 50, duration: 1.5, ease: 'power3.inOut' })
              .to(document.getElementById('preloader-bg'), { opacity: 0, duration: 1, onComplete: () => document.getElementById('preloader-bg').style.display = 'none' }, "-=1.5")
              .to(document.getElementById('preloader-circle'), { opacity: 0, duration: 1, onComplete: () => {
                  document.getElementById('preloader-circle').style.display = 'none';
                  document.getElementById('main-content').style.visibility = 'visible';
              }}, "-=1")
              .to(document.getElementById('main-header'), { opacity: 1, duration: 1 }, "-=0.5")
              .to('.apply-hero-content', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.5")
              
               .to('.job-detail-header', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.5");
              

              
             ScrollTrigger.create({
                start: 'top -80',
                end: 99999,
                toggleClass: {
                    className: 'scrolled-nav',
                    targets: '#main-header'
                }
            });
        } 
        
        

         window.addEventListener('load', () => {
            runPageAnimations();
            
        });
        
 