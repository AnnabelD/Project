import json
import csv
import countries
import os
from collections import Counter
from collections import defaultdict
print "start"
from osgeo import gdal, ogr

shapefile = r'C:\Users\Annabel\Documents\GitHub\Project\TM_WORLD_BORDERS-0.3\TM_WORLD_BORDERS-0.3.shp' 

cc = countries.CountryChecker(shapefile)

input_data = open("C:\Users\Annabel\Documents\GitHub\Project\datadump1.json", "r")
data = json.load(input_data)
i = 0
with open("C:\Users\Annabel\Documents\GitHub\Project\countriescoodump1.txt", "w") as ou:
    for row in range(len(data)):
        ou.write(str(cc.getCountry(countries.Point(float(data[i]["country"][0]),float(data[i]["country"][1])))) + "\n")
        i+= 1



print "done"

