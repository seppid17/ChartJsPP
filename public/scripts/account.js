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

// this function changes the display style of given 3 inputs
function AccountOperation(div1, div2, div3) {
    div1.style.display = 'none';
    div2.style.display = 'none';
    div3.style.display = 'block';
}
// this function and the selected class to the first inptut and remove it from 2nd and 3rd inputs
function setSelect(btn1, btn2, btn3) {
    btn1.className = 'btn btn-opt btn-opt-selected';
    btn2.className = 'btn btn-opt';
    btn3.className = 'btn btn-opt';
}
// Display relevent account details and operations to the user and change the color of relevent btn
let AccountDetailsDiv = document.getElementById('AccountDetailsDiv');
let ChangePasswordDiv = document.getElementById('ChangePasswordDiv');
let DeleteAccountDiv = document.getElementById('DeleteAccountDiv');
let AccountDetailsBtn = document.getElementById('AccountDetails');
let ChangePasswordBtn = document.getElementById('ChangePassword');
let DeleteAccountBtn = document.getElementById('DeleteAccount');
AccountDetailsBtn.onclick = e => {
    AccountOperation(ChangePasswordDiv, DeleteAccountDiv, AccountDetailsDiv);
    setSelect(AccountDetailsBtn, ChangePasswordBtn, DeleteAccountBtn);
}
ChangePasswordBtn.onclick = e => {
    AccountOperation(DeleteAccountDiv, AccountDetailsDiv, ChangePasswordDiv);
    setSelect(ChangePasswordBtn, DeleteAccountBtn, AccountDetailsBtn);
}
DeleteAccountBtn.onclick = e => {
    AccountOperation(ChangePasswordDiv, AccountDetailsDiv, DeleteAccountDiv);
    setSelect(DeleteAccountBtn, AccountDetailsBtn, ChangePasswordBtn);
}

firstNameInput.onkeydown = event => { keyPressFn(event, name_pattern, lastNameInput, 'Invalid name'); }
lastNameInput.onkeydown = event => { keyPressFn(event, name_pattern, passwdInput, 'Invalid name'); }
passwdInput.onkeydown = event => { keyPressFn(event, password_pattern, null, 'Invalid password', changeNameBtn); }
curPasswdInput.onkeydown = event => { keyPressFn(event, password_pattern, newPasswdInput, 'Invalid password'); }
newPasswdInput.onkeydown = event => { keyPressFn(event, password_pattern, cnfPasswdInput, 'Invalid password'); }
cnfPasswdInput.onkeydown = event => { keyPressFn(event, password_pattern, null, 'Invalid password', changePasswdBtn); }
delPasswdInput.onkeydown = event => { keyPressFn(event, password_pattern, null, 'Invalid password', deleteBtn); }

changeNameBtn.onclick = e => {
    e.preventDefault();
    let firstName = firstNameInput.value.trim();
    let lastName = lastNameInput.value.trim();
    let passwd = passwdInput.value.trim();

    setClear(firstNameInput);
    setClear(lastNameInput);
    setClear(passwdInput);

    // fron-end validate first name
    if (isEmpty(firstName)) {
        setErrorFor(firstNameInput, "Name cannot be empty");
        return;
    }
    if (!name_pattern.test(firstName)) {
        setErrorFor(firstNameInput, "Invalid name format");
        return;
    }
    // front-end validate last name
    if (isEmpty(lastName)) {
        setErrorFor(lastNameInput, "Name cannot be empty");
        return;
    }
    if (!name_pattern.test(lastName)) {
        setErrorFor(lastNameInput, "Invalid name format");
        return;
    }
    // front-end validate password
    if (isEmpty(passwd)) {
        setErrorFor(passwdInput, "Password cannot be empty");
        return;
    }
    if (!password_pattern.test(passwd)) {
        setErrorFor(passwdInput, "Invalid password format");
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
                    if (data.hasOwnProperty('field')) {
                        switch (data['field']) {
                            case 'firstname':
                                setErrorFor(firstNameInput, data['reason']);
                                break;
                            case 'lastname':
                                setErrorFor(lastNameInput, data['reason']);
                                break;
                            case 'password':
                                setErrorFor(passwdInput, data['reason']);
                                break;
                        }
                    } else {
                        showFailure(data['reason']);
                    }
                } else {
                    showFailure('Change name failed!');
                }
                return;
            }
            showSuccess('Profile details updated.');
        } catch (error) {
            showFailure('Something went wrong! Please try again.');
        }
    });
}

changePasswdBtn.onclick = e => {
    e.preventDefault();
    let curPasswd = curPasswdInput.value.trim();
    let newPasswd = newPasswdInput.value.trim();
    let cnfPasswd = cnfPasswdInput.value.trim();

    setClear(curPasswdInput);
    setClear(newPasswdInput);
    setClear(cnfPasswdInput);

    if (isEmpty(curPasswd)) {
        setErrorFor(curPasswdInput, "Password cannot be empty");
        return;
    }
    if (!password_pattern.test(curPasswd)) {
        setErrorFor(curPasswdInput, "Invalid password format");
        return;
    }

    if (isEmpty(newPasswd)) {
        setErrorFor(newPasswdInput, "Password cannot be empty");
        return;
    }
    if (!password_pattern.test(newPasswd)) {
        setErrorFor(newPasswdInput, "Invalid password format");
        return;
    }

    if (isEmpty(cnfPasswd)) {
        setErrorFor(cnfPasswdInput, "Password cannot be empty");
        return;
    }
    if (newPasswd !== cnfPasswd) {
        setErrorFor(cnfPasswdInput, "Password dosen't match");
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
                    if (data.hasOwnProperty('field')) {
                        switch (data['field']) {
                            case 'curPassword':
                                setErrorFor(curPasswdInput, data['reason']);
                                break;
                            case 'newPassword':
                                setErrorFor(newPasswdInput, data['reason']);
                                break;
                        }
                    } else {
                        showFailure(data['reason']);
                    }
                } else {
                    showFailure('Change password failed!');
                }
                return;
            }
            showSuccess('Password updated.');
        } catch (error) {
            showFailure('Something went wrong! Please try again.');
        }
    });
}

deleteBtn.onclick = e => {
    e.preventDefault();
    let passwd = delPasswdInput.value.trim();
    if (isEmpty(passwd)) {
        setErrorFor(delPasswdInput, "Password cannot be empty");
        return;
    }
    let xhrSender = new XHRSender();
    xhrSender.addField('password', passwd);
    xhrSender.send('/account/delete', function (xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.hasOwnProperty('success') || data['success'] !== true) {
                if (data.hasOwnProperty('reason') && typeof (data['reason']) === "string") {
                    if (data.hasOwnProperty('field')) {
                        switch (data['field']) {
                            case 'delPassword':
                                setErrorFor(delPasswdInput, data['reason']);
                                break;
                        }
                    } else {
                        showFailure(data['reason']);
                    }
                } else {
                    showFailure('Delete account failed!');
                }
                return;
            }
            showSuccess('Account deactivated.', () => {
                window.location = '/';
            });
        } catch (error) {
            showFailure('Something went wrong! Please try again.');
        }
    });
}