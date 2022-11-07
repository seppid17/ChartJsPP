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
    let res = await user1.post(domain + '/signup').send({ password: "password", firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Email cannot be empty');

});

test('Test 2: invalid email', async () => {
    let res = await user1.post(domain + '/signup').send({ email: 'invalidEmail', password: "password", firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Invalid email');

});

test('Test 3: empty firstname', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: "password", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Name cannot be empty');

});

test('Test 4: invalid firstname', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: "password", firstName: 1234, lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Invalid first name');

});
test('Test 5: empty firstname', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: "password", firstName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Name cannot be empty');

});

test('Test 6: invalid lastname', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: "password", firstName: "dumyfirstname", lastName: 12345 });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Invalid last name');

});

test('Test 7: empty password', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Password cannot be empty');

});

test('Test 8: invalid password', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: 1234, firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('Invalid password');

});

test('Test 9: exist email', async () => {
    let res = await user1.post(domain + '/signup').send({ email: process.env.EMAIL, password: "password", firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeFalsy();
    expect(obj.reason).toEqual('This email already exists');

});

test('Test 10: signup to new account', async () => {
    let res = await user1.post(domain + '/signup').send({ email: 'dumyemailforseproject@gmail.com', password: "password", firstName: "dumyfirstname", lastName: "dumylastname" });
    let text = res.text;
    expect(isJson(text)).toBeTruthy();
    let obj = JSON.parse(text);
    expect(obj.success).toBeTruthy();


});
