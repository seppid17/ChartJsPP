class XHRSender {
    constructor() {
        this.fields = {};
    }

    addField(fieldName, value) {
        this.fields[fieldName] = value;
    }

    send(url, callback, responseType = '') {
        let encoded = Object.keys(this.fields).map((index) => {
            return encodeURIComponent(index) + '=' + encodeURIComponent(this.fields[index]);
        });
        let reqBody = encoded.join("&");
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.responseType = responseType;
        xhr.onload = () => {
            if (xhr.status == 200) {
                callback(xhr);
            }
        };
        xhr.send(reqBody);
    }
}

const email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const name_pattern = /^[A-Za-z]{2,30}$/;
const password_pattern = /^[\x21-\x7E]{8,15}$/;

/**
 * Prevents a form from submittiog when enter key is pressed. Instead,
 * it sets the keyboard focus to next form input field if the current field is valid.
 * If the field is the last input field of the form, triggers the onclick
 * of the submit button.
 * @param {KeyboardEvent} e the keypress event
 * @param {RegExp} pattern pattern to check the input
 * @param {HTMLElement} nextElem next element to set focus
 * @param {HTMLElement} [btn] button to press on success
 * @param {string} [errorMsg] error message to show on error
 * @return {void}
 */
function keyPressFn(e, pattern, nextElem, btn = null, errorMsg = null) {
    if (e.keyCode === 13) {
        setClear(e.target);
        e.preventDefault();
        let value = e.target.value.trim();
        if (!pattern.test(value)) {
            if (errorMsg != null) setErrorFor(e.target, errorMsg);
            return;
        }
        if (nextElem == null) {
            if (btn != null) btn.click();
        } else {
            if (nextElem) {
                nextElem.focus();
            }
        }
    }
}

/**
 * Check if a string is empty
 * 
 * Returns true if string is empty, and false otherwise.
 */
function isEmpty(str) {
    return (!str || str.length === 0);
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    if (small != null) {
        formControl.className = 'form-control form-outline form-input error';
        small.innerText = message;
    }
}

function setClear(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control form-outline form-input';
}

/**
 * Shows a success, error, or confirm message to user.
 */
function displayMsgConfirm(msg, success = false, confirm = false, onclosed = () => { }) {
    var closeBtn = document.getElementById("popupclose");
    var confirmPopup = document.getElementById("popupconfirm");
    var overlay = document.getElementById("overlay");
    var popup = document.getElementById("msgPopup");
    var msgSpan = document.getElementById("msgSpan");

    msgSpan.innerText = msg;
    if (!success) msgSpan.style.color = 'red';
    else msgSpan.style.color = 'var(--text-primary)';

    if (confirm) {
        confirmPopup.hidden = false;
        closeBtn.children[0].innerText = 'Cancel';
    } else {
        confirmPopup.hidden = true;
        closeBtn.children[0].innerText = 'OK';
    }

    overlay.style.display = 'block';
    popup.style.display = 'block';

    let closePopup = () => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
        onclosed();
    }

    overlay.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
        closePopup();
    }

    popup.onclick = e => {
        e.stopPropagation();
    }

    closeBtn.onclick = function () {
        closePopup();
    };
}

function showMsg(msg, success = false, onclosed = () => { }) {
    displayMsgConfirm(msg, success, false, onclosed)
}

function showSuccess(msg, onclosed = () => { }) {
    showMsg(msg, true, onclosed);
}

function showFailure(msg, onclosed = () => { }) {
    showMsg(msg, false, onclosed);
}

