let submitBtn = document.getElementById('submitBtn');
let emailInput = document.getElementById('email');
let firstNameInput = document.getElementById('firstName');
let lastNameInput = document.getElementById('lastName');
let passwdInput = document.getElementById('password');
let cnfpasswdInput = document.getElementById('cnfPassword');

let overlayLoader = document.getElementById("overlayLoader");
let loader = document.getElementById("loader");

emailInput.onkeydown = event => {
    keyPressFn(event, email_pattern, firstNameInput, 'Invalid email');
}
firstNameInput.onkeydown = event => {
    keyPressFn(event, name_pattern, lastNameInput, 'Invalid name');
}
lastNameInput.onkeydown = event => {
    keyPressFn(event, name_pattern, passwdInput, 'Invalid name');
}
passwdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, cnfpasswdInput, 'Invalid password');
}
cnfpasswdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, null, 'Invalid password', submitBtn);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let email = emailInput.value.trim();
    let firstName = firstNameInput.value.trim();
    let lastName = lastNameInput.value.trim();
    let passwd = passwdInput.value.trim();
    let cnfpasswd = cnfpasswdInput.value.trim();

    setClear(emailInput);
    setClear(firstNameInput);
    setClear(lastNameInput);
    setClear(passwdInput);
    setClear(cnfpasswdInput);

    if (isEmpty(email)) {
        setErrorFor(emailInput, "Email cannot be empty");
        return;
    }

    if (!email_pattern.test(email)) {
        setErrorFor(emailInput, "Invalid email format");
        return;
    }

    if (isEmpty(firstName)) {
        setErrorFor(firstNameInput, "Name cannot be empty");
        return;
    }

    if (!name_pattern.test(firstName)) {
        setErrorFor(firstNameInput, "Invalid name format");
        return;
    }

    if (isEmpty(lastName)) {
        setErrorFor(lastNameInput, "Name cannot be empty");
        return;
    }

    if (!name_pattern.test(lastName)) {
        setErrorFor(lastNameInput, "Invalid name format");
        return;
    }

    if (isEmpty(passwd)) {
        setErrorFor(passwdInput, "Password cannot be empty");
        return;
    }

    if (!password_pattern.test(passwd)) {
        setErrorFor(passwdInput, "Invalid password format");
        return;
    }

    if (isEmpty(cnfpasswd)) {
        setErrorFor(cnfpasswdInput, "Password cannot be empty");
        return;
    }

    if (passwd !== cnfpasswd) {
        setErrorFor(cnfpasswdInput, "Passwords doesn't match");
        return;
    }

    getLoader('block');

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
                    if (data.hasOwnProperty('field')) {
                        switch (data['field']) {
                            case 'email':
                                setErrorFor(emailInput, data['reason']);
                                getLoader('none');
                                break;
                            case 'firstname':
                                setErrorFor(firstNameInput, data['reason']);
                                getLoader('none');
                                break;
                            case 'lastname':
                                setErrorFor(lastNameInput, data['reason']);
                                getLoader('none');
                                break;
                            case 'password':
                                setErrorFor(passwdInput, data['reason']);
                                getLoader('none');
                                break;
                        }
                    } else {
                        showFailure(data['reason']);
                    }
                } else {
                    showFailure('Account creation failed!');
                }
                getLoader('none');
                return;
            }
            showSuccess('Account created. Check your email.');
        } catch (error) {
            showFailure('Something went wrong! Try again.');
        }
        getLoader('none');
    });

}

document.body.onload = function (e) {
    emailInput.focus();
}

function getLoader(type) { // type = 'block' or 'none'
    overlayLoader.style.display = type;
    loader.style.display = type;
}