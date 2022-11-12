/**
 * Send XHR POST request with url encoded parameters.
 * Call the callback once response 200 OK is received.
 */
class XHRSender {
    constructor() {
        this.fields = {};
    }

    /**
     * Add a new field to request as a key-value pair
     * 
     * @param {string} fieldName
     * @param {*} value
     * @return {void}
     */
    addField(fieldName, value) {
        this.fields[fieldName] = value;
    }

    /**
     * Send the request.
     * Callback function is called when response OK is received.
     * 
     * @param {string} url URL to send the request
     * @param {function} callback
     * @return {void}
     */
    send(url, callback) {
        let encoded = Object.keys(this.fields).map((index) => {
            return encodeURIComponent(index) + '=' + encodeURIComponent(this.fields[index]);
        });
        let reqBody = encoded.join("&");
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
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
 * 
 * @param {KeyboardEvent} e the keypress event
 * @param {RegExp} pattern pattern to check the input
 * @param {HTMLElement} nextElem next element to set focus
 * @param {string} [errorMsg] error message to show on error
 * @param {HTMLElement} [btn] button to press on success
 * @return {void}
 */
function keyPressFn(e, pattern, nextElem, errorMsg = null, btn = null) {
    if (e.keyCode === 13) {
        if (errorMsg != null) setClear(e.target);
        e.preventDefault();
        e.stopPropagation();
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
 * @return {boolean} true if string is empty, and false otherwise.
 */
function isEmpty(str) {
    return (!str || str.length === 0);
}

/**
 * Set error message for a input field
 * 
 * @param {HTMLElement} input Input field
 * @param {string} message Error message
 * @return {void}
 */
function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    if (small != null) {
        formControl.classList.add('error');
        small.innerText = message;
    }
}

/**
 * Clear the error message for a input field
 * 
 * @param {HTMLElement} input Input field
 * @return {void}
 */
function setClear(input) {
    const formControl = input.parentElement;
    formControl.classList.remove('error');
}

/**
 * Show a success, error, or confirm message.
 * 
 * @param {string} msg
 * @param {boolean} [success]
 * @param {boolean} [confirm]
 * @param {function} [onclosed]
 * @return {void}
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

/**
 * Show a success or error message.
 * 
 * @param {string} msg
 * @param {boolean} [success]
 * @param {function} [onclosed]
 * @return {void}
 */
function showMsg(msg, success = false, onclosed = () => { }) {
    displayMsgConfirm(msg, success, false, onclosed)
}

/**
 * Show a success message.
 * 
 * @param {string} msg
 * @param {function} [onclosed]
 * @return {void}
 */
function showSuccess(msg, onclosed = () => { }) {
    showMsg(msg, true, onclosed);
}

/**
 * Show an error message.
 * 
 * @param {string} msg
 * @param {function} [onclosed]
 * @return {void}
 */
function showFailure(msg, onclosed = () => { }) {
    showMsg(msg, false, onclosed);
}

/**
 * Show a confirm message.
 * 
 * @param {string} msg
 * @param {function} [onconfirm]
 * @return {void}
 */
function promptConfirmation(msg, onconfirm = () => { }) {
    displayMsgConfirm(msg, true, true);
    document.getElementById('popupconfirm').onclick = e => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('msgPopup').style.display = 'none';
        onconfirm();
    }
}

/**
 * Set a cookie with given name, value and expiry date.
 * 
 * @param {*} name name of the cookie
 * @param {*} value value of the cookie
 * @param {number} expiryDays days to expiry of the cookie
 * @return {void}
 */
function setCookie(name, value, expiryDays) {
    const date = new Date();
    date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;samesite=strict";
}

/**
 * Get the cookie with given name.
 * 
 * @param {*} name name of the cookie
 * @return {string} value of the cookie if exists, otherwise an empty string
 */
function getCookie(name) {
    name = name + "=";
    let cookieList = document.cookie.split(';');
    for (let i = 0; i < cookieList.length; i++) {
        let cookie = cookieList[i];
        let index = 0;
        for (; index < cookie.length; index++) {
            if (cookie.charAt(index) != ' ') break;
        }
        if (index > 0) {
            cookie = cookie.substring(index);
        }
        if (cookie.startsWith(name)) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

let isDark = false;
const darkBtn = document.getElementById('darkBtn');
var root = document.querySelector(':root');

/**
 * Set the theme to light or dark
 * 
 * @param {boolean} is_dark
 * @return {void}
 */
function switchTheme(is_dark) {
    if (is_dark) {
        root.style.setProperty('--bg-primary', '#000000');
        root.style.setProperty('--bg-wrapper', '#1d2226');
        root.style.setProperty('--bg-opt-btn', '#1d2226');
        root.style.setProperty('--bg-opt-btn-selected', '#e9e9ea');
        root.style.setProperty('--bg-dropdiv', '#535353');
        root.style.setProperty('--bg-crumb', '#f4f6fa');
        root.style.setProperty('--text-primary', '#e9e9ea');
        root.style.setProperty('--text-primary-h', '#ffffff');
        root.style.setProperty('--text-secondary', '#e9e9ea');
        root.style.setProperty('--text-opt-btn', '#ffffff');
        root.style.setProperty('--color-trash', '#e9e9ea');
        root.style.setProperty('--color-trash-h', '#ffffff');
        root.style.setProperty('--color-icon-h', '#d8bbff');
        root.style.setProperty('--color-icon-success-h', '#8bff8b');
        root.style.setProperty('--color-icon-cancel-h', '#ff7b7b');
        root.style.setProperty('--input-border', '#e9e9ea');
    } else {
        root.style.setProperty('--bg-primary', '#F9FCFF');
        root.style.setProperty('--bg-wrapper', '#ffffff');
        root.style.setProperty('--bg-opt-btn', '#ffffff');
        root.style.setProperty('--bg-opt-btn-selected', '#e5e7eb');
        root.style.setProperty('--bg-dropdiv', '#f7f7f7');
        root.style.setProperty('--bg-crumb', '#f4f6fa');
        root.style.setProperty('--text-primary', '#000000');
        root.style.setProperty('--text-primary-h', '#000000');
        root.style.setProperty('--text-secondary', '#808080');
        root.style.setProperty('--text-opt-btn', '#000000');
        root.style.setProperty('--color-trash', '#808080');
        root.style.setProperty('--color-trash-h', '#000000');
        root.style.setProperty('--color-icon-h', '#7a14ff');
        root.style.setProperty('--color-icon-success-h', '#003400');
        root.style.setProperty('--color-icon-cancel-h', '#410101');
        root.style.setProperty('--input-border', '#f0f0f0');
    }
}

/**
 * Check the saved theme and set it.
 * Use the apporpriate brand image for the theme.
 * 
 * @return {void}
 */
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

/**
 * Check if the user is logged.
 * Show or hide navbar buttons depending on logged status.
 * 
 * @return {void}
 */
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

/**
 * Change theme when theme switch button is pressed
 */
darkBtn.onclick = e => {
    darkBtn.innerText = isDark ? 'dark' : 'light'
    switchTheme(!isDark)
    isDark = !isDark;
    if (isDark) document.getElementById('navbarBrand').src = "/images/brandWhite.png";
    else document.getElementById('navbarBrand').src = "/images/brandBlack.png";
    setCookie('theme', isDark ? 'dark' : 'light', 365000);
}

/**
 * Check theme and logged status when navigating through pages
 */
document.onvisibilitychange = e => {
    if (document.visibilityState == 'visible') {
        checkLogged();
        checkTheme();
    }
}

checkLogged();
checkTheme();

/**
 * Show or hide the loader
 * 
 * @param {string} type 'block' or 'none'
 */
function getLoader(type) {
    document.getElementById("overlayLoader").style.display = type;
    document.getElementById("loader").style.display = type;
}

let loadTimerID = 0;

/**
 * Show the loader
 */
function showLoader() {
    if (loadTimerID != 0) {
        clearTimeout(loadTimerID);
        loadTimerID = 0;
    }
    loadTimerID = setTimeout(() => {
        getLoader('block');
    }, 200);
}

/**
 * Hide the loader
 */
function hideLoader() {
    if (loadTimerID != 0) {
        clearTimeout(loadTimerID);
        loadTimerID = 0;
    }
    getLoader('none');
}