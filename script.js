// Premium Heart Colors - 3 beautiful tones
const HEART_COLORS = [
    { color: '#B03A48', opacity: 0.4 }, // deep red
    { color: '#E8A5A8', opacity: 0.35 }, // romantic pink
    { color: '#FBEAEA', opacity: 0.3 }  // soft blush
];

// Floating Hearts Animation with Premium Effects
function createFloatingHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    if (!heartsContainer) return;
    
    const heartCount = 35;
    
    // Create initial hearts with staggered timing
    for (let i = 0; i < heartCount; i++) {
        setTimeout(() => {
            createHeart(heartsContainer, true);
        }, i * 800);
    }
    
    // Continuously create new hearts
    setInterval(() => {
        if (heartsContainer) {
            createHeart(heartsContainer, false);
        }
    }, 1800);
}

function createHeart(container, isInitial = false) {
    if (!container) return;
    
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    // Random size between 16px and 30px
    const size = Math.random() * 14 + 16;
    heart.style.fontSize = size + 'px';
    
    // Random starting position (horizontal) - spread across full width
    const startX = Math.random() * 100;
    heart.style.left = startX + '%';
    
    // Random animation duration (15-25 seconds)
    const duration = Math.random() * 10 + 15;
    heart.style.animationDuration = duration + 's';
    
    // Random delay for natural effect
    const delay = Math.random() * 2;
    heart.style.animationDelay = delay + 's';
    
    // Use one of the 3 premium colors
    const colorData = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    heart.style.color = colorData.color;
    heart.style.opacity = colorData.opacity;
    
    // Add glow effect to more hearts (40% chance)
    if (Math.random() < 0.4) {
        heart.classList.add('heart-glow');
    }
    
    // Sin-wave path variation
    const waveAmplitude = Math.random() * 50 + 25;
    const waveFrequency = Math.random() * 0.02 + 0.01;
    heart.setAttribute('data-wave-amp', waveAmplitude);
    heart.setAttribute('data-wave-freq', waveFrequency);
    
    // Set initial position - start from below viewport
    const scrollY = window.pageYOffset || window.scrollY;
    const viewportHeight = window.innerHeight;
    heart.style.position = 'fixed';
    heart.style.top = (viewportHeight + scrollY) + 'px';
    heart.style.left = startX + '%';
    heart.style.zIndex = '1';
    
    container.appendChild(heart);
    
    // Animate with sin wave
    animateHeartWave(heart, waveAmplitude, waveFrequency, duration, delay);
    
    // Remove heart after animation completes
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, (duration + delay) * 1000);
}

// Sin-wave animation for romantic floating - works across entire page
function animateHeartWave(heart, amplitude, frequency, duration, delay) {
    const startTime = Date.now() + delay * 1000;
    const endTime = startTime + duration * 1000;
    
    function animate() {
        const now = Date.now();
        if (now > endTime || !heart.parentNode) return;
        
        const elapsed = (now - startTime) / 1000;
        const progress = elapsed / duration;
        
        // Calculate position based on scroll to work across entire page
        const scrollY = window.pageYOffset || window.scrollY;
        const viewportHeight = window.innerHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        
        // Hearts float from below current viewport upward
        const startY = viewportHeight + scrollY;
        const endY = scrollY - 100;
        const yPos = startY + (endY - startY) * progress;
        
        const xOffset = Math.sin(elapsed * frequency * 10) * amplitude;
        
        // Update absolute position for hearts to float across entire document
        heart.style.position = 'fixed';
        heart.style.top = yPos + 'px';
        heart.style.transform = `translateX(${xOffset}px) rotate(${progress * 360}deg)`;
        
        requestAnimationFrame(animate);
    }
    
    setTimeout(() => requestAnimationFrame(animate), delay * 1000);
}

