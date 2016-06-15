/* Annabel Droste */
/* Europakaart Datamaps */

// load the data
d3_queue.queue()
	.defer(d3.json,"landdeelfinalnone.json")
	/* .defer(d3.json,"area.json") */
	.await(start);

// margins barchart
var margin = {top: 25, right: 20, bottom: 100, left: 70};
var species_margin_bottom = 180;
var barwidth_norm = 20;
var height = 350 - margin.top - margin.bottom;
var width = 400 - margin.right - margin.left;
var legendWidth = 30;
var legendHeight = 75;

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

// tooltip species chart
var div_tip = d3.tip()
	.attr('class', 'tip')
	.html(function(d){
		return '<span>' + "Observations: " + d.number + '</span>';
	});

/* Load the data, enable the interactive components that are included in the html (buttons etc.) and create the start page  */
function start(error, data){
	if (error){
		alert(error);
	}
	
	var data_format = {}
	
	// process the data and make sure it is in the right structure
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
				data_format[data[i].country] = {fillKey: key("species", data[i].number_species),
				"name": data[i].name,
				"observations": data[i].observation,
				"number": data[i].number_species,
				"total": data[i].total
				};
			}
		});
	}
	
	// datamap of the world zoomed in on Europe that allows an overview and is clickable to select a country
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
		fills: {'<60 species': '#f1eef6',
				'<160 species': '#bdc9e1',
	            '<240 species': '#74a9cf',
	            '<320 species': '#2b8cbe',
	            '<400 species': '#045a8d',
				'no data': 'grey',
	            defaultFill: 'grey'}, 
		data: data_format,
		geographyConfig: {
	        	highlightFillColor:	'#7ddc1f',
	        	popupTemplate: function(geo, data, area_format) {
				if (!data) { return[ '<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br><strong>', "No data", '</strong>',
                    '</div>'].join('');; }
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Total observations: <strong>', data.total, '</strong>',
					'<br>Number of species: <strong>', data.number, '</strong>',
                    '</div>'].join('');
	        	}
		},
		done: function(map){
			map.svg.selectAll('.datamaps-subunit').on('click', function(geo,data) {
				drawChart(data_format[geo.id]["observations"],data_format[geo.id]["name"], "genus")
			})
		}
	});
	
	// datamap that shows where a single species is present. defaultfill is grey, only after a species has been entered does this change
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
	
	map.legend();
	species_map.legend();
	// colors the map by the total number of species per country
	var species_button = document.getElementById("species_button");
	species_button.addEventListener("click", function(){ colourMap(map, data_format, "species");
	selectLegend("species")});
	
	// colors the map by the total number of observations per country
	var total_button = document.getElementById("total_obs_button");
	total_button.addEventListener("click", function(){ colourMap(map, data_format, "observations");
	selectLegend("observations");});
	
	// create a list of all the species in the dataset that can be used by the dropdown-menu
	var species_list = getSpeciesNames(data_format).sort();
	
	var dropdown = d3.select("#dropdown")
		.append("select")
		.attr("id", "dropdown_options")
		.attr("class", "selectpicker")
		.attr("data-live-search","true")
		.style("display", "none");
		
	species_list.forEach(function(d){
		d3.select("#dropdown_options")
			.append("option")
			.text(d);
	});
	
	$('.selectpicker').selectpicker({
		style: 'btn-info',
		size: 4
	});
	
	// allows the user to type in a pecies and draws the barchart for that species and colors the species map 
	var species_divbutton = document.getElementById("species_div_submit");
	species_divbutton.addEventListener("click", function(){ 
		diversity(data_format, $("#dropdown_options").val(), species_map);});
}

/* updates the map for species or total observations */
function colourMap(map, data_format, type){
	var codes = Object.keys(data_format);
	var new_data_format = data_format;
	
	// create new data_format to change the fillKey and to select the correct data to be entered in the fillKey
	for (var i = 0, len = codes.length; i < len; i++){
		if (type == "observations"){ var interest = data_format[codes[i]].total}
		else { var interest = data_format[codes[i]]["number"]}
		new_data_format[codes[i]] = {fillKey: key(type, interest),
			"name": data_format[codes[i]].name,
			"observations": data_format[codes[i]].observations,
			"number": data_format[codes[i]].number, 
			"total": data_format[codes[i]].total
		}
	}
	map.updateChoropleth(new_data_format);
}

/* Selects the scales and correct labels for the legend */
function selectLegend(type){
	var scaleSpecies = [0, 60, 160, 240, 320, 400];
	var scaleObservations = [0, 6000, 12000, 18000, 24000, 30000];
	
	if (type == "observations"){
		updateLegendLabels(scaleObservations, ' obs.: ');
	}
	if (type == "species"){
		updateLegendLabels(scaleSpecies, ' species: ');
	}
}

/* Selects the html datamap legend labels and alters them with jquery. */
function updateLegendLabels(array, unit){
	var name = d3.select("#map").selectAll("dt");
	for (var i = 0, len = array.length - 1; i<len; i++){
		console.log(name[0][i]);
		$(name[0][i]).replaceWith('<dt><' + array[i+1] + unit + '</dt>');
	}
}

/* Function that draws the chart that shows up if a country is clicked and shows all the top ten genus observed in that country. The same function is called
again if a bar in the barchart is clicked. Then it shows all the species in the genus that are present in the country. If the user hovers over a bar, a link
to the wikipedia is accessible in the tooltip. 
	 */
function drawChart(data, name, type){
	if (type == "genus"){
		tip.hide();
		var data_array = data;
		var data_key = "genus";
		var y_valuename = "details";
		var y_valuename2 = "length";
		var y_axis_label = "species in genus";
		var bottom = margin.bottom;
	};
	
	if (type == "species"){
		var data_array = data.details;
		var data_key = "species";
		var y_valuename = "number";
		var y_axis_label = "observations";
		var bottom = species_margin_bottom;
	};

	// remove old charts 
	var old_chart = d3.select(".barchart" + type)
		.selectAll("g").remove()
		.selectAll(".axis").remove();
	
	var old_spec_chart = d3.select(".barchartspecies")
		.selectAll("g").remove();
		
	// create new chart
	var chart = d3.select(".barchart" + type)
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + bottom + margin.top)
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
		.attr("height",  height + species_margin_bottom + margin.top)
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

/* Colors the countries based on the the species per country or the total number of observations */
function key(type, total){
	// species
	if (type == "species"){ var scale = [0, 60, 160, 240, 320, 400];}
	
	// observations
	else if (type == "observations"){var scale = [0, 6000, 12000, 18000, 24000, 30000];};

	var colors = ['<60 species','<160 species','<240 species','<320 species','<400 species'];

	for (var h = 1, len = scale.length; h < len; h++){
		if (total >= scale[h - 1] && total < scale[h]){
			return colors[h - 1];
		}
	}
};