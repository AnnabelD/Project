## Breeding Birds in Europe
----------------------------------------------

#### Annabel Droste
----------------------------------------------

## Beschrijving van de visualisaties
Deze visualisatie laat de gebruiker onderzoeken waar bepaalde soorten broeden, welke genera het meest in een land broeden (bijv. de meeuwen), welk land de 
meeste broedvogelsoorten telt en waar de meeste observaties zijn gedaan. Als de gebruiker bijvoorbeeld wil weten in welke landen de ijsvogel broedt, dan
kan die soort via het dropdown menu geselecteerd worden waarna de kaart wordt gekleurd om te laten zien in welke landen broedparen aanwezig zijn en welke niet. 
Op de eerste kaart kan ofwel het aantal soorten per land, of het aantal observaties per land worden geselecteerd. Als er op een land wordt geklikt worden de 
10 genera waarvan de meeste soorten in het land broeden in een barchart gevisualiseerd. Dit laat zien dat er in Nederland bijvoorbeeld meer mezensoorten broeden dan meeuwensoorten. 
Als er vervolgens op een van de bars wordt geklikt wordt er een tweede barchart getekend waar te zien is welke mezen of meeuwensoorten dat dan zijn. Beide barcharts
hebben een hoverfunctie die een link laat zien naar de desbetreffende wikipediapagina van de soort of genus. 
De dataset die gebruikt is, is de research dataset van E J M Hagemeijer and M J Blair (Editors). 1997. The EBCC Atlas of European Breeding Birds: Their Distribution and Abundance. T & A D Poyser, London. 
De data is vergaard tussen 1972 en 1995. 

## Visueel design

#### Het geheel
De header bevat een plaatje van vliegende meeuwen omdat het er leuk en levendig uitziet. Om de overgang van de introductie naar de rest zo vloeiend mogelijk te laten gaan
is voor de achtergrondkleur van de rest ook voor een heel licht blauwgrijs gekozen. Het is prettiger om naar te kijken dan fel wit.
De pagina is ruwweg in twee kolommen omdat visualisatie 1 en 2 naast elkaar moeten staan aangezien de gebruiker anders niet doorheeft dat er iets gebeurt als hij op 
een land klikt.

#### Visualisatie 1: kaart aantal soorten en observaties
Voor beide visualisaties is voor een blauw kleurenschema gekozen (verkregen van colorbrewer2.org). Het is een single hue, blauw schema waarvan de eerste waarde
niet is meegenomen aangezien die teveel op wit leek en niet goed zichtbaar was op de achtergrond. Er is voor blauw gekozen aangezien blauw een neutrale, niet-aggressieve kleur is
en prettig om naar te kijken. Als er overheen gehoverd wordt, is er voor groen gekozen zodat het goed duidelijk wordt bij welk land de tooltip hoort. In de tooltip
staan zowel het aantal observaties als het aantal soorten in een land, zodat het mogelijk is om snel landen te vergelijken. Rusland heeft bijvoorbeeld meer soorten dan Oekraïne, door ook meteen
naar het aantal observaties te kijken, blijkt dat Rusland ook daar veel meer van heeft. Daardoor kan men aannemen dat Rusland over het algemeen meer soorten broedvogels heeft dan Oekraïne. 
De twee buttons bovenaan de kaart worden gebruikt om tussen de kaarten te schakelen. De kaart die op dat moment gevisualiseerd wordt is groen, net zoals de hoverfunctie
zodat het nog duidelijker wordt dat geselecteerde elementen groen zijn. Als er op een land geknipt wordt, wordt de top 10 genera laten zien (zie visualisatie 2).

#### Visualisatie 2: top 10 genera en diens soorten
De top 10 genera heeft ook groen als kleur om de link met de kaart duidelijk te maken (hoverfunctie en ingeklikte button) maar tegelijkertijd te laten zien dat
niet hetzelfde wordt gevisualiseerd als in de kaart (dus niet aantal soorten of aantal observaties per land). De link van de hoverfunctie heeft een witte achtergrond met opacity
om ervoor te zorgen dat de link goed leesbaar blijft als hij bijvoorbeeld door de as gaat. De bars worden lichter door de hover om duidelijk te maken welke geselecteerd is. 

