// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Shared JavaScript functions
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(el => {
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);
    });

    // WhatsApp animation
    const whatsappBtn = document.querySelector('a[href^="https://wa.me"]');
    if (whatsappBtn) {
        setInterval(() => {
            whatsappBtn.classList.toggle('animate-pulse');
        }, 2000);
    }

    // Page-specific data loading
    if (window.location.pathname.includes('construction.html')) {
        loadEquipmentData();
    }

    if (window.location.pathname.includes('contractors.html')) {
        loadContractorsData();
    }

    if (window.location.pathname.includes('security.html')) {
        loadSecurityServices();
    }

    // Form handling
    document.getElementById('contactForm') ? .addEventListener('submit', handleContactSubmit);
    document.getElementById('trackForm') ? .addEventListener('submit', handleTrackSubmit);
    document.getElementById('loginForm') ? .addEventListener('submit', handleLogin);
    document.getElementById('signupForm') ? .addEventListener('submit', handleRegister);
});

// ================= AUTH FUNCTIONS =================

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const authLinks = document.querySelectorAll('#authLinks');
    const userLinks = document.querySelectorAll('#userLinks');
    const adminLinks = document.querySelectorAll('#adminLink');

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            authLinks.forEach(el => el.style.display = 'none');
            userLinks.forEach(el => el.style.display = 'flex');

            if (payload.role === 'admin') {
                adminLinks.forEach(el => el.classList.remove('hidden'));
            } else {
                adminLinks.forEach(el => el.classList.add('hidden'));
            }
        } catch (e) {
            console.error('Token decode error:', e);
            logout();
        }
    } else {
        authLinks.forEach(el => el.style.display = 'flex');
        userLinks.forEach(el => el.style.display = 'none');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail') ? .value || document.getElementById('email') ? .value;
    const password = document.getElementById('loginPassword') ? .value || document.getElementById('password') ? .value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            checkAuthStatus();
            window.location.href = '/';
        } else {
            alert(data.msg || 'Login failed. Please check your credentials.');
        }
    } catch (err) {
        console.error('Login error:', err);
        alert('Login failed. Please try again.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('full-name') ? .value;
    const email = document.getElementById('email') ? .value;
    const phone = document.getElementById('phone') ? .value;
    const password = document.getElementById('password') ? .value;
    const role = document.getElementById('user-type') ? .value || 'client';


    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password, role })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            checkAuthStatus();
            window.location.href = '/';
        } else {
            alert(data.msg || 'Registration failed. Please try again.');
        }
    } catch (err) {
        console.error('Registration error:', err);
        alert('Registration failed. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    checkAuthStatus();
    window.location.href = '/';
}

// ================= DATA LOADING FUNCTIONS =================

async function loadEquipmentData() {
    try {
        const response = await fetch(`${API_BASE_URL}/equipment`);
        const equipment = await response.json();

        const container = document.getElementById('equipmentContainer');
        if (container) {
            container.innerHTML = equipment.map(item => `
                <div class="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover mb-4 rounded-lg">` : ''}
                    <h3 class="text-xl font-semibold mb-3">${item.name}</h3>
                    <p class="text-gray-600 mb-2">${item.description}</p>
                    <p class="text-blue-600 font-medium mb-4">KSh ${item.price.toLocaleString()} / day</p>
                    <p class="${item.availability ? 'text-green-600' : 'text-red-600'} mb-4">
                        ${item.availability ? 'Available' : 'Not Available'}
                    </p>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300" ${!item.availability ? 'disabled' : ''}>
                        Hire Now
                    </button>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Error loading equipment:', err);
    }
}

async function loadContractorsData() {
    try {
        const response = await fetch(`${API_BASE_URL}/contractors`);
        const contractors = await response.json();

        const container = document.getElementById('contractorsContainer');
        if (container) {
            container.innerHTML = contractors.map(contractor => `
                <div class="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                    ${contractor.image ? `<img src="${contractor.image}" alt="${contractor.name}" class="w-full h-48 object-cover mb-4 rounded-lg">` : ''}
                    <h3 class="text-xl font-semibold mb-3">${contractor.name}</h3>
                    <p class="text-gray-600 mb-2"><strong>Specialization:</strong> ${contractor.specialization}</p>
                    <p class="text-gray-600 mb-2"><strong>Experience:</strong> ${contractor.experience} years</p>
                    <p class="text-gray-600 mb-4"><strong>Location:</strong> ${contractor.location}</p>
                    <a href="tel:${contractor.contact}" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-300 inline-block">
                        Contact Now
                    </a>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Error loading contractors:', err);
    }
}

async function loadSecurityServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/security-services`);
        const services = await response.json();

        const container = document.getElementById('securityContainer');
        if (container) {
            container.innerHTML = services.map(service => `
                <div class="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                    ${service.image ? `<img src="${service.image}" alt="${service.name}" class="w-full h-48 object-cover mb-4 rounded-lg">` : ''}
                    <h3 class="text-xl font-semibold mb-3">${service.name}</h3>
                    <p class="text-gray-600 mb-2">${service.description}</p>
                    <p class="text-blue-600 font-medium mb-4">KSh ${service.price.toLocaleString()} / month</p>
                    <div class="mb-4">
                        <h4 class="font-medium mb-2">Features:</h4>
                        <ul class="list-disc pl-5">
                            ${service.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-300">
                        Get This Service
                    </button>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error('Error loading security services:', err);
    }
}

// ================= FORM HANDLING =================

async function handleContactSubmit(e) {
    e.preventDefault();
    const formData = {
        name: document.getElementById('contactName')?.value,
        email: document.getElementById('contactEmail')?.value,
        phone: document.getElementById('contactPhone')?.value,
        subject: document.getElementById('contactSubject')?.value,
        message: document.getElementById('contactMessage')?.value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Message sent successfully!');
            e.target.reset();
        } else {
            alert(result.msg || 'Failed to send message.');
        }
    } catch (err) {
        console.error('Error sending message:', err);
        alert('An error occurred. Please try again.');
    }
}

async function handleTrackSubmit(e) {
    e.preventDefault();
    const equipmentId = document.getElementById('trackId')?.value;

    try {
        const response = await fetch(`${API_BASE_URL}/track/${equipmentId}`);
        const data = await response.json();

        const resultDiv = document.getElementById('trackResult');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-4">Tracking Results</h3>
                    <div class="mb-2">
                        <strong>Status:</strong>
                        <span class="${data.status === 'Active' ? 'text-green-600' :
                            data.status === 'Inactive' ? 'text-red-600' : 'text-yellow-600'}">${data.status}</span>
                    </div>
                    <div class="mb-2">
                        <strong>Battery Level:</strong> ${data.battery}%
                    </div>
                    <div class="mb-4">
                        <strong>Last Location:</strong>
                        <p class="text-sm">Latitude: ${data.latitude.toFixed(4)}</p>
                        <p class="text-sm">Longitude: ${data.longitude.toFixed(4)}</p>
                    </div>
                    <div class="h-64" id="map"></div>
                </div>
            `;
            setTimeout(() => alert('Map would display here in production.'), 500);
        }
    } catch (err) {
        console.error('Error tracking equipment:', err);
        alert('Error tracking equipment. Please try again.');
    }
}

// ================= TOOLTIP HELPERS =================
function showTooltip() {
    const tooltipText = this.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50';
    tooltip.textContent = tooltipText;

    const rect = this.getBoundingClientRect();
    tooltip.style.top = `${rect.top - 30}px`;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.transform = 'translateX(-50%)';
    document.body.appendChild(tooltip);
    this._tooltip = tooltip;
}

function hideTooltip() {
    if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
    }
}