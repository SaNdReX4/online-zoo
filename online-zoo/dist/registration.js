const BASE_URL = 'https://vsqsnqnxkh.execute-api.eu-central-1.amazonaws.com/prod';
const REGEX = {
    NAME: /^[a-zA-Z\s]{3,}$/,
    LOGIN: /^[a-zA-Z][a-zA-Z0-9]{2,}$/,
    PASSWORD: /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};
const form = document.getElementById('reg-form');
const nameInput = document.getElementById('reg-name');
const emailInput = document.getElementById('reg-email');
const loginInput = document.getElementById('reg-login');
const passInput = document.getElementById('reg-password');
const confirmInput = document.getElementById('reg-confirm');
const regBtn = document.getElementById('reg-btn');
// ვალიდაციის ფუნქცია - გასწორებული
const validateField = (input, errorId, regex, errorMsg) => {
    const errorSpan = document.getElementById(errorId);
    const isValid = regex.test(input.value);
    // თუ არ არის ვალიდური (მათ შორის ცარიელიც), აჩვენოს ერორი
    if (!isValid) {
        input.classList.add('invalid');
        if (errorSpan)
            errorSpan.textContent = errorMsg;
    }
    else {
        input.classList.remove('invalid');
        if (errorSpan)
            errorSpan.textContent = '';
    }
    checkFormValidity();
    return isValid;
};
// პაროლების შედარება - გასწორებული
const validateConfirmPass = () => {
    const errorSpan = document.getElementById('confirm-error');
    const isMatch = passInput.value === confirmInput.value && confirmInput.value !== '';
    if (!isMatch) {
        confirmInput.classList.add('invalid');
        if (errorSpan)
            errorSpan.textContent = 'Passwords do not match';
    }
    else {
        confirmInput.classList.remove('invalid');
        if (errorSpan)
            errorSpan.textContent = '';
    }
    checkFormValidity();
    return isMatch;
};
const checkFormValidity = () => {
    const isFormValid = REGEX.NAME.test(nameInput.value) &&
        REGEX.EMAIL.test(emailInput.value) &&
        REGEX.LOGIN.test(loginInput.value) &&
        REGEX.PASSWORD.test(passInput.value) &&
        passInput.value === confirmInput.value;
    regBtn.disabled = !isFormValid;
};
// ივენთების მიბმა
[
    { input: nameInput, err: 'name-error', reg: REGEX.NAME, msg: 'Min 3 letters required (english only)' },
    { input: emailInput, err: 'email-error', reg: REGEX.EMAIL, msg: 'Enter a valid email address' },
    { input: loginInput, err: 'login-error', reg: REGEX.LOGIN, msg: 'Start with letter, min 3 chars (english only)' },
    { input: passInput, err: 'pass-error', reg: REGEX.PASSWORD, msg: 'Min 6 chars + 1 special char (!@#$%^&*)' }
].forEach(item => {
    // ველზე დაჭერისას (focus) და წერისას (input) ერორს ვმალავთ, ველიდან გამოსვლისას (blur) ვამოწმებთ
    item.input.addEventListener('blur', () => validateField(item.input, item.err, item.reg, item.msg));
    item.input.addEventListener('input', () => {
        // რეალურ დროშიც ვამოწმებთ, რომ წითელი ხაზი გაქრეს თუ გასწორდა
        if (item.input.classList.contains('invalid')) {
            validateField(item.input, item.err, item.reg, item.msg);
        }
        checkFormValidity();
    });
});
confirmInput.addEventListener('blur', validateConfirmPass);
confirmInput.addEventListener('input', validateConfirmPass);
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    regBtn.disabled = true;
    regBtn.textContent = 'Registering...';
    const userData = {
        name: nameInput.value,
        login: loginInput.value,
        email: emailInput.value,
        password: passInput.value
    };
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (response.status === 201) {
            alert('Registration successful!');
            window.location.href = '../login/index.html';
        }
        else if (response.status === 409) {
            // სპეციალური შეტყობინება დუბლიკატზე
            alert('Error: User with this login or email already exists.');
        }
        else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Something went wrong'}`);
        }
    }
    catch (error) {
        console.error('Error:', error);
        alert('Connection error. Please try again.');
    }
    finally {
        regBtn.disabled = false;
        regBtn.textContent = 'Registration';
    }
});
export {};
//# sourceMappingURL=registration.js.map