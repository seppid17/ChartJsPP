let submitBtn = document.getElementById('submitBtn');
let passwdInput = document.getElementById('password');
let cnfPasswdInput = document.getElementById('cnfPassword');

passwdInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.password_pattern, cnfPasswdInput, 'Invalid Password');
}
cnfPasswdInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.password_pattern, null, 'Invalid Password', submitBtn);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let passwd = passwdInput.value.trim();
    let cnfPasswd = cnfPasswdInput.value.trim();

    FormUtils.setClear(passwdInput);
    FormUtils.setClear(cnfPasswdInput);

    if (FormUtils.isEmpty(passwd)) {
        FormUtils.setErrorFor(passwdInput, "Password cannot be empty");
        return;
    }
    if (!FormUtils.password_pattern.test(passwd)) {
        FormUtils.setErrorFor(passwdInput, "Invalid password");
        return;
    }
    if (FormUtils.isEmpty(cnfPasswd)) {
        FormUtils.setErrorFor(cnfPasswdInput, "Password cannot be empty");
        return;
    }
    if (passwd !== cnfPasswd) {
        FormUtils.setErrorFor(cnfPasswdInput, "Passwords doesn't match");
        return;
    }

    Loader.show();
    
    let xhrSender = new XHRSender();
    xhrSender.addField('password', passwd);
    xhrSender.send(document.URL, function (xhr) {
        Loader.hide();
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    if (data.hasOwnProperty('field')) {
                        switch (data['field']) {
                            case 'password':
                                FormUtils.setErrorFor(passwdInput, data['reason']);
                                break;
                        }
                    } else {
                        PopupMessage.showFailure(data['reason']);
                    }
                } else {
                    PopupMessage.showFailure('Password reset failed!');
                }
                return;
            }
            PopupMessage.showSuccess('Account password reset successfull.', () => {
                window.location = '/login';
            });
        } catch (error) {
            PopupMessage.showFailure('Something went wrong! Please try again.');
        }
    });
}

document.body.onload = function (e) {
    passwdInput.focus();
}