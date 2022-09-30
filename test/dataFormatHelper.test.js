const dataFormatHelper = require('../public/scripts/dataFormatHelper');

/*
Unit testing for dataFormatHelper class
*/
/*
This testing data uses to check the makeBFStree method of the dataFormatHelper class
*/

const Test1Inputdata = [
                {n: 'A', v: 5, c: []},
                {n: 'B', v: 9, c: [
                    {n: 'C', v: 2, c: [{n: 'F', v: 6, c: []}]},{n: 'D', v: 3, c: []} , {n: 'E', v: 7, c: []}
                ]},
                {n: 'G', v: 8, c: []},
                {n: 'H', v: 4, c:[
                    { n: "I", v: 7, c: [] },{ n: "J", v: 4, c: [] }
                ]}
                ];
const Test1OutputData = [
                    [
                        { n: "A", v: 5, p: 0 },{ n: "B", v: 9, p: 0 },{ n: "G", v: 8, p: 0 },{ n: "H", v: 4, p: 0 }
                    ],
                    [
                        { n: "C", v: 2, p: 1 },{ n: "D", v: 3, p: 1 },{ n: "E", v: 7, p: 1 },{ n: "I", v: 7, p: 3 } ,{ n: "J", v: 4, p: 3 }
                    ],
                    [
                        { n: "F", v: 6, p: 0 }
                    ]
                    ];
const Test2InputData = [
                    {n: 'A', v: [5], c:[]},
                    {n: 'B', v: [9], c:[
                        {n:'C', v: [2], c:[{n: 'F', v: [6], c: []}]},{n: 'D', v: [3], c: []},{n: 'E', v:[7], c:[]}
                    ]},
                    {n: 'G', v:[8], c:[]},
                    {n: 'H', v:[4], c:[
                        { n: "I", v: [7], c: [] },{ n: "J", v: [4], c: [] }
                    ]}
                    ];

const Test2OutputData = [
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
test('Test 1: data input1',()=>{
                expect(dataFormatHelper.makeBFStree(Test1Inputdata)).toEqual(Test1OutputData);
            });
test('Test 2: data input2',()=>{
                expect(dataFormatHelper.unlist(Test2InputData)).toEqual(Test2OutputData);
            });  
        });