module.exports = (controller, timeout = 5000) => {
    return async (req, res, next) => {
        try {
            let timeoutId = null;
            let killed = false;
            let endRes = true;
            if (timeout > 0) {
                timeoutId = setTimeout(() => {
                    endRes = false;
                    killed = true;
                    res.end();
                }, timeout);
            }
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
            const myNext = () => {
                endRes = false;
                next();
            }
            try {
                let controllerResult = controller(req, response, myNext);
                if (controllerResult instanceof Promise) {
                    await controllerResult;
                }
            } catch (e) {
            }
            if (timeoutId != null) clearTimeout(timeoutId);
            if (endRes) {
                res.end();
            }
        } catch (e) {
        }
    }
}