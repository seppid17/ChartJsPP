module.exports = (controller, timeout = 5000) => {
    return async (req, res, next) => {
        let timeoutId = null;
        if (timeout > 0) {
            timeoutId = setTimeout(() => {
                res.end();
            }, timeout);
        }
        let endRes = true;
        let myNext = () => {
            endRes = false;
            next();
        }
        try {
            let controllerResult = controller(req, res, myNext);
            if (controllerResult instanceof Promise) {
                await controllerResult;
            }
        } catch (e) {
            console.log(e);
        }
        if (timeoutId != null) clearTimeout(timeoutId);
        if (endRes) {
            res.end();
        }
    }
}