let submitBtn = document.getElementById('submitBtn');
let emailInput = document.getElementById('email');
let firstNameInput = document.getElementById('firstName');
let lastNameInput = document.getElementById('lastName');
let passwdInput = document.getElementById('password');
let cnfpasswdInput = document.getElementById('cnfPassword');

emailInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.email_pattern, firstNameInput, 'Invalid email');
}
firstNameInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.name_pattern, lastNameInput, 'Invalid name');
}
lastNameInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.name_pattern, passwdInput, 'Invalid name');
}
passwdInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.password_pattern, cnfpasswdInput, 'Invalid password');
}
cnfpasswdInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.password_pattern, null, 'Invalid password', submitBtn);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let email = emailInput.value.trim();
    let firstName = firstNameInput.value.trim();
    let lastName = lastNameInput.value.trim();
    let passwd = passwdInput.value.trim();
    let cnfpasswd = cnfpasswdInput.value.trim();

    FormUtils.setClear(emailInput);
    FormUtils.setClear(firstNameInput);
    FormUtils.setClear(lastNameInput);
    FormUtils.setClear(passwdInput);
    FormUtils.setClear(cnfpasswdInput);

    if (FormUtils.isEmpty(email)) {
        FormUtils.setErrorFor(emailInput, "Email cannot be empty");
        return;
    }

    if (!FormUtils.email_pattern.test(email)) {
        FormUtils.setErrorFor(emailInput, "Invalid email format");
        return;
    }

    if (FormUtils.isEmpty(firstName)) {
        FormUtils.setErrorFor(firstNameInput, "Name cannot be empty");
        return;
    }

    if (!FormUtils.name_pattern.test(firstName)) {
        FormUtils.setErrorFor(firstNameInput, "Invalid name format");
        return;
    }

    if (FormUtils.isEmpty(lastName)) {
        FormUtils.setErrorFor(lastNameInput, "Name cannot be empty");
        return;
    }

    if (!FormUtils.name_pattern.test(lastName)) {
        FormUtils.setErrorFor(lastNameInput, "Invalid name format");
        return;
    }

    if (FormUtils.isEmpty(passwd)) {
        FormUtils.setErrorFor(passwdInput, "Password cannot be empty");
        return;
    }

    if (!FormUtils.password_pattern.test(passwd)) {
        FormUtils.setErrorFor(passwdInput, "Invalid password format");
        return;
    }

    if (FormUtils.isEmpty(cnfpasswd)) {
        FormUtils.setErrorFor(cnfpasswdInput, "Password cannot be empty");
        return;
    }

    if (passwd !== cnfpasswd) {
        FormUtils.setErrorFor(cnfpasswdInput, "Passwords doesn't match");
        return;
    }

    Loader.show();

    let xhrSender = new XHRSender();
    xhrSender.addField('email', email);
    xhrSender.addField('firstName', firstName);
    xhrSender.addField('lastName', lastName);
    xhrSender.addField('password', passwd);
    xhrSender.send(document.URL, function (xhr) {
        Loader.hide();
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    if (data.hasOwnProperty('field')) {
                        switch (data['field']) {
                            case 'email':
                                FormUtils.setErrorFor(emailInput, data['reason']);
                                break;
                            case 'firstname':
                                FormUtils.setErrorFor(firstNameInput, data['reason']);
                                break;
                            case 'lastname':
                                FormUtils.setErrorFor(lastNameInput, data['reason']);
                                break;
                            case 'password':
                                FormUtils.setErrorFor(passwdInput, data['reason']);
                                break;
                        }
                    } else {
                        PopupMessage.showFailure(data['reason']);
                    }
                } else {
                    PopupMessage.showFailure('Account creation failed!');
                }
                return;
            }
            PopupMessage.showSuccess('Account created. Check your email.');
        } catch (error) {
            PopupMessage.showFailure('Something went wrong! Try again.');
        }
    });

}

document.body.onload = function (e) {
    emailInput.focus();
}