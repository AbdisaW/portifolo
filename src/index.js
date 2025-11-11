// ===== Modal Logic =====
const modal = document.getElementById('mymodal');
const closeBtn = modal.querySelector('.close');
const cancelBtn = modal.querySelector('.btn.cancel');
const saveBtn = modal.querySelector('.btn.save');

const certTitle = document.getElementById('certTitle');
const certOrg = document.getElementById('certOrg');
const certYear = document.querySelector('date-picker#certYear'); 
// const certYear = document.getElementById('certYear');
const certUrl = document.getElementById('certUrl');

let currentCard = null;

const sideNav = document.querySelector('#sideNav');
const scrollContainer = document.querySelector('.container'); 

sideNav.addEventListener('click', (e) => {
    
    const link = e.target.closest('a');

    if (!link) return;

    e.preventDefault();

   
    sideNav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');


    const targetId = link.getAttribute('href'); 
    const targetSection = document.querySelector(targetId);
    
    if (targetSection && scrollContainer) {
        
      
  
        const headerElement = document.querySelector('header');
        const headerHeight = headerElement ? headerElement.offsetHeight : 0; 
        

        const scrollTarget = targetSection.offsetTop;
        
        

        scrollContainer.scrollTo({
            top: scrollTarget - headerHeight,
            behavior: 'smooth'
        });

        
        
    } else {
        console.error(`Error: Section "${targetId}" or container not found.`);
    }
});


// --- Open modal and pre-fill data ---
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

        // ✅ Use date-picker’s API to preselect year
        if (orgYear[1]) {
            certYear.selectYear(parseInt(orgYear[1]));
        }

        const iframe = card.querySelector('iframe');
        certUrl.value = iframe ? iframe.src : '';

        // Open modal
        modal.style.display = 'flex';
    });
});

// --- Close modal function ---
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

    // ✅ Get selected year from <date-picker>
    const updatedYear = certYear.value;

    // Update card content
    currentCard.querySelector('h5').innerText = certTitle.value;
    currentCard.querySelector('p').innerText = `${certOrg.value} - ${updatedYear}`;

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
        year: updatedYear, // ✅ use the year from date-picker
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



// === Select the Add Section button ===
const addSectionBtn = document.getElementById('addSectionBtn');

// === Handle button click to dispatch custom event ===
addSectionBtn.addEventListener('click', () => {
    const newSectionTitle = prompt('Enter a title for your new section:');
    if (!newSectionTitle) return;

    const newSectionEvent = new CustomEvent('sectionAdded', {
        detail: { title: newSectionTitle }
    });
    document.dispatchEvent(newSectionEvent);
});




// === Listen for the sectionAdded event ===
// document.addEventListener('sectionAdded', (e) => {
//     const { title } = e.detail;
//     const id = title.toLowerCase().replace(/\s+/g, '-');

//     // --- Create new section elements ---
//     const mainSection = document.querySelector('section'); // your main container

//     const newTitle = document.createElement('h3');
//     newTitle.id = id;
//     newTitle.innerText = title;

//     const hr = document.createElement('hr');

//     const newCard = document.createElement('div');
//     newCard.className = 'section-card';
//     newCard.innerHTML = `
//         <p>This is a newly added section titled "${title}".</p>
        
//     `;

//     // --- Add edit button ---
//     const editBtn = document.createElement('button');
//     editBtn.className = 'edit-section-btn';
//     editBtn.innerText = 'Edit';
//     newCard.appendChild(editBtn);

//     editBtn.addEventListener('click', () => {
//         const paragraphs = newCard.querySelectorAll('p');
//         paragraphs.forEach(p => p.contentEditable = true);
//         paragraphs[0].focus();

//         const saveChanges = () => {
//             paragraphs.forEach(p => p.contentEditable = false);
//             editBtn.remove(); // remove button after save
//             paragraphs.forEach(p => {
//                 p.removeEventListener('blur', saveChanges);
//                 p.removeEventListener('keydown', handleKey);
//             });
//         };

//         const handleKey = (event) => {
//             if (event.key === 'Enter') {
//                 event.preventDefault();
//                 saveChanges();
//             }
//         };

//         paragraphs.forEach(p => p.addEventListener('blur', saveChanges));
//         paragraphs.forEach(p => p.addEventListener('keydown', handleKey));
//     });

//     // --- Append new section before the Add Section button ---
//     mainSection.insertBefore(newTitle, addSectionBtn);
//     mainSection.insertBefore(hr, addSectionBtn);
//     mainSection.insertBefore(newCard, addSectionBtn);

//     // --- Update side navigation ---
//     const sideNav = document.getElementById('sideNav');
//     if (sideNav) {
//         const newNavItem = document.createElement('li');
//         newNavItem.innerHTML = `<a href="#${id}">${title}</a>`;
//         sideNav.appendChild(newNavItem);
//     }

//     console.log(`✅ "${title}" section added successfully and linked in the sidebar!`);
// });



// === IndexedDB Setup ===
let db;
const request = indexedDB.open('SectionsDB', 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('sections')) {
        db.createObjectStore('sections', { keyPath: 'id' });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log('✅ IndexedDB ready');
    loadSectionsFromDB(); // load after refresh
};

request.onerror = function (event) {
    console.error('❌ IndexedDB error:', event.target.error);
};

