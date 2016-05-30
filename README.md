# Project
Met deze datavisualisatie wordt inzichtelijk gemaakt waar de hotspots van broedvogels in Europa zijn en hoe landen verschillen van het Europese gemiddelde.
De [dataset](http://ipt.sovon.nl/resource?r=eoa1997) bevat data van 1972 tot 1995. De data voor visualisatie 3 waar ook het totale landoppervlak nodig is, komt van [wikipedia](https://en.wikipedia.org/wiki/List_of_European_countries_by_area).


#### De Visualisaties
Visualisatie 1: Europese kaart dichtheden van broedvogels
De eerste visualisatie is een kaart van Europa waarop de dichtheden van broedvogels zijn gevisualiseerd. 
Het idee is om met behulp van bubbles per land aan te geven hoe veel vogels er zitten. De standaardinstelling zal het 
gemiddelde over de periode 1972-1995 zijn van alle vogels bij elkaar. 
![Visualisatie 1](doc\img_2275.jpg)

Visualisatie 2: Soortsamenstelling per land
De tweede visualisatie (Visualisatie 2) ontstaat als er op een bubble geklikt wordt en laat de soortsamenstelling in dat land zien. Er komt een percentagecirkel
met welke soorten daar zitten en hun percentage, als de percentages heel laag worden komt het onder overige te staan. Eventueel kan er op overige geklikt worden om ook de heel weinig voorkomende soorten te zien (niet onderdeel van MVP). 
Deze visualisatie is ook gelinkt aan Visualisatie 3. 
![Visualisatie 2](doc\img_2279.jpg)

Visualisatie 3: Biodiversiteit per land (barchart) (aantal soorten per land/totale oppervlakte land)
In deze visualisatie wordt duidelijk welke landen het goed doen op het gebied van biodiversiteit van broedvogels (veel verschillende soorten op een klein landoppervlak)
en welke landen het minder doen. Door boven een staaf te hoveren komt de specifieke waarde van dat land. Door op het land te klikken past Visualisatie 2 zich aan aan dat land. 
![Visualisatie 3](doc\img_2280.jpg)

Visualisatie 4: Hotspots voor een soort
Een barchart waarin wordt aangegeven hoe vaak een soort voorkomt in een land (eerst het europese gemiddelde), vervolgens een x (maximum moet nog bepaald worden) aantal landen die met elkaar vergeleken kunnen worden. 
![Visualisatie 4](doc\img_2278.jpg)

Met een dropdown-menu kunnen de visualisaties 1 en 4 worden aangepast om de data van slechts 1 soort te laten zien, in plaats van het europese algehele gemiddelde. 

MVP: Visualisatie 1-3 met het aanklikken van de bubbles om visualisatie 2 te starten, het dropdown menu om op de kaart in Visualisatie 1 slechts 1 soort te laten zien

####Technische problemen
Op dit moment is de dataset te groot (500 000 kB) om het makkelijk te bewerken in een tekstverwerker. Daarom ga ik het eerst met python aanpassen en alle overbodige 
kolommen eruitgooien en het in JSON formaat zetten. 

Waar ook goed over moet worden nagedacht is het selecteren van data op een bepaald land. In de dataset zijn de waarnemingen genoteerd met de coordinaten, dus niet het land.

Als ik tijd over heb, is het leuk om ook te kijken of de broedperiode verschilt per land en of dit gecombineerd kan worden met temperatuurdata. 

#### Vergelijkbare visualisaties
Op [sovon.nl](https://www.sovon.nl/nl/content/vogelsoorten) staat een visualisatie voor Nederland met een verspreidingskaart en trendlijnen zijn gevisualiseerd. De visualisaties op sovon.nl hebben geen interactief element.
Door de broedvogelpopulaties op Europeesniveau te bekijken wordt het hopelijk makkelijker om landen te vergelijken en door interactie toe te staan zullen mijn visualisaties een stuk
explorerender worden. Helaas is het niet mogelijk om de trendlijnen in Europa te laten zien, aangezien er in de dataset niet aparte data zijn toegevoegd, alleen de tijdperiode 1972-1995. 
