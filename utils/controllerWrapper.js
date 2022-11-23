/**
 * Wraps the controller to kill it after timeout if it takes
 * too long to respond.
 * Set timeout to -1 to prevent timeout
 * @param {Function} controller controller to wrap
 * @param {number} timeout timeout in milliseconds
 * @returns {void}
 */
module.exports = (controller, timeout = 5000) => {
    return async (req, res, next) => {
        try {
            let timeoutId = null;
            let killed = false;
            let endRes = true;
            // set timeout
            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    endRes = false;
                    killed = true;
                    res.end();
                }, timeout);
            }

            // override methods of the responce object
            const response = {};
            response.prototype = res;
            response.json = function () {
                if (!killed) {
                    this.prototype.json(...arguments);
                }
            }
            response.render = function () {
                if (!killed) {
                    this.prototype.render(...arguments);
                }
            }
            response.redirect = function () {
                if (!killed) {
                    this.prototype.redirect(...arguments);
                }
            }

            // wrap the next() function to prevent res.end()
            const myNext = () => {
                endRes = false;
                next();
            }

            // call the controller
            try {
                let controllerResult = controller(req, response, myNext);
                if (controllerResult instanceof Promise) {
                    await controllerResult;
                }
            } catch (e) {
            }

            // controller exited. don't kill
            if (timeoutId != null) clearTimeout(timeoutId);
            if (endRes) {
                res.end();
            }
        } catch (e) {
        }
    }
}