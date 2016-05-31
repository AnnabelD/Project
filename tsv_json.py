# Annabel Droste
# programma om de dataset kleiner te maken zodat hij door notepad++ geopend kan worden.

import json
import csv
##import countries
##cc = countries.CountryChecker('TM_WORLD_BORDERS-0.3.shp')
##print cc.getCountry(countries.Point(49.7821, 3.5708)).iso

##info = []
print "start"
input_file = csv.DictReader(open("complete_data_eu.txt"), delimiter='\t')
print "hi"
with open("data.json", "w") as output:
    output.write("[")
    for row in input_file:
        map(row.pop,["institutionCode", "collectionCode", "datasetName", "ownerInstitutionCode", \
                 "basisOfRecord", "occurrenceID", "catalogNumber", "individualCount", "occurrenceStatus", "samplingEffort", "startDayOfYear",\
                 "endDayOfYear", "continent", "kingdom", "phylum", "class", "\xef\xbb\xbfid", "year", "geodeticDatum", "footprintWKT", "taxonID", "scientificName"])
        output.write(str(row).encode(encoding="cp1252"))
        output.write(",")
    output.write("]")



##
##with open("data1.json", "w") as o:
##    json.dump(info,o, encoding="cp1252")

print "done"
