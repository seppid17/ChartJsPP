const { ChartInfo, ChartData } = require("../models/Chart");
const Validator = require("../public/scripts/validator");
const crypto = require('crypto');

/**
 * Save a chart
 * @param {object} req request
 * @param {object} res response
 * @returns {void}
 */
const saveChart = async (req, res) => {
    try {
        let { name, thumbnail, type, data, properties, id } = req.body;

        // Validate the request parameters
        if (!name) {
            res.json({ 'success': false, 'reason': 'Name cannot be empty', 'field': 'name' });
            return;
        }
        if (!Validator.validate('chartName', name)) {
            res.json({ 'success': false, 'reason': 'Invalid name', 'field': 'name' });
            return;
        }
        if (!type) {
            res.json({ 'success': false, 'reason': 'Type cannot be empty', 'field': 'type' });
            return;
        }
        if (!Validator.validate('type', type)) {
            res.json({ 'success': false, 'reason': 'Invalid type', 'field': 'type' });
            return;
        }
        if (!data) {
            res.json({ 'success': false, 'reason': 'Data cannot be empty', 'field': 'data' });
            return;
        }
        if (!Validator.validate('json', data)) {
            res.json({ 'success': false, 'reason': 'Invalid data', 'field': 'data' });
            return;
        }
        if (!properties) {
            res.json({ 'success': false, 'reason': 'Properties cannot be empty', 'field': 'properties' });
            return;
        }
        if (!Validator.validate('json', properties)) {
            res.json({ 'success': false, 'reason': 'Invalid properties', 'field': 'properties' });
            return;
        }
        if (!thumbnail) {
            res.json({ 'success': false, 'reason': 'Thumbnail cannot be empty', 'field': 'thumbnail' });
            return;
        }

        const user = req.session.user;

        // set last modified date
        var date = new Date();
        var dateStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

        // if id is undefined, save as new chart
        if (id == undefined) {
            let count = await ChartInfo.countDocuments({ owner: user.email });
            // a user account can have only upto 5 charts saved
            if (count >= 5) {
                res.json({ 'success': false, 'reason': 'You cannot save more than 5 charts' });
                return;
            }

            // generate a new id for the chart
            id = crypto.randomBytes(16).toString('hex');

            let chartInfo = { id: id, owner: user.email, name: name, shared: false, lastModified: dateStr, thumbnail: thumbnail };
            let infoDoc = await ChartInfo.findOneAndUpdate({ id: id }, { $setOnInsert: chartInfo }, { upsert: true });
            if (infoDoc && !infoDoc.isNew) {
                res.json({ 'success': false });
                return;
            }

            let chartData = { id: id, type: type, data: data, properties: properties };
            let dataDoc = await ChartData.findOneAndUpdate({ id: id }, { $setOnInsert: chartData }, { upsert: true });
            if (dataDoc && !dataDoc.isNew) {
                res.json({ 'success': false });
                return;
            }
            res.json({ 'success': true, 'id': id });
        } else {
            // if id is defined, update that id
            // validate id
            if (!id) {
                res.json({ 'success': false, 'reason': 'Id cannot be empty', 'field': 'id' });
                return;
            }
            if (!Validator.validate('id', id)) {
                res.json({ 'success': false, 'reason': 'Invalid id', 'field': 'id' });
                return;
            }

            let chartInfo = { name: name, lastModified: dateStr, thumbnail: thumbnail };
            let infoDoc = await ChartInfo.findOneAndUpdate({ id: id, owner: user.email }, chartInfo);
            if (!infoDoc) {
                res.json({ 'success': false });
                return;
            }

            let chartData = { id: id, type: type, data: data, properties: properties };
            let doc = await ChartData.findOneAndUpdate({ id: id }, chartData);
            if (!doc) {
                res.json({ 'success': false });
                return;
            }
            res.json({ 'success': true });
        }
    } catch (e) {
        console.log(e);
        res.json({ 'success': false });
    }
};

/**
 * Get the name, owner and shared info of the chart.
 * Returns null if a chart is not found.
 * @param {string} id chart ID
 * @returns {object|null}
 */
async function getChartInfo(id) {
    var chartInfo = await ChartInfo.findOne({ id: id }, { thumbnail: 0, lastModified: 0 });
    if (!chartInfo) {
        return null;
    }
    var info = {
        name: chartInfo.name,
        shared: chartInfo.shared,
        owner: chartInfo.owner
    }
    return info;
}

/**
 * Get the type, data and properties of the chart.
 * Returns null if a chart is not found.
 * @param {string} id chart ID
 * @returns {object|null}
 */
async function getChartData(id) {
    var chartData = await ChartData.findOne({ id: id });
    if (!chartData) {
        return null;
    }
    var data = {
        type: chartData.type,
        data: chartData.data,
        properties: chartData.properties
    }
    return data;
}

/**
 * Get the type, data and properties of the chart.
 * Sends failure if a chart is not found.
 * @param {string} id chart ID
 * @returns {void}
 */
