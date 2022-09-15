let form = document.getElementById('loginForm');
let submitBtn = document.getElementById('submit');
let emailInput = document.getElementById('email');
let passwdInput = document.getElementById('password');

emailInput.onkeydown = event => {
    keyPressFn(event, email_pattern, passwdInput);
}
passwdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, null, submitBtn);
}

/**
 * Shows a success or error message to user.
 * 
 * If success is true, shows a success message. Otherwise, shows an error message
 */
// function showMsg(msg, success = false) {
//     alert(msg);
// }

function checkInputs() {
    // e.preventDefault();
    let email = emailInput.value;
    let passwd = passwdInput.value;

    setClear(emailInput);
    setClear(passwdInput);

    if (isEmpty(email)) {
        setErrorFor(emailInput, 'Email cannot be empty');
        // showMsg("Email cannot be empty");
        return false;
    }
    if (!email_pattern.test(email)) {
        setErrorFor(emailInput, 'Invalid email');
        // showMsg("Invalid email");
        return false;
    }
    if (isEmpty(passwd)) {
        setErrorFor(passwdInput, 'Password cannot be empty');
        // showMsg("Password cannot be empty");
        return false;
    }
    if (!password_pattern.test(passwd)) {
        setErrorFor(passwdInput, 'Invalid Password');
        // showMsg("Invalid password");
        return false;
    }

    return true
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control form-outline form-input error';
    small.innerText = message;
}

function setClear(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control form-outline form-input';
}