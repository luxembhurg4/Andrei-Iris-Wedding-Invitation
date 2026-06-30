document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Navigation & Scroll Effects
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const floatingRsvpTrigger = document.getElementById('floating-rsvp-trigger');

  // Sticky header class toggle on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
      // Show floating RSVP button after scrolling past hero section
      floatingRsvpTrigger.style.opacity = '1';
      floatingRsvpTrigger.style.pointerEvents = 'auto';
    } else {
      navbar.classList.remove('scrolled');
      floatingRsvpTrigger.style.opacity = '0';
      floatingRsvpTrigger.style.pointerEvents = 'none';
    }
  });

  // Toggle Mobile Menu
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    if (navMenu.classList.contains('open')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Close Mobile Menu on Link Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = navToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });

  // Scroll Fade-in Intersection Observer
  const fadeSections = document.querySelectorAll('.fade-in-section');
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  fadeSections.forEach(section => {
    sectionObserver.observe(section);
  });

  // =========================================================================
  // 2. Entourage Interactive Tabs
  // =========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const entourageContents = document.querySelectorAll('.entourage-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      // Hide all content groups
      entourageContents.forEach(content => content.classList.remove('active'));
      
      // Show targeted content group
      const targetTab = button.getAttribute('data-tab');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 3. RSVP Modal System & LocalStorage Backend
  // =========================================================================
  const rsvpModal = document.getElementById('rsvp-modal');
  const openModalBtn = document.getElementById('open-rsvp-modal');
  const floatingRsvpBtn = document.getElementById('floating-rsvp-btn');
  const closeModalBtn = document.getElementById('close-rsvp-modal');
  const rsvpFormPanel = document.getElementById('rsvp-form-panel');
  const rsvpSuccessPanel = document.getElementById('rsvp-success-panel');
  const rsvpForm = document.getElementById('rsvp-wedding-form');
  const btnCloseSuccess = document.getElementById('btn-close-success');

  const rsvpYesFields = document.getElementById('rsvp-yes-fields');
  const guestCountSelect = document.getElementById('guest-count');
  const additionalGuestsContainer = document.getElementById('additional-guests-container');
  const guestNamesInputs = document.getElementById('guest-names-inputs');

  const radioYes = document.getElementById('radio-yes');
  const radioNo = document.getElementById('radio-no');
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');

  // Open Modal function
  const openModal = () => {
    rsvpModal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Disable scroll on background
  };

  // Close Modal function
  const closeModal = () => {
    rsvpModal.classList.remove('open');
    document.body.style.overflow = 'auto'; // Re-enable scroll
    setTimeout(() => {
      // Reset form and panel states after transition completes
      rsvpForm.reset();
      rsvpFormPanel.style.display = 'block';
      rsvpSuccessPanel.style.display = 'none';
      toggleAttendanceFields('yes');
      generateCompanionInputs(1);
    }, 500);
  };

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (floatingRsvpBtn) floatingRsvpBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (btnCloseSuccess) btnCloseSuccess.addEventListener('click', closeModal);

  // Close Modal on clicking outside the modal box
  rsvpModal.addEventListener('click', (e) => {
    if (e.target === rsvpModal) {
      closeModal();
    }
  });

  // Close Modal on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rsvpModal.classList.contains('open')) {
      closeModal();
    }
  });

  // Custom Radio Cards Attendance selection
  const toggleAttendanceFields = (status) => {
    if (status === 'yes') {
      radioYes.classList.add('selected');
      radioNo.classList.remove('selected');
      radioYes.querySelector('input').checked = true;
      rsvpYesFields.classList.add('open');
    } else {
      radioNo.classList.add('selected');
      radioYes.classList.remove('selected');
      radioNo.querySelector('input').checked = true;
      rsvpYesFields.classList.remove('open');
    }
  };

  radioYes.addEventListener('click', () => toggleAttendanceFields('yes'));
  radioNo.addEventListener('click', () => toggleAttendanceFields('no'));

  // Generate dynamic companion input boxes based on Guest Count dropdown selection
  const generateCompanionInputs = (count) => {
    guestNamesInputs.innerHTML = '';
    
    if (count > 1) {
      additionalGuestsContainer.style.display = 'block';
      for (let i = 1; i < count; i++) {
        const inputDiv = document.createElement('div');
        inputDiv.style.marginBottom = '0.5rem';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.placeholder = `Companion #${i} Full Name`;
        input.required = true;
        input.name = `companion-${i}`;
        
        inputDiv.appendChild(input);
        guestNamesInputs.appendChild(inputDiv);
      }
      // Add a small helper text about child counting below inputs
      const helperText = document.createElement('div');
      helperText.style.fontSize = '0.85rem';
      helperText.style.color = 'var(--text-muted)';
      helperText.style.marginTop = '0.75rem';
      helperText.style.fontStyle = 'italic';
      helperText.innerHTML = '<i class="fas fa-circle-info"></i> Note: Children aged 5 years & above require their own seat. Under 4 years are free.';
      guestNamesInputs.appendChild(helperText);
    } else {
      additionalGuestsContainer.style.display = 'none';
    }
  };

  guestCountSelect.addEventListener('change', (e) => {
    generateCompanionInputs(parseInt(e.target.value));
  });

  // Form Submission
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('btn-submit-rsvp');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    const fullName = document.getElementById('guest-fullname').value.trim();
    const email = document.getElementById('guest-email').value.trim();
    const isAttending = document.querySelector('input[name="attendance"]:checked').value === 'yes';
    const guestMessage = document.getElementById('guest-message').value.trim();
    
    let guestCount = 1;
    let companions = [];
    let dietary = 'N/A';

    if (isAttending) {
      guestCount = parseInt(guestCountSelect.value);
      dietary = document.getElementById('guest-dietary').value.trim() || 'None';
      
      // Grab companions names
      if (guestCount > 1) {
        for (let i = 1; i < guestCount; i++) {
          const companionInput = document.querySelector(`input[name="companion-${i}"]`);
          if (companionInput && companionInput.value.trim() !== '') {
            companions.push(companionInput.value.trim());
          }
        }
      }
    }

    // Build payload for SheetMonkey
    const sheetMonkeyPayload = {
      "Full Name": fullName,
      "Email": email,
      "Attendance": isAttending ? "Yes, I'll be there" : "No, sending love",
      "Seats Requested": isAttending ? `${guestCount} Seat${guestCount > 1 ? 's' : ''}` : "0 Seats",
      "Dietary Preferences": dietary,
      "Warm Wishes": guestMessage,
      "Companions": companions.join(', ') // Add extra column just in case
    };

    try {
      await fetch('https://api.sheetmonkey.io/form/vN9CMZ1pjY35qFZPwhBuci', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetMonkeyPayload)
      });
    } catch (err) {
      console.error("SheetMonkey submission error:", err);
    }
    
    // reset button
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;

    // Save into LocalStorage to mock a database save
    const newRsvp = {
      fullName,
      email,
      isAttending,
      guestCount,
      companions,
      dietary,
      guestMessage,
      timestamp: new Date().toISOString()
    };

    let existingRsvps = [];
    try {
      existingRsvps = JSON.parse(localStorage.getItem('wedding_rsvps')) || [];
    } catch (err) {
      existingRsvps = [];
    }
    
    existingRsvps.push(newRsvp);
    localStorage.setItem('wedding_rsvps', JSON.stringify(existingRsvps));

    // Update Summary Details Card
    document.getElementById('summary-name').textContent = fullName;
    
    const summaryStatus = document.getElementById('summary-status');
    if (isAttending) {
      summaryStatus.textContent = 'Joyfully Attending';
      summaryStatus.style.color = '#B38728';
      
      const countRow = document.getElementById('summary-guest-count-row');
      const countVal = document.getElementById('summary-guest-count');
      countRow.style.display = 'flex';
      countVal.textContent = guestCount === 1 ? '1 Seat Reserved' : `${guestCount} Seats Reserved`;
      
      const companionsRow = document.getElementById('summary-companions-row');
      const companionsVal = document.getElementById('summary-companions');
      if (companions.length > 0) {
        companionsRow.style.display = 'flex';
        companionsVal.textContent = companions.join(', ');
      } else {
        companionsRow.style.display = 'none';
      }
      
      const dietaryRow = document.getElementById('summary-dietary-row');
      const dietaryVal = document.getElementById('summary-dietary');
      dietaryRow.style.display = 'flex';
      dietaryVal.textContent = dietary;

    } else {
      summaryStatus.textContent = 'Regretfully Declined';
      summaryStatus.style.color = '#64748B';
      
      document.getElementById('summary-guest-count-row').style.display = 'none';
      document.getElementById('summary-companions-row').style.display = 'none';
      document.getElementById('summary-dietary-row').style.display = 'none';
    }

    // Transition modal views
    rsvpFormPanel.style.display = 'none';
    rsvpSuccessPanel.style.display = 'block';
    
    // Auto scroll modal container to top to see success state clearly
    document.querySelector('.modal-container').scrollTop = 0;
  });

  // =========================================================================
  // Gallery Slideshow Slider
  // =========================================================================
  const slides = document.querySelectorAll('.gallery-slide');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const dotsContainer = document.getElementById('slider-dots');
  let currentSlideIndex = 0;
  let slideInterval;

  if (slides.length > 0) {
    // Generate Dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const adjustContainerHeight = (img) => {
      const slider = document.getElementById('gallery-slider');
      if (!slider || !img) return;
      const containerWidth = slider.clientWidth;
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      if (naturalWidth > 0) {
        const calculatedHeight = (naturalHeight / naturalWidth) * containerWidth;
        // Cap the height to 500px or 60vh to prevent it from occupying the whole screen
        const maxHeight = Math.min(500, window.innerHeight * 0.6);
        const finalHeight = Math.min(calculatedHeight, maxHeight);
        slider.style.height = `${finalHeight}px`;
      }
    };

    const updateSlides = () => {
      slides.forEach((slide, index) => {
        if (index === currentSlideIndex) {
          slide.classList.add('active');
          dots[index].classList.add('active');
          
          // Adjust height dynamically based on image ratio
          const img = slide.querySelector('img.slide-fg');
          if (img) {
            if (img.complete) {
              adjustContainerHeight(img);
            } else {
              img.addEventListener('load', () => adjustContainerHeight(img));
            }
          }
        } else {
          slide.classList.remove('active');
          dots[index].classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlides();
    };

    const prevSlide = () => {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSlides();
    };

    const goToSlide = (index) => {
      currentSlideIndex = index;
      updateSlides();
      resetTimer();
    };

    const startTimer = () => {
      slideInterval = setInterval(nextSlide, 5000);
    };

    const resetTimer = () => {
      clearInterval(slideInterval);
      startTimer();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
      });
    }

    // Recalculate slider height on window resize
    window.addEventListener('resize', () => {
      const activeSlide = document.querySelector('.gallery-slide.active');
      if (activeSlide) {
        const img = activeSlide.querySelector('img.slide-fg');
        if (img) adjustContainerHeight(img);
      }
    });

    // Run first height adjustment on page load / first slide load
    const firstImg = slides[0].querySelector('img.slide-fg');
    if (firstImg) {
      if (firstImg.complete) {
        adjustContainerHeight(firstImg);
      } else {
        firstImg.addEventListener('load', () => adjustContainerHeight(firstImg));
      }
    }

    // Touch swipe gestures on mobile/phone screens
    let touchStartX = 0;
    let touchEndX = 0;
    
    const sliderContainer = document.getElementById('gallery-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    const handleSwipe = () => {
      const swipeThreshold = 50; // minimum swipe distance in px
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swiped Left -> Next Slide
        nextSlide();
        resetTimer();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swiped Right -> Prev Slide
        prevSlide();
        resetTimer();
      }
    };

    startTimer();
  }

});

