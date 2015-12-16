


//// MOVE THAT IN A MAIN FILE
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
    circleColor : '#555555',
    barChartHeight: 600,
    paddingBetweenChartAndDominoAxis: 40
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
//APPEND returns a selection with the added ELEMENT !!

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
    var circleColor = options.circleColor;
    var barColor = options.barColor;
    var barPadding = options.barPadding;
    var barChartHeight = options.barChartHeight;
    var paddingBetweenChartAndDominoAxis = options.paddingBetweenChartAndDominoAxis;



    // this function renders the top list of active/inactive sets
    var renderSetsMenu = function(selection) {
        selection.each(function(data) {
            console.log('DATA FOR TOP BAR',data);
            var svg = d3.select(this);
            var list = svg.append('ul')
                .attr('id','navlist');
            list.append("li")
                .classed("listTitle",true)
                .append("a").text("TITLE")
            list.selectAll('li.listItem')
                .data(d3.keys(data.currentMapping))
                .enter()
                .append("li")
                .classed("listItem",true)
                .append("a").text(function(d,i){ return d; });
        })
    };

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
                        dy = chart.dominoAxisPosition();
                    return 'translate(' + [dx, dy] + ')';
            });
            // Create and translate the brush container group
        });
    }
    function renderAxises(data) {

        //TODO we'll use a clip path to clip the chart and move the stuff in the related g element

        var xDomain = d3.keys(data[0].intersections);
        var setsName = d3.keys(data[0].currentMapping);
        var yExtent = d3.extent( data[0].intersectionsArray,function(d) { return d.elements.length; })

        var totalBarWidth = xDomain.length * barWidth;
        var totalPadddingWidth = (xDomain.length-1) * barPadding;
        var totalPadding = totalPadddingWidth + totalBarWidth;
        // find the padding ratio for d3
        // equation to solve totalPadding =  totalBarWidth  + totalBarWidth * barRatio;
        var ratio = (totalPadding - totalBarWidth) /   totalBarWidth



        var barHeight = barChartHeight;


        // x scale for bars
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, totalPadding], ratio,0)
            .domain(d3.keys(xDomain));

        // y scale for domino
        var yDomino = d3.scale.ordinal()
            .rangeRoundBands([0, barWidth * setsName.length], .0,0)
            .domain(setsName); // a bit dirty coz you access the main data
           console.log(x.rangeBand(),'rg');

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

        //  append group for x domino axis
        console.log(chart,options);
        var enter = svg
        .append("g")
        .attr("class","domino-axis")
        .attr("transform","translate("+50+","+chart.dominoAxisPosition()+")")
        .selectAll("g.dominos")
        .data(data[0].intersectionsArray,function(d){ return d.id})
        .enter();

        var center = (barWidth) / 2;
        var r = center / 1.8
        var dominosChart = {};
        var dominos = enter.append("g")
          .attr("class", "dominos")
          .attr("transform", function(d,i){ console.log('data',d); return "translate("+(x(i))+",0)" });


        var padding = yDomino.rangeBand()/2;
        dominos.selectAll("circle").data(function(d){return reprojectArray(d,data[0])},function(d,i,j){ return d.compoundId; })
          .enter()
          .append("circle")
          .attr("cx",function(d,i){ return center})
          .attr("cy",function(d,i){ return padding + yDomino(d.set )}) // quasi-bon il fuat la moitioe en fiat
          .attr("r", function(d)  { return r })
          .attr("fill",function(d,i) {
            return d.hasCircle ? "none" : circleColor;
          })


        // render bars 'axis' TODO move elsewhere when ok and fix the chart variable
        var _chart = svg.select(".chart")

        var bars = _chart.selectAll(".bar")
            .data(data[0].intersectionsArray,function(d){ console.log('data key',d); return d.id})


        // lots of visual artifacts, try to understand what happend
        bars.enter().append("rect")
            .attr("class", "barsContainer")
            .attr("x", function(d,i) { return x(i); })
            .attr("rx", function(d,i) { return 2 })
            .attr("ry", function(d,i) { return 2 })
            .attr("width", barWidth)
            .attr("y", function(d,i) { return 0; })
            .attr("height", function(d) { return barHeight; });

        bars.enter().append("text")
            .attr("x", function(d,i) { return x(i)+barWidth/2; })
            .attr("y", function(d,i) { return  barHeight - 20 - y(d.elements.length);})
            .attr("dy", ".35em")
            .attr("text-anchor","middle")
            .text(function(d) { return (d.elements.length); });

        bars.enter().append("rect")
            .attr("class", "bars")
            .attr("x", function(d,i) { return x(i)+2; })
            .attr("rx", function(d,i) { return 2 })
            .attr("ry", function(d,i) { return 2 })
            .attr("width", barWidth-4)
            .attr("y", function(d,i) { return  barHeight - y(d.elements.length);})
            .attr("height", function(d) { return y(d.elements.length); });

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

    chart.barChartHeight = function(m) {
        if (!arguments.length) { return barChartHeight; }
        barChartHeight = m;
        return chart;
    }

    chart.paddingBetweenChartAndDominoAxis = function(m) {
         if (!arguments.length) { return paddingBetweenChartAndDominoAxis; }
        paddingBetweenChartAndDominoAxis = m;
        return chart;
    }

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

            // RENDER VERTICAL TOP BAR
            var mainList = div.selectAll('div#chartTopBar').data(data);
            mainList.enter()
                .append('div')
                .attr('id','chartTopBar')
                .call(renderSetsMenu);


            // RENDER SVG STUFF
            svg = div.selectAll('svg').data(data);
            svg.enter()
                .append('svg')
                .attr('width',width)
                .attr('height',height)
                .call(svgInit);
            renderAxises(data);
        });
    }
    chart.dominoAxisPosition = function () {
        return barChartHeight + paddingBetweenChartAndDominoAxis + margin.top;
    }

    return chart;
}




