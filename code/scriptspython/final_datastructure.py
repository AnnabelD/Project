""" Annabel Droste
 program to combine the datasets with the countrynames and the coordinates with their observations, consequently the data is put in the correct format
"""
## [{"country": "countryname",
##    "observation": [{"genus": "genusname",
##                    "details": [{"species": "speciesname",
##                                 "number": "number"},
##                                {"species": etc.}...],
##                     {"genus": etc.}...]},
##    {"country": etc.}...] 

from collections import Counter
from collections import defaultdict
import json
import csv
input_file = csv.DictReader(open("C:\Users\Annabel\Documents\GitHub\Project\data\countriescoodump1small.txt"), delimiter='\n')
input_file2 = csv.DictReader(open("C:\Users\Annabel\Documents\GitHub\Project\data\countriescoodump21small.txt"), delimiter='\n')
input_data = open("C:\Users\Annabel\Documents\GitHub\Project\data\datadump11genussmall.json", "r")
input_data2 = open("C:\Users\Annabel\Documents\GitHub\Project\data\datadump21genussmall.json", "r")
data1 = json.load(input_data)
data2 = json.load(input_data2)
new_data1 = []
new_data2 = []

""" replaces the coordinates from the data with the countrynames """
def assignCountries(countryfile, datajson, new_data):
    i = 0
    for row in countryfile:
        datajson[i]["country"]= row["\xef\xbb\xbfcountry"]
        new_data.append(datajson[i])
        i+= 1

""" builds a nested structure, if the country has not been seen before a new dictionary is added, otherwise the data are added to the country key in collect_dict """
def processData(collect_dict, datajson):
    for entry in datajson:
        collect_dict.setdefault(entry["country"], {}).setdefault(entry["scientificName"].split(" ")[0], []).append(entry["vernacularName"])
    
assignCountries(input_file2, data2, new_data2)
assignCountries(input_file, data1, new_data1)

    
print "countrynames done"
final_form = {}
land = {}
processData(land, new_data1)
processData(land, new_data2)

print "basis data structure"
for el in land:
    i = 0
    final_form[el] = []
    for it in land[el]:
        result = dict(Counter(land[el][it]))
        final_form[el].append({"genus": it, "details": []})
        for species in result:
            final_form[el][i]["details"].append({"species": species, "number": result[species]})
        i += 1

final = []
for i in final_form:
    final.append({"country": i, "observation":final_form[i]})

print "compression datastructure"
with open("landdeelfinal.json", "w") as d:
    json.dump(final,d,encoding="cp1252")

print "done"
