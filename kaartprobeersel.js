/* Annabel Droste, proberen een stip te zetten op 1 coordinaat in een datamap*/

window.onload = function(){
	var map = new Datamap({
		scope: 'world',
		element: document.getElementById('map'),
		setProjection: function(element) {
			var projection = d3.geo.orthographic()
				.center([10, 40])
				.rotate([-15, -15])
				.scale(550)
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
	var data = d3.json("data.json", function(error, data){
		if (error){
			alert(error);
		}
		console.log("hi");
	});
}