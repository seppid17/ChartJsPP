const dataFormatHelper = require('../public/scripts/dataFormatHelper');

/*
Unit testing for dataFormatHelper class
*/
const Inputdata = [
                {n:'A',V:5,c:[]},

                {n:'B',V:9,c:[
                    {n:'C',V:2,c:[{n:'F',V:6,c:[]}]},{n:'D',V:3,c:[]},{n:'E',V:7,c:[]}
                ]},

                {n:'G',V:8,c:[]},

                {n:'H',V:4,c:[
                    { n: "I", v: 7, c: [] },{ n: "J", v: 4, c: [] }
                ]}
                ];
const OutputData = [
                    [
                        { n: "A", v: 5, p: 0 },{ n: "B", v: 9, p: 0 },{ n: "G", v: 8, p: 0 },{ n: "H", v: 4, p: 0 }
                    ],
                    [
                        { n: "C", v: 2, p: 1 },{ n: "D", v: 3, p: 1 },{ n: "E", v: 7, p: 1 },{ n: "I", v: 7, p: 3 } ,{ n: "J", v: 4, p: 3 }
                    ],
                    [
                        { n: "F", v: 6, p: 0 }
                    ]
                    ]

describe("Validator", () => {
test('Test 1: Valid data input',()=>{
                expect(dataFormatHelper.makeBFStree(Inputdata)).toEqual(OutputData);
            });
        });