// Smooth scroll functions
function scrollToRSVP() {
    const rsvpSection = document.getElementById('rsvp');
    rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToDetails() {
    const detailsSection = document.getElementById('eventDetails');
    detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Background color transition on scroll
let lastScrollY = 0;
const colorStops = [
    { color: 'linear-gradient(180deg, #F5E6D3 0%, #FAF7F2 50%, #FFFFFF 100%)' },
    { color: 'linear-gradient(180deg, #F5E6D3 0%, #FBEAEA 50%, #FAF7F2 100%)' },
    { color: 'linear-gradient(180deg, #FAF7F2 0%, #F5E6D3 50%, #FBEAEA 100%)' },
    { color: 'linear-gradient(180deg, #F5E6D3 0%, #FAF7F2 50%, #FFFFFF 100%)' }
];

function updateBackgroundColor() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollProgress = scrollY / (documentHeight - windowHeight);
    
    // Calculate which color stop to use
    const colorIndex = Math.min(
        Math.floor(scrollProgress * (colorStops.length - 1)),
        colorStops.length - 2
    );
    const nextIndex = Math.min(colorIndex + 1, colorStops.length - 1);
    const localProgress = (scrollProgress * (colorStops.length - 1)) - colorIndex;
    
    // Smooth transition between colors
    if (scrollProgress < 1) {
        document.body.style.background = colorStops[colorIndex].color;
    }
}

// RSVP Data Storage Functions
// Save to both server (centralized) and localStorage (backup)
async function saveRSVPData(data) {
    // Validate input data
    if (!data || !data.name || !data.guests || !data.attending) {
        throw new Error('Missing required RSVP data');
    }
    
    // Add timestamp and ID
    const rsvpEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('vi-VN'),
        name: String(data.name).trim(),
        guests: parseInt(data.guests) || 1,
        attending: data.attending,
        message: (data.message || '').trim()
    };
    
    // Validate entry
    if (!rsvpEntry.name || !rsvpEntry.attending) {
        throw new Error('Invalid RSVP entry data');
    }
    
    // Try to save to server first (centralized storage)
    try {
        const response = await fetch('/api/save-rsvp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ RSVP saved to server:', result);
            rsvpEntry.id = result.data?.id || rsvpEntry.id; // Use server ID if provided
        } else {
            console.warn('⚠️ Failed to save to server, using localStorage only');
        }
    } catch (error) {
        console.warn('⚠️ Server unavailable, using localStorage only:', error);
        // Continue with localStorage as fallback
    }
    
    // Always save to localStorage as backup
    try {
        let rsvps = getAllRSVPsSync();
        rsvps.push(rsvpEntry);
        localStorage.setItem('weddingRSVPs', JSON.stringify(rsvps));
        console.log('✅ RSVP saved to localStorage:', rsvpEntry);
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
        throw new Error('Failed to save RSVP: ' + error.message);
    }
    
    // Also save individual entry for backup
    try {
        localStorage.setItem(`rsvp_${rsvpEntry.id}`, JSON.stringify(rsvpEntry));
    } catch (error) {
        console.warn('Could not save individual RSVP entry:', error);
        // Non-critical, continue
    }
    
    return rsvpEntry;
}

// Get RSVPs from server (centralized) with localStorage fallback
async function getAllRSVPs() {
    // Try to get from server first
    try {
        const response = await fetch('/api/get-rsvps');
        if (response.ok) {
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                console.log('✅ Loaded RSVPs from server:', result.data.length);
                // Also sync to localStorage as backup
                try {
                    localStorage.setItem('weddingRSVPs', JSON.stringify(result.data));
                } catch (e) {
                    console.warn('Could not sync to localStorage:', e);
                }
                return result.data;
            }
        }
    } catch (error) {
        console.warn('⚠️ Server unavailable, using localStorage:', error);
    }
    
    // Fallback to localStorage
    try {
        const data = localStorage.getItem('weddingRSVPs');
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error reading RSVPs from localStorage:', error);
        // If corrupted, try to recover individual entries
        const recovered = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('rsvp_')) {
                try {
                    const entry = JSON.parse(localStorage.getItem(key));
                    if (entry && entry.id) {
                        recovered.push(entry);
                    }
                } catch (e) {
                    console.error('Error recovering RSVP entry:', key, e);
                }
            }
        }
        // Save recovered data
        if (recovered.length > 0) {
            recovered.sort((a, b) => (a.id || 0) - (b.id || 0));
            localStorage.setItem('weddingRSVPs', JSON.stringify(recovered));
        }
        return recovered;
    }
}

