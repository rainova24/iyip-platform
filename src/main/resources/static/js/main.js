// ===== IYIP Platform - Modern JavaScript =====

// Floating particles animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Dashboard tab switching
function switchTab(tabName) {
    // Update active tab
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update content based on tab
    const content = document.getElementById('dashboard-content');
    const cards = content.querySelectorAll('.dashboard-card');

    // Add fade effect
    content.style.opacity = '0.7';
    setTimeout(() => {
        content.style.opacity = '1';
    }, 200);

    // Update content based on different tabs
    updateTabContent(tabName, cards);

    // Visual feedback animation
    cards.forEach((card, index) => {
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Update tab content
function updateTabContent(tabName, cards) {
    const contentMap = {
        overview: [
            { title: 'Active Projects', content: 'Kelola 5 proyek aktif dengan timeline yang jelas', icon: '🎯' },
            { title: 'Performance Analytics', content: 'Lihat statistik engagement dan community activity', icon: '📈' },
            { title: 'Recent Notifications', content: '3 event baru, 2 journal update menunggu', icon: '🔔' },
            { title: 'Collaboration Requests', content: 'Tinjau 7 permintaan kolaborasi dari expert', icon: '🤝' }
        ],
        events: [
            { title: 'Upcoming Events', content: '5 event akan datang dalam 2 minggu ke depan', icon: '📅' },
            { title: 'Registered Events', content: 'Anda terdaftar di 3 event inovasi', icon: '✅' },
            { title: 'Event History', content: '12 event telah Anda ikuti tahun ini', icon: '📋' },
            { title: 'Event Analytics', content: 'Tingkat partisipasi 85% dari semua event', icon: '📊' }
        ],
        journals: [
            { title: 'Published Journals', content: '8 jurnal telah dipublikasikan dan mendapat review', icon: '📖' },
            { title: 'Draft Journals', content: '3 draft jurnal menunggu untuk diselesaikan', icon: '✏️' },
            { title: 'Journal Analytics', content: '1,200+ views dan 45 citations total', icon: '📈' },
            { title: 'Collaborative Journals', content: '2 jurnal kolaboratif sedang dalam proses', icon: '👥' }
        ],
        community: [
            { title: 'My Communities', content: 'Bergabung dengan 6 komunitas aktif', icon: '👥' },
            { title: 'Community Posts', content: '15 post baru dari komunitas Anda', icon: '💬' },
            { title: 'Discussion Forums', content: '8 diskusi aktif membutuhkan partisipasi Anda', icon: '🗣️' },
            { title: 'Community Events', content: '4 event eksklusif komunitas bulan ini', icon: '🎉' }
        ]
    };

    const content = contentMap[tabName] || contentMap.overview;

    cards.forEach((card, index) => {
        if (content[index]) {
            const cardIcon = card.querySelector('.card-icon');
            const cardTitle = card.querySelector('.card-title');
            const cardContent = card.querySelector('.card-content');

            if (cardIcon) cardIcon.textContent = content[index].icon;
            if (cardTitle) cardTitle.textContent = content[index].title;
            if (cardContent) cardContent.textContent = content[index].content;
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0s';
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all fade-in-up elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
}

// Navbar background on scroll
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.1)';
        }
    });
}

// Enhanced hover effects for interactive elements
function initInteractiveElements() {
    document.querySelectorAll('.interactive-element').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Advanced ripple effect
function initRippleEffect() {
    document.querySelectorAll('.ripple-effect').forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Card flip animation for dashboard cards
function initDashboardCardAnimations() {
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'rotateY(10deg) translateY(-5px)';
            setTimeout(() => {
                this.style.transform = 'rotateY(0deg) translateY(-3px)';
            }, 300);
        });
    });
}

