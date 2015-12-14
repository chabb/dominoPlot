


//// MOVE THAT IN A MAIN FILE
var options = {
    margin : {
        left: 20,
        top: 20
    },
    width : 1000,
    height: 800,
    barWidth: 40,
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

console.log('start computing');
var  result = d3.computeIntersections(contents);
console.log(result);
d3.select('#main')
    .datum(result)
    .call(chart);



// you have a data-bound element
/// END OF MAIN FILE




function dominoPlot(options) {
    // setup variable
    var chart = {};


    // this fonction init the groups and the basic element
    var svgInit = function(selection) {
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
        // Create and translate the brush container group
        });
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

    chart.barWidrh = function(width) {
        if (!argument.length) { return width; }
        barWidth = width;
    }
    return chart;
}