// Synchronous version for backward compatibility (uses localStorage only)
function getAllRSVPsSync() {
    try {
        const data = localStorage.getItem('weddingRSVPs');
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Error reading RSVPs from localStorage:', error);
        return [];
    }
}

async function getRSVPStats() {
    const rsvps = await getAllRSVPs();
    const attending = rsvps.filter(r => r.attending === 'yes');
    const notAttending = rsvps.filter(r => r.attending === 'no');
    const totalGuests = attending.reduce((sum, r) => {
        const guests = parseInt(r.guests) || 0;
        return sum + guests;
    }, 0);
    
    return {
        total: rsvps.length,
        attending: attending.length,
        notAttending: notAttending.length,
        totalGuests: totalGuests
    };
}

async function exportRSVPsToJSON() {
    const rsvps = await getAllRSVPs();
    const dataStr = JSON.stringify(rsvps, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

async function exportRSVPsToCSV() {
    const rsvps = await getAllRSVPs();
    
    // Ask user to choose delimiter
    const delimiterChoice = confirm(
        'Chọn định dạng CSV:\n\n' +
        'OK = Dấu chấm phẩy (;) - Khuyến nghị cho Excel\n' +
        'Cancel = Dấu phẩy (,) - Chuẩn CSV'
    );
    
    // Use semicolon (;) as delimiter for better Excel recognition
    const delimiter = delimiterChoice ? ';' : ',';
    
    // Escape function for CSV
    function escapeCSV(value) {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        // If contains delimiter, quotes, or newlines, wrap in quotes
        if (stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
            return '"' + stringValue.replace(/"/g, '""') + '"';
        }
        return stringValue;
    }
    
    const headers = ['ID', 'Thời gian', 'Tên', 'Số khách', 'Tham dự', 'Lời nhắn'];
    
    // Create header row
    const headerRow = headers.map(escapeCSV).join(delimiter);
    
    // Create data rows
    const dataRows = rsvps.map(r => {
        return [
            r.id,
            r.date,
            r.name,
            r.guests,
            r.attending === 'yes' ? 'Có' : 'Không',
            r.message || ''
        ].map(escapeCSV).join(delimiter);
    });
    
    // Combine all rows
    const csvContent = [headerRow, ...dataRows].join('\r\n');
    
    // Add BOM (Byte Order Mark) for UTF-8 to ensure Excel recognizes encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Form submission handler with Petals Animation
document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvpForm');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(rsvpForm);
            const data = {
                name: formData.get('name'),
                guests: formData.get('guests'),
                attending: formData.get('attending'),
                message: formData.get('message')
            };
            
            // Validate form data before saving
            if (!data.name || !data.guests || !data.attending) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }
            
            // Save to server and localStorage
            try {
                console.log('Attempting to save RSVP:', data);
                const savedRSVP = await saveRSVPData(data);
                console.log('RSVP saved successfully:', savedRSVP);
                
                // Verify it was saved
                const allRSVPs = await getAllRSVPs();
                console.log('✅ Total RSVPs in storage:', allRSVPs.length);
                console.log('✅ All RSVPs:', allRSVPs);
                console.log('✅ Latest RSVP ID:', savedRSVP.id);
                
                // Show petals animation
                createPetalsAnimation();
                
                // Show success message
                setTimeout(() => {
                    showSuccessMessage();
                }, 500);
                
                // Reset form
                rsvpForm.reset();
                
                // Update admin panel if visible
                console.log('🔄 Attempting to update admin panel...');
                await updateAdminPanel();
                console.log('✅ Admin panel update called');
            } catch (error) {
                console.error('Error saving RSVP:', error);
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                    data: data
                });
                alert('Có lỗi xảy ra khi lưu thông tin: ' + error.message + '\nVui lòng thử lại hoặc liên hệ với chúng tôi.');
            }
        });
    }
    
    // Initialize floating hearts
    createFloatingHearts();
    
    // Add scroll animations
    initScrollAnimations();
    
    // Background color transition on scroll
    window.addEventListener('scroll', updateBackgroundColor);
    updateBackgroundColor();
});

