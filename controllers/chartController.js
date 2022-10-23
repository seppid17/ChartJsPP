const { ChartInfo, ChartData } = require("../models/Chart");
const Validator = require("../utils/validator");
const crypto = require('crypto');

const saveChart = async (req, res) => {
    try {
        let { name, thumbnail, type, data, properties, id } = req.body;
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
            ChartInfo.findOneAndUpdate({ id: id }, { $setOnInsert: chartInfo }, { upsert: true }, (err, doc) => {
                if (err || (doc && !doc.isNew)) {
                    console.log(err);
                    res.json({ 'success': false });
                    return;
                }
                let chartData = { id: id, type: type, data: data, properties: properties };
                ChartData.findOneAndUpdate({ id: id }, { $setOnInsert: chartData }, { upsert: true }, (err, doc) => {
                    if (err || (doc && !doc.isNew)) {
                        console.log(err);
                        res.json({ 'success': false });
                        return;
                    }
                    res.json({ 'success': true, 'id': id });
                });
            });
        } else {
            let chartInfo = { name: name, lastModified: dateStr, thumbnail: thumbnail };
            ChartInfo.findOneAndUpdate({ id: id, owner: user.email }, chartInfo).then(doc => {
                if (!doc) {
                    res.json({ 'success': false });
                    return;
                }
                let chartData = { id: id, type: type, data: data, properties: properties };
                ChartData.findOneAndUpdate({ id: id }, chartData).then(doc => {
                    res.json({ 'success': true });
                }).catch(err => {
                    console.log(err);
                    res.json({ 'success': false });
                });
            }).catch(err => {
                console.log(err);
                res.json({ 'success': false });
            });
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
    if (id == undefined) {
        console.log('no id');
        res.json({ 'success': false, 'reason': 'No chart ID provided' });
    } else {
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
            thumbnail: chart.thumbnail
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
    if (id == undefined) {
        console.log('no id');
        res.json({ 'success': false, 'reason': 'No chart ID provided' });
    } else {
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
    }
};

const shareChart = async (req, res) => {
    let { id } = req.body;
    const user = req.session.user;
    if (id == undefined) {
        console.log('no id');
        res.json({ 'success': false, 'reason': 'No chart ID provided' });
    } else {
        try {
            let doc = await ChartInfo.findOneAndUpdate({ id: id, owner: user.email }, { shared: true });
            let success = (doc != null);
            res.json({ 'success': success });
        } catch (err) {
            console.log(err);
            res.json({ 'success': false });
        }
    }
};

module.exports = { saveChart, retrieveSharedChart, retrieveChart, getChartList, deleteChart, shareChart };