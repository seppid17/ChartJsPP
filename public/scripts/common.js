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
                var unauthorized = xhr.getResponseHeader("Unauthorized");
                if (unauthorized && unauthorized !== "") {
                    // window.location = unauthorized;
                    return;
                }
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
function showMsg(msg, success = false, confirm = false) {
    var closePopup = document.getElementById("popupclose");
    var confirmPopup = document.getElementById("popupconfirm");
    var overlay = document.getElementById("overlay");
    var popup = document.getElementById("msgPopup");
    var msgSpan = document.getElementById("msgSpan");

    msgSpan.innerText = msg;
    if (!success) msgSpan.style.color = 'red';
    else {
        if(!isDark) msgSpan.style.color = 'black';
        else msgSpan.style.color = 'white';
    }

    if (confirm) {
        confirmPopup.hidden = false;
        closePopup.children[0].innerText = 'Cancel';
    } else {
        confirmPopup.hidden = true;
        closePopup.children[0].innerText = 'OK';
    }

    overlay.style.display = 'block';
    popup.style.display = 'block';

    closePopup.onclick = function () {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    };
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
if (getCookie('theme')==='dark'){
    isDark = true;
    darkBtn.checked = true;
    document.getElementById('navbarBrand').src = "/images/brandWhite.png"
    document.body.classList.add("dark-mode");
    darkBtn.innerText = isDark ? 'light' : 'dark';
}else{
    darkBtn.checked = false;
    document.getElementById('navbarBrand').src = "/images/brandBlack.png"
    setCookie('theme', 'light', 365000);
}

darkBtn.onclick = e => {
    darkBtn.innerText = isDark ? 'dark' : 'light'
    document.body.classList.toggle("dark-mode");
    isDark = !isDark;
    if (isDark) document.getElementById('navbarBrand').src = "/images/brandWhite.png";
    else document.getElementById('navbarBrand').src = "/images/brandBlack.png";
    setCookie('theme', isDark ? 'dark' : 'light', 365000);
}

if (typeof module != 'undefined') {
    module.exports = { isEmpty }
}