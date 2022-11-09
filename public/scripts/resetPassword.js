let submitBtn = document.getElementById('submitBtn');
let passwdInput = document.getElementById('password');
let cnfPasswdInput = document.getElementById('cnfPassword');

passwdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, cnfPasswdInput);
}
cnfPasswdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, null, submitBtn);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let passwd = passwdInput.value.trim();
    let cnfPasswd = cnfPasswdInput.value.trim();

    setClear(passwdInput);
    setClear(cnfPasswdInput);

    if (isEmpty(passwd)) {
        setErrorFor(passwdInput, "Password cannot be empty");
        return;
    }
    if (!password_pattern.test(passwd)) {
        setErrorFor(passwdInput, "Invalid password");
        return;
    }
    if (isEmpty(cnfPasswd)) {
        setErrorFor(cnfPasswdInput, "Password cannot be empty");
        return;
    }
    if (passwd !== cnfPasswd) {
        setErrorFor(cnfPasswdInput, "Passwords doesn't match");
        return;
    }
    let xhrSender = new XHRSender();
    xhrSender.addField('password', passwd);
    xhrSender.send(document.URL, function (xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    if (data.hasOwnProperty('field')) {
                        switch (data['field']) {
                            case 'password':
                                setErrorFor(passwdInput, data['reason']);
                                break;
                        }
                    } else {
                        showFailure(data['reason']);
                    }
                } else {
                    showFailure('Password reset failed!');
                }
                return;
            }
            showSuccess('Account password reset successfull.', () => {
                window.location = '/login';
            });
        } catch (error) {
            showFailure('Something went wrong! Please try again.');
        }
    });
}

document.body.onload = function (e) {
    passwdInput.focus();
}