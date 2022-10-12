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
                                break;
                            case 'firstname':
                                setErrorFor(firstNameInput, data['reason']);
                                break;
                            case 'lastname':
                                setErrorFor(lastNameInput, data['reason']);
                                break;
                            case 'password':
                                setErrorFor(passwdInput, data['reason']);
                                break;
                        }
                    } else {
                        showMsg(data['reason']);
                    }
                } else {
                    showMsg('Account creation failed!');
                }
                return;
            }
            showMsg('Account created. Check your email.', true);
        } catch (error) {
            showMsg('Something went wrong! Try again.');
        }
    });
}