// Petals Animation - Romantic floating petals
function createPetalsAnimation() {
    const form = document.getElementById('rsvpForm');
    const petalCount = 15;
    
    for (let i = 0; i < petalCount; i++) {
        setTimeout(() => {
            createPetal(form);
        }, i * 100);
    }
}

function createPetal(container) {
    const petal = document.createElement('div');
    petal.style.cssText = `
        position: absolute;
        width: 12px;
        height: 12px;
        background: ${HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)].color};
        border-radius: 50% 0 50% 0;
        pointer-events: none;
        z-index: 1000;
        opacity: 0.7;
        transform: rotate(${Math.random() * 360}deg);
    `;
    
    const rect = container.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    petal.style.left = startX + 'px';
    petal.style.top = startY + 'px';
    
    document.body.appendChild(petal);
    
    // Animate petal
    const angle = Math.random() * Math.PI * 2;
    const distance = 200 + Math.random() * 150;
    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance - 100;
    const rotation = Math.random() * 720 - 360;
    
    petal.animate([
        {
            transform: `translate(0, 0) rotate(0deg)`,
            opacity: 0.7
        },
        {
            transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${rotation}deg)`,
            opacity: 0
        }
    ], {
        duration: 2000,
        easing: 'ease-out',
        fill: 'forwards'
    });
    
    setTimeout(() => {
        if (petal.parentNode) {
            petal.parentNode.removeChild(petal);
        }
    }, 2000);
}

// Success message display
function showSuccessMessage() {
    const form = document.getElementById('rsvpForm');
    const existingMsg = form.querySelector('.success-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.style.cssText = `
        background: linear-gradient(135deg, #8B2635 0%, #B03A48 100%);
        color: white;
        padding: 25px;
        border-radius: 15px;
        text-align: center;
        font-family: 'Playfair Display', serif;
        font-size: 18px;
        margin-top: 20px;
        animation: fadeInUp 0.5s ease-out;
        box-shadow: 0 10px 30px rgba(139, 38, 53, 0.3);
    `;
    successMsg.textContent = 'Cảm ơn bạn đã xác nhận! Chúng tôi rất mong được gặp bạn trong ngày đặc biệt này. ❤️';
    
    form.appendChild(successMsg);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMsg.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 500);
    }, 5000);
}

// Scroll animations for elements
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.detail-card, .timeline-item, .gallery-item, .story-text, .story-image'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Add fade-in animation for page load
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Slow parallax layers - Vintage decorative elements
function createParallaxLayers() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create decorative vintage elements
    for (let i = 0; i < 3; i++) {
        const layer = document.createElement('div');
        layer.className = 'parallax-layer';
        layer.style.cssText = `
            position: absolute;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            top: ${20 + i * 30}%;
            left: ${10 + i * 25}%;
            animation: floatParallax ${15 + i * 5}s ease-in-out infinite;
        `;
        hero.appendChild(layer);
    }
}

// Add parallax layer animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParallax {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(20px, -20px) scale(1.1); }
        66% { transform: translate(-15px, 15px) scale(0.9); }
    }
`;
document.head.appendChild(style);

// Initialize parallax layers
document.addEventListener('DOMContentLoaded', function() {
    createParallaxLayers();
    initAdminPanel();
    initGalleryLightbox();
    initMusicPlayer();
});

// Music Player Functions - Beautiful in White
let isPlaying = false;
let audio = null;

function initMusicPlayer() {
    audio = document.getElementById('weddingMusic');
    const playBtn = document.getElementById('playBtn');
    
    if (!audio) return;
    
    // Set initial volume
    audio.volume = 0.5;
    
    // Set start time to 13 seconds
    const START_TIME = 13;
    
    // Set start time when audio metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = START_TIME;
    });
    
    // Auto-play immediately when page loads
    // Try multiple strategies for autoplay across browsers
    const tryAutoPlay = () => {
        // Set start time before playing
        if (audio.readyState >= 1) {
            audio.currentTime = START_TIME;
        }
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Ensure we start at 13 seconds
                if (audio.currentTime < START_TIME) {
                    audio.currentTime = START_TIME;
                }
                isPlaying = true;
                updatePlayerUI();
                console.log('Music auto-played');
            }).catch((error) => {
                // Auto-play was prevented - try again on first user interaction
                console.log('Auto-play blocked, will play on user interaction');
                
                const enableOnInteraction = () => {
                    audio.currentTime = START_TIME;
                    audio.play().then(() => {
                        isPlaying = true;
                        updatePlayerUI();
                    }).catch(() => {
                        console.log('Still cannot auto-play');
                    });
                };
                
                // Try on any user interaction
                document.addEventListener('click', enableOnInteraction, { once: true });
                document.addEventListener('touchstart', enableOnInteraction, { once: true });
                document.addEventListener('scroll', enableOnInteraction, { once: true });
            });
        }
    };
    
    // Try autoplay when audio is ready
    if (audio.readyState >= 2) {
        // Audio is already loaded
        tryAutoPlay();
    } else {
        // Wait for audio to be ready
        audio.addEventListener('canplay', tryAutoPlay, { once: true });
        audio.addEventListener('loadeddata', tryAutoPlay, { once: true });
    }
    
    // Also try immediately (for some browsers)
    setTimeout(tryAutoPlay, 100);
    
    // Update UI when audio plays or pauses
    audio.addEventListener('play', () => {
        // Ensure we start at 13 seconds when playing
        if (audio.currentTime < START_TIME) {
            audio.currentTime = START_TIME;
        }
        isPlaying = true;
        updatePlayerUI();
    });
    
    audio.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayerUI();
    });
    
    // Handle audio errors
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
    });
    
    // Custom loop: when audio ends, reset to START_TIME (13 seconds) and play again
    audio.addEventListener('ended', () => {
        audio.currentTime = START_TIME;
        audio.play();
    });
    
    // Ensure we never go before START_TIME (safety check)
    audio.addEventListener('timeupdate', () => {
        // If somehow before START_TIME (but not at the very beginning), reset
        if (audio.currentTime < START_TIME && audio.currentTime > 0.5 && audio.readyState >= 2) {
            audio.currentTime = START_TIME;
        }
    });
}

