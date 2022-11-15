let submitBtn = document.getElementById('submitBtn');
let emailInput = document.getElementById('email');

emailInput.onkeydown = event => {
    FormUtils.keyPressFn(event, FormUtils.email_pattern, null, 'Invalid email', submitBtn);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let email = emailInput.value.trim();

    FormUtils.setClear(emailInput);

    if (FormUtils.isEmpty(email)) {
        FormUtils.setErrorFor(emailInput, 'Email cannot be empty');
        return false;
    }
    if (!FormUtils.email_pattern.test(email)) {
        FormUtils.setErrorFor(emailInput, 'Invalid email format');
        return false;
    }

    Loader.show();

    let xhrSender = new XHRSender();
    xhrSender.addField('email', email);
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
                        }
                    } else {
                        PopupMessage.showFailure(data['reason']);
                    }
                } else {
                    PopupMessage.showFailure('Password reset request failed!');
                }
                return;
            }
            PopupMessage.showSuccess('Password reset requested. Check your email');
        } catch (error) {
            PopupMessage.showFailure('Something went wrong! Please try again.');
        }
    });
}

document.body.onload = function (e) {
    emailInput.focus();
}