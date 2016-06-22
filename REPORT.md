## Breeding Birds in Europe
----------------------------------------------

#### Annabel Droste
----------------------------------------------

## Description of the Functionality
This webpage allows the user to explore the European breeding bird dataset of the EBCC. These visualisations enable the user to get an overview
of the dispersion of a single species. For instance if you would like to know where in Europe the osprey breeds, with the use of the dropdown menu it becomes visible easily. 
Another visualisation shows the number of bird species breeding in a country, thus one can see that in Russia a lot of species have been spotted, whereas in ukraine
about a hundred species less were observed. The user can click on a country which shows the ten genera with the most observed species in that country. When one of the bars is clicked
all the species that are present in that genus and the country are plotted in a second barchart. Both barcharts contain a hover function that allows the user to look up
more information through the wikipedia page of that species or genus. Thus there are two different anglepoints by which the user can explore the European breeding bird population: 
either by country, or by species. 

## Technical Design
The basis of the visualisations is contained in the birds_euroge.js script, the functions for the barcharts are in barcharts.js and the maps are coloured by the functions in mapfunctions.js.

#### Visualisations by Country
The first map is linked to two buttons that allow the user to either see the total number of species or the total number of observations in a country. 
When a button is clicked two functions are called to colour the map and to change the legend of the datamap with the use of jQuery by actually selecting the <td> elements of the datamap that contain the legend and replacing them 
with another label with javascript (replaceWith). I have chosen to do it like this because datamaps makes it hard to update a legend since it uses the fillKey to make the legend.
The map contains an onclick function which creates a barchart for that specific country with the top ten of genera with the most species. The top ten is determined by
sorting the entire array of genera and the number of species they contain and setting the length of the array to ten if the array is longer than ten. This
bargraph also contains an onclick function which creates a bargraph of the number of observations for all the species in that genus in the country. Both these bargraphs
are created with the same function. 

#### Visualisations by Species
The visualisations by species are controlled by a dropdown menu. If a species is selected a barchart is drawn and the map is colored to make the breeding countries clearly
visible. To create the dropdown menu, a list is made of all the species present in that country by iterating over the dataset and pushing all the species names that are not yet in 
a list to that list. This is done once. The user can start typing to make the search easier. The data-live-search option of bootstrap is set to true, so that the 
dropdown menu shows suggestions based on what has been typed. If the button next to the dropdown menu is clicked the function to make the barchart is called (diversity()). 
Within this function, the function to color the map (colorSpeciesMap) is called and three arguments are given: a list of all countries where the species breeds (countries), the entire
dataset (dataFormat) and the map (speciesMap). countries is given as argument because otherwise it would have been necessary to loop once again through the entire dataset to check in which 
countries the species is present. dataFormat is given so that the countrycodes can be obtained easily. speciesMap is the datamap that has beed defined earlier. In order to update it, 
it has to be given to the function. It would also have been possible to make it a global variable, but I thought that looked confusing in the code if one datamap was global and the other was not. 
The list of countries could potentially be made inside the onload function but it changes with every species selected so to do that in another function was neatest.

#### Dataprocessing
The unprocessed dataset was 500 mB, to be able to explore it better, I have split it in half so that "kladblok" (a texteditor) would not crash every time. The "'s" were also replaced
by "s". Otherwise the data could not be loaded with d3.json. The biggest problem with the processing of the data was the conversion of coordinates to countrynames. 
Several approaches have been tried the best two are mentioned below. 
- google API: the google API made the conversion fast but did not recognize coordinates in sea and only allowed 2500 queries a day. The code used to try this was based on http://stackoverflow.com/questions/20169467/how-to-convert-from-longitude-and-latitude-to-country-or-city .
- use of shapefile and OSgeoW: does not recognize coordinates in sea and takes a couple of hours to process the entire dataset. 
I used the shapefile and OSgeoW approach. The code can be found in coo.py within the scripts folder. The program that does the actual conversion (countries.py) has been included in the same folder
and was obtained from https://github.com/che0/countries . I accepted that observations with coordinates in the sea were named as "None". In the processing of the data in javascript I filter these out.
The observations made in Guernsy and Isle of Man were not recognized in the high resolution datamap that I used, unclear why since the normal resolution worked fine, so these were also filtered out. 
The number of observations on these Islands were around the 300, so rather low in comparison with most of the other countries. 
Another problem with the dataset was that the entries in the dataset contained an "individualCount" which was an estimate of the number of species present at that point. 
However the ranges of this label were from 0, 0-9, 10-99, 100-999, 1000-9999, 10000-99999 and no estimation. Because these numbers are hardly comparable (110 breeding birds viewed in a spot is quite different from 810 breeding birds) and
no estimation says even less about the actual number of birds, I decided to treat each entry as a single observation. Only the entries with an individualCount of 0 were filtered out in the python program. 


 