// Progressive loading simulation
function simulateProgressiveLoading() {
    const cards = document.querySelectorAll('.feature-card, .dashboard-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';

        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Enhanced mobile menu toggle
function createMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: all 0.3s ease;
    `;

    menuToggle.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
    });

    navbar.querySelector('.nav-container').appendChild(menuToggle);
}

// Performance monitoring
function initPerformanceMonitoring() {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
            }
        }
    });

    if ('PerformanceObserver' in window) {
        perfObserver.observe({ entryTypes: ['navigation'] });
    }
}

// Theme switching capability
function initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';

        // Save theme preference
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '☀️';
    }

    document.body.appendChild(themeToggle);
}

// Advanced scroll animations
function initAdvancedScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .dashboard-card');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const randomDelay = Math.random() * 300;
                setTimeout(() => {
                    entry.target.style.animation = 'slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                }, randomDelay);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => scrollObserver.observe(el));
}

// Voice command integration (experimental)
function initVoiceCommands() {
    if ('speechSynthesis' in window && 'webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'id-ID';

        const voiceButton = document.createElement('button');
        voiceButton.className = 'voice-button';
        voiceButton.innerHTML = '🎤';

        voiceButton.addEventListener('click', () => {
            recognition.start();
            voiceButton.style.background = 'rgba(255, 0, 0, 0.3)';
        });

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();

            if (command.includes('beranda') || command.includes('home')) {
                document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                showNotification('Navigasi ke beranda', 'success');
            } else if (command.includes('fitur') || command.includes('features')) {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                showNotification('Navigasi ke fitur', 'success');
            } else if (command.includes('event')) {
                switchTab('events');
                showNotification('Membuka tab events', 'success');
            } else if (command.includes('jurnal') || command.includes('journal')) {
                switchTab('journals');
                showNotification('Membuka tab journals', 'success');
            } else {
                showNotification('Perintah tidak dikenali', 'warning');
            }

            voiceButton.style.background = 'rgba(255, 255, 255, 0.1)';
        };

        recognition.onerror = () => {
            voiceButton.style.background = 'rgba(255, 255, 255, 0.1)';
            showNotification('Error dalam voice recognition', 'error');
        };

        document.body.appendChild(voiceButton);
    }
}

// Custom cursor effect
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    document.querySelectorAll('.interactive-element, a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 100%)';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 100%)';
        });
    });
}

// PWA support
function initPWASupport() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }

    // Add to home screen prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        const installButton = document.createElement('button');
        installButton.className = 'install-button';
        installButton.textContent = 'Install App';

        installButton.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    installButton.remove();
                    showNotification('App berhasil diinstall!', 'success');
                }
            });
        });

        document.body.appendChild(installButton);
    });
}

// Enhanced navigation with smooth transitions
function enhancedNavigation() {
    const navLinks = document.querySelectorAll('.nav-item a, .btn-primary, .btn-secondary');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add loading state
            if (this.classList.contains('btn-primary') || this.classList.contains('btn-secondary')) {
                this.style.transform = 'scale(0.95)';
                this.style.opacity = '0.8';

                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    this.style.opacity = '1';
                }, 200);
            }
        });
    });
}

// Real-time notifications system
function initNotificationSystem() {
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);

    // Demo notifications
    setTimeout(() => showNotification('Selamat datang di IYIP Platform! 🎉', 'success'), 2000);
    setTimeout(() => showNotification('3 event baru tersedia untuk Anda', 'info'), 5000);
    setTimeout(() => showNotification('Journal submission deadline: 2 hari lagi', 'warning'), 8000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(320px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    });

    document.getElementById('notification-container').appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(320px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Search functionality
function initSearchSystem() {
    const searchButton = document.createElement('button');
    searchButton.className = 'search-button';
    searchButton.innerHTML = '🔍';

    searchButton.addEventListener('click', () => {
        showSearchModal();
    });

    document.body.appendChild(searchButton);
}

function showSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';

    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';

    const searchInput = document.createElement('input');
    searchInput.className = 'search-input';
    searchInput.type = 'text';
    searchInput.placeholder = 'Cari events, journals, communities...';

    searchInput.addEventListener('input', (e) => {
        // Implement search logic here
        console.log('Searching for:', e.target.value);
        if (e.target.value.length > 2) {
            showNotification(`Mencari: "${e.target.value}"`, 'info');
        }
    });

    searchBox.appendChild(searchInput);
    modal.appendChild(searchBox);
    document.body.appendChild(modal);

    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        searchBox.style.transform = 'translateY(0)';
        searchInput.focus();
    }, 10);

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

// Form validation helpers
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    showFieldError(input, 'Field ini wajib diisi');
                } else {
                    clearFieldError(input);
                }
            });

            if (isValid) {
                showNotification('Form berhasil disubmit! ✅', 'success');
                // Process form submission
            }
        });
    });
}

function showFieldError(field, message) {
    clearFieldError(field);

    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;

    field.parentNode.insertBefore(error, field.nextSibling);
    field.style.borderColor = '#ff6b6b';
}

function clearFieldError(field) {
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
    field.style.borderColor = '';
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            showSearchModal();
        }

        // Ctrl/Cmd + / for help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showNotification('Keyboard shortcuts: Ctrl+K (Search), Ctrl+/ (Help)', 'info');
        }

        // ESC to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.search-modal');
            modals.forEach(modal => {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            });
        }
    });
}

// Data fetching and API integration
async function loadDashboardData() {
    try {
        // Simulate API calls - replace with actual backend endpoints
        const [events, journals, communities, submissions] = await Promise.all([
            fetch('/api/events').then(r => r.json()).catch(() => []),
            fetch('/api/journals').then(r => r.json()).catch(() => []),
            fetch('/api/communities').then(r => r.json()).catch(() => []),
            fetch('/api/submissions').then(r => r.json()).catch(() => [])
        ]);

        updateDashboardCards(events, journals, communities, submissions);
        showNotification('Data berhasil dimuat dari server', 'success');
    } catch (error) {
        console.log('Using demo data while backend is not connected');
        loadDemoData();
        showNotification('Menggunakan demo data (backend belum terhubung)', 'warning');
    }
}

function updateDashboardCards(events, journals, communities, submissions) {
    const dashboardContent = document.getElementById('dashboard-content');
    if (!dashboardContent) return;

    // Update cards with real data
    const cards = dashboardContent.querySelectorAll('.dashboard-card');

    if (cards[0]) {
        cards[0].querySelector('.card-content').textContent =
            `Kelola ${events.length || 5} proyek aktif dengan timeline yang jelas dan milestone tracking`;
    }

    if (cards[1]) {
        cards[1].querySelector('.card-content').textContent =
            `${journals.length || 12} jurnal dipublikasikan dengan ${communities.length || 8} komunitas aktif`;
    }

    if (cards[2]) {
        cards[2].querySelector('.card-content').textContent =
            `${submissions.filter(s => s.status === 'pending').length || 3} submission baru menunggu review`;
    }
}

function loadDemoData() {
    // Demo data untuk preview
    const demoData = {
        events: [
            { id: 1, title: 'Innovation Workshop', status: 'active', date: '2024-07-15' },
            { id: 2, title: 'Tech Seminar', status: 'upcoming', date: '2024-07-20' },
            { id: 3, title: 'Startup Pitch', status: 'active', date: '2024-07-25' },
            { id: 4, title: 'AI Conference', status: 'upcoming', date: '2024-08-01' },
            { id: 5, title: 'Blockchain Summit', status: 'active', date: '2024-08-10' }
        ],
        journals: [
            { id: 1, title: 'AI Research Paper', isPublic: true, views: 450 },
            { id: 2, title: 'Blockchain Study', isPublic: false, views: 120 },
            { id: 3, title: 'IoT Innovation', isPublic: true, views: 380 },
            { id: 4, title: 'Machine Learning Trends', isPublic: true, views: 620 }
        ],
        communities: [
            { id: 1, name: 'AI Researchers', memberCount: 150, activeDiscussions: 8 },
            { id: 2, name: 'Startup Founders', memberCount: 89, activeDiscussions: 12 },
            { id: 3, name: 'Tech Innovators', memberCount: 203, activeDiscussions: 15 }
        ],
        submissions: [
            { id: 1, status: 'pending', type: 'research', title: 'AI Ethics Study' },
            { id: 2, status: 'approved', type: 'innovation', title: 'Smart City Solution' },
            { id: 3, status: 'pending', type: 'research', title: 'Quantum Computing' },
            { id: 4, status: 'rejected', type: 'innovation', title: 'Green Energy App' }
        ]
    };

    updateDashboardCards(
        demoData.events,
        demoData.journals,
        demoData.communities,
        demoData.submissions
    );

    // Store demo data for search functionality
    window.demoData = demoData;
}

// Enhanced search functionality with filtering
function enhancedSearch(query) {
    if (!window.demoData || !query) return [];

    const results = [];
    const searchTerm = query.toLowerCase();

    // Search in events
    window.demoData.events.forEach(event => {
        if (event.title.toLowerCase().includes(searchTerm)) {
            results.push({
                type: 'event',
                title: event.title,
                subtitle: `Status: ${event.status} | Date: ${event.date}`,
                data: event
            });
        }
    });

    // Search in journals
    window.demoData.journals.forEach(journal => {
        if (journal.title.toLowerCase().includes(searchTerm)) {
            results.push({
                type: 'journal',
                title: journal.title,
                subtitle: `${journal.views} views | ${journal.isPublic ? 'Public' : 'Private'}`,
                data: journal
            });
        }
    });

    // Search in communities
    window.demoData.communities.forEach(community => {
        if (community.name.toLowerCase().includes(searchTerm)) {
            results.push({
                type: 'community',
                title: community.name,
                subtitle: `${community.memberCount} members | ${community.activeDiscussions} active discussions`,
                data: community
            });
        }
    });

    return results;
}

// Analytics and tracking
function initAnalytics() {
    // Track page views
    console.log('Page view tracked:', window.location.pathname);

    // Track user interactions
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-primary, .btn-secondary, .feature-card, .dashboard-card')) {
            console.log('User interaction:', e.target.className);
        }
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                console.log('Scroll depth:', maxScroll + '%');
            }
        }
    });
}

// Error handling and recovery
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        showNotification('Terjadi kesalahan. Silakan refresh halaman.', 'error');
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promise Rejection:', e.reason);
        showNotification('Terjadi kesalahan jaringan. Periksa koneksi internet.', 'error');
    });
}

// Performance optimization
function initPerformanceOptimization() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;

    window.addEventListener('scroll', function() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) originalScrollHandler();
        }, 16); // ~60fps
    });

    // Lazy load images when implemented
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Accessibility enhancements
function initAccessibility() {
    // Add keyboard navigation for cards
    document.querySelectorAll('.feature-card, .dashboard-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add ARIA labels
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });

    // Announce page changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(announcer);

    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
    };
}

// Service Worker registration for PWA
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered successfully');

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showNotification('Update tersedia! Refresh untuk mendapatkan versi terbaru.', 'info');
                        }
                    });
                });
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    }
}

// Initialize all components
function initializeApp() {
    console.log('🚀 Initializing IYIP Platform...');

    // Core UI components
    createParticles();
    simulateProgressiveLoading();
    createMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarScroll();

    // Interactive features
    initInteractiveElements();
    initRippleEffect();
    initDashboardCardAnimations();
    enhancedNavigation();

    // Advanced features
    initThemeToggle();
    initAdvancedScrollAnimations();
    initVoiceCommands();
    initCustomCursor();
    initPWASupport();

    // System features
    initNotificationSystem();
    initSearchSystem();
    initFormValidation();
    initKeyboardShortcuts();
    initPerformanceMonitoring();
    initAnalytics();
    initErrorHandling();
    initPerformanceOptimization();
    initAccessibility();

    // Data loading
    loadDashboardData();

    // Service Worker
    registerServiceWorker();

    console.log('✅ IYIP Platform initialized successfully!');
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', () => {
    // Set initial loading state
    document.body.style.opacity = '0.95';
    document.body.style.transform = 'scale(0.98)';
    document.body.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    // Initialize app
    initializeApp();

    // Complete loading animation
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'scale(1)';

        // Show welcome message
        setTimeout(() => {
            if (window.announceToScreenReader) {
                window.announceToScreenReader('IYIP Platform loaded successfully');
            }
        }, 1000);
    }, 100);
});

// Window load event for final optimizations
window.addEventListener('load', () => {
    console.log('🎯 Page fully loaded, running final optimizations...');

    // Remove loading states
    document.querySelectorAll('.loading').forEach(el => {
        el.classList.remove('loading');
    });

    // Preload critical resources
    const criticalResources = [
        '/css/style.css',
        '/js/main.js'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
    });

    console.log('✨ All optimizations complete!');
});

// Export functions for global access
window.IYIP = {
    switchTab,
    showNotification,
    showSearchModal,
    loadDashboardData,
    enhancedSearch
};

// Make switchTab globally available for onclick handlers
window.switchTab = switchTab;