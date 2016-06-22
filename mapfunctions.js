/* Annabel Droste
Functions that color the map according to the data they receive
	*/

/* First map functions */

/* Colors the countries based on the the species per country or the total number of observations */
function key(scale, total){
	var colors = ['<60 species','<160 species','<240 species','<320 species','<400 species'];

	for (var h = 1, len = scale.length; h < len; h++){
		if (total >= scale[h - 1] && total < scale[h]){
			return colors[h - 1];
		}
	}
};

/* updates the map for species or total observations */
function colourMap(map, dataFormat, type){
	var codes = Object.keys(dataFormat);
	var newDataFormat = dataFormat;
	
	// create new dataFormat to change the fillKey and to select the correct data to be entered in the fillKey
	for (var i = 0, len = codes.length; i < len; i++){
		if (type == scaleObservations){ var interest = dataFormat[codes[i]].total}
		else { var interest = dataFormat[codes[i]]["number"]}
		newDataFormat[codes[i]] = {fillKey: key(type, interest),
			"name": dataFormat[codes[i]].name,
			"observations": dataFormat[codes[i]].observations,
			"number": dataFormat[codes[i]].number, 
			"total": dataFormat[codes[i]].total
		}
	}
	map.updateChoropleth(newDataFormat);
}

/* Selects the scales and correct labels for the legend */
function selectLegend(type){
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
	for (var i = 0, len = array.length - 1; i < len; i++){
		$(name[0][i]).replaceWith('<dt><' + array[i + 1] + unit + '</dt>');
	}
}

function changeColorButton(clickedButton, resetButton){
	clickedButton.style.backgroundColor = "#33FF33";
	resetButton.style.backgroundColor = "#deebf7";
}


/* Second map functions (the map that reacts to the dropdown menu) */
/* Colors the countries where the species is present. */
function colorSpeciesMap(countries, dataFormat, speciesMap){
	var newDataFormat = {};
	var codes = Object.keys(dataFormat);
	// put all countries on absent
	for (var i in codes){
		newDataFormat[codes[i]] = {fillKey: "absent"};
	}
	// put the countries from the array "countries" on present.
	for (var i in countries){
		country_codes.forEach(function(k){
			if (k.name == countries[i]){
				newDataFormat[k["iso"]] = {fillKey: "present"};
			}
		});
	}
	speciesMap.updateChoropleth(newDataFormat);
};

/* Returns a list of all the species names present in the dataset.  */
function getSpeciesNames(dataFormat){
	var list = [];
	for (var i in dataFormat){
		dataFormat[i]["observations"].forEach(function(d){
			d.details.forEach(function(i){
				// if the species name is not yet present in the list, add it. 
				if (list.indexOf(i.species) == -1){
					list.push(i.species);
				}
			})
		})
	}
	return list;
}