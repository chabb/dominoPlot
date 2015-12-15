


//// MOVE THAT IN A MAIN FILE
var options = {
    margin : {
        left: 50,
        top: 50
    },
    width : 1000,
    height: 800,
    barWidth: 30,
    barPadding: 10,
    barColor : '#111111',
    circeColor : '#123456'
};

var chart = dominoPlot(options);
var contents = d3.map([
    { name : "mice", content:["a","b","c","d","q"]},
    { name : "human", content:["a","b","z","d","q"]},
    { name : "rice", content:["eee","b","p","q"]},
    { name : "ghouls", content:["rip","ba","pa","qd","df","fds","dfs","dfs"]},
    { name : "cat", content:["gd","zd","sc","sq"]},
    { name : "martian", content:["qc","qp","sc","eede","bz","grm"]}
  ],function(d) {return d.name;});

var  result = d3.computeIntersections(contents);

// selection.call(function[, arguments…]) Invoke the function ONCE, with the provided arguments
//The this context of the called function is also the current selection. This is slightly redundant with the first argument,
//which we might fix in the future.
//If you use an object's method in selection.call and need this to point to that object
//you create a function bound to the object before calling.

$(document).ready(function(){
   d3.select('#main')
    .datum([result])
    .call(chart.main);
})

// you have a data-bound element
/// END OF MAIN FILE
function dominoPlot(options) {
    // setup variable

    var chart = {};
    var margin = options.margin;
    var width = options.width;
    var height = options.height;
    var barWidth = options.barWidth;
    var barColor = options.barColor;
    var barPadding = options.barPadding;

    // this fonction init the groups and the basic element
    var svgInit = function(selection) {
        console.log('Defining groups',selection);
        selection.each(function(data) {

            var svg = d3.select(this);
            // create the main container
            svg.append('g')
                .attr('class', 'chart')
                .attr('transform', function() {
                    var dx = margin.left,
                        dy = margin.top;
                    return 'translate(' + [dx, dy] + ')';
            });
            // create the main axises
            svg.append('g')
              .attr('class','xaxis axis')
              .attr('transform',function(){
                var dx = margin.left,dy = height-margin.top;
                return 'translate('+[dx,dy]+')';
            })
            svg.append('g')
                .attr('class', 'yaxis axis')
                .attr('transform', function() {
                    var dx = margin.left,
                        dy = margin.top;
                    return 'translate(' + [dx, dy] + ')';
            });
            svg.append('g')
                .attr('class', 'yaxis domino axis')
                .attr('transform', function() {
                    var dx = margin.left,
                        dy = margin.top + 500;
                    return 'translate(' + [dx, dy] + ')';
            });
            // Create and translate the brush container group
        });
    }
    function renderAxises(data) {

        // we'll use a clip path to clip the chart and move the stuff in the related g element


        var xDomain = d3.keys(data[0].intersections);
        var setsName = d3.keys(data[0].currentMapping);
        var yExtent = d3.extent(data[0].intersections,function(d) { return d.elements.length; })
        var totalWidth = xDomain.length * barWidth + (xDomain.length - 1) * barPadding;
        console.log('THE TOTAL WIDTH',totalWidth);
        var barHeight = 480;


        // x scale for bars
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, totalWidth], 0,0)
            .domain(d3.keys(xDomain));

        // y scale for domino
        var yDomino = d3.scale.ordinal()
            .rangeRoundBands([0, x.rangeBand() * setsName.length], .0,0)
            .domain(setsName); // a bit dirty coz you access the main data

        // y scale for bars
        var y = d3.scale.linear()
            .range([barHeight,0])
            .domain(yExtent);


        var xAxis = d3.svg.axis()
          .scale(x)
          .tickValues([])
          .orient("bottom");

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(yExtent[1], "-");

        var yAxisDomino = d3.svg.axis()
          .scale(yDomino)
          .orient("left")
          .ticks(10, "%");

        var axisSelection = svg.select(".xaxis.axis");
        axisSelection.call(xAxis);


        svg.select('.yaxis.axis').transition().duration(400).call(yAxis);
        svg.select('.yaxis.domino.axis').transition().duration(400).call(yAxisDomino);


    }

    chart.width = function(w) {
        if (!arguments.length) {return width;}
        width = w;
        return chart;
    }
    chart.height = function(w) {
        if (!arguments.length) { return height;}
        height = h;
        return chart;
    }
    // Margin Accessor
    chart.margin = function(m) {
        if (!arguments.length) { return margin; }
        margin = m;
        return chart;
    };

    chart.circleColor = function(m) {
        if (!argument.length) { return color};
        circleColor = m;
    }

    chart.barColor = function(m) {
        if (!argument.barColor(m)) { return m; }
        barColor = m;
    }

    chart.barWidth = function(width) {
        if (!argument.length) { return width; }
        barWidth = width;
    }

    chart.barPadding = function(padding) {
        if (!argument.length) { return padding; }
        barPadding = padding;
    }

    chart.main = function(selection) {
        console.log('start',selection.data());
        selection.style(
            {
                'width'  : chart.width(),
                'height' : chart.height()
            }
        );
        selection.each(function(data){
            var div = d3.select(this)
            svg = div.selectAll('svg').data(data);

            svg.enter()
                .append('svg')
                .attr('width',width)
                .attr('height',height)
                .call(svgInit);
            renderAxises(data);
        });
    }

    return chart;
}




