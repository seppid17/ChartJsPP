let submitBtn = document.getElementById('submitBtn');
let emailInput = document.getElementById('email');

emailInput.onkeydown = event => {
    keyPressFn(event, email_pattern, null, submitBtn);
}

/**
 * Shows a success or error message to user.
 * 
 * If success is true, shows a success message. Otherwise, shows an error message
 */
function showMsg(msg, success = false) {
    alert(msg);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let email = emailInput.value;
    if (isEmpty(email)) {
        showMsg("Some required fields are empty");
        return;
    }
    if (!email_pattern.test(email)) {
        showMsg("Invalid password");
        return;
    }
    let xhrSender = new XHRSender();
    xhrSender.addField('email', email);
    xhrSender.send(document.URL, function (xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    showMsg(data['reason']);
                } else {
                    showMsg('Password reset request failed!');
                }
                return;
            }
            showMsg('Password reset requested. You will receive a password reset link to your email', true);
        } catch (error) {
            showMsg('Something went wrong! Please try again.');
        }
    });
}