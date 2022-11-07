const dotenv = require("dotenv");
const { json } = require("express");
dotenv.config({ path: "test/test.env" });
const superagent = require('superagent');
const user1 = superagent.agent();
const domain = 'http://localhost:' + process.env.PORT;

let firstName = '', lastName = '';

beforeAll(async () => {
    let res = await user1.post(domain + '/login').send({ email: process.env.EMAIL, password: process.env.PASSWORD });
    try {
        res = await user1.get(domain + '/isLogged');
        let resUser = JSON.parse(res.text);
        ({ firstName, lastName } = resUser);
    } catch (e) { }
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
 * This test cases for changeName function that is in the accountController.js file.
 * This function uses to change the user firstname and lastname after validating the user password
 * ,firstname and lastname.This testcases check those validation process.
 */

test('Test 1: empty password', async () => {
    let res = await user1.post(domain + "/account/name").send({ firstName: "first", lastName: "last" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Password cannot be empty");

});

test('Test 2: empty firstname', async () => {
    let res = await user1.post(domain + "/account/name").send({ lastName: "last", password: process.env.PASSWORD });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Name cannot be empty");

});
test('Test 3: empty lastname', async () => {
    let res = await user1.post(domain + "/account/name").send({ firstName: "firstname", password: process.env.PASSWORD });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Name cannot be empty");

});
test('Test 4: invalid firstname type', async () => {
    let res = await user1.post(domain + "/account/name").send({ firstName: 1234, lastName: "last", password: process.env.PASSWORD });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Invalid name format");

});

test('Test 5: invalid lastname type', async () => {
    let res = await user1.post(domain + "/account/name").send({ firstName: "firstname", lastName: 12345, password: process.env.PASSWORD });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Invalid name format");

});

test('Test 6: invalid password type', async () => {
    let res = await user1.post(domain + "/account/name").send({ firstName: "firstname", lastName: "lastname", password: 1234 });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Invalid password format");

});

test('Test 7: invalid password matching', async () => {
    let res = await user1.post(domain + "/account/name").send({ firstName: "firstname", lastName: "lastname", password: "Notpassword" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual("Incorrect password");

});

test('Test 8: valid password', async () => {
    let res = await user1.post(domain + "/account/name").send({ firstName: firstName, lastName: lastName, password: process.env.PASSWORD });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeTruthy();


});