function toggleMusic() {
    if (!audio) return;
    
    const START_TIME = 13; // Start from 13th second
    
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        // Set start time before playing
        if (audio.readyState >= 1) {
            audio.currentTime = START_TIME;
        }
        audio.play().then(() => {
            // Ensure we start at 13 seconds
            if (audio.currentTime < START_TIME) {
                audio.currentTime = START_TIME;
            }
            isPlaying = true;
        }).catch((error) => {
            console.error('Error playing audio:', error);
            alert('Cannot play music. Please check connection or audio file.');
        });
    }
    
    updatePlayerUI();
}

function setVolume(value) {
    if (!audio) return;
    audio.volume = value / 100;
}

function updatePlayerUI() {
    const playBtn = document.getElementById('playBtn');
    
    if (playBtn) {
        const playIcon = playBtn.querySelector('.play-icon');
        if (playIcon) {
            if (isPlaying) {
                playBtn.classList.add('playing');
                playIcon.textContent = '❚❚';
            } else {
                playBtn.classList.remove('playing');
                playIcon.textContent = '▶';
            }
        }
    }
}

// Gallery Lightbox Functions
let currentImageIndex = 0;
let galleryImages = [];

function initGalleryLightbox() {
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item[data-image]');
    galleryImages = Array.from(galleryItems).map(item => item.getAttribute('data-image'));
    
    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    // Close on background click
    const lightbox = document.getElementById('galleryLightbox');
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const lightbox = document.getElementById('galleryLightbox');
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                changeLightboxImage(-1);
            } else if (e.key === 'ArrowRight') {
                changeLightboxImage(1);
            }
        }
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (galleryImages[index]) {
        lightboxImage.src = galleryImages[index];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Smooth fade in
        setTimeout(() => {
            lightbox.style.opacity = '1';
        }, 10);
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    lightbox.style.opacity = '0';
    
    setTimeout(() => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }, 400);
}

