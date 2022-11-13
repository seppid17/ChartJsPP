let submitBtn = document.getElementById('submitBtn');
let emailInput = document.getElementById('email');

emailInput.onkeydown = event => {
    keyPressFn(event, email_pattern, null, 'Invalid email', submitBtn);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let email = emailInput.value.trim();

    setClear(emailInput);

    if (isEmpty(email)) {
        setErrorFor(emailInput, 'Email cannot be empty');
        return false;
    }
    if (!email_pattern.test(email)) {
        setErrorFor(emailInput, 'Invalid email format');
        return false;
    }

    Loader.show();

    let xhrSender = new XHRSender();
    xhrSender.addField('email', email);
    xhrSender.send(document.URL, function (xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    if (data.hasOwnProperty('field')) {
                        switch (data['field']) {
                            case 'email':
                                setErrorFor(emailInput, data['reason']);
                                Loader.hide();
                                break;
                        }
                    } else {
                        PopupMessage.showFailure(data['reason']);
                    }
                } else {
                    PopupMessage.showFailure('Password reset request failed!');
                }
                Loader.hide();
                return;
            }
            PopupMessage.showSuccess('Password reset requested. Check your email');
        } catch (error) {
            PopupMessage.showFailure('Something went wrong! Please try again.');
        }
        Loader.hide();
    });
}

document.body.onload = function (e) {
    emailInput.focus();
}