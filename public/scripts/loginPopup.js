function popupLogin(ondone) {
    Loader.hide();
    var overlay = document.getElementById("loginOverlay");
    var popup = document.getElementById("loginPopup");
    var submitBtn = document.getElementById('login');
    var emailInput = document.getElementById('email');
    var passwdInput = document.getElementById('password');

    let isChartPage = typeof chartKeyListener != 'undefined';
    if (isChartPage) document.removeEventListener('keydown', chartKeyListener);

    overlay.style.display = 'block';
    popup.style.display = 'block';

    let closePopup = () => {
        if (isChartPage) document.addEventListener('keydown', chartKeyListener);
        passwdInput.value = '';
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }

    overlay.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
        closePopup();
        ondone(false);
    }

    popup.onclick = e => {
        e.stopPropagation();
    }

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
                                    FormUtils.setErrorFor(emailInput, data['reason']);
                                    break;
                                case 'password':
                                    FormUtils.setErrorFor(passwdInput, data['reason']);
                                    break;
                            }
                        } else {
                            PopupMessage.showFailure(data['reason']);
                        }
                    } else {
                        PopupMessage.showFailure('Login failed!');
                    }
                    return;
                }
                closePopup();
                AuthUtils.checkLogged();
                ondone(true);
            } catch (error) {
                PopupMessage.showFailure('Something went wrong! Try again.');
            }
        });
    }

    emailInput.focus();
}