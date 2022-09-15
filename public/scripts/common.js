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
                    window.location = unauthorized;
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
 */
function keyPressFn(e, pattern, nextElem, btn = null, onfail = () => { }) {
    if (e.keyCode === 13) {
        e.preventDefault();
        let value = e.target.value.trim();
        if (!pattern.test(value)) {
            onfail();
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