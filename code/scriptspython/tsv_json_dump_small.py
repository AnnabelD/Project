# Annabel Droste
# removes all the superfluous information from the dataset and creates a json file with the necessary info.
import csv
import json

input_file1 = csv.DictReader(open("C:\Users\Annabel\Documents\GitHub\Project\data\dataset_eu2_1.txt"), delimiter='\t')
output_file1 = "C:\Users\Annabel\Documents\GitHub\Project\data\datadump11genussmall.json"
info = []
print "start"

""" remove all the superfluous informations from the dataset """
def processData(file_input, container, file_output):
    for row in file_input:
        if row["individualCount"] != "0":
            map(row.pop,["institutionCode", "collectionCode", "datasetName", "ownerInstitutionCode", \
                         "basisOfRecord", "occurrenceID", "catalogNumber", "occurrenceStatus", "samplingEffort", "startDayOfYear",\
                         "endDayOfYear", "continent", "kingdom", "phylum", "class", "\xef\xbb\xbfid", "year", "geodeticDatum", "footprintWKT", "taxonID"])
            lat = row.pop("decimalLatitude")
            lon = row.pop("decimalLongitude")
            row["country"] = [lat,lon]
            container.append(row)

    with open("C:\Users\Annabel\Documents\GitHub\Project\\" + file_output, "w") as o:
        json.dump(container,o, encoding="cp1252")

processData(input_file1,info,output_file1)

input_file2 = csv.DictReader(open("C:\Users\Annabel\Documents\GitHub\Project\data\dataset_eu2.txt"), delimiter='\t')
output_file2 = "C:\Users\Annabel\Documents\GitHub\Project\data\datadump21genussmall.json"
info = []

print "start2"
processData(input_file2,info,output_file2)

print "done"


