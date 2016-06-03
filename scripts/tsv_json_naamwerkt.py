# Annabel Droste
# programma om de dataset kleiner te maken zodat hij door notepad++ geopend kan worden. Na dit programma moeten een paar dingen aangepast worden in kladblok (zie comments)
# Daarna kan dat bestand worden ingeladen in het programma dat de coordinaten omzet naar landnamen.
import csv
input_file = csv.DictReader(open("C:\Users\Annabel\Documents\GitHub\Project\complete_data_eu.txt"), delimiter='\t')

with open("C:\Users\Annabel\Documents\GitHub\Project\datanaam.json", "w") as output:
    output.write("[")
    for row in input_file:
        map(row.pop,["institutionCode", "collectionCode", "datasetName", "ownerInstitutionCode", \
                 "basisOfRecord", "occurrenceID", "catalogNumber", "individualCount", "occurrenceStatus", "samplingEffort", "startDayOfYear",\
                 "endDayOfYear", "continent", "kingdom", "phylum", "class", "\xef\xbb\xbfid", "year", "geodeticDatum", "footprintWKT", "taxonID", "scientificName"]) 
        lat = row.pop("decimalLatitude")
        lon = row.pop("decimalLongitude")
        row["country"] = [lat, lon]
        output.write(str(row).encode(encoding="cp1252"))
        output.write(",")
    output.write("]")

# Vervolgens zijn de volgende aanpassingen nog nodig in de dataset (kan via kladblok, notepad loopt vast)
# Na laatste entry row de "," weghalen
# vervangen: " 's" door "s
# vervangen "'s" door s
# vervangen: "\" door ""
# sommige namen zullen niet kloppen, maar d3.json geeft geen error meer

print "done"
