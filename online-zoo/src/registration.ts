interface ValidationResult {
    isValid: boolean;
    message: string;
}


const REGEX = {
    NAME: /^[a-zA-Z\s]{3,}$/, 
    LOGIN: /^[a-zA-Z][a-zA-Z0-9]{2,}$/, 
    PASSWORD: /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/ 
};


const form = document.getElementById('reg-form') as HTMLFormElement;
const nameInput = document.getElementById('reg-name') as HTMLInputElement;
const loginInput = document.getElementById('reg-login') as HTMLInputElement;
const passInput = document.getElementById('reg-password') as HTMLInputElement;
const confirmInput = document.getElementById('reg-confirm') as HTMLInputElement;
const regBtn = document.getElementById('reg-btn') as HTMLButtonElement;


const validateField = (input: HTMLInputElement, errorId: string, regex: RegExp, errorMsg: string): boolean => {
    const errorSpan = document.getElementById(errorId) as HTMLElement;
    const isValid = regex.test(input.value);

    if (!isValid) {
        input.classList.add('invalid');
        errorSpan.textContent = errorMsg;
    } else {
        input.classList.remove('invalid');
        errorSpan.textContent = '';
    }
    checkFormValidity();
    return isValid;
};


const validateConfirmPass = (): boolean => {
    const errorSpan = document.getElementById('confirm-error') as HTMLElement;
    const isMatch = passInput.value === confirmInput.value && confirmInput.value !== '';
    
    if (!isMatch) {
        confirmInput.classList.add('invalid');
        errorSpan.textContent = 'Passwords do not match';
    } else {
        confirmInput.classList.remove('invalid');
        errorSpan.textContent = '';
    }
    checkFormValidity();
    return isMatch;
};


const checkFormValidity = (): void => {
    const isFormValid = 
        REGEX.NAME.test(nameInput.value) &&
        REGEX.LOGIN.test(loginInput.value) &&
        REGEX.PASSWORD.test(passInput.value) &&
        passInput.value === confirmInput.value;

    regBtn.disabled = !isFormValid;
};


[
    { input: nameInput, err: 'name-error', reg: REGEX.NAME, msg: 'Min 3 letters required' },
    { input: loginInput, err: 'login-error', reg: REGEX.LOGIN, msg: 'Start with letter, min 3 chars' },
    { input: passInput, err: 'pass-error', reg: REGEX.PASSWORD, msg: 'Min 6 chars + 1 special char' }
].forEach(item => {
    item.input.addEventListener('blur', () => validateField(item.input, item.err, item.reg, item.msg));
    item.input.addEventListener('focus', () => {
        item.input.classList.remove('invalid');
        (document.getElementById(item.err) as HTMLElement).textContent = '';
    });
});

confirmInput.addEventListener('blur', validateConfirmPass);
confirmInput.addEventListener('focus', () => {
    confirmInput.classList.remove('invalid');
    (document.getElementById('confirm-error') as HTMLElement).textContent = '';
});


form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    
    console.log('Registering user...');
});