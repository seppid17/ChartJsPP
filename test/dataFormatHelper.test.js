const dataFormatHelper = require('../public/scripts/dataFormatHelper');

/*
Unit testing for dataFormatHelper class
*/
/*
This testing data uses to check the makeBFStree method of the dataFormatHelper class
*/
const Test1InputData = [
                    {n: 'A', v: [5], c:[]},
                    {n: 'B', v: [9], c:[
                        {n:'C', v: [2], c:[{n: 'F', v: [6], c: []}]},{n: 'D', v: [3], c: []},{n: 'E', v:[7], c:[]}
                    ]},
                    {n: 'G', v:[8], c:[]},
                    {n: 'H', v:[4], c:[
                        { n: "I", v: [7], c: [] },{ n: "J", v: [4], c: [] }
                    ]}
                    ];

const Test1OutputData = [
                    {n: 'A', v: 5, c: []},
                    {n: 'B', v: 9, c: [
                        {n: 'C', v: 2, c: [{n: 'F', v: 6, c: []}]},{n: 'D', v: 3, c: []} , {n: 'E', v: 7, c: []}
                    ]},
                    {n: 'G', v: 8, c: []},
                    {n: 'H', v: 4, c:[
                        { n: "I", v: 7, c: [] },{ n: "J", v: 4, c: [] }
                    ]}
];

describe("data formater", () => {
test('Test 2: data input2',()=>{
                expect(dataFormatHelper.unlist(Test1InputData)).toEqual(Test1OutputData);
            });  
        });