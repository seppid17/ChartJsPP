let submitBtn = document.getElementById('submitBtn');
let passwdInput = document.getElementById('password');

passwdInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.password_pattern, null, 'Invalid password', submitBtn);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let passwd = passwdInput.value.trim();

    FormUtils.setClear(passwdInput);

    if (FormUtils.isEmpty(passwd)) {
        FormUtils.setErrorFor(passwdInput, 'Password cannot be empty');
        return;
    }
    if (!FormUtils.password_pattern.test(passwd)) {
        FormUtils.setErrorFor(passwdInput, 'Invalid password format');
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
                    PopupMessage.showFailure('Account activation failed!');
                }
                return;
            }
            PopupMessage.showSuccess('Account activated.', () => {
                window.location = '/login';
            });
        } catch (error) {
            PopupMessage.showFailure('Something went wrong! Please try again.');
        }
    });
}