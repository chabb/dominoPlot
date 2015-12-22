var a = ["a","aa","aaa","aaaa","aaaaa"];
var b = ["b","bb","bbb","bbbb","bbbbb"];
var c = ["c","cc","ccc","cccc","ccccc"];
var d = ["d","dd","ddd","dddd","ddddd"];
var e = ["e","ee","eee","eeee","eeeee"];

var abz = ["a","b","z","zz"];
var abcde = ["a","b","c","d","e"];

var a1 = ["a","1"];
var b2 = ["b","2"];
var c3 = ["c","3"];
var d4 = ["d","4"];
var oneToFive = ["1","2","3","4"];

var result;

function dump(object, indent) {
    console.log(JSON.stringify(object, null, 4));
}

// Easy case
describe("2 Sets, no element in common", function() {
    beforeEach(function(){

        var contents = d3.map(
            [
                { name : "a", content:a},
                { name : "b", content:b}
            ],function(d) {return d.name;}
        );

        result = d3.computeIntersections(contents);
        console.log('testing',dump(result.turnOffSet,2));
    });
    function testCorrectInitialConfig() {
        expect(result.numberOfSets).toBe(2);
        expect(result.distinctElements).toBe(10);
        expect(result.numberOfDominos).toBe(4);
        expect(result.intersectionsArray.length).toBe(result.numberOfDominos);
        expect(result.currentMapping['a']).toBe(1);
        expect(result.currentMapping['b']).toBe(2);
        expect(result.originalMapping['a']).toBe(1);
        expect(result.originalMapping['b']).toBe(2);
    }
    function testCorrectIntersections() {
         for (var i=0; i<result.intersections.length;i++)
            expect(result.intersections[i].id).toBe(i);
        expect(result.intersections[0].elements.length).toBe(0);
        expect(result.intersections[1].elements).toEqual(a);
        expect(result.intersections[2].elements).toEqual(b);
        expect(result.intersections[3].elements).toEqual([]);
    }


    it("should return correct initial configuration", function() {
        testCorrectInitialConfig();
    });
    it("should have correct intersections",function() {
        testCorrectIntersections();
    })
    describe("After turning off sets a",function() {
        beforeEach(function(){
            result.turnOffSet("a");
        })
        it("should return correct initial configuration", function() {
            expect(result.stateTable['a'].active).toBeFalsy(); //FIXME, THIS IS DONE IN INTERFACE, THIS IS WRONG
            expect(result.numberOfDominos).toBe(2);
            expect(result.numberOfSets).toBe(1);
            expect(result.distinctElements).toBe(10); // WE KEEP ALL THE ELEMENTS IN THE (0)
        });
        it ("should have correct intersections",function() {
            expect(result.intersectionsArray[0].elements).toEqual(a);
            expect(result.intersectionsArray[1].elements).toEqual(b);
        });
        describe("after turning on sets a",function () {
            beforeEach(function(){
                result.turnOnSet("a");
            });
            it("should be back to normal", function() {

                testCorrectInitialConfig();
                testCorrectIntersections();
            });
            describe("after turning off sets b",function(){
                beforeEach(function(){
                    result.turnOffSet("b");
                });
                it("should return correct initial configuration", function() {
                    expect(result.stateTable['b'].active).toBeFalsy(); //FIXME, THIS IS DONE IN INTERFACE, THIS IS WRONG
                    expect(result.numberOfDominos).toBe(2);
                    expect(result.numberOfSets).toBe(1);
                    expect(result.distinctElements).toBe(10); // WE KEEP ALL THE ELEMENTS IN THE (0)
                });
                it ("should have correct intersections",function() {
                    expect(result.intersectionsArray[0].elements).toEqual(b);
                    expect(result.intersectionsArray[1].elements).toEqual(a);
                });
                describe("after turning on sets b",function () {
                    beforeEach(function(){
                        result.turnOnSet("b");
                    });
                    it("should be back to normal", function() {

                        testCorrectInitialConfig();
                        testCorrectIntersections();
                    });
                });
            })
        });
    });
});


xdescribe("2 Sets, some elements in common",function() {
    var abz = ["a","b","z","zz"];
    var abcde = ["a","b","c","d","e"];
    beforeEach(function(){

        var contents = d3.map(
            [
                { name : "a", content:abz},
                { name : "b", content:abcde}
            ],function(d) {return d.name;}
        );

        result = d3.computeIntersections(contents);

    });
    function testCorrectIntersections() {
        for (var i=0; i<result.intersections.length;i++)
            expect(result.intersections[i].id).toBe(i);
        expect(result.intersectionsArray[0].elements.length).toBe(0);
        expect(result.intersectionsArray[1].elements).toEqual(['z','zz']);
        expect(result.intersectionsArray[2].elements).toEqual(['c','d','e']);
        expect(result.intersectionsArray[3].elements).toEqual(['a','b']);
    }
    it("should have correct intersections",function() {
        testCorrectIntersections();
    })
    describe("After turning off sets a",function() {
        beforeEach(function(){
            result.turnOffSet("a");
        })
        it("should return correct initial configuration", function() {
            expect(result.stateTable['a'].active).toBeFalsy(); //FIXME, THIS IS DONE IN INTERFACE, THIS IS WRONG
            expect(result.numberOfDominos).toBe(2);
            expect(result.numberOfSets).toBe(1);
            expect(result.distinctElements).toBe(9); // WE KEEP ALL THE ELEMENTS IN THE (0)
        });
        it("should have correct intersections",function() {
            dump(result,4);
            expect(result.intersectionsArray[0].elements).toEqual(['z','zz']); //disabled elements goes in id 0
            expect(result.intersectionsArray[1].elements).toEqual(['c', 'd', 'e', 'a', 'b']); // disabled element goes in id 1
        });
    });
});

// edge cases
xdescribe("2 Sets, all elements in common",function(){



});





 /*var datas = {
        intersections : intersections,
        intersectionsArray: baseIntersectionsArray.slice(),
        distinctElements : elements,
        numberOfSets : numberOfSets,
        currentMapping : dominoMapping,
        currentInvertedMapping : invertedMapping,
        originalMapping : originalMapping ? originalMapping : dominoMapping,
        originalInvertedMapping : originalInvertedMapping,
        numberOfDominos : limit,
        stateTable : table,
        turnOnSet : turnOnSet,
        turnOffSet : turnOffSet
    }*/
