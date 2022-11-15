let submitBtn = document.getElementById('submit');
let emailInput = document.getElementById('email');
let passwdInput = document.getElementById('password');

emailInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.email_pattern, passwdInput, 'Invalid email');
}

passwdInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.password_pattern, null, 'Invalid Password', submitBtn);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let email = emailInput.value.trim();
    let passwd = passwdInput.value.trim();

    FormUtils.setClear(emailInput);
    FormUtils.setClear(passwdInput);

    if (FormUtils.isEmpty(email)) {
        FormUtils.setErrorFor(emailInput, 'Email cannot be empty');
        return false;
    }
    if (!FormUtils.email_pattern.test(email)) {
        FormUtils.setErrorFor(emailInput, 'Invalid email');
        return false;
    }
    if (FormUtils.isEmpty(passwd)) {
        FormUtils.setErrorFor(passwdInput, 'Password cannot be empty');
        return false;
    }
    if (!FormUtils.password_pattern.test(passwd)) {
        FormUtils.setErrorFor(passwdInput, 'Invalid Password');
        return false;
    }

    Loader.show();

    let xhrSender = new XHRSender();
    xhrSender.addField('email', email);
    xhrSender.addField('password', passwd);
    xhrSender.send('/login', function (xhr) {
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
                            case 'password':
                                FormUtils.setErrorFor(passwdInput, data['reason']);
                                break;
                        }
                    } else {
                        PopupMessage.showFailure(data['reason'], false, () => {
                            passwdInput.value = '';
                        });
                    }
                } else {
                    PopupMessage.showFailure('Login failed!', false, () => {
                        passwdInput.value = '';
                    });
                }
                return;
            }
            let target = '/dashboard';
            if (data.hasOwnProperty('target') && typeof (data['target']) === "string") {
                target = data['target'];
            }
            window.location = target;
        } catch (error) {
            PopupMessage.showFailure('Something went wrong! Try again.', false, () => {
                passwdInput.value = '';
            });
        }
    });
}

document.body.onload = function (e) {
    emailInput.focus();
}