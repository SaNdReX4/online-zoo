const nameInputelement = document.querySelector("#email");
let allFeedbacks = [];
let allPets = [];
let currentPetIndex = 0;
let currentFeedbackPage = 0;
const FEEDBACKS_PER_PAGE = 4;
async function loadLandingData() {
    const petsContainer = document.getElementById('pets-container');
    const feedbackContainer = document.getElementById('cards-container');
    if (petsContainer)
        petsContainer.innerHTML = '<p class="loader">Loading pets...</p>';
    if (feedbackContainer)
        feedbackContainer.innerHTML = '<p class="loader">Loading feedback...</p>';
    // --- შესწორება: ტოკენის წამოღება და ჰედერებში ჩამატება ---
    const token = localStorage.getItem('userToken');
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    if (token && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
    }
    try {
        const [petsRes, feedbackRes] = await Promise.all([
            fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets', { headers }),
            fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/feedback', { headers })
        ]);
        // თუ ავტორიზაციით ერორს აგდებს (მაგ. 401), ვცადოთ ხელახლა ტოკენის გარეშე
        let petsData;
        let feedbackData;
        if (!petsRes.ok) {
            console.warn("ავტორიზებული რექვესტი ჩავარდა, ვცდილობთ საჯაროდ...");
            const publicPetsRes = await fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/pets');
            petsData = await publicPetsRes.json();
        }
        else {
            petsData = await petsRes.json();
        }
        if (!feedbackRes.ok) {
            const publicFeedbackRes = await fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/feedback');
            feedbackData = await publicFeedbackRes.json();
        }
        else {
            feedbackData = await feedbackRes.json();
        }
        allPets = petsData.data;
        allFeedbacks = feedbackData.data;
        // პოპაპის სელექტის შევსება
        const petSelect = document.getElementById('pet-select');
        if (petSelect && allPets) {
            petSelect.innerHTML = '<option value="" disabled selected>Choose your favourite</option>';
            allPets.forEach(pet => {
                const option = document.createElement('option');
                option.value = String(pet.id);
                option.textContent = pet.name;
                petSelect.appendChild(option);
            });
            console.log("სელექტი შეივსო წარმატებით");
        }
        if (petsContainer) {
            renderPets(allPets, petsContainer);
        }
        renderTestimonials();
        setupPagination();
        setupSliderControls();
        console.log("მონაცემები წარმატებით წამოვიდა სერვერიდან");
    }
    catch (error) {
        console.error("Error fetching data:", error);
        const errorMsg = 'Something went wrong. Please, refresh the page';
        if (petsContainer)
            petsContainer.innerHTML = `<p class="error">${errorMsg}</p>`;
        if (feedbackContainer)
            feedbackContainer.innerHTML = `<p class="error">${errorMsg}</p>`;
    }
}
// დანარჩენი ფუნქციები (renderPets, renderTestimonials და ა.შ.) უცვლელია
function renderPets(pets, container) {
    if (!container || pets.length === 0)
        return;
    const displayPets = pets.slice(currentPetIndex, currentPetIndex + 28);
    container.innerHTML = displayPets
        .filter(pet => !!pet)
        .map(pet => `
            <div class="card">
                <div class="card-lable"><span>${pet.name}</span></div>
                <img src="../../assets/images/${pet.id}.webp" alt="${pet.name}" 
                    onerror="
                        const id = '${pet.id}';
                        const path = '../../assets/images/';
                        const formats = ['.WEBP', '.png', '.PNG', '.jpg', '.JPG', '.jpeg'];
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
                    <a href="#">VIEW LIVE CAM <img src="../../assets/icons/Union2.svg" alt="arrow-logo" /></a>
                </div>
            </div>
        `).join('');
}
function renderTestimonials() {
    const container = document.getElementById('cards-container');
    if (!container || allFeedbacks.length === 0)
        return;
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
function setupSliderControls() {
    const nextPetBtn = document.getElementById('next-pet');
    const prevPetBtn = document.getElementById('prev-pet');
    nextPetBtn?.addEventListener('click', () => {
        currentPetIndex = (currentPetIndex + 1) % allPets.length;
        const petsContainer = document.getElementById('pets-container');
        if (petsContainer)
            renderPets(allPets, petsContainer);
    });
    prevPetBtn?.addEventListener('click', () => {
        currentPetIndex = (currentPetIndex - 1 + allPets.length) % allPets.length;
        const petsContainer = document.getElementById('pets-container');
        if (petsContainer)
            renderPets(allPets, petsContainer);
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
function updateDots() {
    const dots = document.querySelectorAll('.pagination-dots .dot');
    dots.forEach((dot, index) => {
        if (index === currentFeedbackPage)
            dot.classList.add('active');
        else
            dot.classList.remove('active');
    });
}
function setupPagination() {
    const dots = document.querySelectorAll('.pagination-dots .dot');
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const target = e.currentTarget;
            currentFeedbackPage = parseInt(target.dataset.index || '0');
            renderTestimonials();
        });
    });
}
document.addEventListener('DOMContentLoaded', loadLandingData);
// ლოგინის ლოგიკა
const userIcon = document.getElementById('user-icon');
const userPopup = document.getElementById('user-popup');
const unauthLinks = document.getElementById('unauthorized-links');
const authInfo = document.getElementById('authorized-info');
const displayName = document.getElementById('user-display-name');
const displayEmail = document.getElementById('user-display-email');
const logoutBtn = document.getElementById('logout-btn');
const checkAuthStatus = () => {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    if (userName && userName !== 'undefined') {
        unauthLinks.classList.add('hidden');
        authInfo.classList.remove('hidden');
        displayName.textContent = userName;
        if (displayEmail && userEmail && userEmail !== 'undefined')
            displayEmail.textContent = userEmail;
    }
    else {
        unauthLinks.classList.remove('hidden');
        authInfo.classList.add('hidden');
    }
};
const validateToken = async () => {
    const token = localStorage.getItem('userToken');
    if (!token)
        return;
    try {
        const response = await fetch('https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod/auth/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const result = await response.json();
            const nameFromServer = result.data.name;
            const emailFromServer = result.data.email;
            if (nameFromServer) {
                localStorage.setItem('userName', nameFromServer);
                if (emailFromServer)
                    localStorage.setItem('userEmail', emailFromServer);
                checkAuthStatus();
            }
        }
        else if (response.status === 401) {
            logoutBtn.click();
        }
    }
    catch (error) {
        console.error('Token validation failed:', error);
    }
};
userIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    userPopup.classList.toggle('hidden');
    checkAuthStatus();
});
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userToken');
    localStorage.removeItem('isLoggedIn');
    window.location.reload();
});
document.addEventListener('click', (e) => {
    const target = e.target;
    if (userPopup && !userPopup.contains(target) && target !== userIcon)
        userPopup.classList.add('hidden');
});
checkAuthStatus();
validateToken();
// --- Step 1 ვალიდაცია ---
const nextBtn1 = document.getElementById('next1');
const otherAmountInput = document.getElementById('otherAmountInput');
const petSelect = document.getElementById('pet-select');
const amountButtons = document.querySelectorAll('.amt');
let selectedAmount = null;
const validateStep1 = () => {
    const isPetSelected = petSelect && petSelect.value !== "";
    const isAmountSelected = (selectedAmount !== null) || (otherAmountInput && otherAmountInput.value.trim() !== "");
    if (nextBtn1) {
        if (isPetSelected && isAmountSelected) {
            nextBtn1.disabled = false;
            nextBtn1.style.opacity = "1";
            nextBtn1.style.cursor = "pointer";
        }
        else {
            nextBtn1.disabled = true;
            nextBtn1.style.opacity = "0.5";
            nextBtn1.style.cursor = "not-allowed";
        }
    }
};
amountButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        amountButtons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedAmount = btn.getAttribute('data-amt');
        if (otherAmountInput)
            otherAmountInput.value = "";
        validateStep1();
    });
});
otherAmountInput?.addEventListener('input', () => {
    if (otherAmountInput.value.trim() !== "") {
        selectedAmount = null;
        amountButtons.forEach(b => b.classList.remove('selected'));
    }
    validateStep1();
});
petSelect?.addEventListener('change', validateStep1);
if (nextBtn1) {
    nextBtn1.disabled = true;
    nextBtn1.style.opacity = "0.5";
}
// სტეპ 2 ის დამატება 
// --- Step 2-ის ვალიდაციის ლოგიკა ---
// step 3
// ვალიდაცია
document.addEventListener("DOMContentLoaded", () => {
    const cardNumberInput = document.getElementById("cardNumber");
    const cvvInput = document.getElementById("cvvNumber");
    const expMonthSelect = document.getElementById("expMonth");
    const expYearSelect = document.getElementById("expYear");
    const completeButton = document.getElementById("complete");
    if (!cardNumberInput ||
        !cvvInput ||
        !expMonthSelect ||
        !expYearSelect ||
        !completeButton) {
        return;
    }
    completeButton.disabled = true;
    const getCardDigits = () => {
        return cardNumberInput.value.replace(/\D/g, "");
    };
    const validateCardNumber = () => {
        return /^\d{16}$/.test(getCardDigits());
    };
    const validateCVV = () => {
        return /^\d{3}$/.test(cvvInput.value.trim());
    };
    const validateExpirationDate = () => {
        const month = expMonthSelect.value;
        const year = expYearSelect.value;
        if (!month || !year)
            return false;
        if (!/^(0[1-9]|1[0-2])$/.test(month))
            return false;
        if (!/^\d{2}$/.test(year))
            return false;
        const fullYear = 2000 + Number(year);
        // არჩეული თვის ბოლო დღე
        const expirationDate = new Date(fullYear, Number(month), 0, 23, 59, 59, 999);
        const now = new Date();
        return expirationDate.getTime() > now.getTime();
    };
    const validateStep3 = () => {
        return validateCardNumber() && validateCVV() && validateExpirationDate();
    };
    const updateCompleteButtonState = () => {
        completeButton.disabled = !validateStep3();
    };
    const showError = (element, message) => {
        element.style.borderColor = "#e74c3c";
        const parent = element.parentElement;
        if (!parent)
            return;
        let errorEl = parent.querySelector(".validation-error");
        if (!errorEl) {
            errorEl = document.createElement("div");
            errorEl.className = "validation-error";
            errorEl.style.color = "#e74c3c";
            errorEl.style.fontSize = "12px";
            errorEl.style.marginTop = "6px";
            parent.appendChild(errorEl);
        }
        errorEl.textContent = message;
    };
    const clearError = (element) => {
        element.style.borderColor = "";
        const parent = element.parentElement;
        if (!parent)
            return;
        const errorEl = parent.querySelector(".validation-error");
        if (errorEl) {
            errorEl.remove();
        }
    };
    const validateCardNumberWithError = () => {
        if (cardNumberInput.value.trim() === "") {
            clearError(cardNumberInput);
            return;
        }
        if (!validateCardNumber()) {
            showError(cardNumberInput, "Card number must be exactly 16 digits.");
        }
        else {
            clearError(cardNumberInput);
        }
    };
    const validateCVVWithError = () => {
        if (cvvInput.value.trim() === "") {
            clearError(cvvInput);
            return;
        }
        if (!validateCVV()) {
            showError(cvvInput, "CVV must be exactly 3 digits.");
        }
        else {
            clearError(cvvInput);
        }
    };
    const validateExpirationWithError = () => {
        if (!expMonthSelect.value || !expYearSelect.value) {
            clearError(expYearSelect);
            expMonthSelect.style.borderColor = "";
            expYearSelect.style.borderColor = "";
            return;
        }
        if (!validateExpirationDate()) {
            expMonthSelect.style.borderColor = "#e74c3c";
            expYearSelect.style.borderColor = "#e74c3c";
            showError(expYearSelect, "Expiration date must be a valid future date.");
        }
        else {
            expMonthSelect.style.borderColor = "";
            expYearSelect.style.borderColor = "";
            clearError(expYearSelect);
        }
    };
    // Card number: მხოლოდ ციფრები + მაქს 16
    cardNumberInput.addEventListener("input", () => {
        const digits = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
        cardNumberInput.value = digits.replace(/(.{4})/g, "$1 ").trim();
        validateCardNumberWithError();
        updateCompleteButtonState();
    });
    // CVV: მხოლოდ ციფრები + მაქს 3
    cvvInput.addEventListener("input", () => {
        cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 3);
        validateCVVWithError();
        updateCompleteButtonState();
    });
    expMonthSelect.addEventListener("change", () => {
        validateExpirationWithError();
        updateCompleteButtonState();
    });
    expYearSelect.addEventListener("change", () => {
        validateExpirationWithError();
        updateCompleteButtonState();
    });
    cardNumberInput.addEventListener("blur", validateCardNumberWithError);
    cvvInput.addEventListener("blur", validateCVVWithError);
    expMonthSelect.addEventListener("blur", validateExpirationWithError);
    expYearSelect.addEventListener("blur", validateExpirationWithError);
    updateCompleteButtonState();
});
export {};
//# sourceMappingURL=index.js.map