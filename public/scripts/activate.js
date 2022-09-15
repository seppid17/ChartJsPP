let submitBtn = document.getElementById('submitBtn');
let passwdInput = document.getElementById('password');

passwdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, null, submitBtn);
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
    let passwd = passwdInput.value.trim();
    if (isEmpty(passwd)) {
        showMsg("Some required fields are empty");
        return;
    }
    if (!password_pattern.test(passwd)) {
        showMsg("Invalid password");
        return;
    }
    let xhrSender = new XHRSender();
    xhrSender.addField('password', passwd);
    xhrSender.send(document.URL, function (xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    showMsg(data['reason']);
                } else {
                    showMsg('Account activation failed!');
                }
                return;
            }
            setTimeout(() => {
                window.location = '/login';
            }, 4000);
            showMsg('Account activated', true);
        } catch (error) {
            showMsg('Something went wrong! Please try again.');
        }
    });
}