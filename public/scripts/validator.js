class Validator {

    // maximum length for the fields
    static _lengthLimit = {
        email: 40,
        password: 15,
        name: 30,
        chartName: 40,
        token: 32,
        id: 32,
        date: 10
    }

    // regex patterns for the fields
    static _patterns = {
        email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        password: /^[\x21-\x7E]{8,15}$/,
        name: /^[A-Za-z]{2,30}$/,
        chartName: /^[\x20-\x7e]{1,40}$/,
        token: /^[0-9a-fA-F]{1,32}$/,
        id: /^[0-9a-fA-F]{1,32}$/,
        date: /^[1-3]?[0-9]\/(?:1[0-2]|[1-9])\/[0-9]{4}$/
    };

    // valid chart types
    static _chartTypes = ['bar', 'pie', 'line', 'doughnut', 'polarArea', 'radar', 'scatter', 'bubble', 'sunburst', 'treemap', 'icicle'];

    /**
     * Check if a string is a valid json encoded object.
     * @param {string} jsonstr string to be checked
     * @returns {boolean}
     */
    static _isJson(jsonstr) {
        try {
            if (!jsonstr) return false;
            let obj = JSON.parse(jsonstr);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Validates the value according to the type.
     * @param {string} type type of the string
     * @param {string} value value to be checked
     * @returns {boolean}
     */
    static validate(type, value) {
        try {
            if (typeof value !== 'string') return false;
            if (type == 'type') { // chart type
                return this._chartTypes.includes(value);
            }
            if (type == 'json') { // json serialized string
                return this._isJson(value);
            }
            if (!this._lengthLimit.hasOwnProperty(type)) return false; // unknown type
            if (value.length > this._lengthLimit[type]) return false; // too long
            return this._patterns[type].test(value); // invalid
        } catch (e) {
            return false;
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = Validator;
}