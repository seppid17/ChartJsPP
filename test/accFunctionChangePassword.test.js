const dotenv = require("dotenv");
const { json } = require("express");
dotenv.config({ path: "test/test.env" });
const superagent = require('superagent');
const user1 = superagent.agent();
const domain = 'http://localhost:' + process.env.PORT;


beforeAll(async () => {
    let res = await user1.post(domain + "/login").send({ email: process.env.EMAIL, password: process.env.PASSWORD });
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
 * This test cases for changePasswd function that is in the accountController.js file.
 * This function uses to change the user account password after validating the user current password
 * and new password.This testcases check those validation process.
 */

test("Test 1: current password empty", async () => {
    let res = await user1.post(domain + "/account/password").send({ newPassword: "newpassword" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Password cannot be empty");
});

test("Test 2: current password validation", async () => {
    let res = await user1.post(domain + "/account/password").send({ curPassword: 1234, newPassword: "password" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Invalid password format");
});

test("Test 3: new password empty", async () => {
    let res = await user1.post(domain + "/account/password").send({ curPassword: process.env.PASSWORD });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Password cannot be empty");
});

test("Test 4: new password validation", async () => {
    let res = await user1.post(domain + "/account/password").send({ curPassword: process.env.PASSWORD, newPassword: 1234 });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Invalid password format");
});

test("Test 5: Incorrect password", async () => {
    let res = await user1.post(domain + "/account/password").send({ curPassword: "Notpassword", newPassword: "password" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Incorrect password");
});

test("Test 6: change password", async () => {
    // updates the password with the same password to prevent password change after test
    let res = await user1.post(domain + "/account/password").send({ curPassword: process.env.PASSWORD, newPassword: process.env.PASSWORD });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeTruthy();

});