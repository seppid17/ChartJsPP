const { ChartInfo, ChartData } = require("../models/Chart");
const Validator = require("../utils/validator");
const crypto = require('crypto');

const saveChart = (req, res) => {
    let { name, thumbnail, type, data, properties, id } = req.body;
    const user = req.session.user;
    if (id == undefined) {
        id = crypto.randomBytes(16).toString('hex');
        let chartInfo = { id: id, owner: user.email, name: name, thumbnail: thumbnail };
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
        let chartInfo = { name: name, thumbnail: thumbnail };
        ChartInfo.findOneAndUpdate({ id: id, owner: user.email }, chartInfo).then(doc => {
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
};

async function getChartInfo(id, owner = null) {
    var filters = { id: id };
    if (owner != null) {
        filters.owner = owner;
    }
    var chartInfo = await ChartInfo.findOne(filters);
    if (!chartInfo) {
        return null;
    }
    var info = {
        name: chartInfo.name,
        thumbnail: chartInfo.thumbnail
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

const retrieveChart = async (req, res) => {
    let { id } = req.body;
    const user = req.session.user;
    if (id == undefined) {
        console.log('no id');
        res.json({ 'success': false, 'reason': 'No chart ID provided' });
    } else {
        try {
            let chartInfo = await getChartInfo(id, user.email);
            if (chartInfo == null) {
                res.json({ 'success': false });
                return;
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

module.exports = { saveChart, retrieveChart };