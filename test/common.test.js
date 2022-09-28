//======================
const function2 =require('../public/scripts/common');

/*Unit testing for common.js */

let str1 = '' // Empty string
test('Test 1: The emptiness of string',()=>{
    expect(function2.isEmpty(str1)).toBeTruthy();
});

let str2 = 'Not Empty string' // The sting is not empty
test('Test 2: The not empty string',()=>{
    expect(function2.isEmpty(str2)).toBeFalsy();
});
