require("dotenv").config({ path: ".env" });
const mongoose = require('mongoose');
const database = process.env.MONGO_URI;
const { ChartInfo, ChartData } = require("../models/Chart");
const User = require("../models/User");
const SignupRequest = require("../models/SignupRequest");
const Validator = require('../utils/validator');

let chartInfo, chartData, users, signupRequests

beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
        .catch(err => console.log(err));

    chartInfo = await ChartInfo.find({}); // ,{thumbnail:0}
    chartData = await ChartData.find({}); // ,{data:0}
    users = await User.find({ active: true });
    signupRequests = await SignupRequest.find({});
});


test('Test 1: All charts must have info and data', () => {
    expect(chartInfo).toBeInstanceOf(Array);
    expect(chartData).toBeInstanceOf(Array);
    expect(chartData.length == chartInfo.length).toBeTruthy();
});

test('Test 2: Chart ID must be unique', () => {
    let ids = chartInfo.map(item => { return item.id; })
        .filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    expect(ids.length == chartInfo.length).toBeTruthy();
});

test('Test 3: Each chart ID must exist in info and data collections', () => {
    let ids = chartInfo.map(item => { return item.id; });
    chartData.forEach(item => {
        expect(ids).toContain(item.id);
        let ind = ids.indexOf(item.id);
        ids.splice(ind, 1);
    });
});

test('Test 4: User email must be unique', () => {
    let emails = users.map(user => { return user.email; })
        .filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    expect(emails.length == users.length).toBeTruthy();
});

test('Test 5: User email must exist in signup requests', () => {
    let emails = signupRequests.map(request => { return request.email; })
        .filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    users.forEach(user => {
        expect(emails).toContain(user.email);
        let ind = emails.indexOf(user.email);
        emails.splice(ind, 1);
    });
});

test('Test 6: Charts must have an existing owner', () => {
    let emails = users.map(request => { return request.email; });
    chartInfo.forEach(item => {
        expect(emails).toContain(item.owner);
    });
});

test('Test 7: Charts must have valid name,owner,lastModified,thumbnail', () => {
    chartInfo.forEach(item => {
        expect(Validator.validate('email', item.owner)).toBeTruthy();
        expect(Validator.validate('chartName', item.name)).toBeTruthy();
        expect(item.lastModified).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4}$/);
        expect(item.thumbnail.length > 0).toBeTruthy();
    });
});

test('Test 8: Charts must have valid data,properties,type', () => {
    let isJson = jsonstr => {
        try {
            let obj = JSON.parse(jsonstr);
            return true;
        } catch (e) {
            return false;
        }
    }
    chartData.forEach(item => {
        expect(isJson(item.data)).toBeTruthy();
        expect(isJson(item.properties)).toBeTruthy();
        expect(item.type.length > 0).toBeTruthy();
    });
});

test('Test 8: Users must have valid email,firstName,lastName', () => {
    users.forEach(user => {
        expect(Validator.validate('email', user.email)).toBeTruthy();
        expect(Validator.validate('name', user.firstName)).toBeTruthy();
        expect(Validator.validate('name', user.lastName)).toBeTruthy();
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});