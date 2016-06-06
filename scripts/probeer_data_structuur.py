from collections import Counter
from collections import defaultdict
import json
import csv
input_file = csv.DictReader(open("C:\Users\Annabel\Documents\GitHub\Project\countriescoodump1.txt"), delimiter='\n')
input_file2 = csv.DictReader(open("C:\Users\Annabel\Documents\GitHub\Project\countriescoodump2.txt"), delimiter='\n')
input_data = open("C:\Users\Annabel\Documents\GitHub\Project\datadump1genus.json", "r")
input_data2 = open("C:\Users\Annabel\Documents\GitHub\Project\datadump2genus.json", "r")
data1 = json.load(input_data)
data2 = json.load(input_data2)


def assignCountries(countryfile, datajson):
    i = 0
    for row in countryfile:
        datajson[i]["country"]= row["country"]
        i+= 1

##def processData(collect_dict, datajson):
##    for entry in datajson:
####        allowed to delete whilst iterating over? Otherwise remove None afterwards
##        if type(entry["country"]) == "None":
##            del entry
##            break
##        collect_dict.setdefault(entry["country"], []).append(entry["vernacularName"] + "," + entry["scientificName"])

def processData(collect_dict, datajson):
    for entry in datajson:
##        allowed to delete whilst iterating over? Otherwise remove None afterwards
        if type(entry["country"]) == "None":
            del entry
            break
        collect_dict.setdefault(entry["country"], {}).setdefault(entry["scientificName"].split(" ")[0], []).append(entry["vernacularName"])
    

assignCountries(input_file, data1)
assignCountries(input_file2, data2)
    
print "countrynames done"
final_form = {}
land = {}
processData(land, data1)
processData(land, data2)

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

##for el in land:
##    i = 0
##    final_form[el] = []
##    for it in land[el]:
##        result = dict(Counter(land[el][it]))
##        final_form[el].append({it: []})
##        for species in result:
##            final_form[el][i][it].append({"species": species, "number": result[species]})
##        i += 1

##for el in land:
##    result = dict(Counter(land[el]))
##    final_form[el] = []
##    for species in result:
##        names = species.split(",")
##        genus = names[1].split(" ")
##        final_form[el].append({"species": names[0], "number": result[species], "genus": genus[0]})

final = []
for i in final_form:
    final.append({"country": i, "observation":final_form[i]})

print "compression datastructure"
with open("landdeelfinal.json", "w") as d:
    json.dump(final,d,encoding="cp1252")

print "done"
