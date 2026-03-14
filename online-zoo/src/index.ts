import type { Animal, Feedback, ApiResponse } from './types.js';

let allFeedbacks: Feedback[] = []; 
let allPets: Animal[] = []; 
let currentPetIndex = 0; 
let currentFeedbackPage = 0;
const FEEDBACKS_PER_PAGE = 4;

async function loadLandingData(): Promise<void> {
    const petsContainer = document.getElementById('pets-container');
    const feedbackContainer = document.getElementById('cards-container');

    if (petsContainer) petsContainer.innerHTML = '<p class="loader">Loading pets...</p>';
    if (feedbackContainer) feedbackContainer.innerHTML = '<p class="loader">Loading feedback...</p>';

    try {
        const [petsRes, feedbackRes] = await Promise.all([
            fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets'),
            fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/feedback')
        ]);

        if (!petsRes.ok || !feedbackRes.ok) throw new Error();

        const petsData: ApiResponse<Animal> = await petsRes.json();
        const feedbackData: ApiResponse<any> = await feedbackRes.json();

        allPets = petsData.data;
        allFeedbacks = feedbackData.data;

        if (petsContainer) {
            renderPets(allPets, petsContainer);
        }
        
        renderTestimonials(); 
        setupPagination();
        setupSliderControls(); 

        console.log("მონაცემები წარმატებით წამოვიდა სერვერიდან");

    } catch (error) {
        console.error("Error fetching data:", error);
        const errorMsg = 'Something went wrong. Please, refresh the page';
        if (petsContainer) petsContainer.innerHTML = `<p class="error">${errorMsg}</p>`;
        if (feedbackContainer) feedbackContainer.innerHTML = `<p class="error">${errorMsg}</p>`;
    }
}

function renderPets(pets: Animal[], container: HTMLElement): void {
    if (!container || pets.length === 0) return;
    
    const displayPets = pets.slice(currentPetIndex, currentPetIndex + 28);

    container.innerHTML = displayPets
        .filter(pet => !!pet)
        .map(pet => {
            // აქ ვწერ ფუნქციას, რომელიც რიგრიგობით ცდის ყველა გაფართოებას
            return `
            <div class="card">
                <div class="card-lable"><span>${pet.name}</span></div>
                <img src="../../assets/images/${pet.id}.webp" alt="${pet.name}" 
                    onerror="
                        const id = '${pet.id}';
                        const path = '../../assets/images/';
                        const formats = ['.WEBP', '.png', '.PNG', '.jpg', '.JPG', '.jpeg'];
                        
                        // ვამოწმებთ, მერამდენე მცდელობაზე ვართ custom ატრიბუტით
                        let attempt = parseInt(this.getAttribute('data-attempt') || '0');
                        
                        if (attempt < formats.length) {
                            this.setAttribute('data-attempt', attempt + 1);
                            this.src = path + id + formats[attempt];
                        } else {
                            this.src = path + 'panda.png';
                            this.onerror = null; 
                        }
                    "/>
                <div class="card-text">
                    <h2>${pet.commonName}</h2>
                    <p>${pet.description}</p>
                    <a href="#">
                        VIEW LIVE CAM
                        <img src="../../assets/icons/Union2.svg" alt="arrow-logo" />
                    </a>
                </div>
            </div>
        `}).join('');
}

function renderTestimonials(): void {
    const container = document.getElementById('cards-container');
    if (!container || allFeedbacks.length === 0) return;

    const start = currentFeedbackPage * FEEDBACKS_PER_PAGE;
    const paginatedItems = allFeedbacks.slice(start, start + FEEDBACKS_PER_PAGE);

    container.innerHTML = paginatedItems.map(item => `
        <div class="card-users">
            <span class="quotation-mark"> “ </span>
            <div class="card-users-text">
                <h3>${item.city || 'Unknown'}, ${item.month || ''} ${item.year || ''}</h3>
                <p>${item.text}</p>
                <h3>${item.name || 'Anonymous'}</h3>
            </div>
        </div>
    `).join('');

    updateDots();
}

function setupSliderControls(): void {
    const nextPetBtn = document.getElementById('next-pet'); 
    const prevPetBtn = document.getElementById('prev-pet');

    nextPetBtn?.addEventListener('click', () => {
        currentPetIndex = (currentPetIndex + 1) % allPets.length;
        const petsContainer = document.getElementById('pets-container');
        if (petsContainer) renderPets(allPets, petsContainer);
    });

    prevPetBtn?.addEventListener('click', () => {
        currentPetIndex = (currentPetIndex - 1 + allPets.length) % allPets.length;
        const petsContainer = document.getElementById('pets-container');
        if (petsContainer) renderPets(allPets, petsContainer);
    });

    const nextFeedbackBtn = document.getElementById('next-feedback'); 
    const prevFeedbackBtn = document.getElementById('prev-feedback');

    nextFeedbackBtn?.addEventListener('click', () => {
        const totalPages = Math.ceil(allFeedbacks.length / FEEDBACKS_PER_PAGE);
        currentFeedbackPage = (currentFeedbackPage + 1) % totalPages;
        renderTestimonials();
    });

    prevFeedbackBtn?.addEventListener('click', () => {
        const totalPages = Math.ceil(allFeedbacks.length / FEEDBACKS_PER_PAGE);
        currentFeedbackPage = (currentFeedbackPage - 1 + totalPages) % totalPages;
        renderTestimonials();
    });
}

function updateDots(): void {
    const dots = document.querySelectorAll('.pagination-dots .dot');
    dots.forEach((dot, index) => {
        if (index === currentFeedbackPage) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function setupPagination(): void {
    const dots = document.querySelectorAll('.pagination-dots .dot');
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            currentFeedbackPage = parseInt(target.dataset.index || '0');
            renderTestimonials();
        });
    });
}

document.addEventListener('DOMContentLoaded', loadLandingData);