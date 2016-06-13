/* Annabel Droste */
/* Europakaart Datamaps */
/* nog niets gedaan aan opmaak, en sommige functies moeten slimmer kunnen zodat niet twee keer hetzelfde hoeft */
// engelse comments

d3_queue.queue()
	.defer(d3.json,"landdeelfinalnone.json")
	.defer(d3.json,"area.json")
	.await(start);

// margins barchart
var margin = {top: 20, right: 20, bottom: 100, left: 70};
var barwidth_norm = 20;
var height = 350 - margin.top - margin.bottom;
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
		var link_wiki = "https://en.wikipedia.org/wiki/" + d.name;
		return '<span>' + '<a href="' + link_wiki + '">' + "More info" + '</a> ' + '</span>';
	});

var div_tip = d3.tip()
	.attr('class', 'tip')
	.html(function(d){
		return '<span>' + "All observations: " + d.total + '</span>';
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
		// guernsey and isle of man create errors with the high resolution datamap (the non-high resolution functioned okay). 
		// Isle of Man is the last entry, so a break must occur 
		if (data[i].country == "None" || data[i].country == "Guernsey"){
			data.splice(i,1);
		}
		if (data[i].country == "Isle of Man"){
			break;
		}
		data[i].number_species = d3.sum(data[i].observation, function(d){return d["details"].length;});
		data[i].total = d3.sum(data[i].observation, function(d){ return d3.sum(d.details, function(u){ return u.number})});
		country_codes.forEach(function(k){
			if (k.name == data[i].country){
				data[i].name = data[i].country;
				data[i].country = k.iso;
				data_format[data[i].country] = {fillKey: key(area_format[data[i].name], data[i].number_species),
				"name": data[i].name,
				"area":area_format[data[i].name],
				"observations": data[i].observation,
				"number": data[i].number_species,
				"total": data[i].total
				};
			}
		});
	}

	var map = new Datamap({
		scope: 'world',
		element: document.getElementById('map'),
		setProjection: function(element) {
			var projection = d3.geo.mercator()
				.center([1, 24])
				.rotate([-13, -27])
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
                    '<br>Total observations: <strong>', data.total, '</strong>',
                    '</div>'].join('');
	        	}
		},
		done: function(map){
			map.svg.selectAll('.datamaps-subunit').on('click', function(geo,data) {
				drawChart(data_format[geo.id]["observations"],data_format[geo.id]["name"], "genus")
			})
		}
	});
	
	var species_map = new Datamap({
			scope: 'world',
			element: document.getElementById('map_species'),
			setProjection: function(element) {
				var projection = d3.geo.orthographic()
					.center([1, 24])
					.rotate([-13, -27])
					.scale(430)
					.translate([element.offsetWidth / 2, element.offsetHeight / 2]);
				var path = d3.geo.path()
					.projection(projection);
				return {
				path: path,
				projection: projection
				};
			},
			fills: {'present': '#d95f0e',
					'absent': 'grey',
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
						'</div>'].join('');
					}
			}
		});
		
	var species_button = document.getElementById("species_button");
	species_button.addEventListener("click", function(){ colourMap(map, data_format, 0);});
	
	var area_button = document.getElementById("area_button");
	area_button.addEventListener("click", function(){ colourMap(map, data_format, 1);});
	
	var total_button = document.getElementById("total_obs_button");
	total_button.addEventListener("click", function(){ colourMap(map, data_format, 2);});
	
	
	var genus_divbutton = document.getElementById("genus_div_submit");
	genus_divbutton.addEventListener("click", function(){ 
		var genus_divchart = document.getElementById("genus_div");
		diversity(data_format, genus_divchart.value, species_map);});
		
	var species_list = getSpeciesNames(data_format);
	
	/* var dropdown = d3.select("select")
		.append(select)
		.attr("class", "selectpicker")
		.attr("data-live-search","true") */
}

/* Colourmap with for species, genus or one species */
function colourMap(map, data_format, area){
	var codes = Object.keys(data_format);
	var new_data_format = data_format;
	console.log(codes);
	
	for (var i = 0, len = codes.length; i < len; i++){
		console.log(codes[i]);
		if (area == 1){ var new_area = data_format[codes[i]].area; var interest = data_format[codes[i]]["number"]}
		else if (area == 2){var new_area = 2; var interest = data_format[codes[i]].total}
		else { var new_area = 0; var interest = data_format[codes[i]]["number"]}
		new_data_format[codes[i]] = {fillKey: key(new_area, interest),
			"name": data_format[codes[i]].name,
			"area": data_format[codes[i]].area,
			"observations": data_format[codes[i]].observations,
			"number": data_format[codes[i]].number, 
			"total": data_format[codes[i]].total
		}
	}
	map.updateChoropleth(new_data_format);
}

