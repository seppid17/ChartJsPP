const nav = document.getElementById('navbar');
const navbarBrand = document.getElementById('navbarBrand');
const nameSpan = document.getElementById('nameSpan');

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
     * @param {string} fieldName
     * @param {*} value
     * @returns {void}
     */
    addField(fieldName, value) {
        this.fields[fieldName] = value;
    }

    /**
     * Send the request.
     * Callback function is called when response OK is received.
     * @param {string} url URL to send the request
     * @param {function} callback
     * @returns {void}
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

/**
 * Shows a popup for confirmation or to show information of an operation
 */
class PopupMessage {
    static closeBtn = document.getElementById("popupclose");
    static confirmPopup = document.getElementById("popupconfirm");
    static overlay = document.getElementById("overlay");
    static popup = document.getElementById("msgPopup");
    static msgSpan = document.getElementById("msgSpan");

    /**
     * Show a success, error, or confirm message.
     * @param {string} msg
     * @param {boolean} [success]
     * @param {boolean} [confirm]
     * @param {function} [onclosed]
     * @returns {void}
     */
    static _display(msg, success = false, confirm = false, onclosed = () => { }) {
        Loader.hide();
        PopupMessage.msgSpan.innerText = msg;
        if (!success) PopupMessage.msgSpan.style.color = 'red';
        else PopupMessage.msgSpan.style.color = 'var(--text-primary)';

        let isChartPage = typeof chartKeyListener != 'undefined';
        if (isChartPage) document.removeEventListener('keydown', chartKeyListener);

        if (confirm) {
            PopupMessage.confirmPopup.hidden = false;
            PopupMessage.closeBtn.children[0].innerText = 'Cancel';
        } else {
            PopupMessage.confirmPopup.hidden = true;
            PopupMessage.closeBtn.children[0].innerText = 'OK';
            document.addEventListener('keydown', e => {
                if (e.key == 'Enter' && !e.shiftKey && !e.altKey && !(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
                    e.preventDefault();
                    closePopup();
                }
            });
            PopupMessage.popup.focus();
        }

        PopupMessage.overlay.style.display = 'block';
        PopupMessage.popup.style.display = 'block';

        let closePopup = () => {
            PopupMessage.popup.style.display = 'none';
            PopupMessage.overlay.style.display = 'none';
            if (isChartPage) document.addEventListener('keydown', chartKeyListener);
            onclosed();
        }

        PopupMessage.overlay.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            closePopup();
        }

        PopupMessage.popup.onclick = e => {
            e.stopPropagation();
        }

        PopupMessage.closeBtn.onclick = function () {
            closePopup();
        };
    }

    /**
     * Show a success or error message.
     * @param {string} msg
     * @param {boolean} [success]
     * @param {function} [onclosed]
     * @returns {void}
     */
    static _showMsg(msg, success = false, onclosed = () => { }) {
        PopupMessage._display(msg, success, false, onclosed)
    }

    /**
     * Show a success message.
     * @param {string} msg
     * @param {function} [onclosed]
     * @returns {void}
     */
    static showSuccess(msg, onclosed = () => { }) {
        PopupMessage._showMsg(msg, true, onclosed);
    }

    /**
     * Show an error message.
     * @param {string} msg
     * @param {function} [onclosed]
     * @returns {void}
     */
    static showFailure(msg, onclosed = () => { }) {
        PopupMessage._showMsg(msg, false, onclosed);
    }

    /**
     * Show a confirm message.
     * @param {string} msg
     * @param {function} [onconfirm]
     * @returns {void}
     */
    static promptConfirmation(msg, onconfirm = () => { }, onclosed = () => { }) {
        PopupMessage._display(msg, true, true, onclosed);
        document.getElementById('popupconfirm').onclick = e => {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('msgPopup').style.display = 'none';
            onconfirm();
        }
    }
}

class StorageUtils {
    /**
     * Set a cookie with given name and value.
     * @param {*} name name of the cookie
     * @param {*} value value of the cookie
     * @returns {void}
     */
    static _setCookie(name, value) {
        const date = new Date();
        date.setTime(date.getTime() + 3153600000000);
        let expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;samesite=strict";
    }

    /**
     * Get the cookie with given name.
     * @param {*} name name of the cookie
     * @returns {string|null} value of the cookie if exists, otherwise null
     */
    static _getCookie(name) {
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
        return null;
    }

    /**
     * Store a value with name in localStorage.
     * If localStorage is not available, save in cookies.
     * @param {*} name name as the key
     * @param {*} value value to be stored
     * @returns {void}
     */
    static store(name, value) {
        if (typeof (Storage) !== "undefined") {
            localStorage[name] = value;
        } else {
            StorageUtils._setCookie(name, value);
        }
    }

    /**
     * Retrieve the value with given name from localStorage.
     * If localStorage is not available, search in cookies.
     * @param {*} name name as the key
     * @returns {string|null} retrieved value from storage if exists, otherwise null
     */
    static retrieve(name) {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.hasOwnProperty(name))
                return localStorage[name];
        } else {
            return StorageUtils._getCookie(name, value);
        }
        return null;
    }
}

