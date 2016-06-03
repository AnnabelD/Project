# Annabel Droste
# Programma dat de data van de landoppervlakte (tsv) omzet naar een json 
import csv
import json

input_file = csv.DictReader(open("C:\Users\Annabel\Documents\GitHub\Project\area.tsv"), delimiter='\t')
info = []
for row in input_file:
    info.append(row)

with open("C:\Users\Annabel\Documents\GitHub\Project\area.json", "w") as o:
    json.dump(info,o, encoding="cp1252")

print "done"

# deze data.json kan meteen door d3.json worden ingeladen 
