/* Annabel Droste */
/* Europakaart Datamaps */
/* nog niets gedaan aan opmaak, en sommige functies moeten slimmer kunnen zodat niet twee keer hetzelfde hoeft */

d3_queue.queue()
	.defer(d3.json,"landdeelfinal.json")
	.defer(d3.json,"area.json")
	.await(start);

// margins barchart
var margin = {top: 20, right: 20, bottom: 250, left: 70};
var barwidth = 20;
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
		return '<span>' + d.details.length + '</span>';
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
				drawGenuschart(data_format[geo.id]["observations"],data_format[geo.id]["name"])
			})
		}
	});
	map.legend();
	diversity(data);
	
	var species_button = document.getElementById("species_button");
	species_button.addEventListener("click", function(){ colourMap(map, data_format, 0);});
}

/* Colourmap with for species, genus or one species */
function colourMap(subject, data_format, area){
	var max_number = d3.max(data_format, function(d){console.log(data_format[d]["number"]); return data_format[d]["number"]})
	for (var i in data_format){
		data_format["fillKey"] = key(area, data_format[i]["number"]);
	}
	map.fills = {}
}

/* Function that draws the chart that shows up if a country is clicked and shows all the species. 
	Het is nog niet gelukt om de assen goed te krijgen, bovendien wordt de chart voor sommige landen veel te breed */
function drawGenuschart(observations, name){
	// create basis of chart 
	var chart = d3.select(".barchart")
		.attr("width", barwidth * observations.length + margin.right + margin.left)
		.attr("height", height + margin.bottom + margin.top)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," +  margin.top + ")");
	
	// remove previous bars
	chart.selectAll("g").remove();
	chart.selectAll(".axis").remove();
	chart.selectAll("text").remove();
	
	var genus = []
	observations.forEach(function (d){
		genus.push(d.genus)		
	});
	
	// x-as barchart species per country
	var x = d3.scale.ordinal()
		.domain(genus)
		.rangeRoundBands([0, barwidth * observations.length]);
	    	
	var x_axis = d3.svg.axis()
		.scale(x)
		.orient("bottom");	
	
	var max_data = d3.max(observations, function(d){ return d.details.length})
	y.domain([0, max_data + 5]);
		
	chart.call(tip);
		
	var bar = chart.selectAll("g")
		.data(observations.sort(function(a, b){	return b.details.length-a.details.length}))
		.attr("class", "bars")
		.enter().append("g")
		.attr("transform", function(d, i) { 
			return "translate(" + i * barwidth + ",0)"; 
		});

	bar.append("rect")
    	.attr("y", function(d) { 
    		return y(d.details.length); 
    	})
    	.attr("height", function(d) { 
    		return height - y(d.details.length); 
    	})
    	.attr("width", barwidth - 3)
		.on("mouseover", function(d){
    		d3.select(this).style("fill", "#7ddc1f")
    		tip.show(d);
    	})
    	.on("mouseout", function(d) {
    		d3.select(this).style("fill", "blue")
    		tip.hide(d);
    	})
		.on("click", function(d){drawSpecieschart(d);});
		
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
		.attr("x", 9)
		.attr("dy", ".35em")
		.attr("transform", "rotate(90)")
		.style("text-anchor", "start");
}

/* Species barchart after a bar from genus barchart was clicked. */
function drawSpecieschart(genus){
	var chart = d3.select(".barchartspecies")
		.attr("width", barwidth * genus.details.length + margin.right + margin.left)
		.attr("height", height + margin.bottom + margin.top)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," +  margin.top + ")");
	
	// remove previous bars
	chart.selectAll("g").remove();
	chart.selectAll(".axis").remove();
	chart.selectAll("text").remove();
	
	var species = []
	genus.details.forEach(function (d){
		species.push(d.species)		
	});
	
	// x-as barchart species per country
	var x_spec = d3.scale.ordinal()
		.domain(species)
		.rangeRoundBands([0, barwidth * genus.details.length]);
	    	
	var x_spec_axis = d3.svg.axis()
		.scale(x_spec)
		.orient("bottom");	
	
	var max_data = d3.max(genus.details, function(d){ return d.number})
	y.domain([0, max_data + 5]);
		
	chart.call(tip);
		
	var bar = chart.selectAll("g")
		.data(genus.details.sort(function(a, b){	return b.number-a.number}))
		.attr("class", "bars")
		.enter().append("g")
		.attr("transform", function(d, i) { 
			return "translate(" + i * barwidth + ",0)"; 
		});

	bar.append("rect")
    	.attr("y", function(d) { 
    		return y(d.number); 
    	})
    	.attr("height", function(d) { 
    		return height - y(d.number); 
    	})
    	.attr("width", barwidth - 3)
		.on("mouseover", function(d){
    		d3.select(this).style("fill", "#7ddc1f")
    		tip.show(d);
    	})
    	.on("mouseout", function(d) {
    		d3.select(this).style("fill", "blue")
    		tip.hide(d);
    	})
		
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
    	.call(x_spec_axis)
		.selectAll("text")
		.attr("y", 0)
		.attr("x", 9)
		.attr("dy", ".35em")
		.attr("transform", "rotate(90)")
		.style("text-anchor", "start");
}

