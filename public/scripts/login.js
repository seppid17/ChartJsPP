let form = document.getElementById('loginForm');
let submitBtn = document.getElementById('submit');
let emailInput = document.getElementById('email');
let passwdInput = document.getElementById('password');

emailInput.onkeydown = event => {
    keyPressFn(event, email_pattern, passwdInput, null, 'Invalid email');
}
passwdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, null, submitBtn, 'Invalid Password');
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
    let email = emailInput.value.trim();
    let passwd = passwdInput.value.trim();

    setClear(emailInput);
    setClear(passwdInput);

    if (isEmpty(email)) {
        setErrorFor(emailInput, 'Email cannot be empty');
        // showMsg("Email cannot be empty");
        return false;
    }
    if (!email_pattern.test(email)) {
        setErrorFor(emailInput, 'Invalid email');
        // showMsg("Invalid email");
        return false;
    }
    if (isEmpty(passwd)) {
        setErrorFor(passwdInput, 'Password cannot be empty');
        // showMsg("Password cannot be empty");
        return false;
    }
    if (!password_pattern.test(passwd)) {
        setErrorFor(passwdInput, 'Invalid Password');
        // showMsg("Invalid password");
        return false;
    }

    let xhrSender = new XHRSender();
    xhrSender.addField('email', email);
    xhrSender.addField('password', passwd);
    xhrSender.send(document.URL, function (xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    if (data['reason'] === 'This email does not have an account') {
                        setErrorFor(emailInput, data['reason']);
                    } else if (data['reason'] === 'Incorrect password') {
                        setErrorFor(passwdInput, data['reason']);
                    } else {
                        showMsg(data['reason']);
                    }
                } else {
                    showMsg('Login failed!');
                }
                return;
            }
            window.location = '/dashboard';
        } catch (error) {
            showMsg('Something went wrong!');
        }
    });
}