const retrieveChartCommon = async (req, res, owner) => {
    let { id } = req.body;
    // validate id
    if (!id) {
        res.json({ 'success': false, 'reason': 'No chart ID provided', 'field': 'id' });
        return;
    }
    if (!Validator.validate('id', id)) {
        res.json({ 'success': false, 'reason': 'Invalid id', 'field': 'id' });
        return;
    }

    try {
        let chartInfo = await getChartInfo(id);
        if (chartInfo == null) {
            res.json({ 'success': false, 'reason': 'Chart not found' });
            return;
        }
        // cannot get without login
        if (!chartInfo.shared && owner == null) {
            res.json({ 'success': false, 'reason': 'NotShared' });
            return;
        }
        // not the owner and not shared
        if (!chartInfo.shared && chartInfo.owner !== owner) {
            res.json({ 'success': false, 'reason': 'You are not the owner of this chart' });
            return;
        }

        // don't show the owner's email to others
        if (owner == null || chartInfo.owner !== owner) {
            chartInfo.owner = null;
        }

        let chartData = await getChartData(id);
        if (chartData == null) {
            res.json({ 'success': false });
            return;
        }
        res.json({ 'success': true, 'info': chartInfo, 'data': chartData });
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
};

/**
 * Get a shared chart
 * @param {object} req request
 * @param {object} res response
 * @returns {void}
 */
const retrieveSharedChart = (req, res) => {
    return retrieveChartCommon(req, res, null);
};

/**
 * Get a chart by the owner
 * @param {object} req request
 * @param {object} res response
 * @returns {void}
 */
const retrieveChart = (req, res) => {
    const user = req.session.user;
    return retrieveChartCommon(req, res, user.email);
};

/**
 * Get a list of charts owned by the owner
 * @param {string} owner owner's email
 * @returns {Array|null}
 */
async function getChartsByOwner(owner) {
    var chartInfo = await ChartInfo.find({ owner: owner });
    if (!chartInfo) {
        return null;
    }
    let charts = [];
    chartInfo.forEach(chart => {
        let info = {
            id: chart.id,
            name: chart.name,
            lastModified: chart.lastModified,
            thumbnail: chart.thumbnail,
            shared: chart.shared
        };
        charts.push(info);
    })
    return charts;
}

/**
 * Get a list of charts owned by the owner
 * @param {object} req request
 * @param {object} res response
 * @returns {void}
 */
const getChartList = async (req, res) => {
    const user = req.session.user;
    try {
        let chartInfo = await getChartsByOwner(user.email);
        if (chartInfo == null) {
            res.json({ 'success': false });
            return;
        }
        res.json({ 'success': true, info: chartInfo });
        return;
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
};

/**
 * Delete a chart by id
 * @param {object} req request
 * @param {object} res response
 * @returns {void}
 */
const deleteChart = async (req, res) => {
    let { id } = req.body;
    const user = req.session.user;
    // validate id
    if (!id) {
        res.json({ 'success': false, 'reason': 'No chart ID provided', 'field': 'id' });
        return;
    }
    if (!Validator.validate('id', id)) {
        res.json({ 'success': false, 'reason': 'Invalid id', 'field': 'id' });
        return;
    }

    try {
        let infoResult = await ChartInfo.deleteOne({ id: id, owner: user.email });
        if (infoResult.acknowledged !== true || infoResult.deletedCount <= 0) {
            res.json({ 'success': false });
            return;
        }
        let dataResult = await ChartData.deleteOne({ id: id });
        if (dataResult.acknowledged !== true || dataResult.deletedCount <= 0) {
            res.json({ 'success': false });
            return;
        }
        res.json({ 'success': true });
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
};

/**
 * set a chart shared or unshared
 * @param {boolean} share whether the chart is shared or not
 * @param {object} req request
 * @param {object} res response
 * @returns {void}
 */
async function setShareStatus(share, req, res) {
    let { id } = req.body;
    const user = req.session.user;
    // validate id
    if (!id) {
        res.json({ 'success': false, 'reason': 'No chart ID provided', 'field': 'id' });
        return;
    }
    if (!Validator.validate('id', id)) {
        res.json({ 'success': false, 'reason': 'Invalid id', 'field': 'id' });
        return;
    }

    try {
        let doc = await ChartInfo.findOneAndUpdate({ id: id, owner: user.email }, { shared: share });
        let success = (doc != null);
        res.json({ 'success': success });
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
}

/**
 * set a chart shared
 * @param {object} req request
 * @param {object} res response
 * @returns {void}
 */
const shareChart = (req, res) => {
    return setShareStatus(true, req, res);
};

/**
 * set a chart unshared
 * @param {object} req request
 * @param {object} res response
 * @returns {void}
 */
const unshareChart = (req, res) => {
    return setShareStatus(false, req, res);
};

module.exports = { saveChart, retrieveSharedChart, retrieveChart, getChartList, deleteChart, shareChart, unshareChart };