##### Breeding Birds in Europe
----------------------------------------------

## Annabel Droste
----------------------------------------------

## Description of the Functionality
This webpage allows the user to explore the European breeding bird dataset of the EBCC. Hopefully these visualisations enable the user to get an overview
of the dispersion of a single species. For instance if you would like to know where in Europe the osprey breeds, it becomes visible easily. 
Another visualisation shows the number of bird species breeding in a country, thus one can see that in Russia a lot of species have been spotted, whereas in ukraine
about a hundred species less were observed. The user can click on a country which shows the ten genuses with the most observed species in that country. When one of the bars is clicked
all the species that are present in that genus and the country are plotted in a second barchart. Both barcharts contain a hover function that allows the user to look up
more information through the wikipedia page of that species or genus. 

## Technical Design
The basis of the visualisations is contained in the birds_euroge.js script, the barcharts are made by barcharts.js and the maps are coloured by the map_functions.js.
The first map is linked to two buttons that allow the user to either see the total number of species or the total number of observations in a country. 
When a button is clicked two functions are called to colour the map and to change the legend of the datamap with the use of jQuery.
The maps contain an onclick function which creates a barchart for that specific country with the top ten of genuses with the most species. The top ten is determined by
sorting the entire array of genuses and the number of species they contain and setting the length of the array to ten if the array is longer than ten. This
bargraph also contains an onclick function which creates a bargraph of the number of observations for all the species in that genus in the country. Both these bargraphs
are created with the same function. 