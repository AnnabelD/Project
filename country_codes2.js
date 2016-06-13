/* Code comes from http://stackoverflow.com/questions/25044145/datamaps-get-list-of-country-codes , gets the correct country codes */
var country_co = Datamap.prototype.worldTopo.objects.world.geometries;
var country_codes = []
for (var i = 0, j = country_co.length; i < j; i++) {
  country_codes.push(country_co[i].properties);
}
