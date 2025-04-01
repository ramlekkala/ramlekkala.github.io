// Main content loading function with improved animations
async function loadContent(page) {
    try {
        const contentDiv = document.getElementById('content');
        contentDiv.style.opacity = '0';
        
        const response = await fetch(page);
        if (!response.ok) throw new Error(`Failed to load ${page}`);
        
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        
        // Get content from the page (either specific div or body)
        const newContent = doc.querySelector('#content-to-load')?.innerHTML || doc.body.innerHTML;
        
        // Hide home content and show main content with fade animation
        document.getElementById('home-content').style.display = 'none';
        contentDiv.style.display = 'block';
        contentDiv.innerHTML = newContent;
        
        // Add fade-in animation class
        contentDiv.classList.add('fade-in');
        setTimeout(() => {
            contentDiv.style.opacity = '1';
        }, 50);
        
        // Reinitialize components after content load
        initComponents();
        
        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('content').innerHTML = `
            <div class="error-message">
                <h3>Content Loading Error</h3>
                <p>We couldn't load the requested page. Please try again later.</p>
                <button class="btn-primary" onclick="showHomePage()">Return to Home</button>
            </div>`;
        document.getElementById('content').style.opacity = '1';
    }
}

// Initialize all components
function initComponents() {
    initDropdown();
    initSmoothScrolling();
    initContactForm();
    addSectionObservers();
}

// Dropdown initialization (for mobile menu)
function initDropdown() {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.getElementById('dropdown-content');
    
    if (dropdownBtn && dropdownContent) {
        // Toggle dropdown
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdownContent.style.display === 'block';
            dropdownContent.style.display = isOpen ? 'none' : 'block';
            dropdownBtn.setAttribute('aria-expanded', !isOpen);
        });
        
        // Close when clicking outside
        document.addEventListener('click', () => {
            dropdownContent.style.display = 'none';
            dropdownBtn.setAttribute('aria-expanded', 'false');
        });
        
        // Prevent dropdown close when clicking inside
        dropdownContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Initialize contact form if exists
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form submission logic here
            alert('Form submission would be handled here in a real implementation');
        });
    }
}

// Add intersection observers for scroll animations
function addSectionObservers() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Navigation functions
function showHomePage() {
    document.getElementById('home-content').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    window.history.pushState({}, '', window.location.pathname);
    
    // Scroll to top when returning home
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function navigateTo(page) {
    loadContent(page);
    window.history.pushState({ page }, '', page);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Set up navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.getAttribute('data-page'));
        });
    });
    
    // Handle back/forward navigation
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            loadContent(event.state.page);
        } else {
            showHomePage();
        }
    });
    
    // Initialize all components
    initComponents();
    
    // Load initial content
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    if (path.includes('.html')) {
        const initialPage = path.split('/').pop();
        loadContent(initialPage);
    } else if (hash) {
        // Handle direct anchor links
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }, 500);
    } else {
        document.getElementById('home-content').style.display = 'block';
    }
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
});