/**
 * Setting the page theme to light or dark mode
 */
class Theme {
    static LIGHT = false;
    static DARK = true;
    static theme = Theme.LIGHT;
    static darkBtn = document.getElementById('darkBtn');
    static root = document.querySelector(':root');
    static _onchangeTriggers = [];

    /**
     * Set the theme to light or dark.
     * Triggers Theme.onchange()
     * @param {boolean} is_dark
     * @returns {void}
     */
    static switchTheme(theme) {
        if (theme == Theme.DARK) {
            Theme.root.style.setProperty('--bg-primary', '#000000');
            Theme.root.style.setProperty('--bg-wrapper', '#1d2226');
            Theme.root.style.setProperty('--bg-opt-btn', '#1d2226');
            Theme.root.style.setProperty('--bg-opt-btn-selected', '#e9e9ea');
            Theme.root.style.setProperty('--bg-dropdiv', '#535353');
            Theme.root.style.setProperty('--bg-crumb', '#f4f6fa');
            Theme.root.style.setProperty('--text-primary', '#e9e9ea');
            Theme.root.style.setProperty('--text-primary-h', '#ffffff');
            Theme.root.style.setProperty('--text-secondary', '#e9e9ea');
            Theme.root.style.setProperty('--text-opt-btn', '#ffffff');
            Theme.root.style.setProperty('--color-trash', '#e9e9ea');
            Theme.root.style.setProperty('--color-trash-h', '#ffffff');
            Theme.root.style.setProperty('--color-icon-h', '#d8bbff');
            Theme.root.style.setProperty('--color-icon-success-h', '#8bff8b');
            Theme.root.style.setProperty('--color-icon-cancel-h', '#ff7b7b');
            Theme.root.style.setProperty('--input-border', '#e9e9ea');
        } else {
            Theme.root.style.setProperty('--bg-primary', '#F9FCFF');
            Theme.root.style.setProperty('--bg-wrapper', '#ffffff');
            Theme.root.style.setProperty('--bg-opt-btn', '#ffffff');
            Theme.root.style.setProperty('--bg-opt-btn-selected', '#e5e7eb');
            Theme.root.style.setProperty('--bg-dropdiv', '#f7f7f7');
            Theme.root.style.setProperty('--bg-crumb', '#f4f6fa');
            Theme.root.style.setProperty('--text-primary', '#000000');
            Theme.root.style.setProperty('--text-primary-h', '#000000');
            Theme.root.style.setProperty('--text-secondary', '#808080');
            Theme.root.style.setProperty('--text-opt-btn', '#000000');
            Theme.root.style.setProperty('--color-trash', '#808080');
            Theme.root.style.setProperty('--color-trash-h', '#000000');
            Theme.root.style.setProperty('--color-icon-h', '#7a14ff');
            Theme.root.style.setProperty('--color-icon-success-h', '#003400');
            Theme.root.style.setProperty('--color-icon-cancel-h', '#410101');
            Theme.root.style.setProperty('--input-border', '#f0f0f0');
        }
        Theme._onchangeTriggers.forEach(trigger => {
            trigger(theme);
        });
    }

    /**
     * Check the saved theme and set it.
     * Use the apporpriate brand image for the theme.
     * @returns {void}
     */
    static checkTheme() {
        let savedTheme = StorageUtils.retrieve('theme');
        if (savedTheme === 'dark') {
            Theme.theme = Theme.DARK;
            Theme.darkBtn.checked = true;
            navbarBrand.src = "/images/brandWhite.png";
            Theme.switchTheme(true);
        } else if (savedTheme === 'light') {
            Theme.theme = Theme.LIGHT;
            Theme.darkBtn.checked = false;
            navbarBrand.src = "/images/brandBlack.png";
            Theme.switchTheme(false);
        } else {
            Theme.darkBtn.checked = false;
            navbarBrand.src = "/images/brandBlack.png";
            Theme.switchTheme(false);
            StorageUtils.store('theme', 'light');
        }
    }

    static addOnchangeTrigger(trigger) {
        Theme._onchangeTriggers.push(trigger);
    }
}

/**
 * Functions to show a loader when an operation takes long time
 */
class Loader {
    static loadTimerID = 0;

    /**
     * Show or hide the loader
     * @param {string} type 'block' or 'none'
     */
    static _setLoaderDisplay(type) {
        document.getElementById("overlayLoader").style.display = type;
        document.getElementById("loader").style.display = type;
    }

    /**
     * Show the loader
     */
    static show() {
        if (Loader.loadTimerId != 0) {
            clearTimeout(Loader.loadTimerId);
            Loader.loadTimerId = 0;
        }
        Loader.loadTimerId = setTimeout(() => {
            Loader._setLoaderDisplay('block');
        }, 400);
    }

    /**
     * Hide the loader
     */
    static hide() {
        if (Loader.loadTimerId != 0) {
            clearTimeout(Loader.loadTimerId);
            Loader.loadTimerId = 0;
        }
        Loader._setLoaderDisplay('none');
    }
}

