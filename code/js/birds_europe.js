/* 
* Annabel Droste 
* Basis of the webpage 
*/

// margins barchart
var margin = {top: 30, right: 40, bottom: 100, left: 70};
var speciesMarginBottom = 205;
var barwidthNorm = 20;
var height = 350 - margin.top - margin.bottom;
var width = 400 - margin.right - margin.left;
var legendWidth = 30;
var legendHeight = 75;

// the two scales used for the maps and legendas for respectively species and observations
var scaleSpecies = [0, 60, 160, 240, 320, 400];
var scaleObservations = [0, 6000, 12000, 18000, 24000, 30000];

// barchart genus
var y = d3.scale.linear()
	.range([height, 0]);

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

// tooltip species and genus chart connected to first map
var tip = d3.tip()
	.attr('class', 'tipExtra')
	.html(function(d){
		var link_wiki = "https://en.wikipedia.org/wiki/" + d.name;
		return '<span>' + '<a href="' + link_wiki + '" target="_blank">' + "More info" + '</a> ' + '</span>';
	});

// tooltip species chart
var divTip = d3.tip()
	.attr('class', 'tip')
	.html(function(d){
		return '<span>' + d.number + '</span>';
	});

/* Load the data, enable the interactive components that are included in the html (buttons etc.) and create the start page  */
window.onload = function (){
	var data = d3.json("../../data/landdeelfinal.json", function(error, data){
	if (error){
		alert(error);
	}
	var dataFormat = {};
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
		data[i].numberSpecies = d3.sum(data[i].observation, function(d){return d["details"].length;});
		data[i].total = d3.sum(data[i].observation, function(d){ return d3.sum(d.details, function(u){ return u.number})});
		country_codes.forEach(function(k){
			if (k.name == data[i].country){
				data[i].name = data[i].country;
				data[i].country = k.iso;
				dataFormat[data[i].country] = {fillKey: key(scaleSpecies, data[i].numberSpecies),
				"name": data[i].name,
				"observations": data[i].observation,
				"number": data[i].numberSpecies,
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
		fills: {'<60 species': '#c6dbef',
				'<160 species': '#9ecae1',
	            '<240 species': '#6baed6',
	            '<320 species': '#3182bd',
	            '<400 species': '#08519c',
				'no data': 'grey',
	            defaultFill: 'grey'}, 
		data: dataFormat,
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
				drawChart(dataFormat[geo.id]["observations"],dataFormat[geo.id]["name"], "genus")
			})
		}
	});
	
	// datamap that shows where a single species is present. defaultfill is grey, only after a species has been entered does this change
	var speciesMap = new Datamap({
		scope: 'world',
		element: document.getElementById('map_species'),
		setProjection: function(element) {
			var projection = d3.geo.orthographic()
				.center([8, 28])
				.rotate([-7, -24])
				.scale(450)
				.translate([element.offsetWidth / 2, element.offsetHeight / 2]);
			var path = d3.geo.path()
				.projection(projection);
			return {
			path: path,
			projection: projection
			};
		},
		fills: {'present': '#FF6600',
				'absent': '#003399',
				'no data': 'grey',
				defaultFill: 'grey'}, 
		data: dataFormat,
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
	speciesMap.legend();
	
	// creates the two buttons
	var speciesButton = document.getElementById("speciesButton");
	var totalButton = document.getElementById("totalObsButton");
	
	changeColorButton(speciesButton, totalButton);
	
	// colors the map by the total number of species per country
	speciesButton.addEventListener("click", function(){ colourMap(map, dataFormat, scaleSpecies);
	changeColorButton(speciesButton, totalButton);
	selectLegend("species")});
	
	// colors the map by the total number of observations per country
	totalButton.addEventListener("click", function(){ colourMap(map, dataFormat, scaleObservations);
	changeColorButton(totalButton, speciesButton);
	selectLegend("observations");});
	
	// create a list of all the species in the dataset that can be used by the dropdown-menu
	var species_list = getSpeciesNames(dataFormat).sort();
	
	var dropdown = d3.select("#dropdown")
		.append("select")
		.attr("id", "dropdownOptions")
		.attr("class", "selectpicker")
		.attr("data-live-search","true")
		.style("display", "none");
		
	species_list.forEach(function(d){
		d3.select("#dropdownOptions")
			.append("option")
			.text(d);
	});
	
	$('.selectpicker').selectpicker({
		style: 'btn-info',
		size: 4
	});
	
	// allows the user to type in a pecies and draws the barchart for that species and colors the species map 
	var speciesDivButton = document.getElementById("speciesDivSubmit");
	speciesDivButton.addEventListener("click", function(){ 
		diversity(dataFormat, $("#dropdownOptions").val(), speciesMap);});
})}