// === Save to IndexedDB ===
function saveSectionToDB(section) {
    if (!db) return;
    const transaction = db.transaction(['sections'], 'readwrite');
    const store = transaction.objectStore('sections');
    store.put(section);
    transaction.oncomplete = () => {
        console.log(`💾 Section "${section.title}" saved to IndexedDB.`);
    };
    transaction.onerror = (e) => {
        console.error('❌ Failed to save section:', e.target.error);
    };
}

// === Load from IndexedDB ===
function loadSectionsFromDB() {
    const transaction = db.transaction(['sections'], 'readonly');
    const store = transaction.objectStore('sections');
    const request = store.getAll();

    request.onsuccess = (e) => {
        const sections = e.target.result;
        sections.forEach(section => renderSection(section, false)); // false = no edit button
    };
}

// === Render Section ===
function renderSection(section, isNew = true) {
    const mainSection = document.querySelector('section');
    const newTitle = document.createElement('h3');
    newTitle.id = section.id;
    newTitle.innerText = section.title;

    const hr = document.createElement('hr');

    const newCard = document.createElement('div');
    newCard.className = 'section-card';
    newCard.innerHTML = `<p>${section.content}</p>`;

    // Add Edit button only for new sections
    if (isNew) {
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-section-btn';
        editBtn.innerText = 'Edit';
        newCard.appendChild(editBtn);

        editBtn.addEventListener('click', () => {
            const paragraphs = newCard.querySelectorAll('p');
            paragraphs.forEach(p => p.contentEditable = true);
            paragraphs[0].focus();

            const saveChanges = () => {
                paragraphs.forEach(p => p.contentEditable = false);
                editBtn.remove();
                paragraphs.forEach(p => {
                    p.removeEventListener('blur', saveChanges);
                    p.removeEventListener('keydown', handleKey);
                });

                saveSectionToDB({
                    id: section.id,
                    title: section.title,
                    content: paragraphs[0].innerText
                });
            };

            const handleKey = (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    saveChanges();
                }
            };

            paragraphs.forEach(p => p.addEventListener('blur', saveChanges));
            paragraphs.forEach(p => p.addEventListener('keydown', handleKey));
        });
    }

    mainSection.insertBefore(newTitle, addSectionBtn);
    mainSection.insertBefore(hr, addSectionBtn);
    mainSection.insertBefore(newCard, addSectionBtn);

    const sideNav = document.getElementById('sideNav');
    if (sideNav && !document.querySelector(`#sideNav a[href="#${section.id}"]`)) {
        const newNavItem = document.createElement('li');
        newNavItem.innerHTML = `<a href="#${section.id}">${section.title}</a>`;
        sideNav.appendChild(newNavItem);
    }
}

// === Handle Section Added Event ===
document.addEventListener('sectionAdded', (e) => {
    const { title } = e.detail;
    const id = title.toLowerCase().replace(/\s+/g, '-');

    const sectionObj = {
        id,
        title,
        content: `This is a newly added section titled "${title}".`
    };

    renderSection(sectionObj, true); // true = show edit button
    saveSectionToDB(sectionObj);
    console.log(`✅ "${title}" section added and saved to IndexedDB!`);
});








// === Select the container to observe ===
const portfolioContainer = document.querySelector('section');

// === Create a MutationObserver instance ===
const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            if (mutation.addedNodes.length > 0) {
                console.log('🟢 New section or element added:', mutation.addedNodes);
            }
            if (mutation.removedNodes.length > 0) {
                console.log('🔴 Element removed:', mutation.removedNodes);
            }
        }
    });
});

// === Configure and start observing ===
observer.observe(portfolioContainer, {
    childList: true,  // Watch for added/removed elements
    subtree: true     // Include nested changes
});

console.log('👀 MutationObserver is now watching for DOM changes...');






const fetchBtn = document.getElementById('fetchGithubBtn');
const infoDiv = document.getElementById('githubInfo');

function displayUser(user) {
    document.getElementById('avatar').src = user.avatar_url;
    document.getElementById('name').textContent = user.name || user.login;
    document.getElementById('bio').textContent = user.bio || 'No bio available.';
    document.getElementById('followers').textContent = user.followers;
    document.getElementById('repos').textContent = user.public_repos;
    document.getElementById('profileLink').href = user.html_url;
    infoDiv.classList.remove('hidden');
    fetchBtn.classList.add('hidden');
}

function loadCachedUser() {
    const cached = localStorage.getItem('githubUser');
    if (!cached) return null;
    return JSON.parse(cached);
}

function saveCachedUser(user) {
    const data = {
        user,
        timestamp: Date.now()
    };
    localStorage.setItem('githubUser', JSON.stringify(data));
}

function shouldUpdateCache(thresholdMinutes = 60) {
    const cached = loadCachedUser();
    if (!cached) return true;
    const age = (Date.now() - cached.timestamp) / (1000 * 60); // minutes
    return age > thresholdMinutes;
}

function fetchGitHubUser() {
    fetch('https://api.github.com/users/AbdisaW')
        .then(res => res.json())
        .then(user => {
            displayUser(user);
            saveCachedUser(user);
        })
        .catch(() => {
            const cached = loadCachedUser();
            if (cached) {
                displayUser(cached.user);
                alert('⚠️ Showing cached GitHub info (offline or fetch failed)');
            } else {
                alert('❌ Could not fetch GitHub info and no cached data found.');
            }
        });
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    const cached = loadCachedUser();
    if (cached) displayUser(cached.user);

    // If cache is old, fetch fresh data
    if (shouldUpdateCache(60)) { // update if older than 60 minutes
        fetchGitHubUser();
    }
});

// Manual fetch button
fetchBtn.addEventListener('click', fetchGitHubUser);