#### Visualisatie 3: Verspreiding van 1 soort
Er is gekozen voor een dropdown menu omdat de gebruiker op die manier niet de precieze spelling van de naam in de database hoeft in te typen. Er staat een button naast
zodat duidelijk is wat er gaat gebeuren en wat de bedoeling is van de visualisatie. In zowel de barchart als de kaart is een roodachtige/oranjekleur gekozen om aanwezigheid 
te laten zien. Het is niet twee keer dezelfde kleur omdat beide een andere variabele laten zien: in de kaart presentie, in de barchart aantal observaties. De kleur
donkerblauw is gekozen voor absent aangezien het contrasteert en goed zichtbaar is. Grijs geeft geen data aan, net zoals in de eerste kaart. 
Alle barcharts hebben een schuin ticklabel op de x-as aangezien ik dat altijd een stuk leesbaarder vindt dan een volledig verticale. 

## Technisch design
De basis van de visualisaties staat in birds_europe.js, de functies voor de barcharts staan in barcharts.js en de kaarten worden gekleurd door mapfunctions.js. 



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

## Veranderingen van het oorspronkelijke DESIGN.md
In het DESIGN.md was ik ervan uitgegaan dat er data (datums) waren ingevoerd bij de observaties maar dat bleek niet het geval. Daardoor zijn de visualisaties meer geconcentreerd 
op verspreiding over landen i.p.v. trends. 

####### Visualisatie 1 uit het DESIGN.md: Europese kaart broedvogels
Eerst had ik ook nog een oppervlakte component waardoor het bijvoorbeeld zichtbaar was dat Rusland i.v.m. zijn 
oppervlakte weinig broedende vogelsoorten had. Dit is eruit gehaald doordat het niet waarheidsgetrouw is. Misschien broeden die soorten die in Rusland wel in elke kilometer, 
en zitten ze in een ander, kleiner land helemaal niet overal. In dat geval lijkt het dat Rusland het slechter doet qua broedvogels terwijl dat eigenlijk niet het geval is. 
Daarom heb ik de oppervlakte-component helemaal uit de visualisaties gehaald. Wel heb ik een button gemaakt waarmee het totale aantal observaties per land wordt gevisualiseerd aangezien
dat zo sterk verschilt per land. Ook de bubbles op de kaart heb ik niet geïmplementeerd aangezien het moeilijk wordt om 
cirkels in te schatten. Mensen zijn er beter in om kleurschakeringen af te lezen. 
Het idee om de verspreiding van 1 soort te visualiseren heb ik wel uitgevoerd maar in een andere kaart dan kaart met het aantal soorten en observaties aangezien het minder 
interactie behoeft.

####### Visualisatie 2: Piechart soortsamenstelling land
Deze visualisatie is in tweeën gesplitst in de eindversie aangezien sommige landen meer dan 300 soorten heeft. Dat is niet in 1 piechart te visualiseren. In plaats van alle soorten
worden eerst de 10 genera die de meeste soorten bevatten in dat land in een barchart gevisualiseerd. Op deze manier wordt inzichtelijk gemaakt wat voor type vogels veel voorkomen in landen. In Nederland zijn er bijvoorbeeld
veel type mezen die hier broeden, terwijl Rusland juist meer soorten meeuwen kent. Als er op een van de bars met een genus wordt geklikt, worden de soorten binnen dat genus in een tweede
visualisatie gevisualiseerd. De link die verschijnt als er boven een bar wordt gehoverd gaat naar de wikipediapagina van de desbetreffende soort/genus en stelt de gebruiker in staat om snel kennis op te doen over de genera en de soorten

####### Visualisatie 3: Barchart biodiversiteit
Ook dit is eruit gehaald aangezien het aantal observaties zo sterk verschilt tussen de verschillende landen. Het zou niet waarheidsgetrouw zijn om ze dan toch te vergelijken. 

####### Visualisatie 4: Vergelijking tussen landen
Oorspronkelijk wilde ik ook landen echt naast elkaar kunnen vergelijken. Ook deze visualisatie is eruitgehaald omdat het aantal observaties zo sterk verschilt tussen landen.


 
