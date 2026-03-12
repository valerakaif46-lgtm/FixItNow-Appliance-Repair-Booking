// ===== STICKY NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.25)';
  } else {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ===== SCROLL FADE-UP ANIMATION =====
const fadeUpElements = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeUpElements.forEach(el => observer.observe(el));

// ===== BOOKING FORM: DYNAMIC COST CALCULATION =====
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {

  const DIAGNOSIS_FEE = 299;
  const MINOR_CHARGE = 500;
  const MAJOR_CHARGE = 1200;
  const EMERGENCY_RATE = 0.10;

  function calculateCost() {
    let base = DIAGNOSIS_FEE;
    let serviceCharge = 0;

    const issues = document.querySelectorAll('input[name="issue"]:checked');
    const isEmergency = document.getElementById('isEmergency').checked;

    // Show/hide rows
    const minorRow = document.getElementById('minorRow');
    const majorRow = document.getElementById('majorRow');
    const emergencyRow = document.getElementById('emergencyRow');
    const surchargeFee = document.getElementById('surchargeFee');
    const totalEl = document.getElementById('totalCost');

    // Check for major vs minor issues
    let hasMajor = false;
    let hasMinor = false;
    issues.forEach(i => {
      if (i.value === 'major') hasMajor = true;
      else hasMinor = true;
    });

    if (hasMajor) {
      serviceCharge = MAJOR_CHARGE;
      majorRow.style.display = 'flex';
      minorRow.style.display = 'none';
    } else if (hasMinor) {
      serviceCharge = MINOR_CHARGE;
      minorRow.style.display = 'flex';
      majorRow.style.display = 'none';
    } else {
      minorRow.style.display = 'none';
      majorRow.style.display = 'none';
    }

    let subtotal = base + serviceCharge;
    let surcharge = 0;

    if (isEmergency) {
      surcharge = Math.round(subtotal * EMERGENCY_RATE);
      emergencyRow.style.display = 'flex';
      surchargeFee.textContent = '₹' + surcharge;
    } else {
      emergencyRow.style.display = 'none';
    }

    const total = subtotal + surcharge;
    totalEl.textContent = '₹' + total.toLocaleString('en-IN');
  }

  // Listen for changes
  document.querySelectorAll('input[name="issue"]').forEach(cb => {
    cb.addEventListener('change', calculateCost);
  });
  document.getElementById('isEmergency').addEventListener('change', calculateCost);

  // Warranty indicator
  document.querySelectorAll('input[name="warranty"]').forEach(r => {
    r.addEventListener('change', () => {
      const badge = document.getElementById('warrantyBadge');
      const val = document.querySelector('input[name="warranty"]:checked').value;
      if (val === 'under_warranty') {
        badge.textContent = '✅ Under Warranty';
        badge.className = 'badge-in';
      } else if (val === 'out_of_warranty') {
        badge.textContent = '⚠️ Out of Warranty';
        badge.className = 'badge-out';
      } else {
        badge.textContent = '❓ Warranty Unknown';
        badge.className = 'badge-out';
      }
    });
  });

  // ===== FORM VALIDATION =====
  function showError(inputEl, errEl, show) {
    if (show) {
      inputEl.classList.add('error');
      errEl.classList.add('show');
    } else {
      inputEl.classList.remove('error');
      errEl.classList.remove('show');
    }
  }

  function validateForm() {
    let valid = true;

    // Full Name
    const fullName = document.getElementById('fullName');
    showError(fullName, document.getElementById('nameErr'), fullName.value.trim().length < 2);
    if (fullName.value.trim().length < 2) valid = false;

    // Phone
    const phone = document.getElementById('phone');
    showError(phone, document.getElementById('phoneErr'), !/^\d{10}$/.test(phone.value.trim()));
    if (!/^\d{10}$/.test(phone.value.trim())) valid = false;

    // Address
    const address = document.getElementById('address');
    showError(address, document.getElementById('addressErr'), address.value.trim().length < 5);
    if (address.value.trim().length < 5) valid = false;

    // Appliance
    const appliance = document.getElementById('appliance');
    showError(appliance, document.getElementById('applianceErr'), appliance.value === '');
    if (appliance.value === '') valid = false;

    // Issue (at least one)
    const issues = document.querySelectorAll('input[name="issue"]:checked');
    const issueErr = document.getElementById('issueErr');
    if (issues.length === 0) {
      issueErr.classList.add('show');
      valid = false;
    } else {
      issueErr.classList.remove('show');
    }

    // Date
    const repairDate = document.getElementById('repairDate');
    const today = new Date().toISOString().split('T')[0];
    showError(repairDate, document.getElementById('dateErr'), repairDate.value === '' || repairDate.value < today);
    if (repairDate.value === '' || repairDate.value < today) valid = false;

    // Time slot
    const timeSlot = document.getElementById('timeSlot');
    showError(timeSlot, document.getElementById('slotErr'), timeSlot.value === '');
    if (timeSlot.value === '') valid = false;

    return valid;
  }

  // Live validation on input
  document.getElementById('fullName').addEventListener('input', function() {
    showError(this, document.getElementById('nameErr'), this.value.trim().length < 2);
  });
  document.getElementById('phone').addEventListener('input', function() {
    showError(this, document.getElementById('phoneErr'), !/^\d{10}$/.test(this.value.trim()));
  });
  document.getElementById('address').addEventListener('input', function() {
    showError(this, document.getElementById('addressErr'), this.value.trim().length < 5);
  });
  document.getElementById('appliance').addEventListener('change', function() {
    showError(this, document.getElementById('applianceErr'), this.value === '');
    calculateCost();
  });

  // ===== FORM SUBMIT =====
  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const name = document.getElementById('fullName').value.trim();
    const appliance = document.getElementById('appliance');
    const applianceName = appliance.options[appliance.selectedIndex].text;
    const date = document.getElementById('repairDate').value;
    const slot = document.getElementById('timeSlot');
    const slotName = slot.options[slot.selectedIndex].text;
    const total = document.getElementById('totalCost').textContent;
    const isEmergency = document.getElementById('isEmergency').checked;

    // Build confirmation
    const confirmName = document.getElementById('confirmName');
    const confirmDetails = document.getElementById('confirmDetails');
    confirmName.textContent = name;
    confirmDetails.innerHTML = `
      <p><strong>Appliance:</strong> ${applianceName}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time Slot:</strong> ${slotName}</p>
      <p><strong>Estimated Cost:</strong> ${total}</p>
      ${isEmergency ? '<p><strong>Priority:</strong> 🚨 Emergency Repair</p>' : ''}
      <p style="margin-top:0.8rem;font-size:0.8rem;color:#5c6478;">Booking ID: FIN-${Date.now().toString().slice(-6)}</p>
    `;

    bookingForm.style.display = 'none';
    document.getElementById('bookingConfirmation').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Set min date to today
  const dateInput = document.getElementById('repairDate');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