/* Function that draws the chart that shows up if a country is clicked and shows all the genus/species observed in that country.. 
	Het is nog niet gelukt om de assen goed te krijgen, bovendien wordt de chart voor sommige landen veel te breed */
function drawChart(data, name, type){
	if (type == "genus"){
		tip.hide();
		var data_array = data;
		var data_key = "genus";
		var y_valuename = "details";
		var y_valuename2 = "length";
		var barwidth = barwidth_norm;
		var old_spec_chart = d3.select(".barchartspecies")
			.selectAll("g").remove();
		var y_axis_label = "species in genus";
	};
	
	if (type == "species"){
		var data_array = data.details;
		var data_key = "species";
		var y_valuename = "number";
		var barwidth = 1.5 * barwidth_norm;
		var old_spec_chart = d3.select(".barchartspecies")
			.selectAll("g").remove();
		var y_axis_label = "observations";
	};

	// remove old chart 
	var old_chart = d3.select(".barchart" + type)
		.selectAll("g").remove()
		.selectAll(".axis").remove();
		
	// create new chart
	var chart = d3.select(".barchart" + type)
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.bottom + margin.top)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," +  margin.top + ")");
		
	// sort the data on descending order and select the top 10
	var data_domain = []
	data_array.forEach(function (d){ if (type == "genus"){ data_domain.push({"name": d[data_key], "number": d[y_valuename][y_valuename2], "details": d.details})}
	else{ data_domain.push({"name": d[data_key], "number": d[y_valuename]})}});
	data_domain = data_domain.sort(function(a, b) {
		return b.number < a.number ? -1 : b.number > a.number ? 1 : b.number >= a.number ? 0 : NaN;
	})
	if (type == "genus"){
		if (data_domain.length > 10){data_domain.length = 10;}
	};
	var length = data_domain.length;
	// x-as barchart species per country
	var x = d3.scale.ordinal()
		.domain(data_domain.map(function(d){ return d.name}))
		.rangeRoundBands([0, width]);
	    	
	var x_axis = d3.svg.axis()
		.scale(x)
		.orient("bottom");	
	
	var max_data = d3.max(data_domain, function(d){ return d.number});
	y.domain([0, max_data + 2]);
	
	chart.call(tip);
		
	var bar = chart.selectAll("g")
		.data(data_domain)
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
    	.call(y_axis)
  		.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -35)
    	.attr("dy", ".1em")
    	.style("text-anchor", "end")
    	.text("Total " + y_axis_label);
	
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
	
	chart.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")   
        .text(type + " in " + name);
}

/* Draws the total observations per species. */
function diversity(data_format, species_name, species_map){
	var countries = [];
	var number_species = [];
	// right now, only countries where the birds are present are shown.
	for (var i in data_format){
		data_format[i].observations.forEach(function(d){
			d.details.forEach(function(k){
				if (k.species == species_name){
					countries.push(data_format[i].name);
					number_species.push({"country": data_format[i].name, "number": k.number, "total": data_format[i].total});
			}})
		})
	};
	d3.select(".barchartdiv")
		.selectAll("g").remove()
		.selectAll(".axis").remove();
	
	var y_div = d3.scale.linear()
		.domain([0, d3.max(number_species, function(d){ return d.number;})])
		.range([height, 0]);

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

	// creëren van de assen
    div_chart.append("g")
    	.attr("class", "y axis")
    	.call(y_div_axis)
		.append("text")
    	.attr("transform", "rotate(-90)")
    	.attr("y", -35)
    	.attr("dy", "-.3em")
    	.style("text-anchor", "end")
    	.text("Total observations " + species_name);
	
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
		
	speciesMap(countries, data_format, species_map);
};

/* Colors the countries based on the density of breeding birds species */
function key(area, total){
	// species
	if (area == 0){
		var scale = [0, 60, 160, 240, 320, 400];
		var value = total;
	}
	// observations
	else if (area == 2){
		var scale = [0, 6000, 12000, 18000, 24000, 30000];
		var value = total;
	}
	// area
	else{
		var scale = [0, 0.00001, 0.0001, 0.001, 0.1, 1];
		var value = total/area;
	}
	var colors = ['< 25 species','< 50 species','< 75 species','< 100 species','< 125 species'];

	for (var h = 1, len = scale.length; h < len; h++){
		if (value >= scale[h - 1] && value < scale[h]){
			return colors[h - 1];
		}
	}
};