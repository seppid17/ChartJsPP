let submitBtn = document.getElementById('submitBtn');
let passwdInput = document.getElementById('password');

passwdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, null, submitBtn);
}

submitBtn.onclick = e => {
    e.preventDefault();
    let passwd = passwdInput.value.trim();

    setClear(passwdInput);
    
    if (isEmpty(passwd)) {
        setErrorFor(passwdInput, 'Password cannot be empty');
        return;
    }
    if (!password_pattern.test(passwd)) {
        setErrorFor(passwdInput, 'Invalid password format');
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
                        showMsg(data['reason']);
                    }
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