function promptConfirmation(msg, onconfirm = () => { }) {
    displayMsgConfirm(msg, true, true);
    document.getElementById('popupconfirm').onclick = e => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('msgPopup').style.display = 'none';
        onconfirm();
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;samesite=strict";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

let isDark = false;
const darkBtn = document.getElementById('darkBtn');
var r = document.querySelector(':root');

function switchTheme(is_dark) {
    if (is_dark) {
        r.style.setProperty('--bg-primary', '#000000');
        r.style.setProperty('--bg-wrapper', '#1d2226');
        r.style.setProperty('--bg-opt-btn', '#1d2226');
        r.style.setProperty('--bg-opt-btn-selected', '#e9e9ea');
        r.style.setProperty('--bg-dropdiv', '#535353');
        r.style.setProperty('--bg-crumb', '#f4f6fa');
        r.style.setProperty('--text-primary', '#e9e9ea');
        r.style.setProperty('--text-primary-h', '#ffffff');
        r.style.setProperty('--text-secondary', '#e9e9ea');
        r.style.setProperty('--text-opt-btn', '#ffffff');
        r.style.setProperty('--color-trash', '#e9e9ea');
        r.style.setProperty('--color-trash-h', '#ffffff');
        r.style.setProperty('--color-icon-h', '#d8bbff');
        r.style.setProperty('--color-icon-success-h', '#8bff8b');
        r.style.setProperty('--color-icon-cancel-h', '#ff7b7b');
        r.style.setProperty('--input-border', '#e9e9ea');
    } else {
        r.style.setProperty('--bg-primary', '#F9FCFF');
        r.style.setProperty('--bg-wrapper', '#ffffff');
        r.style.setProperty('--bg-opt-btn', '#ffffff');
        r.style.setProperty('--bg-opt-btn-selected', '#e5e7eb');
        r.style.setProperty('--bg-dropdiv', '#f7f7f7');
        r.style.setProperty('--bg-crumb', '#f4f6fa');
        r.style.setProperty('--text-primary', '#000000');
        r.style.setProperty('--text-primary-h', '#000000');
        r.style.setProperty('--text-secondary', '#808080');
        r.style.setProperty('--text-opt-btn', '#000000');
        r.style.setProperty('--color-trash', '#808080');
        r.style.setProperty('--color-trash-h', '#000000');
        r.style.setProperty('--color-icon-h', '#7a14ff');
        r.style.setProperty('--color-icon-success-h', '#003400');
        r.style.setProperty('--color-icon-cancel-h', '#410101');
        r.style.setProperty('--input-border', '#f0f0f0');
    }
}

function checkTheme() {
    let savedTheme = getCookie('theme')
    if (savedTheme === 'dark') {
        isDark = true;
        darkBtn.checked = true;
        document.getElementById('navbarBrand').src = "/images/brandWhite.png";
        switchTheme(true)
    } else if (savedTheme === 'light') {
        isDark = false;
        darkBtn.checked = false;
        document.getElementById('navbarBrand').src = "/images/brandBlack.png";
        switchTheme(false)
    } else {
        darkBtn.checked = false;
        document.getElementById('navbarBrand').src = "/images/brandBlack.png";
        switchTheme(false)
        setCookie('theme', 'light', 365000);
    }
}

function checkLogged() {
    let nav = document.getElementById('navbar');
    if (!nav) return;
    let xhrSender = new XHRSender();
    xhrSender.send('/isLogged', xhr => {
        try {
            let data = JSON.parse(xhr.responseText);
            if (data.hasOwnProperty('logged') && data['logged'] == true) {
                nav.classList.remove('notLogged');
                nav.classList.add('logged');
            } else {
                nav.classList.remove('logged');
                nav.classList.add('notLogged');
            }
        } catch (error) {
        }
    });
}

darkBtn.onclick = e => {
    darkBtn.innerText = isDark ? 'dark' : 'light'
    switchTheme(!isDark)
    isDark = !isDark;
    if (isDark) document.getElementById('navbarBrand').src = "/images/brandWhite.png";
    else document.getElementById('navbarBrand').src = "/images/brandBlack.png";
    setCookie('theme', isDark ? 'dark' : 'light', 365000);
}

document.onvisibilitychange = e => {
    if (document.visibilityState == 'visible') {
        checkLogged();
        checkTheme();
    }
}

checkLogged();
checkTheme();

if (typeof module != 'undefined') {
    module.exports = { isEmpty }
}