// =========================================================================
// 4. Add to Calendar Engine (Global Function)
// =========================================================================
function addToCalendar(type, isoDateTimeString, location) {
  let title = `Wedding Ceremony: Andrei & Iris`;
  let desc = `Join Andrei and Iris as they tie the knot! Ceremony details: Elijah Chapel, Taloto District, Tagbilaran City.`;
  
  if (type === 'Reception') {
    title = `Wedding Reception: Andrei & Iris`;
    desc = `Join Andrei and Iris as they celebrate their union! Reception details: Raven's Buffet Restaurant, Dampas Binayran Road, Tagbilaran City.`;
  }
  
  // Format Date to UTC-equivalent for Google Calendar format (YYYYMMDDTHHMMSSZ)
  // Target Philippines timezone (+08:00) so we offset target by -8 hours
  const dateObj = new Date(isoDateTimeString);
  const startUTC = new Date(dateObj.getTime() - (8 * 60 * 60 * 1000));
  
  // Ceremony is 1 hour, Reception is 3 hours
  const durationMs = (type === 'Ceremony' ? 1 : 3) * 60 * 60 * 1000;
  const endUTC = new Date(startUTC.getTime() + durationMs);

  const formatGoogleDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const datesParam = `${formatGoogleDate(startUTC)}/${formatGoogleDate(endUTC)}`;
  
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${datesParam}&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(location)}`;
  
  window.open(googleCalendarUrl, '_blank');
}
