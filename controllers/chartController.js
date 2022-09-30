const { ChartInfo, ChartData } = require("../models/Chart");
const Validator = require("../utils/validator");
const crypto = require('crypto');

const saveChart = (req, res) => {
    let { name, thumbnail, type, data, properties, id } = req.body;
    if (id == undefined) {
        id = crypto.randomBytes(16).toString('hex');
    }
    const user = req.session.user;
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
};

module.exports = { saveChart };