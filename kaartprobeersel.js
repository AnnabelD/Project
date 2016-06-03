/* Annabel Droste */
/* Europakaart Datamaps */

d3_queue.queue()
	.defer(d3.json,"landdeel2.json")
	.defer(d3.json,"area.json")
	.await(start);

function start(error, data, area){
	if (error){
		alert(error);
	}
	console.log(data);
	console.log(area);
	var data_format = {}
	var area_format = {}
	area.forEach(function(d){
		area_format[d.country] = +d.area;
	});
	console.log(area_format);

	for (var i in data){
		country_codes.forEach(function(k){
			var index = k.indexOf(data[i].country);
			if (index != -1){
				data[i].name = data[i].country;
				console.log(data[i].country);
				data[i].country = k[1];
				console.log(data[i].country);
				console.log(data[i].observation.length);
				data_format[data[i].country] = {fillKey: key(area_format[data[i].name], data[i].observation.length),
				"area":area_format[data[i].name],
				"observations": [{					
				"species": data[i].name["species"], "number": data[i].name["number"]
				}]
				};
			}
		});
	}
	
	/* data[0].forEach(function(d,j){
		console.log("hi")
		country_codes.forEach(function(i){
			console.log("hiagain")
			var index = i.indexOf(d.country);
			if (index != -1){
				d.name = d.country;
				d.country = i[1];
				console.log(d.country);
				data_format[d.country] = {fillKey: key(area_format[d.name], d.length),
				"area":area_format[d.name],
				"observations": [{
				"species": d.name[j]["species"], "number": d.name[j]["number"]
				}]
				};
			}
		});
	}); */
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
		data: data_format
	});
}

/* Colors the countries based on the density of breeding birds species */
function key(area, total){
	var scale = [0, 25, 50, 75, 100, 125];
	var colors = ['< 25 species','< 50 species','< 75 species','< 100 species','< 125 species'];

	for (var h = 1, len = scale.length; h < len; h++){
		if (total >= scale[h - 1] && total < scale[h]){
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
    ["mk", "MKD", "Macedonia"],
    ["mv", "MDV", "Maldives"],
    ["mt", "MLT", "Malta"],
    ["mh", "MHL", "Marshall Islands"],
    ["mq", "MTQ", "Martinique"],
    ["mr", "MRT", "Mauritania"],
    ["mu", "MUS", "Mauritius"],
    ["yt", "MYT", "Mayotte"],
    ["md", "MDA", "Moldova, Republic of"],
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