/* Draws the diversity barchart, an overview of the diversity in the EU. */
function diversity(data){
	var countries = [];
	data.forEach(function(d){
		countries.push(d.name);
	});

	var x_div = d3.scale.linear()
		.domain([0, d3.max(data, function(d){ return d.observation.length})])
		.range([0, width]);
	
	var x_div_axis = d3.svg.axis()
		.scale(x_div)
		.orient("bottom");
	
	var y_div = d3.scale.ordinal()
		.domain(countries)
		.rangeRoundBands([0, barwidth * data.length]);
	
	var y_div_axis = d3.svg.axis()
		.scale(y_div)
		.orient("left");

	var div_chart = d3.select(".barchartdiv")
		.attr("width", width)
		.attr("height", barwidth * data.length + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," +  margin.top + ")");
		
		
	var bar = div_chart.selectAll("g")
		.data(data.sort(function(a, b){	return b.observation.length-a.observation.length}))
		.attr("class", "bars")
		.enter().append("g")
		.attr("transform", function(d, i) { 
			return "translate(0," + i * barwidth + ")"; 
		});

	bar.append("rect")
		.attr("x", 0)
		.attr("width", function(d) { return x_div(d.observation.length) + "px"; })
    	.attr("height", barwidth - 2)
	
	// creëren van de assen
    div_chart.append("g")
    	.attr("class", "y axis")
    	.call(y_div_axis)
	
	div_chart.append("g")
    	.attr("class", "x axis")
		.attr("transform", "translate(0," + barwidth*data.length + ")")
    	.call(x_div_axis);
}

/* Colors the countries based on the density of breeding birds species */
function key(area, total){
	var scale = [0, 0.00001, 0.0001, 0.001, 0.1, 1];
	var colors = ['< 25 species','< 50 species','< 75 species','< 100 species','< 125 species'];

	for (var h = 1, len = scale.length; h < len; h++){
		if ((total/area) >= scale[h - 1] && (total/area) < scale[h]){
			return colors[h - 1];
		}
	}
}

/* list Author: Robin Kuiper, 
 adjusted to the country names of the data
 Date: 27 03 2014 */
