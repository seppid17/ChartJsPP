const dotenv = require("dotenv");
const { json } = require("express");
dotenv.config({ path: "test/.env" });
const superagent = require('superagent');

const user1 = superagent.agent();
const domain = process.env.SERVER_DOMAIN;


beforeAll(async () => {
    let res = await user1
        .post(domain + "/login")
        .send({ email: process.env.EMAIL, password: process.env.PASSWORD })
});

let isJson = jsonstr => {
    try {
        let obj = JSON.parse(jsonstr);
        return true;
    } catch (e) {
        return false;
    }
}
/**
 * This test cases for deleteAccount function that is in the accountController.js file.
 * This function uses to delete the user account after validating the user current password
 * .This testcases check those validation process.
 */

test('Test 1: Password cannot be empty', async () => {
    let res = await user1.post(domain + "/account/delete").send({});
    let text = res.text
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Password cannot be empty");
});

test("Test 2: invalid password type", async () => {
    let res = await user1.post(domain + "/account/delete").send({ password: 12345 });
    let text = res.text
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Invalid password format");
});


test("Test 3: Incorrect password", async () => {
    let res = await user1.post(domain + "/account/delete").send({ password: "Notpassword" });
    let text = res.text
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Incorrect password");
});