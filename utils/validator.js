class Validator {

    static _lengthLimit = {
        email: 40,
        password: 15,
        name: 30,
        token: 32
    }
    static _patterns = {
        email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        password: /^[\x21-\x7E]{8,15}$/,
        name: /^[A-Za-z]{2,30}$/,
        token: /^[0-9a-fA-F]{1,32}$/
    };

    static validate(type, value) {
        try {
            if (typeof value !== 'string') return false;
            if (value.length > this._lengthLimit[type]) return false;
            return this._patterns[type].test(value);
        } catch (e) {
            return false;
        }
    }
}

module.exports = Validator;