function changeLightboxImage(direction) {
    currentImageIndex += direction;
    
    // Loop around
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImage.src = galleryImages[currentImageIndex];
        lightboxImage.style.opacity = '1';
    }, 200);
}

// Admin Panel Functions - Password encoded for security
// Password is base64 encoded to prevent easy reading in source code
function getAdminPassword() {
    // Decode base64: "c2VudGltZW50YWwwNTA0" = "sentimental0504"
    try {
        return atob('c2VudGltZW50YWwwNTA0');
    } catch(e) {
        return '';
    }
}

function initAdminPanel() {
    const footer = document.querySelector('.footer');
    const footerText = document.getElementById('footerText');
    
    if (!footerText || !footer) return;
    
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    
    // Desktop: Triple click on footer text to activate
    let clickCount = 0;
    let clickTimer;
    
    footerText.addEventListener('click', function(e) {
        if (!isMobile) {
            clickCount++;
            clearTimeout(clickTimer);
            
            clickTimer = setTimeout(() => {
                if (clickCount === 3) {
                    showAdminLogin();
                }
                clickCount = 0;
            }, 500);
        }
    });
    
    // Mobile: Long press (1.5 seconds) on footer text to activate
    let longPressTimer;
    
    footerText.addEventListener('touchstart', function(e) {
        if (isMobile) {
            longPressTimer = setTimeout(() => {
                showAdminLogin();
                e.preventDefault();
            }, 1500);
        }
    }, { passive: false });
    
    footerText.addEventListener('touchend', function(e) {
        if (isMobile && longPressTimer) {
            clearTimeout(longPressTimer);
        }
    });
    
    footerText.addEventListener('touchmove', function(e) {
        if (isMobile && longPressTimer) {
            clearTimeout(longPressTimer);
        }
    });
}

