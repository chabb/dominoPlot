var a = ["a","aa","aaa","aaaa","aaaaa"];
var b = ["b","bb","bbb","bbbb","bbbbb"];
var c = ["c","cc","ccc","cccc","ccccc"];
var d = ["d","dd","ddd","dddd","ddddd"];
var e = ["e","ee","eee","eeee","eeeee"];



var abz = ["a","b","z","zz"];
var abcde = ["a","b","c","d","e","z","bb"];
var aabb = ["aa","bb","a","b"]



var a1 = ["a","1"];
var b2 = ["b","2"];
var c3 = ["c","3"];
var d4 = ["d","4"];
var oneToFive = ["1","2","3","4"];

var result;

function dump(object, indent) {
    console.log(JSON.stringify(object, null, 4));
}


// note that intersectionsArray is an array indexed by ID
// intersections is a map with id as key
// i hope to get ride of the map


describe("2 Sets, no element in common", function() {
    beforeEach(function(){
        var contents = d3.map(
            [
                { name : "a", content:abz},
                { name : "b", content:abcde},
                { name : "c", content:aabb}


            ],function(d) {return d.name;}
        );
        result = d3.computeIntersections(contents);
    });
    function testCorrectInitialConfig() {
        expect(result.numberOfSets).toBe(3);
        //expect(result.distinctElements).toBe(9); // FIXME
        expect(result.numberOfDominos).toBe(8);
        expect(result.intersectionsArray.length).toBe(result.numberOfDominos);
        expect(result.currentMapping['a']).toBe(1);
        expect(result.currentMapping['b']).toBe(2);
        expect(result.currentMapping['c']).toBe(3);
        expect(result.originalMapping['a']).toBe(1);
        expect(result.originalMapping['b']).toBe(2);
        expect(result.originalMapping['c']).toBe(3);
    }
    function testCorrectIntersections() {
        expect(result.intersections[0].elements.length).toBe(0);
        expect(result.intersections[1].elements).toEqual(['zz']);
        expect(result.intersections[2].elements).toEqual(['c','d','e']);
        expect(result.intersections[3].elements).toEqual(['z']);
        expect(result.intersections[4].elements).toEqual(['aa']);
        expect(result.intersections[5].elements).toEqual([]);
        expect(result.intersections[6].elements).toEqual(['bb']);
        expect(result.intersections[7].elements).toEqual(["a","b"]);
    }
    it ("should be correct",function() {
        testCorrectInitialConfig();
        testCorrectIntersections();
    })
    describe("After turning off sets a",function() {
        beforeEach(function(){
            result.turnOffSet("a");
        })
        it("should return correct initial configuration", function() {
            expect(result.stateTable['a'].active).toBeFalsy(); //FIXME, THIS IS DONE IN INTERFACE, THIS IS WRONG
            expect(result.numberOfDominos).toBe(4);
            expect(result.numberOfSets).toBe(2);
            //expect(result.distinctElements).toBe(9); // FIXME, IS INCORRECT
        });
        function testWith2Dominos() {
            expect(result.intersections[0].elements).toEqual(["zz"]);
            expect(result.intersections[1].elements).toEqual(["c","d","e","z"]);
            expect(result.intersections[2].elements).toEqual(["aa"]);
            expect(result.intersections[3].elements).toEqual(["bb","a","b"]);
        }
        it("should have the correct set",function(){
            testWith2Dominos();

        });
        describe("After turning off sets b",function() {
            beforeEach(function(){
                result.turnOffSet("b");
            });
            it("should return correct initial configuration", function() {
                expect(result.stateTable['a'].active).toBeFalsy();
                expect(result.stateTable['b'].active).toBeFalsy(); //FIXME, THIS IS DONE IN INTERFACE, THIS IS WRONG
                expect(result.numberOfDominos).toBe(2);
                expect(result.numberOfSets).toBe(1);
            });
            it("should have the correct set",function(){
                expect(result.intersections[0].elements).toEqual(["zz","c","d","e","z"]);
                expect(result.intersections[1].elements).toEqual(["aa","bb","a","b"]);
            });
            // turtle back to normal
            describe("After turning on sets b",function() {
                beforeEach(function(){
                    result.turnOnSet("b");
                });
                it("should return correct initial configuration", function() {
                    expect(result.stateTable['a'].active).toBeFalsy();
                    expect(result.stateTable['b'].active).toBeTruthy(); //FIXME, THIS IS DONE IN INTERFACE, THIS IS WRONG
                    expect(result.numberOfDominos).toBe(4);
                    expect(result.numberOfSets).toBe(2);
                });
                it("should have the correct set",function(){
                    testWith2Dominos();
                });
                describe("After turning on sets a",function() {
                    beforeEach(function(){
                        result.turnOnSet("a");
                    });
                    it("should return correct initial configuration", function() {
                        testCorrectInitialConfig();
                    });
                    it("should have the correct set",function(){

                        testCorrectIntersections();
                    });
                });
            });


        });

    });
});
