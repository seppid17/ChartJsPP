let submitBtn = document.getElementById('submitBtn');
let emailInput = document.getElementById('email');
let firstNameInput = document.getElementById('firstName');
let lastNameInput = document.getElementById('lastName');
let passwdInput = document.getElementById('password');
let cnfpasswdInput = document.getElementById('cnfPassword');

emailInput.onkeydown = event => {
    keyPressFn(event, email_pattern, firstNameInput);
}
firstNameInput.onkeydown = event => {
    keyPressFn(event, name_pattern, lastNameInput);
}
lastNameInput.onkeydown = event => {
    keyPressFn(event, name_pattern, passwdInput);
}
passwdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, cnfpasswdInput);
}
cnfpasswdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, null, submitBtn);
}

/**
 * Shows a success or error message to user.
 * 
 * If success is true, shows a success message. Otherwise, shows an error message
 */
function showMsg(msg, success = false) {
    alert(msg);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let email = emailInput.value;
    let firstName = firstNameInput.value;
    let lastName = lastNameInput.value;
    let passwd = passwdInput.value;
    let cnfpasswd = cnfpasswdInput.value;
    if (isEmpty(email) || isEmpty(firstName) || isEmpty(lastName) || isEmpty(passwd) || isEmpty(cnfpasswd)) {
        showMsg("Some required fields are empty");
        return;
    }
    if (!email_pattern.test(email)) {
        showMsg("Invalid email");
        return;
    }
    if (!name_pattern.test(firstName)) {
        showMsg("Invalid email");
        return;
    }
    if (!name_pattern.test(lastName)) {
        showMsg("Invalid email");
        return;
    }
    if (!password_pattern.test(passwd)) {
        showMsg("Invalid password");
        return;
    }
    if (passwd !== cnfpasswd) {
        showMsg("Passwords doesn't match");
        return;
    }
    let xhrSender = new XHRSender();
    xhrSender.addField('email', email);
    xhrSender.addField('firstName', firstName);
    xhrSender.addField('lastName', lastName);
    xhrSender.addField('password', passwd);
    xhrSender.send(document.URL, function (xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    showMsg(data['reason']);
                } else {
                    showMsg('Account creation failed!');
                }
                return;
            }
            showMsg('Account created. You will receive an account activation link to your email', true);
        } catch (error) {
            showMsg('Something went wrong! Please try again.');
        }
    });
}