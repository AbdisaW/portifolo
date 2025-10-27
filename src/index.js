// ===== Modal Logic =====
const modal = document.getElementById('mymodal');
const closeBtn = modal.querySelector('.close');
const cancelBtn = modal.querySelector('.btn.cancel');
const saveBtn = modal.querySelector('.btn.save');

const certTitle = document.getElementById('certTitle');
const certOrg = document.getElementById('certOrg');
const certYear = document.getElementById('certYear');
const certUrl = document.getElementById('certUrl');

// Keep track of the current card being edited
let currentCard = null;

// --- Open modal when clicking pencil icon ---
document.querySelectorAll('.cert-header a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // prevent page jump

        // Find the card of the clicked icon
        const card = e.currentTarget.closest('.section-project-name');
        currentCard = card;

        // Pre-fill modal with existing data
        certTitle.value = card.querySelector('h5').innerText;
        const orgYear = card.querySelector('p').innerText.split(' - ');
        certOrg.value = orgYear[0] || '';
        certYear.value = orgYear[1] || '';
        const iframe = card.querySelector('iframe');
        certUrl.value = iframe ? iframe.src : '';

        // Open modal
        modal.style.display = 'flex';
    });
});

// --- Close modal ---
function closeModal() {
    modal.style.display = 'none';
}

closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// --- Save changes ---
saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentCard) return;

    // Update card content
    currentCard.querySelector('h5').innerText = certTitle.value;
    currentCard.querySelector('p').innerText = `${certOrg.value} - ${certYear.value}`;

    const iframe = currentCard.querySelector('iframe');
    if (certUrl.value) {
        if (iframe) {
            iframe.src = certUrl.value;
        } else {
            // create iframe if not exist
            const details = currentCard.querySelector('details');
            const newIframe = document.createElement('iframe');
            newIframe.src = certUrl.value;
            newIframe.title = certTitle.value;
            newIframe.className = 'cert-iframe';
            details.appendChild(newIframe);
        }
    } else if (iframe) {
        iframe.remove();
    }

    // Save updated data to localStorage
    let savedCerts = JSON.parse(localStorage.getItem('certifications')) || {};
    const cardId = currentCard.querySelector('h5').innerText; // use title as key
    savedCerts[cardId] = {
        title: certTitle.value,
        organization: certOrg.value,
        year: certYear.value,
        url: certUrl.value
    };
    localStorage.setItem('certifications', JSON.stringify(savedCerts));

    // Close modal
    closeModal();
});

// ===== Theme Toggle Logic =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-theme');
  themeToggle.textContent = '☀️'; // Sun for light mode
}

// When button clicked, toggle theme
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  const isDark = body.classList.contains('dark-theme');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});




const videoUpload = document.getElementById('videoUpload');
const videoPreview = document.getElementById('videoPreview');
const videoInfo = document.getElementById('videoInfo');
const videoFileName = document.getElementById('videoFileName');
const removeVideoBtn = document.getElementById('removeVideoBtn');
const uploadArea = document.querySelector('.upload-area');

videoUpload.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;

  const videoURL = URL.createObjectURL(file);
  videoPreview.src = videoURL;

  // Show video and info, hide upload area
  uploadArea.classList.add('hidden');
  videoPreview.classList.remove('hidden');
  videoInfo.classList.remove('hidden');

  videoFileName.textContent = file.name;
  videoPreview.play();
});

removeVideoBtn.addEventListener('click', () => {
  videoPreview.pause();
  videoPreview.src = '';
  videoUpload.value = ''; // reset file input

  // Hide video and info, show upload area again
  videoPreview.classList.add('hidden');
  videoInfo.classList.add('hidden');
  uploadArea.classList.remove('hidden');
});


