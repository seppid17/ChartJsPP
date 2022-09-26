const functions =require('../public/scripts/parseData');

/***
Unit testing for parseCSV function
 ***/
// valid data input, test 1
const data = '1,0,A,5\n2,0,B,6';
const obj =[{n:'A',v:[5],c:[]},{n:'B',v:[6],c:[]}];
// Invalid data input,test 2
const err_data = '1,A,5\n2,0,B,6';
test('Object testing',()=>{
    expect(functions.parseCSV(data)).toEqual(obj);
});
test('Object testing',()=>{
    expect(functions.parseCSV(err_data)).toBeNull();
});