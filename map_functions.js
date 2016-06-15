/* Annabel Droste
Functions that color the map according to the data they receive
	*/

/* Colors the countries where the species is present. */
function speciesMap(countries, data_format, species_map){
	var data_format_new = {};
	var codes = Object.keys(data_format);
	for (var i in codes){
		data_format_new[codes[i]] = {fillKey: "absent"};
	}
	for (var i in countries){
		country_codes.forEach(function(k){
			if (k.name == countries[i]){
				data_format_new[k["iso"]] = {fillKey: "present"};
			}
		});
	}
	species_map.updateChoropleth(data_format_new);
};

/* Returns a list of all the species names present in the dataset.  */
function getSpeciesNames(data_format){
	var list = [];
	for (var i in data_format){
		data_format[i]["observations"].forEach(function(d){
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