const Validator = require('../utils/validator');
/*
Unit testing for user data validator class
*/
/**
 This test cases are used to check the valid user inputs
 */
const validEmail = 'name1999@gmail.com';
const validPassword = '1234abcd@#$';
const validName = 'Username';
const validToken = '1652436413abcef'
const validJson = JSON.stringify({a:[1,2], 1:{x:1,y:2}, xyz:"12xyz"});

test('Test 1: Valid email', () => {
    expect(Validator.validate('email', validEmail)).toBeTruthy();
});
test('Test 2: Valid password', () => {
    expect(
        Validator.validate('password', validPassword)).toBeTruthy();
});
test('Test 3: Valid name', () => {
    expect(
        Validator.validate('name', validName)).toBeTruthy();
});
test('Test 4: Valid token', () => {
    expect(
        Validator.validate('token', validToken)).toBeTruthy();
});
test('Test 5: Valid JSON', () => {
    expect(
        Validator.validate('json', validJson)).toBeTruthy();
});


/**
 This test cases are used to check the invalid user inputs
 */

const invalidEmail = 'namegvhdghnbjnamegvhdghnbjnabcdefghijklmnopqrstuvwxyz1999@gmail.com'; //charactor length is  more than 40
const invalidPassword = '1234ASVGBH345#$abcd@#$'; //charactor length is  more than 15
const invalidName = 'UsernameUsernameUsernameUsername'; //charactor length is more than 30
const invalidToken = '1652436413abcef12345678991652436413abcef1234567899' //charactor length is more than 32
const invalidJson = "{\"a\":[1,2], [ abc}";
const invalidtype = 123455; // input type is not string
test('Test 6: Invalid email', () => {
    expect(Validator.validate('email', invalidEmail)).toBeFalsy();
});
test('Test 7: Invalid password', () => {
    expect(
        Validator.validate('password', invalidPassword)).toBeFalsy();
});
test('Test 8: Invalid name', () => {
    expect(
        Validator.validate('name', invalidName)).toBeFalsy();
});
test('Test 9: Invalid token', () => {
    expect(
        Validator.validate('token', invalidToken)).toBeFalsy();
});
test('Test 10: Invalid JSON', () => {
    expect(
        Validator.validate('json', invalidJson)).toBeFalsy();
});
test('Test 11: input type is not string', () => {
    expect(
        Validator.validate('token', invalidtype)).toBeFalsy();
});
