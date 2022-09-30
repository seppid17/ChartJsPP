//======================
const functions =require('../public/scripts/parseData');

/*Unit testing for parseData.js

Function name : parseCSV(csv);
There are two functions inside this, extractCSV(csv) and removeIDs(json, list).
This functions are also checked.
    Test1 
    valid data input, const data = '1,0,A,5\n2,0,B,6\n3,0,A,5\n4,0,B,6';
    
    Other data sets are used to test the invalid data inputs
 */
const valid_data1 = '1,0,A,5\n2,0,B,6\n3,0,A,5\n4,0,B,6';
const output1 =[{n:'A',v:[5],c:[]},{n:'B',v:[6],c:[]},{n:'A',v:[5],c:[]},{n:'B',v:[6],c:[]}];
test('Test 1: Valid data input',()=>{
    expect(
        functions.parseCSV(valid_data1)).toEqual(output1);
});

const err_data1 = '1,0,A,5\n2,B,6'; // line data less than 4 (insufficent data)
test('Test 2: Insufficent data',()=>{
    expect(() => {
        functions.parseCSV(err_data1);
    }).toThrow('Insufficent data. Please check and upload again');
});

const err_data2 = '1,0,A,5\ne,0,B,6'; //  id (first element of data set) contains this symbols "!/^\d+$/" 
test('Test 3: Id contain symbols/letter',()=>{
    expect(() => {
        functions.parseCSV(err_data2)
    }).toThrow('Invalid id. Please check and upload again');
});

const err_data3 = '1,0,A,5\n-2,0,B,6'; // id less than zero
test('Test 4: Negative values for ID',()=>{
    expect(() => {
        functions.parseCSV(err_data3)
    }).toThrow('Invalid id. Please check and upload again');
});

const err_data4 = '1,0,B,5\n2,x,B,6'; // parent id (2rd element) contains this symbols "!/^\d+$/"
test('Test 5: Parent id contain symbols/letter',()=>{
    expect(() => {
        functions.parseCSV(err_data4)
    }).toThrow('Invalid parent. Please check and upload again');
});

const err_data5 = '1,0,A,5\n2,0,B,6\n3,3,C,4'; // parent id equal greater than own id
test('Test 6: Parent id equal or geater than own id',()=>{
    expect(() => {
        functions.parseCSV(err_data5)
    }).toThrow('Parent id equal or greater than its own id. Please check and upload again');
});

const err_data6 = '1,0,A,5\n2,0,B,A\n3,0,C,10'; // invalid values
test('Test 7: Invalid values',()=>{
    expect(() => {
        functions.parseCSV(err_data6)
    }).toThrow('Invalid values. Please check and upload again');
});

const err_data7 = '1,0,A,5\n1,0,B,6'; // duplicate id
test('Test 8: Duplicate Id value',()=>{
    expect(() => {
        functions.parseCSV(err_data7)
    }).toThrow('Duplicate ids. Please check and upload again');
});

const err_data8 = '1,0,A,5\n3,0,C,5\n4,2,B,6'; // missing parent id
test('Test 9: Missing parent',()=>{
    expect(() => {
        functions.parseCSV(err_data8)
    }).toThrow('Missing parent. Please check and upload again');
});

const valid_data2 = '  \n1,0,A,5\n\n2,0,B,6\n\t  \n3,0,A,5\n4,0,B,6\n\n';
const output2 =[{n:'A',v:[5],c:[]},{n:'B',v:[6],c:[]},{n:'A',v:[5],c:[]},{n:'B',v:[6],c:[]}];
test('Test 1: Valid data with empty lines',()=>{
    expect(
        functions.parseCSV(valid_data2)).toEqual(output2);
});