async function showAdminLogin() {
    const password = prompt('Nhập mật khẩu để xem danh sách RSVP:');
    const correctPassword = getAdminPassword();
    
    if (password === correctPassword) {
        await showAdminPanel();
    } else if (password) {
        alert('Mật khẩu không đúng!');
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function showAdminPanel() {
    // Remove existing panel if any
    const existingPanel = document.getElementById('adminPanel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    // Always fetch fresh data from server
    const rsvps = await getAllRSVPs();
    console.log('=== Admin Panel Debug ===');
    console.log('Total RSVPs loaded:', rsvps.length);
    console.log('RSVPs data:', JSON.stringify(rsvps, null, 2));
    
    // Sort by timestamp (newest first)
    // Use id (timestamp) as primary, fallback to timestamp string, then to 0
    rsvps.sort((a, b) => {
        let timeA = 0;
        if (a.id) {
            timeA = a.id;
        } else if (a.timestamp) {
            try {
                timeA = new Date(a.timestamp).getTime();
            } catch (e) {
                timeA = 0;
            }
        }
        
        let timeB = 0;
        if (b.id) {
            timeB = b.id;
        } else if (b.timestamp) {
            try {
                timeB = new Date(b.timestamp).getTime();
            } catch (e) {
                timeB = 0;
            }
        }
        
        return timeB - timeA; // Newest first
    });
    
    const stats = await getRSVPStats();
    console.log('RSVP Stats:', stats);
    console.log('=== End Admin Panel Debug ===');
    
    const panel = document.createElement('div');
    panel.id = 'adminPanel';
    panel.innerHTML = `
        <div class="admin-panel-overlay"></div>
        <div class="admin-panel-content">
            <div class="admin-header">
                <h2>📋 Danh Sách RSVP</h2>
                <button class="admin-close" onclick="this.closest('#adminPanel').remove()">×</button>
            </div>
            <div style="padding: 10px 20px; background: #d1ecf1; border-bottom: 1px solid #0c5460; font-size: 12px; color: #0c5460;">
                💡 <strong>Lưu ý:</strong> Dữ liệu được lưu tập trung trên server. Tất cả người dùng đều thấy cùng dữ liệu. Nếu không thấy RSVP mới, hãy click nút "🔄 Làm mới".
            </div>
            <div class="admin-stats">
                <div class="stat-item">
                    <span class="stat-label">Tổng số:</span>
                    <span class="stat-value">${stats.total}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Sẽ tham dự:</span>
                    <span class="stat-value attending">${stats.attending}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Không tham dự:</span>
                    <span class="stat-value not-attending">${stats.notAttending}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tổng số khách:</span>
                    <span class="stat-value">${stats.totalGuests}</span>
                </div>
            </div>
            <div class="admin-actions">
                <button class="admin-btn" onclick="refreshAdminPanel()" style="background: #28a745;">🔄 Làm mới</button>
                <button class="admin-btn" onclick="handleExportJSON()">📥 Xuất JSON</button>
                <button class="admin-btn" onclick="handleExportCSV()">📊 Xuất CSV</button>
                <button class="admin-btn" onclick="debugLocalStorage()" style="background: #6c757d;">🔍 Debug</button>
                <button class="admin-btn" onclick="handleClearAll()" style="background: #dc3545;">🗑️ Xóa tất cả</button>
            </div>
            <div class="admin-list">
                ${rsvps.length === 0 ? '<p style="text-align: center; padding: 40px; color: #6B6B6B;">Chưa có RSVP nào</p>' : 
                    rsvps.map(rsvp => {
                        const name = escapeHtml(String(rsvp.name || 'Không có tên').trim());
                        const date = escapeHtml(String(rsvp.date || 'Không có ngày').trim());
                        const guests = parseInt(rsvp.guests) || 0;
                        const attending = rsvp.attending === 'yes' ? '✅ Có' : '❌ Không';
                        const message = rsvp.message ? escapeHtml(String(rsvp.message).trim()) : '';
                        return `
                        <div class="rsvp-item ${rsvp.attending === 'yes' ? 'attending' : 'not-attending'}">
                            <div class="rsvp-header">
                                <strong>${name}</strong>
                                <span class="rsvp-date">${date}</span>
                            </div>
                            <div class="rsvp-details">
                                <span>Số khách: <strong>${guests}</strong></span>
                                <span>Tham dự: <strong>${attending}</strong></span>
                            </div>
                            ${message ? `<div class="rsvp-message">"${message}"</div>` : ''}
                        </div>
                    `;
                    }).join('')
                }
            </div>
        </div>
    `;
    document.body.appendChild(panel);
}

async function updateAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) {
        console.log('Updating admin panel with fresh data...');
        // Force remove existing panel and recreate with updated data
        panel.remove();
        // Small delay to ensure DOM is updated
        setTimeout(async () => {
            await showAdminPanel();
        }, 100);
    } else {
        console.log('Admin panel not open, no update needed');
    }
}

function debugLocalStorage() {
    console.log('=== LocalStorage Debug Info ===');
    console.log('localStorage available:', typeof(Storage) !== "undefined");
    
    // Check main RSVP array
    const mainData = localStorage.getItem('weddingRSVPs');
    console.log('weddingRSVPs key exists:', !!mainData);
    console.log('weddingRSVPs raw data:', mainData);
    
    try {
        const parsed = JSON.parse(mainData || '[]');
        console.log('weddingRSVPs parsed:', parsed);
        console.log('weddingRSVPs count:', parsed.length);
    } catch (e) {
        console.error('Error parsing weddingRSVPs:', e);
    }
    
    // Check individual entries
    const individualEntries = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('rsvp_')) {
            try {
                const entry = JSON.parse(localStorage.getItem(key));
                individualEntries.push({ key, entry });
            } catch (e) {
                console.error('Error parsing entry:', key, e);
            }
        }
    }
    console.log('Individual RSVP entries:', individualEntries);
    console.log('Individual entries count:', individualEntries.length);
    
    // Get all RSVPs using getAllRSVPs (async)
    getAllRSVPs().then(allRSVPs => {
        console.log('getAllRSVPs() result:', allRSVPs);
        console.log('getAllRSVPs() count:', allRSVPs.length);
        
        // Get stats
        return getRSVPStats();
    }).then(stats => {
        console.log('RSVP Stats:', stats);
        console.log('=== End Debug Info ===');
        alert('Debug info đã được log vào Console (F12).\n\nTổng số RSVP: ' + (stats?.total || 0) + '\nSẽ tham dự: ' + (stats?.attending || 0) + '\nKhông tham dự: ' + (stats?.notAttending || 0));
    }).catch(error => {
        console.error('Error in debug:', error);
        console.log('=== End Debug Info ===');
        alert('Có lỗi khi debug. Xem Console (F12) để biết chi tiết.');
    });
}

