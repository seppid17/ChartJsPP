//======================
const functions = require('../public/scripts/common');

/*Unit testing for common.js 

Function names: isEmpty(str)
                isEmail(email)
                isPassword(passwd)
                isName(name)
                isEqual(dataOne, dataTwo)*/

test('Test 1: isEmpty',()=>{
    expect(functions.isEmpty('')).toBeTruthy(); //empty
    expect(functions.isEmpty('Non empty string')).toBeFalsy(); //non empty
});

test('Test 2: isEmail',()=>{
    expect(functions.isEmail('sample@gmail.com')).toBeTruthy();
    expect(functions.isEmail('abc@.com')).toBeFalsy();
    expect(functions.isEmail('abc  12@gmail.com')).toBeFalsy();
    expect(functions.isEmail('abc  12.com')).toBeFalsy();
});

test('Test 2: isPassword',()=>{
    expect(functions.isPassword('123456789')).toBeTruthy();
    expect(functions.isPassword('ad fss 35')).toBeFalsy();
    expect(functions.isPassword('12@gm1314')).toBeTruthy();
});

test('Test 2: isName',()=>{
    expect(functions.isName('test')).toBeTruthy();
    expect(functions.isName('@.com')).toBeFalsy();
});

test('Test 2: isEqual',()=>{
    expect(functions.isEqual('sample@gmail.com', 'sample@gmail.com')).toBeTruthy();
    expect(functions.isEqual('abc@.com', ' abc@.com')).toBeFalsy();
});