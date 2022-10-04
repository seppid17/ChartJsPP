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

test('Test 1: Valid email',()=>{
    expect(Validator.validate('email',validEmail)).toBeTruthy();
});
test('Test 2: Valid password',()=>{
expect(
    Validator.validate('password',validPassword)).toBeTruthy();
});
test('Test 3: Valid name',()=>{
    expect(
        Validator.validate('name',validName)).toBeTruthy();
});
test('Test 4: Valid token',()=>{
    expect(
        Validator.validate('token',validToken)).toBeTruthy();
});

/**
 This test cases are used to check the invalid user inputs
 */

const invalidEmail = 'namegvhdghnbjnamegvhdghnbjnabcdefghijklmnopqrstuvwxyz1999@gmail.com'; //charactor length is  more than 40
const invalidPassword = '1234ASVGBH345#$abcd@#$'; //charactor length is  more than 15
const invalidName = 'UsernameUsernameUsernameUsername'; //charactor length is more than 30
const invalidToken = '1652436413abcef12345678991652436413abcef1234567899' //charactor length is more than 32
const invalidtype = 123455; // input type is not string
test('Test 5: inValid email',()=>{
    expect(Validator.validate('email',invalidEmail)).toBeFalsy();
});
test('Test 7: inValid password',()=>{
expect(
    Validator.validate('password',invalidPassword)).toBeFalsy();
});
test('Test 8: inValid name',()=>{
    expect(
        Validator.validate('name',invalidName)).toBeFalsy();
});
test('Test 9: inValid token',()=>{
    expect(
        Validator.validate('token',invalidToken)).toBeFalsy();
});
test('Test 10: input type is not string',()=>{
    expect(
        Validator.validate('token',invalidtype)).toBeFalsy();
});
