const functions =require('../public/scripts/parseData');
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
const data = '1,0,A,5,6,8\n2,0,B,6\n3,0,A,5\n4,0,B,6';
const obj =[{n:'A',v:[5],c:[]},{n:'B',v:[6],c:[]},{n:'A',v:[5],c:[]},{n:'B',v:[6],c:[]}];

const err_data1 = '1,A,5\n2,B,6'; // line data less than 4
const err_data2 = '!,0,A,5\n^,0,B,6'; //  id(first element of data set) contains this symbols  "!/^\d+$/"  
const err_data3 = '-1,0,A,5\n-2,0,B,6'; // id less than zero
const err_data4 = '-1,0,!,5\n-2,0,^,6'; // parent(3rd element) contains this symbols  "!/^\d+$/"
const err_data5 = '1,0,2,5\n1,0,4,6'; // duplicate id
test('Testing valid data input',()=>{
    expect(functions.parseCSV(data)).toEqual(obj);
});
test('Testing invalid data input',()=>{
    expect(functions.parseCSV(err_data1)).toBeNull();
    expect(functions.parseCSV(err_data2)).toBeNull();
    expect(functions.parseCSV(err_data3)).toBeNull();
    expect(functions.parseCSV(err_data4)).toBeNull();
    expect(functions.parseCSV(err_data5)).toBeNull();
});

