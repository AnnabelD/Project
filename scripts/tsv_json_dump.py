# Annabel Droste
# programma om alle overbodige kolommen uit de dataset te halen en het in een json te zetten.
# Dit programma zet de coordinaten nog niet direct om naar landnamen, dat doet probeer_data_structuur.py
# Moet het nog in een functie zetten!!
import csv
import json

input_file = csv.DictReader(open("C:\Users\Annabel\Documents\GitHub\Project\dataset_eu2_1.txt"), delimiter='\t')
info = []
print "start"

for row in input_file:
    map(row.pop,["institutionCode", "collectionCode", "datasetName", "ownerInstitutionCode", \
                 "basisOfRecord", "occurrenceID", "catalogNumber", "individualCount", "occurrenceStatus", "samplingEffort", "startDayOfYear",\
                 "endDayOfYear", "continent", "kingdom", "phylum", "class", "\xef\xbb\xbfid", "year", "geodeticDatum", "footprintWKT", "taxonID"])
    lat = row.pop("decimalLatitude")
    lon = row.pop("decimalLongitude")
    row["country"] = [lat,lon]
    info.append(row)

with open("C:\Users\Annabel\Documents\GitHub\Project\datadump1genus.json", "w") as o:
    json.dump(info,o, encoding="cp1252")

input_file = csv.DictReader(open("C:\Users\Annabel\Documents\GitHub\Project\dataset_eu2.txt"), delimiter='\t')
info = []
print "start2"

for row in input_file:
    map(row.pop,["institutionCode", "collectionCode", "datasetName", "ownerInstitutionCode", \
                 "basisOfRecord", "occurrenceID", "catalogNumber", "individualCount", "occurrenceStatus", "samplingEffort", "startDayOfYear",\
                 "endDayOfYear", "continent", "kingdom", "phylum", "class", "\xef\xbb\xbfid", "year", "geodeticDatum", "footprintWKT", "taxonID"])
    lat = row.pop("decimalLatitude")
    lon = row.pop("decimalLongitude")
    row["country"] = [lat,lon]
    info.append(row)

with open("C:\Users\Annabel\Documents\GitHub\Project\datadump2genus.json", "w") as o:
    json.dump(info,o, encoding="cp1252")

print "done"

# deze data.json kan meteen door d3.json worden ingeladen 
