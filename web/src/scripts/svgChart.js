
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
    var result; // TODO FIXME => TRY TO GET RID OF THIS REFERENCE


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
                .append("a").text(function(d,i){ return d; })
                .classed("active",function(d) { return data.stateTable[d].active})
                .on("click",function(d,i) {
                    var newState = !data.stateTable[d].active;
                    data.stateTable[d].active = newState;

                    if (newState) {
                        data.turnOnSet(d);
                    } else {
                        data.turnOffSet(d);
                    }

                    d3.select(this)
                        .classed("active",function(d) { return data.stateTable[d].active})
                        .classed("inactive",function(d) { return !data.stateTable[d].active})
                    console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
                    renderAxises([data]);

                })

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

            svg.append("g")
                .attr("class","domino-axis")
                .attr("transform","translate("+margin.left+","+chart.dominoAxisPosition()+")")
            // Create and translate the brush container group
        });
    }
    function renderAxises(data) {

        //TODO we'll use a clip path to clip the chart and move the stuff in the related g element

        var xDomain = d3.keys(data[0].intersections);

        var setsName = (d3.keys(data[0].currentMapping)).filter(function(d,i) {
            return data[0].stateTable[d].active;
        });

        var yExtent = d3.extent( data[0].intersectionsArray,function(d) {
            if (!d) return 0;
            return d.elements.length;
        })
        yExtent = [0, yExtent[1]];

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
        console.log(x.rangeBand(),'rg',setsName);


        // y scale for bars
        var y = d3.scale.linear()
            .range([barHeight,0])
            .domain(yExtent);


        var xAxis = d3.svg.axis()
          .scale(x)
          .tickValues([])
          .orient("top");

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
        var  dominoElements = svg.select('g.domino-axis')
            .selectAll("g.dominos")
            .data(data[0].intersectionsArray,function(d){ return d.id})
        var enter = dominoElements.enter();

        var center = (barWidth) / 2;
        var r = center / 1.8
        var dominosChart = {};
        var dominos = enter.append("g")
          .attr("class", "dominos")
          .attr("transform", function(d,i){ console.log('data',d); return "translate("+(x(i))+",0)" });

        dominoElements.exit().transition().duration(1000).style('opacity',0).remove();

        dominoElements.attr("transform", function(d,i){ console.log('data',d); return "translate("+(x(i))+",0)" });



        var padding = yDomino.rangeBand()/2;
        var circles = dominoElements.selectAll("circle").data(function(d){return reprojectArray(d,data[0])},function(d,i,j){ return d.compoundId; })
        circles.enter()
          .append("circle")
          .attr("cx",function(d,i){ return center})
          .attr("cy",function(d,i){ console.log('circle',d);return padding + yDomino(d.set )}) // quasi-bon il fuat la moitioe en fiat
          .attr("r", function(d)  { return r })
          .attr("fill",function(d,i) {
            return d.hasCircle ?  circleColor : "none";
          });

        circles.attr("cx",function(d,i){ return center})
          .attr("cy",function(d,i){ console.log('circle update',d);return padding + yDomino(d.set )}) // quasi-bon il fuat la moitioe en fiat
          .attr("r", function(d)  { return r })
          .attr("fill",function(d,i) {
            return d.hasCircle ?  circleColor : "none";
          });
        circles.exit().remove();



        // render bars 'axis' TODO move elsewhere when ok and fix the chart variable
        var _chart = svg.select(".chart");
        console.log(data[0].intersectionsArray);
        var bars = _chart.selectAll(".barsGroup")
            .data(data[0].intersectionsArray,function(d){ console.log('data key',d.id); return d.id})

        // lots of visual artifacts, try to understand what happend

        var enteringBars = bars.enter().append("g").classed("barsGroup",true);


        enteringBars.append("rect")
            .attr("class", "barsContainer")
            .attr("x", function(d,i) { return x(i); })
            .attr("rx", function(d,i) { return 2 })
            .attr("ry", function(d,i) { return 2 })
            .attr("width", barWidth)
            .attr("y", function(d,i) { return 0; })
            .attr("height", function(d) { return barHeight; });

        enteringBars.append("text")
            .attr("x", function(d,i) { return x(i)+barWidth/2; })
            .attr("y", function(d,i) { return  -20 + y(d.elements.length);})
            .attr("dy", ".35em")
            .attr("text-anchor","middle")


        enteringBars.append("rect")
            .attr("class", "bars")
            .attr("x", function(d,i) { return x(i)+2; })
            .attr("rx", function(d,i) { return 2 })
            .attr("ry", function(d,i) { return 2 })
            .attr("width", barWidth-4)


        // update
        bars.select('.barsContainer').attr("x", function(d,i) { return x(i); })

        bars.select('.bars')
            .attr("y", function(d,i) { return y(d.elements.length);  })
            .attr("height", function(d) { return  barHeight - y(d.elements.length); })
            .attr("x", function(d,i) { return x(i); })
        bars.select('text').text(function(d) { return (d.elements.length); })
         .attr("y", function(d,i) { return  -20 + y(d.elements.length);})
         .text(function(d) { return (d.elements.length); })
         .attr("x", function(d,i) { return x(i)+barWidth/2; })

        //exit
        bars.exit().select('.bars').transition().duration(1000).attr("y",y(0)).attr("height",0)
        bars.exit().transition().duration(1000).style('opacity',0).remove();
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
                'height' : chart.height()+200 // TODO FIXME
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