// Wrapper functions for onclick handlers (to handle async)
async function refreshAdminPanel() {
    await showAdminPanel();
}

async function handleExportJSON() {
    try {
        await exportRSVPsToJSON();
    } catch (error) {
        console.error('Error exporting JSON:', error);
        alert('Có lỗi khi xuất JSON. Vui lòng thử lại.');
    }
}

async function handleExportCSV() {
    try {
        await exportRSVPsToCSV();
    } catch (error) {
        console.error('Error exporting CSV:', error);
        alert('Có lỗi khi xuất CSV. Vui lòng thử lại.');
    }
}

async function handleClearAll() {
    if (confirm('Bạn có chắc chắn muốn xóa TẤT CẢ dữ liệu RSVP? Hành động này không thể hoàn tác!')) {
        localStorage.removeItem('weddingRSVPs');
        // Clear individual entries
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('rsvp_')) {
                localStorage.removeItem(key);
            }
        }
        alert('Đã xóa tất cả dữ liệu RSVP từ localStorage!\n\nLưu ý: Dữ liệu trên server (JSONBin.io) vẫn còn. Để xóa hoàn toàn, cần xóa trực tiếp trên JSONBin.io.');
        await showAdminPanel();
    }
}

function clearAllRSVPs() {
    handleClearAll();
}

// Calendar Widget - Render November 2025
function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarDays) return;
    
    // November 2025 - starts on Saturday (T7)
    // Day 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const firstDayOfMonth = 6; // Saturday (T7) - November 1, 2025
    const daysInMonth = 30;
    const highlightDay = 30; // Wedding day
    
    // Clear existing content
    calendarDays.innerHTML = '';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Highlight the wedding day (30th)
        if (day === highlightDay) {
            dayElement.classList.add('highlight');
        }
        
        calendarDays.appendChild(dayElement);
    }
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
});
