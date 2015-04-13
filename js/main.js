$(document).ready(function(){
	
});


var margin = {
	top: 20,
	right: 20,
	bottom: 20,
	left: 40
	}
	
var width = 600 - margin.left - margin.right;

		
	var dash_styles = [
		"none",
		 "5, 5",
		 "10, 10",
		 ".9,.9",
		 "15, 10, 5, 10",
		 "15,5,5,5"
	];





var margin = {top: 20, right: 30, bottom: 30, left: 40},
	width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
   
   
var parseDate = d3.time.format("%Y%m%d").parse;


var x = d3.time.scale()
	.range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);
    
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");
	
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");
	
	
var color = d3.scale.category10();	
	
	
var line = d3.svg.line()
	.interpolate("basis")
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.rate); });


var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



d3.csv("./data/scot_mfg.csv", function(error, data) {
	color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
	//dashstyle.domain(de.keys(data[0]).filter(function(key) { return key !== "data"; }));
	
  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });
  
  var sectors = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, rate: +d[name] };
      }
      )
    };
  });
  
  sectors.push({
  	name: "basis",
  	values: data.map(function(d) {
  		return {date: d.date, rate: 100 };
  	})
  });
  
  console.log(sectors);
  
  var all = sectors;
  var mfg = sectors.slice(0,1);
  var base = sectors.slice(-1);
  mfg = mfg.push(base);
  
  var a = {width:width, height:height};
    
  x.domain(d3.extent(data, function(d) { return d.date; } ));
  
  y.domain([
    d3.min(mfg, function(c) { return d3.min(c.values, function(v) { return v.rate; }); }),
    d3.max(mfg, function(c) { return d3.max(c.values, function(v) { return v.rate; }); })
  ]);
    
    
    chart.append("g")
    		.attr("class", "x axis")
    		.attr("transform", "translate(0," + height + ")")
    		.call(xAxis);
    		
    chart.append("g")
    		.attr("class", "y axis")
    		.call(yAxis)
    	 .append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Growth (%)");
		  
		sectorLine(mfg);
		d3.select(".show-sectors").on("click",function(){
			if(this.classList.contains("sectors-on")) {
			  chart.selectAll(".sector").remove();
			  rescale(mfg);
			  sectorLine(mfg);
			  d3.select(this).classed("sectors-on",false);
			} else {
			  chart.selectAll(".sector").remove();
			  rescale(all);
			  sectorLine(all);
			  d3.select(this).classed("sectors-on", true);
			  
			}
		});
	

});

function sectorLine(derta) {

	var sector = chart.selectAll(".sector")
			.data(derta)
		.enter().append("g")
			.attr("class", "sector")
			.attr("class",function(d) {return d3.select(this).attr("class") + " " + d.name; });

			
			
		sector.append("path")
				.attr("class", "line")
				.attr("d", function(d) { return line(d.values); } )
				.style("stroke","white")
				.transition()
				.style("opacity",1);
				
				
				
		sector.append("text")
				.datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
				.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.rate) + ")"; })
			    .attr("x", 0)
			    .attr("dy", ".35em")
			    .text(function(d) { return d.name; });
			    

			    

}

function rescale(dirta) {
	y.domain([
		d3.min(dirta, function(c) { return d3.min(c.values, function(v) { return v.rate; }); }),
		d3.max(dirta, function(c) { return d3.max(c.values, function(v) { return v.rate; }); })
  	]);
  	
  	d3.select('.y.axis')
  		.call(yAxis);
}
