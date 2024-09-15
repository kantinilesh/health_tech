// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Navbar animation
gsap.from("nav", {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

// Home section animation
gsap.from("#home h1, #home p, #home a", {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});

// Disease data
const diseases = [
    {
        name: "Brain Tumor",
        description: "Learn about the symptoms and treatment of brain tumors.",
        link: "disease.html?disease=brain-tumor"
    },
    {
        name: "Cancer",
        description: "Understand various types of cancer, their symptoms, and treatments.",
        link: "disease.html?disease=cancer"
    },
    {
        name: "Jaundice",
        description: "Discover the symptoms and treatment options for jaundice.",
        link: "disease.html?disease=jaundice"
    },
    {
        name: "Typhoid",
        description: "Learn about the causes, symptoms, and treatment of typhoid fever.",
        link: "disease.html?disease=typhoid"
    },
    {
        name: "Diabetes",
        description: "Understand the causes and management of diabetes.",
        link: "disease.html?disease=diabetes"
    }
];

// Populate disease cards
const diseaseContainer = document.querySelector("#diseases .grid");
diseases.forEach(disease => {
    const card = document.createElement("div");
    card.className = "disease-card";
    card.innerHTML = `
        <h3 class="text-2xl font-semibold mb-4">${disease.name}</h3>
        <p class="mb-4">${disease.description}</p>
        <a href="${disease.link}" class="text-blue-600 dark:text-blue-400 hover:underline">Read more →</a>
    `;
    diseaseContainer.appendChild(card);
});

// Diseases section animation
gsap.from(".disease-card", {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.1,
    scrollTrigger: {
        trigger: "#diseases",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
    }
});

// Pharmacy section animation
gsap.from("#pharmacy h2, #map", {
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
        trigger: "#pharmacy",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
    }
});

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

function setTheme(theme) {
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Check for saved theme preference or prefer-color-scheme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    setTheme(savedTheme);
} else if (prefersDark) {
    setTheme('dark');
}

// Pharmacy search functionality
const searchPharmacy = document.getElementById('searchPharmacy');
const pincodeInput = document.getElementById('pincode');
let map;

// Initialize the map
function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5); // Center on India
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

initMap();

searchPharmacy.addEventListener('click', async () => {
    const pincode = pincodeInput.value.trim();
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
        alert('Please enter a valid 6-digit PIN code');
        return;
    }

    try {
        // First, get the coordinates for the PIN code
        const nominatimResponse = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`);
        const nominatimData = await nominatimResponse.json();

        if (nominatimData.length === 0) {
            alert('No location found for this PIN code');
            return;
        }

        const { lat, lon } = nominatimData[0];
        map.setView([lat, lon], 14);

        // Now, search for pharmacies near this location
        const overpassApiUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:5000,${lat},${lon})["amenity"="pharmacy"];out;`;
        const overpassResponse = await fetch(overpassApiUrl);
        const overpassData = await overpassResponse.json();

        // Clear existing markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add markers for each pharmacy
        overpassData.elements.forEach(pharmacy => {
            L.marker([pharmacy.lat, pharmacy.lon])
                .addTo(map)
                .bindPopup(pharmacy.tags.name || 'Unnamed Pharmacy');
        });

        if (overpassData.elements.length === 0) {
            alert('No pharmacies found in this area');
        }
    } catch (error) {
        console.error('Error fetching pharmacy data:', error);
        alert('An error occurred while searching for pharmacies');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});