/**
 * Utilities for forms and input validation
 */
class FormUtils {

    /**
     * Patterns to validate inputs
     */
    static email_pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    static name_pattern = /^[A-Za-z]{2,30}$/;
    static password_pattern = /^[\x21-\x7E]{8,15}$/;
    static chart_name_pattern = /^[\x20-\x7e]{0,40}$/;
    /**
     * Prevents a form from submittiog when enter key is pressed. Instead,
     * it sets the keyboard focus to next form input field if the current field is valid.
     * If the field is the last input field of the form, triggers the onclick
     * of the submit button.
     * @param {KeyboardEvent} e the keypress event
     * @param {RegExp} pattern pattern to check the input
     * @param {HTMLElement} nextElem next element to set focus
     * @param {string} [errorMsg] error message to show on error
     * @param {HTMLElement} [btn] button to press on success
     * @returns {void}
     */
    static keyPressFn(e, pattern, nextElem, errorMsg = null, btn = null) {
        if (e.key === 'Enter') {
            if (errorMsg != null) FormUtils.setClear(e.target);
            e.preventDefault();
            e.stopPropagation();
            let value = e.target.value.trim();
            if (!pattern.test(value)) {
                if (errorMsg != null) FormUtils.setErrorFor(e.target, errorMsg);
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
     * @returns {boolean} true if string is empty, and false otherwise.
     */
    static isEmpty(str) {
        return (!str || str.length === 0);
    }

    /**
     * Set error message for a input field
     * @param {HTMLElement} input Input field
     * @param {string} message Error message
     * @returns {void}
     */
    static setErrorFor(input, message) {
        const formControl = input.parentElement;
        const small = formControl.querySelector('small');
        if (small != null) {
            formControl.classList.add('error');
            small.innerText = message;
        }
    }

    /**
     * Clear the error message for a input field
     * @param {HTMLElement} input Input field
     * @returns {void}
     */
    static setClear(input) {
        const formControl = input.parentElement;
        formControl.classList.remove('error');
    }
}

/**
 * Check if the user is logged.
 * Show or hide navbar buttons depending on logged status.
 * If the user must be logged in to stay on this page, and if the user has logged out,
 * then reload the page
 * @returns {void}
 */
class AuthUtils {
    static _mustLogin = false;

    static mustLogin() {
        AuthUtils._mustLogin = true;
    }

    static checkLogged() {
        if (!nav) return;
        let xhrSender = new XHRSender();
        xhrSender.send('/isLogged', xhr => {
            try {
                let data = JSON.parse(xhr.responseText);
                if (data.hasOwnProperty('logged') && data['logged'] == true) {
                    nav.classList.remove('notLogged');
                    nav.classList.add('logged');
                } else {
                    if (AuthUtils._mustLogin) {
                        window.location = document.URL;
                    }
                    nav.classList.remove('logged');
                    nav.classList.add('notLogged');
                }
            } catch (error) {
            }
        });
    }
}

/**
 * Change theme when theme switch button is pressed
 */
Theme.darkBtn.onclick = e => {
    Theme.darkBtn.innerText = Theme.theme == Theme.DARK ? 'dark' : 'light';
    Theme.theme = Theme.theme == Theme.DARK ? Theme.LIGHT : Theme.DARK;
    Theme.switchTheme(Theme.theme);
    if (Theme.theme == Theme.DARK) document.getElementById('navbarBrand').src = "/images/brandWhite.png";
    else document.getElementById('navbarBrand').src = "/images/brandBlack.png";
    StorageUtils.store('theme', Theme.theme == Theme.DARK ? 'dark' : 'light');
}

/**
 * Check theme and logged status when navigating through pages
 */
document.addEventListener('visibilitychange', e => {
    if (document.visibilityState == 'visible') {
        AuthUtils.checkLogged();
        Theme.checkTheme();
    }
});

/**
 * Common keyboard shortcuts
 */
document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() == 'k' && !e.shiftKey && !e.altKey && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        Theme.darkBtn.click();
    }
    if (e.key.toLowerCase() == 'e' && !e.shiftKey && !e.altKey && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        window.open('/chart', '_blank');
    }
});

/**
 * Increment the number of open tabs count
 */
window.addEventListener('load', e => {
    try {
        let opencount = StorageUtils.retrieve('opencount');
        if (opencount !== null) {
            opencount = Number(opencount);
            opencount++;
            StorageUtils.store('opencount', opencount);
        } else {
            StorageUtils.store('opencount', 1);
        }
    } catch (e) { }
});

/**
 * decrement the number of open tabs count
 */
window.onpagehide = function () {
    let opencount = StorageUtils.retrieve('opencount');
    if (opencount !== null) {
        opencount = Number(opencount);
        opencount = Math.max(0, opencount - 1);
        StorageUtils.store('opencount', opencount);
    }
}

AuthUtils.checkLogged();
Theme.checkTheme();
