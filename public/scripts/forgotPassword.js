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
                                break;
                        }
                    } else {
                        showFailure(data['reason']);
                    }
                } else {
                    showFailure('Password reset request failed!');
                }
                return;
            }
            showSuccess('Password reset requested. Check your email');
        } catch (error) {
            showFailure('Something went wrong! Please try again.');
        }
    });
}

document.body.onload = function (e) {
    emailInput.focus();
}