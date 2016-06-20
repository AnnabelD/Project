/* 
* Annabel Droste
* Functions to make the barcharts
 */
 
 // 1e barchart van de as af zetten
 // laatste tick weglaten of getal erbij zetten (nice of ...)
 // tooltip species alleen 1 getal
// opmaak titel verbeteren 
 
 /* Function that draws the chart that shows up if a country is clicked and shows all the top ten genus observed in that country. The same function is called
again if a bar in the barchart is clicked. Then it shows all the species in the genus that are present in the country. If the user hovers over a bar, a link
to the wikipedia is accessible in the tooltip. 
	 */
function drawChart(data, name, type){
	if (type == "genus"){
		tip.hide();
		var dataArray = data;
		var dataKey = "genus";
		var yValuename = "details";
		var yValuename2 = "length";
		var yAxisLabel = "species in genus";
		var bottom = margin.bottom;
	};
	
	if (type == "species"){
		var dataArray = data.details;
		var dataKey = "species";
		var yValuename = "number";
		var yAxisLabel = "observations";
		var bottom = speciesMarginBottom;
	};

	// remove old charts 
	var oldChart = d3.select(".barchart" + type)
		.selectAll("g").remove()
		.selectAll(".axis").remove();
	
	var oldSpecChart = d3.select(".barchartspecies")
		.selectAll("g").remove();
		
	// create new chart
	var chart = d3.select(".barchart" + type)
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + bottom + margin.top)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," +  margin.top + ")");
		
	// sort the data on descending order and select the top 10
	var dataDomain = []
	dataArray.forEach(function (d){ if (type == "genus"){ dataDomain.push({"name": d[dataKey], "number": d[yValuename][yValuename2], "details": d.details})}
	else{ dataDomain.push({"name": d[dataKey], "number": d[yValuename]})}});
	dataDomain = dataDomain.sort(function(a, b) {
		return b.number < a.number ? -1 : b.number > a.number ? 1 : b.number >= a.number ? 0 : NaN;
	})
	if (type == "genus"){
		if (dataDomain.length > 10){dataDomain.length = 10;}
	};
	var length = dataDomain.length;
	// x-as barchart species per country
	var x = d3.scale.ordinal()
		.domain(dataDomain.map(function(d){ return d.name}))
		.rangeRoundBands([0, width]);
	    	
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");	
	
	var maxData = d3.max(dataDomain, function(d){ return d.number});
	y.domain([0, maxData + 2]);
	y.nice();
	
	chart.call(tip);
		
	var bar = chart.selectAll("g")
		.data(dataDomain)
		.attr("class", "bars")
		.enter().append("g")
		.attr("transform", function(d, i) { 
			return "translate(" + i * (width/length) + ",0)"; 
		});

	bar.append("rect")
    	.attr("y", function(d) { return y(d.number);})
    	.attr("height", function(d) { 
    		if (type == "genus"){return height - y(d.number);}
			else{ return height - y(d.number)}
    	})
    	.attr("width", (width/length) - 3)
		.on("mouseover", function(d){
    		d3.select(this).style("fill", "#7ddc1f")
			tip.hide(d)
			tip.show(d);
    	})
    	.on("mouseout", function(d) {
    		d3.select(this).style("fill", "")
    	})
		.on("click", function(d){ if (type == "genus"){drawChart(d, d.name + " in " + name, "species");}});
		
    // creëren van de assen
    chart.append("g")
    	.attr("class", "y axis")
    	.call(yAxis)
  		.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -35)
    	.attr("dy", ".1em")
    	.style("text-anchor", "end")
    	.text("Total " + yAxisLabel);
	
	chart.append("g")
    	.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
    	.call(xAxis)
		.selectAll("text")
		.attr("y", 0)
		.attr("x", -9)
		.attr("dy", ".31em")
		.attr("transform", "rotate(-65)")
		.style("text-anchor", "end");
	
	chart.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")   
        .text(type + " in " + name);
}

/* Draws the total observations per species. */
function diversity(dataFormat, speciesName, speciesMap){
	var countries = [];
	var numberSpecies = [];
	// right now, only countries where the birds are present are shown.
	for (var i in dataFormat){
		dataFormat[i].observations.forEach(function(d){
			d.details.forEach(function(k){
				if (k.species == speciesName){
					countries.push(dataFormat[i].name);
					numberSpecies.push({"country": dataFormat[i].name, "number": k.number, "total": dataFormat[i].total});
			}})
		})
	};
	d3.select(".barchartdiv")
		.selectAll("g").remove()
		.selectAll(".axis").remove();
	
	var yDiv = d3.scale.linear()
		.domain([0, d3.max(numberSpecies, function(d){ return d.number;}) + 2])
		.range([height, 0])
		.nice();

	var xDiv = d3.scale.ordinal()
		.domain(countries)
		.rangeRoundBands([0, barwidthNorm * countries.length]);
	
	var xDivAxis = d3.svg.axis()
		.scale(xDiv)
		.orient("bottom");
	
	var yDivAxis = d3.svg.axis()
		.scale(yDiv)
		.orient("left");

	var divChart = d3.select(".barchartdiv")
		.attr("width", barwidthNorm * countries.length + margin.right + margin.left)
		.attr("height",  height + speciesMarginBottom + margin.top)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," +  margin.top + ")");
		
	divChart.call(divTip);
				
	var bar = divChart.selectAll("g")
		.data(numberSpecies)
		.attr("class", "bars")
		.enter().append("g")
		.attr("transform", function(d, i) { 
			return "translate(" + i * barwidthNorm + ", 0)"; 
		});
	
	bar.append("rect")
		.attr("y", function(d){return yDiv(d.number);})
		.attr("height", function(d){return height - yDiv(d.number);})
		.attr("width", barwidthNorm-2)
		.on("mouseover", function(d){
    		d3.select(this).style("fill", "#ff3300")
    		divTip.show(d);
    	})
    	.on("mouseout", function(d) {
    		d3.select(this).style("fill", "")
    		divTip.hide(d);
    	})

	// creëren van de assen
    divChart.append("g")
    	.attr("class", "y axis")
    	.call(yDivAxis)
		.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -35)
    	.attr("dy", "-.3em")
    	.style("text-anchor", "end")
    	.text("Total observations " + speciesName);
	
	divChart.append("g")
    	.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
    	.call(xDivAxis)
		.selectAll("text")
		.attr("y", 0)
		.attr("x", -9)
		.attr("dy", ".31em")
		.attr("transform", "rotate(-65)")
		.style("text-anchor", "end");
		
	colorSpeciesMap(countries, dataFormat, speciesMap);
};