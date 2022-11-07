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

test('Test 1: empty password', async () => {
    let res = await user1.post(domain + '/activate/dumyemailforseproject@gmail.com/9aca6938d193b8d60d50f5c040a0e1ac').send({});
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Password cannot be empty');

});

test('Test 2: invalid email', async () => {
    let res = await user1.post(domain + '/activate/dumyemail/9aca6938d193b8d60d50f5c040a0e1ac').send({ password: "password" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Account activation failed! Invalid email format.');

});

test('Test 3: invalid password format', async () => {
    let res = await user1.post(domain + '/activate/dumyemailforseproject@gmail.com/9aca6938d193b8d60d50f5c040a0e1ac').send({ password: 12345 });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Invalid password format.');

});

test('Test 4: invalid token format', async () => {
    let res = await user1.post(domain + '/activate/dumyemailforseproject@gmail.com/invalidtoken@').send({ password: "password" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Account activation failed! Invalid token format.');

});