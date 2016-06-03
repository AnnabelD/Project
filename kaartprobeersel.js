/* Annabel Droste */
/* Europakaart Datamaps */

d3_queue.queue()
	.defer(d3.json,"landdeel.json")
	.defer(d3.json,"area.json")
	.await(start);

function start(error, data, area){
	if (error){
		alert(error);
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
		fills: {defaultFill: 'grey'}, 
		data: {
			ITA: {fillKey: 'green'},
			IRL: {fillKey: 'blue'}
		}
	});
	
	console.log("hi");
	console.log(data);
	console.log(data["France"]);
	console.log(area);
	console.log(area[0]["country"])
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
