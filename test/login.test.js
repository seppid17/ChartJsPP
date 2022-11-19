const dotenv = require("dotenv");
const { json } = require("express");
dotenv.config({ path: "test/test.env" });
const superagent = require('superagent');
const user1 = superagent.agent();
const domain = 'http://localhost:' + process.env.PORT;

let isJson = jsonstr => {
    try {
        let obj = JSON.parse(jsonstr);
        return true;
    } catch (e) {
        return false;
    }
}

test('Test 1: empty email', async () => {
    let res = await user1.post(domain + "/login").send({ password: process.env.PASSWORD });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Email cannot be empty");

});

test('Test 2: invalid email format', async () => {
    let res = await user1.post(domain + "/login").send({ email: "invlaidEmail", password: process.env.PASSWORD });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Invalid email format");

});

test('Test 3: empty password', async () => {
    let res = await user1.post(domain + "/login").send({ email: process.env.EMAIL });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Password cannot be empty");

});

test('Test 4: invalid password format', async () => {
    let res = await user1.post(domain + "/login").send({ email: process.env.EMAIL, password: '1234' });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Invalid password format");

});

test('Test 5: incorrect password', async () => {
    let res = await user1.post(domain + "/login").send({ email: process.env.EMAIL, password: process.env.PASSWORD + "invalid" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Incorrect password");

});

test('Test 6: successfully loging ', async () => {
    let res = await user1.post(domain + "/login").send({ email: process.env.EMAIL, password: process.env.PASSWORD });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeTruthy();


});