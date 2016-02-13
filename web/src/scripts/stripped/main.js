

// selection.call(function[, arguments…]) Invoke the function ONCE, with the provided arguments
//The this context of the called function is also the current selection. This is slightly redundant with the first argument,
//which we might fix in the future.
//If you use an object's method in selection.call and need this to point to that object
//you create a function bound to the object before calling.
//APPEND returns a selection with the added ELEMENT !!
var D = {};
$(document).ready(function(){
 main();
})


function main() {

    var options = {
        margin : {
            left: 50,
            top: 50
        },
        width : 1400,
        height: 1000,
        barWidth: 46,
        barPadding: 30,
        barColor : '#111111',
        circleColor : '#b9c0d0',
        barChartHeight: 600,
        paddingBetweenChartAndDominoAxis: 40
    };

    var chart = dominoPlot(options);
    var contents = d3.map([
        { name : "mice", content:["a","b","c","d","e"]},
        { name : "human", content:["a","b","zzzz","zzzw","zzzp"]},
        { name : "rice", content:["a","b","c","zzzz","n","nn","nnn","nnnn"]},
       // { name : "ghouls", content:["rip","ba","pa","qd","df","fds","dfs","dfs"]},
      //  { name : "cat", content:["gd","zd","sc","sq"]},
      //  { name : "martian", content:["qc","qp","sc","eede","bz","grm"]}
      ],function(d) {return d.name;});

     contents = d3.map([
        { name : "mice", content:randomSetGenerator(10000)},
        { name : "human", content:randomSetGenerator(10000)},
        { name : "rice", content:randomSetGenerator(10000)},
        { name : "ghouls", content:randomSetGenerator(10000)},
        { name : "cat", content:randomSetGenerator(10000)},
        { name : "martian", content:randomSetGenerator(10000)}],function(d) {return d.name;});

    var  result = d3.computeIntersections(contents);
    D.result = result;
    D.contents = contents;
    d3.select('#main')
    .datum([result])
    .call(chart.main);
}

function randomSetGenerator(length) {
    var array = {}
    for (var i=0;i<length;i++) {
        var randomstring = Math.random().toString(36).slice(2,5);
        array[randomstring]= randomstring;

    }
    return Object.keys(array);

}



//mice-human-rice = a b
//mice-human = a b
//mice-rice  = a b c
// human-rice = zzzz a b
// mice = d e
// human = zzzw zzzp
// rice = n nn nnn nnnn


// only mice - rice  : a b c
// mice : d de
// rice : zzzz n nn nnn nnnn


