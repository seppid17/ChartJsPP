//======================
const functions =require('../public/scripts/parseData');
const function2 =require('../public/scripts/common');

/*Unit testing for parseData.js */
/*
Function name : parseCSV(csv);
There are two functions inside this, extractCSV(csv) and removeIDs(json, list).
This functions are also checked.
    testing 1 
    valid data input, const data = '1,0,A,5\n2,0,B,6\n3,0,A,5\n4,0,B,6';
    
    testing 2
    Invalid data input, const err_data = '1,A,5\n2,0,B,6';
 */
const data = '1,0,A,5\n2,0,B,6\n3,0,A,5\n4,0,B,6';
const obj =[{n:'A',v:[5],c:[]},{n:'B',v:[6],c:[]},{n:'A',v:[5],c:[]},{n:'B',v:[6],c:[]}];
test('Testing valid data input',()=>{
    expect(functions.parseCSV(data)).toEqual(obj);
});
const err_data1 = '1,A,5\n2,B,6'; // line data less than 4
test('Row data less than 4',()=>{
    expect(functions.parseCSV(err_data1)).toBeNull();
});
const err_data2 = '!,0,A,5\n^,0,B,6'; //  id(first element of data set) contains this symbols  "!/^\d+$/" 
test('Id contain invalid symbol',()=>{
    expect(functions.parseCSV(err_data2)).toBeNull();
});
const err_data3 = '-1,0,A,5\n-2,0,B,6'; // id less than zero
test('Id less than zero',()=>{
    expect(functions.parseCSV(err_data3)).toBeNull();
});
const err_data4 = '-1,0,!,5\n-2,0,^,6'; // parent(3rd element) contains this symbols  "!/^\d+$/"
test('Parent contain invalid symbol',()=>{
    expect(functions.parseCSV(err_data4)).toBeNull();
});
const err_data5 = '1,0,2,5\n1,0,4,6'; // duplicate id
test('Duplicate Id value',()=>{
    expect(functions.parseCSV(err_data5)).toBeNull();
});

/*Unit testing for common.js */
let str1 = '' // Empty string
test('The emptiness of string',()=>{expect(function2.isEmpty(str1)).toBeTruthy()});
let str2 = 'Not Empty string' // The sting is not empty
test('The nmber string',()=>{expect(function2.isEmpty(str2)).toBeFalsy()});