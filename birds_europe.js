/* Annabel Droste */
/* Europakaart Datamaps */
/* nog niets gedaan aan opmaak, en sommige functies moeten slimmer kunnen zodat niet twee keer hetzelfde hoeft */
// engelse comments

d3_queue.queue()
	.defer(d3.json,"landdeelfinal.json")
	.defer(d3.json,"area.json")
	.await(start);

// margins barchart
var margin = {top: 20, right: 20, bottom: 250, left: 70};
var barwidth_norm = 20;
var height = 550 - margin.top - margin.bottom;
var width = 400 - margin.right - margin.left;

// barchart genus
var y = d3.scale.linear()
	.range([height, 0]);

var y_axis = d3.svg.axis()
	.scale(y)
	.orient("left");

var tip = d3.tip()
	.attr('class', 'tip')
	.html(function(d){
		return '<span>' + d.y_valuename + '</span>';
	});

var div_tip = d3.tip()
	.attr('class', 'tip')
	.html(function(d){
		return '<span>' + d.number + '</span>';
	});

function start(error, data, area){
	if (error){
		alert(error);
	}
	
	var data_format = {}
	var area_format = {}
	area.forEach(function(d){
		area_format[d.country] = +d.area;
	});

	for (var i in data){
		if (data[i].country == "None"){
			data.splice(i,1);
		}
		data[i].number_species = d3.sum(data[i].observation, function(d){return d["details"].length;});
		country_codes.forEach(function(k){
			var index = k.indexOf(data[i].country);
			if (index != -1){
				data[i].name = data[i].country;
				data[i].country = k[1];
				data_format[data[i].country] = {fillKey: key(area_format[data[i].name], data[i].number_species),
				"name": data[i].name,
				"area":area_format[data[i].name],
				"observations": data[i].observation,
				"number": data[i].number_species
				};
			}
		});
	}

	var map = new Datamap({
		scope: 'world',
		element: document.getElementById('map'),
		setProjection: function(element) {
			var projection = d3.geo.orthographic()
				.center([1, 24])
				.rotate([-15, -25])
				.scale(590)
				.translate([element.offsetWidth / 2, element.offsetHeight / 2]);
			var path = d3.geo.path()
				.projection(projection);
			return {
			path: path,
			projection: projection
			};
		},
		fills: {'< 25 species': '#f1eef6',
				'< 50 species': '#bdc9e1',
	            '< 75 species': '#74a9cf',
	            '< 100 species': '#2b8cbe',
	            '< 125 species': '#045a8d',
				'no data': 'grey',
	            defaultFill: 'grey'}, 
		data: data_format,
		geographyConfig: {
	        	highlightFillColor:	'#7ddc1f',
	        	popupTemplate: function(geo, data, area_format) {
                // tooltip
				if (!data) { return[ '<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br><strong>', "No data", '</strong>',
                    '</div>'].join('');; }
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Total something: <strong>', (data.number/data.area), '</strong>',
                    '</div>'].join('');
	        	}
		},
		done: function(map){
			map.svg.selectAll('.datamaps-subunit').on('click', function(geo,data) {
				drawChart(data_format[geo.id]["observations"],data_format[geo.id]["name"], "genus")
			})
		}
	});
	map.legend();
	
	var species_button = document.getElementById("species_button");
	species_button.addEventListener("click", function(){ colourMap(map, data_format, 0);});
	
	
	var genus_divbutton = document.getElementById("genus_div_submit");
	genus_divbutton.addEventListener("click", function(){ 
		var genus_divchart = document.getElementById("genus_div");
		diversity(data_format, genus_divchart.value);});
}

/* Colourmap with for species, genus or one species */
function colourMap(subject, data_format, area){
	var max_number = d3.max(data_format, function(d){console.log(data_format[d]["number"]); return data_format[d]["number"]})
	for (var i in data_format){
		data_format["fillKey"] = key(area, data_format[i]["number"]);
	}
	map.fills = {}
}

/* Function that draws the chart that shows up if a country is clicked and shows all the genus/species observed in that country.. 
	Het is nog niet gelukt om de assen goed te krijgen, bovendien wordt de chart voor sommige landen veel te breed */
