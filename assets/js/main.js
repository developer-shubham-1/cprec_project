// AOS init & utilities
function ready(fn){ document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }

ready(() => {
  AOS.init({ duration: 700, once: true });
  // Set footer year
  const y = document.getElementById('yearCopy');
  if (y) y.textContent = new Date().getFullYear();
  // Mark active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    if(a.getAttribute('href') === path){ a.classList.add('active'); }
  });
  // If query param q present, prefill search on publications
  const url = new URL(window.location.href);
  const q = url.searchParams.get('q');
  if (q && document.getElementById('searchInput')) {
    document.getElementById('searchInput').value = q;
  }
});



// Gallery Lightbox (Bootstrap modal)
function initGalleryLightbox(){
  const modal = document.getElementById('imageModal');
  if(!modal) return;
  const img = document.getElementById('lightboxImage');
  modal.addEventListener('show.bs.modal', e => {
    const trigger = e.relatedTarget;
    const src = trigger?.getAttribute('data-img');
    if (src) img.src = src + (src.includes('?') ? '&' : '?') + 'auto=format&fit=crop&w=1400&q=80';
  });
}




// Get DOM elements
const allPubGrid = document.getElementById('allPubGrid');
const thesisPubGrid = document.getElementById('thesisPubGrid');
const journalPubGrid = document.getElementById('journalPubGrid');

// Function to render publications to the DOM
function renderPublications(data, gridElement) {
    gridElement.innerHTML = '';
    if (data.length === 0) {
        gridElement.innerHTML = '<div class="col-12 text-center text-muted">No publications found.</div>';
        return;
    }
    data.forEach(pub => {
        const html = `
            <div class="col">
                <a href="#" class="text-decoration-none pub-card-link">
                    <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                        <div class="pub-type-badge ${pub.type}">${pub.type}</div>
                        <img src="${pub.image}" class="card-img-top" alt="${pub.title} Cover">
                        <div class="card-body p-4">
                            <h5 class="card-title fw-semibold mb-2 text-primary">${pub.title}</h5>
                            <p class="card-text text-muted small mb-3">${pub.description}</p>
                            <div class="d-flex flex-wrap gap-3 small text-muted">
                                <span><i class="fa-regular fa-user me-1"></i>${pub.author}</span>
                                <span><i class="fa-regular fa-calendar me-1"></i>${pub.year}</span>
                                <span><i class="fa-solid fa-bookmark me-1"></i>${pub.subject}</span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
        gridElement.innerHTML += html;
    });
}

// Function to filter and render publications based on user input and active tab
function filterPublications(type = 'all') {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const yearFilter = document.getElementById('yearFilter').value;
    const subjectFilter = document.getElementById('subjectFilter').value;

    const filtered = publications.filter(pub => {
        const matchesSearch = pub.title.toLowerCase().includes(searchTerm) || pub.author.toLowerCase().includes(searchTerm);
        const matchesYear = yearFilter === '' || pub.year === yearFilter;
        const matchesSubject = subjectFilter === '' || pub.subject === subjectFilter;
        const matchesType = type === 'all' || pub.type === type;
        
        return matchesSearch && matchesYear && matchesSubject && matchesType;
    });

    if (type === 'all') {
        renderPublications(filtered, allPubGrid);
    } else if (type === 'thesis') {
        renderPublications(filtered, thesisPubGrid);
    } else if (type === 'journal') {
        renderPublications(filtered, journalPubGrid);
    }
}

// Function to reset all filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('yearFilter').value = '';
    document.getElementById('subjectFilter').value = '';
    // Re-render based on active tab
    const activeTab = document.querySelector('.nav-pills .nav-link.active');
    if (activeTab.id === 'thesis-tab') {
        filterPublications('thesis');
    } else if (activeTab.id === 'journal-tab') {
        filterPublications('journal');
    } else {
        filterPublications('all');
    }
}

// Event listeners to handle user input
document.addEventListener('DOMContentLoaded', () => {
    // Initial render when the page loads
    filterPublications('all');

    // Add event listeners for the filter inputs and tabs
    document.getElementById('searchInput').addEventListener('input', () => filterPublications(document.querySelector('.nav-pills .nav-link.active').dataset.bsTarget.substring(1).replace('-publications', '')));
    document.getElementById('yearFilter').addEventListener('change', () => filterPublications(document.querySelector('.nav-pills .nav-link.active').dataset.bsTarget.substring(1).replace('-publications', '')));
    document.getElementById('subjectFilter').addEventListener('change', () => filterPublications(document.querySelector('.nav-pills .nav-link.active').dataset.bsTarget.substring(1).replace('-publications', '')));

    // Re-wire click events for tabs to ensure they trigger filtering
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.id.replace('-tab', '');
            filterPublications(type);
        });
    });
});