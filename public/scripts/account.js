let firstNameInput = document.getElementById('firstName');
let lastNameInput = document.getElementById('lastName');
let passwdInput = document.getElementById('password');
let changeNameBtn = document.getElementById('changeNameBtn');

let curPasswdInput = document.getElementById('curPassword');
let newPasswdInput = document.getElementById('newPassword');
let cnfPasswdInput = document.getElementById('cnfPassword');
let changePasswdBtn = document.getElementById('changePasswdBtn');

let delPasswdInput = document.getElementById('delPassword');
let deleteBtn = document.getElementById('deleteBtn');

firstNameInput.onkeydown = event => {
    keyPressFn(event, name_pattern, lastNameInput);
}
lastNameInput.onkeydown = event => {
    keyPressFn(event, name_pattern, passwdInput);
}
passwdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, null, changeNameBtn);
}

curPasswdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, newPasswdInput);
}
newPasswdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, cnfPasswdInput);
}
cnfPasswdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, null, changePasswdBtn);
}

delPasswdInput.onkeydown = event => {
    keyPressFn(event, password_pattern, null, deleteBtn);
}

/**
 * Shows a success or error message to user.
 * 
 * If success is true, shows a success message. Otherwise, shows an error message
 */
function showMsg(msg, success = false) {
    alert(msg);
}

changeNameBtn.onclick = e => {
    e.preventDefault();
    let firstName = firstNameInput.value;
    let lastName = lastNameInput.value;
    let passwd = passwdInput.value;
    if (isEmpty(firstName) || isEmpty(lastName) || isEmpty(passwd)) {
        showMsg("Some required fields are empty");
        return;
    }
    if (!name_pattern.test(firstName)) {
        showMsg("Invalid first name");
        return;
    }
    if (!name_pattern.test(lastName)) {
        showMsg("Invalid last name");
        return;
    }
    if (!password_pattern.test(passwd)) {
        showMsg("Invalid password");
        return;
    }
    
    let xhrSender = new XHRSender();
    xhrSender.addField('firstName', firstName);
    xhrSender.addField('lastName', lastName);
    xhrSender.addField('password', passwd);
    xhrSender.send('/account/name', function (xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    showMsg(data['reason']);
                } else {
                    showMsg('Change name failed!');
                }
                return;
            }
            showMsg('Name changed', true);
        } catch (error) {
            showMsg('Something went wrong! Please try again.');
        }
    });
}

changePasswdBtn.onclick = e => {
    e.preventDefault();
    let curPasswd = curPasswdInput.value;
    let newPasswd = newPasswdInput.value;
    let cnfPasswd = cnfPasswdInput.value;
    if (isEmpty(curPasswd) || isEmpty(newPasswd) || isEmpty(cnfPasswd)) {
        showMsg("Some required fields are empty");
        return;
    }
    if (!password_pattern.test(curPasswd)) {
        showMsg("Invalid current password");
        return;
    }
    if (!password_pattern.test(newPasswd)) {
        showMsg("Invalid new password");
        return;
    }
    if (newPasswd !== cnfPasswd) {
        showMsg("Passwords doesn't match");
        return;
    }
    let xhrSender = new XHRSender();
    xhrSender.addField('curPassword', curPasswd);
    xhrSender.addField('newPassword', newPasswd);
    xhrSender.send('/account/password', function (xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    showMsg(data['reason']);
                } else {
                    showMsg('Change password failed!');
                }
                return;
            }
            showMsg('Password changed', true);
        } catch (error) {
            showMsg('Something went wrong! Please try again.');
        }
    });
}

deleteBtn.onclick = e => {
    e.preventDefault();
    let passwd = delPasswdInput.value;
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
    xhrSender.send('/account/delete', function (xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    showMsg(data['reason']);
                } else {
                    showMsg('Delete account failed!');
                }
                return;
            }
            setTimeout(() => {
                window.location = '/';
            }, 4000);
            showMsg('Account deactivated', true);
        } catch (error) {
            showMsg('Something went wrong! Please try again.');
        }
    });
}