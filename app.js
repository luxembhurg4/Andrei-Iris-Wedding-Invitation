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
  // Film Strip Gallery — always full, never pauses
  // =========================================================================
  const filmStripTrack = document.getElementById('film-strip-track');
  const filmStripWindow = document.querySelector('.film-strip-window');

  const buildFilmStrip = () => {
    if (!filmStripTrack || !filmStripWindow) return;

    const templateSet = filmStripTrack.querySelector('.film-strip-set');
    if (!templateSet) return;

    const originalHTML = templateSet.innerHTML;
    filmStripTrack.innerHTML = '';

    const set = document.createElement('div');
    set.className = 'film-strip-set';
    set.innerHTML = originalHTML;
    filmStripTrack.appendChild(set);

    const vpWidth = filmStripWindow.offsetWidth;
    const seedFrames = [...set.querySelectorAll('.film-frame')];

    while (set.offsetWidth < vpWidth) {
      seedFrames.forEach((frame) => set.appendChild(frame.cloneNode(true)));
    }

    const loopWidth = set.offsetWidth;
    filmStripTrack.appendChild(set.cloneNode(true));
    filmStripTrack.appendChild(set.cloneNode(true));

    filmStripTrack.style.setProperty('--loop-width', `${loopWidth}px`);
    filmStripTrack.style.setProperty('--roll-duration', `${Math.max(25, loopWidth / 35)}s`);
  };

  if (filmStripTrack && filmStripWindow) {
    buildFilmStrip();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildFilmStrip, 200);
    });
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

// =========================================================================
// Film Strip — Infinite Seamless Loop
// =========================================================================
(function initFilmStrip() {
  const track = document.getElementById('film-strip-track');
  if (!track) return;

  const originalSet = track.querySelector('.film-strip-set');
  if (!originalSet) return;

  // Duplicate the set so we always have a seamless loop
  // We need at least enough copies to fill the viewport twice
  const clone = originalSet.cloneNode(true);
  track.appendChild(clone);

  // After images load, measure the width of one set and set CSS vars
  function applyMetrics() {
    const setWidth = originalSet.scrollWidth;
    const totalWidth = track.scrollWidth;

    // --loop-width: the pixel distance to translateX for one full set
    // We want to slide left by exactly one set-width and then snap back
    track.style.setProperty('--loop-width', `${setWidth}px`);

    // Speed: ~80px per second feels natural (adjust as needed)
    const pxPerSec = 80;
    const duration = Math.round(setWidth / pxPerSec);
    track.style.setProperty('--roll-duration', `${duration}s`);

    // Set the animation using the now-known pixel value directly
    track.style.animation = `filmRollLeft ${duration}s linear infinite`;
  }

  // Wait for images to finish loading before measuring
  const imgs = track.querySelectorAll('img');
  let loaded = 0;
  const total = imgs.length;

  if (total === 0) {
    applyMetrics();
    return;
  }

  imgs.forEach(img => {
    if (img.complete) {
      loaded++;
      if (loaded === total) applyMetrics();
    } else {
      img.addEventListener('load', () => {
        loaded++;
        if (loaded === total) applyMetrics();
      });
      img.addEventListener('error', () => {
        loaded++;
        if (loaded === total) applyMetrics();
      });
    }
  });
})();
