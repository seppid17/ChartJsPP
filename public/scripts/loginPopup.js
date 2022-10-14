function popupLogin(onlogin) {
    var overlay = document.getElementById("loginOverlay");
    var popup = document.getElementById("loginPopup");
    var submitBtn = document.getElementById('login');
    var emailInput = document.getElementById('email');
    var passwdInput = document.getElementById('password');

    overlay.style.display = 'block';
    popup.style.display = 'block';

    overlay.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
        passwdInput.value = '';
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }

    popup.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
    }

    emailInput.onkeydown = event => {
        keyPressFn(event, email_pattern, passwdInput, null, 'Invalid email');
    }

    passwdInput.onkeydown = event => {
        keyPressFn(event, password_pattern, null, submitBtn, 'Invalid Password');
    }

    submitBtn.onclick = e => {
        e.preventDefault();
        let email = emailInput.value.trim();
        let passwd = passwdInput.value.trim();

        setClear(emailInput);
        setClear(passwdInput);

        if (isEmpty(email)) {
            setErrorFor(emailInput, 'Email cannot be empty');
            return false;
        }
        if (!email_pattern.test(email)) {
            setErrorFor(emailInput, 'Invalid email');
            return false;
        }
        if (isEmpty(passwd)) {
            setErrorFor(passwdInput, 'Password cannot be empty');
            return false;
        }
        if (!password_pattern.test(passwd)) {
            setErrorFor(passwdInput, 'Invalid Password');
            return false;
        }

        let xhrSender = new XHRSender();
        xhrSender.addField('email', email);
        xhrSender.addField('password', passwd);
        xhrSender.send('/login', function (xhr) {
            try {
                let data = JSON.parse(xhr.responseText);
                if (!data.hasOwnProperty('success') || data['success'] !== true) {
                    if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                        if (data.hasOwnProperty('field')) {
                            switch (data['field']) {
                                case 'email':
                                    setErrorFor(emailInput, data['reason']);
                                    break;
                                case 'password':
                                    setErrorFor(passwdInput, data['reason']);
                                    break;
                            }
                        } else {
                            showMsg(data['reason']);
                        }
                    } else {
                        showMsg('Login failed!');
                    }
                    return;
                }
                passwdInput.value = '';
                onlogin();
                popup.style.display = 'none';
                overlay.style.display = 'none';
            } catch (error) {
                showMsg('Something went wrong! Try again.');
            }
        });
    }

    emailInput.focus();
}