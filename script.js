// Theme Toggle
const themeBtn = document.querySelector('.theme-toggle-btn');
const body = document.body;

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        themeBtn.innerHTML = body.classList.contains('light-theme')
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
    });

    // Load saved theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Mobile Menu
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.innerHTML = navLinks.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuBtn) menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Scroll Animations
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => observer.observe(element));

// Skill Bar Animation
const skillBars = document.querySelectorAll('.progress');
const animateSkills = () => {
    skillBars.forEach(bar => {
        const width = bar.style.getPropertyValue('--width');
        if (width) bar.style.width = width;
    });
};

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillsObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(skillsSection);
        }
    }, { threshold: 0.5 });

    skillsObserver.observe(skillsSection);
}

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            projectCards.forEach(card => {
                const tech = card.dataset.tech.split(' ');
                if (filter === 'all' || tech.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 0);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// Logo Modal
const logo = document.querySelector('.logo-img');
const modal = document.querySelector('#logoModal');

if (logo && modal) {
    logo.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Accessibility: Keyboard Navigation for Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
}

// Chatbot
let greeted = false;
const chatToggle = document.getElementById('chat-toggle');
const chatbot = document.getElementById('chatbot');
const chatClose = document.querySelector('.chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.querySelector('.chat-messages');
const suggestions = document.querySelectorAll('.suggestion');

const chatResponses = {
    "about you": "I'm Shivam Sharma, an AI/ML student passionate about deep learning, computer vision, and ethical AI. Check my projects for more!",
    "projects": "📁 I’ve worked on BoardPrep (a study app), AI Law Chatbot, and Dermaware (skin health concept). See the Projects section!",
    "skills": "🛠️ I’m skilled in Python, TensorFlow, OpenCV, Firebase, LangChain, and more. See the Skills section!",
    "contact": "📬 You can reach me via the Contact form or email: shivam17sharma2004@gmail.com. You can also call me at: 9330087464.",
    "hello": "👋 Hello! What can I help you with today?",
    "hi": "👋 Hi there! How can I assist you?",
    "default": "❗ Sorry, I didn’t understand that. Try asking about my projects, skills, or contact info!"
};

if (chatToggle && chatbot && chatClose && chatInput && chatSend && chatMessages) {
    chatToggle.addEventListener('click', () => {
        chatbot.style.display = chatbot.style.display === 'block' ? 'none' : 'block';
        if (!greeted && chatbot.style.display === 'block') {
            addMessage('bot', "👋 Hello Sir/Mam! Welcome to Shivam's Chatbot. How may I help you?");
            greeted = true;
        }
    });

    chatClose.addEventListener('click', () => {
        chatbot.style.display = 'none';
    });

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    suggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            if (chatInput) {
                chatInput.value = btn.textContent.toLowerCase();
                sendMessage();
            }
        });
    });
}

function sendMessage() {
    if (!chatInput) return;
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage('user', message);

    const cleaned = message.toLowerCase();
    const matchedKey = Object.keys(chatResponses).find(key => cleaned.includes(key));
    const response = chatResponses[matchedKey] || chatResponses["default"];

    setTimeout(() => addMessage('bot', response), 500);
    chatInput.value = '';
}

function addMessage(type, text) {
    if (!chatMessages) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = text;
    messageDiv.style.padding = '0.625rem 0.9375rem';
    messageDiv.style.margin = '0.375rem';
    messageDiv.style.borderRadius = '0.75rem';
    messageDiv.style.maxWidth = '80%';
    messageDiv.style.alignSelf = type === 'user' ? 'flex-end' : 'flex-start';
    messageDiv.style.background = type === 'user' ? 'var(--neon)' : 'rgba(255, 255, 255, 0.05)';
    messageDiv.style.color = type === 'user' ? 'var(--dark)' : 'var(--light)';
    messageDiv.style.boxShadow = '0 0.125rem 0.375rem rgba(0, 0, 0, 0.2)';

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Lazy Load Images
const lazyImages = document.querySelectorAll('img[data-src]');
const lazyLoad = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
}, { threshold: 0.1 });

lazyImages.forEach(img => lazyLoad.observe(img));