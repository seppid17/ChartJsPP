const { ChartInfo, ChartData } = require("../models/Chart");
const Validator = require("../utils/validator");
const crypto = require('crypto');

const saveChart = async (req, res) => {
    try {
        let { name, thumbnail, type, data, properties, id } = req.body;
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
        var date = new Date();
        var dateStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        if (id == undefined) {
            let count = await ChartInfo.countDocuments({ owner: user.email });
            if (count >= 5) {
                res.json({ 'success': false, 'reason': 'You cannot save more than 5 charts' });
                return;
            }
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

async function getChartInfo(id) {
    var filters = { id: id };
    var chartInfo = await ChartInfo.findOne(filters);
    if (!chartInfo) {
        return null;
    }
    var info = {
        name: chartInfo.name,
        thumbnail: chartInfo.thumbnail,
        shared: chartInfo.shared,
        owner: chartInfo.owner
    }
    return info;
}

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

const retrieveChartCommon = async (req, res, owner) => {
    let { id } = req.body;
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
        if (!chartInfo.shared && owner == null) {
            res.json({ 'success': false, 'reason': 'NotShared' });
            return;
        }
        if (!chartInfo.shared && chartInfo.owner !== owner) {
            res.json({ 'success': false, 'reason': 'You are not the owner of this chart' });
            return;
        }
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

const retrieveSharedChart = async (req, res) => {
    return await retrieveChartCommon(req, res, null);
};

const retrieveChart = async (req, res) => {
    const user = req.session.user;
    return await retrieveChartCommon(req, res, user.email);
};

async function getChartsByOwner(owner) {
    var filters = { owner: owner };
    var chartInfo = await ChartInfo.find(filters);
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

const deleteChart = async (req, res) => {
    let { id } = req.body;
    const user = req.session.user;
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

async function setShareStatus(share, req, res) {
    let { id } = req.body;
    const user = req.session.user;
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

const shareChart = (req, res) => {
    return setShareStatus(true, req, res);
};

const unshareChart = (req, res) => {
    return setShareStatus(false, req, res);
};

module.exports = { saveChart, retrieveSharedChart, retrieveChart, getChartList, deleteChart, shareChart, unshareChart };