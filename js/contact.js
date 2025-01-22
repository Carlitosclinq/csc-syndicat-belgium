// Délai avant de lancer la recherche après la saisie
const SEARCH_DELAY = 300;

class OfficeFinder {
    constructor() {
        this.searchInput = document.getElementById('location-search');
        this.resultsContainer = document.getElementById('search-results');
        this.filters = document.querySelectorAll('.filter-option input');
        this.searchTimeout = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.searchInput.addEventListener('input', this.handleSearchInput.bind(this));
        this.filters.forEach(filter => {
            filter.addEventListener('change', () => this.performSearch());
        });
    }

    handleSearchInput() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => this.performSearch(), SEARCH_DELAY);
    }

    async performSearch() {
        const query = this.searchInput.value.trim();
        const activeFilters = Array.from(this.filters)
            .filter(f => f.checked)
            .map(f => f.value);

        if (query.length < 2) {
            this.clearResults();
            return;
        }

        this.showLoadingState();
        try {
            const results = await this.fetchOffices(query, activeFilters);
            this.displayResults(results);
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            this.showError();
        }
    }

    showLoadingState() {
        this.resultsContainer.innerHTML = '<div class="loading">Recherche en cours...</div>';
    }

    showError() {
        this.resultsContainer.innerHTML = '<div class="error">Une erreur est survenue, veuillez réessayer.</div>';
    }

    clearResults() {
        this.resultsContainer.innerHTML = '';
    }

    async fetchOffices(query, filters) {
        // Simulation API - À remplacer par une vraie API
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockOffices = this.getMockOffices();
                const filtered = mockOffices.filter(office => {
                    const matchesQuery = office.name.toLowerCase().includes(query.toLowerCase()) ||
                                       office.address.toLowerCase().includes(query.toLowerCase());
                    
                    const matchesFilters = filters.length === 0 ||
                        filters.every(filter => office.services.includes(filter));
                    
                    return matchesQuery && matchesFilters;
                });
                resolve(filtered);
            }, 500);
        });
    }

    getMockOffices() {
        return [
            {
                name: 'CSC Bruxelles Centre',
                address: 'Rue Example 123, 1000 Bruxelles',
                phone: '02 XXX XX XX',
                email: 'bruxelles@csc.be',
                services: ['chomage', 'juridique'],
                hours: {
                    lundi: '8h30-12h30, 13h30-16h30',
                    mardi: '8h30-12h30, 13h30-16h30',
                    mercredi: '8h30-12h30',
                    jeudi: '8h30-12h30, 13h30-16h30',
                    vendredi: '8h30-12h30'
                }
            },
            {
                name: 'CSC Ixelles',
                address: 'Avenue Test 45, 1050 Ixelles',
                phone: '02 XXX XX XX',
                email: 'ixelles@csc.be',
                services: ['chomage'],
                hours: {
                    lundi: '9h00-12h00',
                    mardi: '9h00-12h00, 14h00-16h00',
                    mercredi: '9h00-12h00',
                    jeudi: '9h00-12h00, 14h00-16h00',
                    vendredi: '9h00-12h00'
                }
            }
        ];
    }

    displayResults(offices) {
        if (offices.length === 0) {
            this.resultsContainer.innerHTML = '<div class="no-results">Aucun bureau trouvé pour cette recherche.</div>';
            return;
        }

        const html = offices.map(office => this.createOfficeCard(office)).join('');
        this.resultsContainer.innerHTML = html;
        
        // Ajouter les gestionnaires d'événements pour les cartes dépliantes
        document.querySelectorAll('.office-card .toggle-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.office-card');
                card.classList.toggle('expanded');
                e.target.textContent = card.classList.contains('expanded') ? 'Moins de détails' : 'Plus de détails';
            });
        });
    }

    createOfficeCard(office) {
        const services = office.services.map(service => {
            const labels = {
                'chomage': 'Service chômage',
                'juridique': 'Service juridique'
            };
            return `<span class="service-tag">${labels[service]}</span>`;
        }).join('');

        const hours = Object.entries(office.hours).map(([day, time]) => `
            <div class="hours-row">
                <span class="day">${day}</span>
                <span class="time">${time}</span>
            </div>
        `).join('');

        return `
            <div class="office-card">
                <div class="office-basic-info">
                    <h3>${office.name}</h3>
                    <p class="address">${office.address}</p>
                    <div class="services-tags">${services}</div>
                </div>
                <div class="office-contact">
                    <p><strong>Tél:</strong> ${office.phone}</p>
                    <p><strong>Email:</strong> ${office.email}</p>
                </div>
                <div class="office-details">
                    <h4>Horaires d'ouverture</h4>
                    <div class="hours-grid">${hours}</div>
                </div>
                <button class="toggle-details">Plus de détails</button>
            </div>
        `;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new OfficeFinder();
    
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

function handleContactSubmit(e) {
    e.preventDefault();
    
    // Validation du formulaire
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulation d'envoi
    console.log('Envoi du formulaire:', data);
    
    // Afficher un message de confirmation
    alert('Votre message a été envoyé. Nous vous répondrons dans les plus brefs délais.');
    e.target.reset();
}