var country_codes = [
    ["af", "AFG", "Afghanistan"],
    ["ax", "ALA", "Åland Islands"],
    ["al", "ALB", "Albania"],
    ["dz", "DZA", "Algeria"],
    ["ad", "AND", "Andorra"],
    ["ai", "AIA", "Anguilla"],
    ["ag", "ATG", "Antigua and Barbuda"],
    ["am", "ARM", "Armenia"],
    ["at", "AUT", "Austria"],
    ["az", "AZE", "Azerbaijan"],
    ["bb", "BRB", "Barbados"],
    ["by", "BLR", "Belarus"],
    ["be", "BEL", "Belgium"],
    ["ba", "BIH", "Bosnia and Herzegovina"],
    ["bv", "BVT", "Bouvet Island"],
    ["bg", "BGR", "Bulgaria"],
    ["cv", "CPV", "Cape Verde"],
    ["ky", "CYM", "Cayman Islands"],
    ["cx", "CXR", "Christmas Island"],
    ["cc", "CCK", "Cocos (Keeling) Islands"],
    ["ck", "COK", "Cook Islands"],
    ["cr", "CRI", "Costa Rica"],
    ["hr", "HRV", "Croatia"],
    ["cy", "CYP", "Cyprus"],
    ["cz", "CZE", "Czech Republic"],
    ["dk", "DNK", "Denmark"],
    ["eg", "EGY", "Egypt"],
    ["ee", "EST", "Estonia"],
    ["fk", "FLK", "Falkland Islands (Malvinas)"],
    ["fo", "FRO", "Faroe Islands"],
    ["fi", "FIN", "Finland"],
    ["fr", "FRA", "France"],
    ["gf", "GUF", "French Guiana"],
    ["pf", "PYF", "French Polynesia"],
    ["tf", "ATF", "French Southern Territories"],
    ["ge", "GEO", "Georgia"],
    ["de", "DEU", "Germany"],
    ["gi", "GIB", "Gibraltar"],
    ["gr", "GRC", "Greece"],
    ["gl", "GRL", "Greenland"],
    ["gd", "GRD", "Grenada"],
    ["gg", "GGY", "Guernsey"],
    ["va", "VAT", "Holy See (Vatican City State)"],
    ["hu", "HUN", "Hungary"],
    ["is", "ISL", "Iceland"],
    ["ir", "IRN", "Iran"],
    ["iq", "IRQ", "Iraq"],
    ["ie", "IRL", "Ireland"],
    ["im", "IMN", "Isle of Man"],
    ["il", "ISR", "Israel"],
    ["it", "ITA", "Italy"],
    ["jo", "JOR", "Jordan"],
    ["kz", "KAZ", "Kazakhstan"],
    ["kw", "KWT", "Kuwait"],
    ["kg", "KGZ", "Kyrgyzstan"],
    ["lv", "LVA", "Latvia"],
    ["lb", "LBN", "Lebanon"],
    ["ly", "LBY", "Libya"],
    ["li", "LIE", "Liechtenstein"],
    ["lt", "LTU", "Lithuania"],
    ["lu", "LUX", "Luxembourg"],
    ["mo", "MAC", "Macao"],
    ["mk", "MKD", "The former Yugoslav Republic of Macedonia"],
    ["mv", "MDV", "Maldives"],
    ["mt", "MLT", "Malta"],
    ["mh", "MHL", "Marshall Islands"],
    ["mq", "MTQ", "Martinique"],
    ["mr", "MRT", "Mauritania"],
    ["mu", "MUS", "Mauritius"],
    ["yt", "MYT", "Mayotte"],
    ["md", "MDA", "Republic of Moldova"],
    ["mc", "MCO", "Monaco"],
    ["mn", "MNG", "Mongolia"],
    ["me", "MNE", "Montenegro"],
    ["ms", "MSR", "Montserrat"],
    ["ma", "MAR", "Morocco"],
    ["nl", "NLD", "Netherlands"],
    ["nf", "NFK", "Norfolk Island"],
    ["mp", "MNP", "Northern Mariana Islands"],
    ["no", "NOR", "Norway"],
    ["ps", "PSE", "Palestine, State of"],
    ["pn", "PCN", "Pitcairn"],
    ["pl", "POL", "Poland"],
    ["pt", "PRT", "Portugal"],
    ["qa", "QAT", "Qatar"],
    ["re", "REU", "Réunion"],
    ["ro", "ROU", "Romania"],
    ["ru", "RUS", "Russia"],
    ["bl", "BLM", "Saint Barthélemy"],
    ["sh", "SHN", "Saint Helena, Ascension and Tristan da Cunha"],
    ["kn", "KNA", "Saint Kitts and Nevis"],
    ["lc", "LCA", "Saint Lucia"],
    ["mf", "MAF", "Saint Martin (French part)"],
    ["pm", "SPM", "Saint Pierre and Miquelon"],
    ["vc", "VCT", "Saint Vincent and the Grenadines"],
    ["ws", "WSM", "Samoa"],
    ["sm", "SMR", "San Marino"],
    ["sa", "SAU", "Saudi Arabia"],
    ["rs", "SRB", "Serbia"],
    ["sk", "SVK", "Slovakia"],
    ["si", "SVN", "Slovenia"],
    ["sb", "SLB", "Solomon Islands"],
    ["gs", "SGS", "South Georgia and the South Sandwich Islands"],
    ["es", "ESP", "Spain"],
    ["sj", "SJM", "Svalbard and Jan Mayen"],
    ["se", "SWE", "Sweden"],
    ["ch", "CHE", "Switzerland"],
    ["sy", "SYR", "Syria"],
    ["tj", "TJK", "Tajikistan"],
    ["tn", "TUN", "Tunisia"],
    ["tr", "TUR", "Turkey"],
    ["tm", "TKM", "Turkmenistan"],
    ["tc", "TCA", "Turks and Caicos Islands"],
    ["ua", "UKR", "Ukraine"],
    ["gb", "GBR", "United Kingdom"],
    ["uz", "UZB", "Uzbekistan"],
    ["vu", "VUT", "Vanuatu"] ];