function drawChart(data, name, type){
	if (type == "genus"){
		var length = data.length;
		var data_array = data;
		var data_key = "genus";
		var y_valuename = "details";
		var y_valuename2 = "length";
		var barwidth = barwidth_norm;
		var old_spec_chart = d3.select(".barchartspecies")
			.selectAll("g").remove();
	};
	
	if (type == "species"){
		var length = data.details.length;
		var data_array = data.details;
		var data_key = "species";
		var y_valuename = "number";
		var barwidth = 1.5 * barwidth_norm;
	};

	// remove old chart 
	var old_chart = d3.select(".barchart" + type)
		.selectAll("g").remove()
		.selectAll(".axis").remove();
		
	// create new chart
	var chart = d3.select(".barchart" + type)
		.attr("width", barwidth * length + margin.right + margin.left)
		.attr("height", height + margin.bottom + margin.top)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," +  margin.top + ")");
	
	var data_domain = []
	data_array.forEach(function (d){ data_domain.push(d[data_key])});
	
	// x-as barchart species per country
	var x = d3.scale.ordinal()
		.domain(data_domain)
		.rangeRoundBands([0, barwidth * length]);
	    	
	var x_axis = d3.svg.axis()
		.scale(x)
		.orient("bottom");	
	
	var max_data = d3.max(data_array, function(d){ if (type == "genus"){return d[y_valuename][y_valuename2]}
	else{return d[y_valuename]}});
	y.domain([0, max_data + 3]);
	
	chart.call(tip);
		
	var bar = chart.selectAll("g")
		/* .data(data_array.sort(function(a, b){	
			if (type == "genus"){ return b[y_valuename][y_valuename2]-a[y_valuename][y_valuename2]}
			else{return b[y_valuename]-a[y_valuename]}})) */
		.data(data_array)
		.attr("class", "bars")
		.enter().append("g")
		.attr("transform", function(d, i) { 
			return "translate(" + i * barwidth + ",0)"; 
		});

	bar.append("rect")
    	.attr("y", function(d) { 
			if (type == "genus"){return y(d[y_valuename][y_valuename2]);}
			else{ return y(d[y_valuename])}
    	})
    	.attr("height", function(d) { 
    		if (type == "genus"){return height - y(d[y_valuename][y_valuename2]);}
			else{ return height - y(d[y_valuename])}
    	})
    	.attr("width", barwidth - 3)
		.on("mouseover", function(d){
    		d3.select(this).style("fill", "#7ddc1f")
    		tip.show(d);
    	})
    	.on("mouseout", function(d) {
    		d3.select(this).style("fill", "")
    		tip.hide(d);
    	})
		.on("click", function(d){drawChart(d, name, "species");});
		
    // creëren van de assen
    chart.append("g")
    	.attr("class", "y axis")
    	.call(y_axis)
  		.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -35)
    	.attr("dy", ".1em")
    	.style("text-anchor", "end")
    	.text("Total observations");
	
	chart.append("g")
    	.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
    	.call(x_axis)
		.selectAll("text")
		.attr("y", 0)
		.attr("x", -9)
		.attr("dy", ".31em")
		.attr("transform", "rotate(-65)")
		.style("text-anchor", "end");
}

/* Draws the diversity barchart, an overview of the diversity in the EU. */
function diversity(data_format, species_name){
	var countries = [];
	var number_species = [];
	// right now, only countries where the birds are present are shown.
	for (var i in data_format){
		console.log("hi")
		data_format[i].observations.forEach(function(d){
			d.details.forEach(function(k){
				if (k.species == species_name){
					countries.push(data_format[i].name);
					number_species.push({"country": data_format[i].name, "number": k.number});
			}})
		})
	};
	console.log(countries);
	d3.select(".barchartdiv")
		.selectAll("g").remove()
		.selectAll(".axis").remove();
	
	var y_div = d3.scale.linear()
		.domain([0, d3.max(number_species, function(d){ return d.number;})])
		.range([height, 0]);

	console.log(number_species);
	var x_div = d3.scale.ordinal()
		.domain(countries)
		.rangeRoundBands([0, barwidth_norm * countries.length]);
	
	var x_div_axis = d3.svg.axis()
		.scale(x_div)
		.orient("bottom");
	
	var y_div_axis = d3.svg.axis()
		.scale(y_div)
		.orient("left");

	var div_chart = d3.select(".barchartdiv")
		.attr("width", barwidth_norm * countries.length + margin.right + margin.left)
		.attr("height",  height + margin.bottom + margin.top)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," +  margin.top + ")");
		
	div_chart.call(div_tip);
				
	var bar = div_chart.selectAll("g")
		.data(number_species)
		.attr("class", "bars")
		.enter().append("g")
		.attr("transform", function(d, i) { 
			return "translate(" + i * barwidth_norm + ", 0)"; 
		});
	
	bar.append("rect")
		.attr("y", function(d){return y_div(d.number);})
		.attr("height", function(d){return height - y_div(d.number);})
		.attr("width", barwidth_norm-2)
		.on("mouseover", function(d){
    		d3.select(this).style("fill", "#ff3300")
    		div_tip.show(d);
    	})
    	.on("mouseout", function(d) {
    		d3.select(this).style("fill", "")
    		div_tip.hide(d);
    	})
	/* bar.append("rect")
		.attr("x", 0)
		.attr("width", function(d) { return y_div(d.number) + "px"; })
    	.attr("height", barwidth_norm - 2)
	 */
	// creëren van de assen
    div_chart.append("g")
    	.attr("class", "y axis")
    	.call(y_div_axis)
		.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -35)
    	.attr("dy", "-.3em")
    	.style("text-anchor", "end")
    	.text("Total observations");
	
	div_chart.append("g")
    	.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
    	.call(x_div_axis)
		.selectAll("text")
		.attr("y", 0)
		.attr("x", -9)
		.attr("dy", ".31em")
		.attr("transform", "rotate(-65)")
		.style("text-anchor", "end");
};

/* Colors the countries based on the density of breeding birds species */
function key(area, total){
	var scale = [0, 0.00001, 0.0001, 0.001, 0.1, 1];
	var colors = ['< 25 species','< 50 species','< 75 species','< 100 species','< 125 species'];

	for (var h = 1, len = scale.length; h < len; h++){
		if ((total/area) >= scale[h - 1] && (total/area) < scale[h]){
			return colors[h - 1];
		}
	}
};