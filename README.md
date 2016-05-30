# Project
Met deze datavisualisatie wordt inzichtelijk gemaakt waar de hotspots van broedvogels in Europa zijn, hoe landen verschillen van het Europese gemiddelde en 
in welke maanden een bepaalde soort broedt. De [dataset](http://ipt.sovon.nl/resource?r=eoa1997) bevat data van 1972
tot 1995. Het doel van de visualisatie is om 

#### De Visualisaties
De eerste visualisatie is een kaart van Europa waarop de dichtheden van broedvogels zijn gevisualiseerd. 
Dit kan door een punt op de kaart te zetten per vogel of door de dichtheid te berekenen per land en dat getal in het land te printen. De standaardinstelling zal het 
gemiddelde over de periode 1972-1995 zijn. Met behulp van interactie kan ook 1 jaar geselecteerd worden. 

De tweede visualisatie is een linechart om de trend over de periode 1972-1995 inzichtelijk te maken. In deze linechart kunnen twee lijnen geplot worden (misschien later meer), de eerste 
lijn laat de gemiddelde trend over de EU over alle vogels. De tweede lijn is de trend in een bepaald land dat wordt geselecteerd door op een land op 
de kaart te klikken. 

De derde visualisatie is een barchart die laat zien hoeveel broedparen er per maand zijn waargenomen, ook hier kan weer het EU gemiddelde en het land naar keuze
worden gevisualiseerd. 

Met een dropdown-menu kunnen de visualisaties worden aangepast om de data van slechts 1 soort te laten zien, ipv het europese algehele gemiddelde. 

####Technische problemen
Op dit moment is de dataset te groot (500 000 kB) om het makkelijk te bewerken in een tekstverwerker. Daarom ga ik het eerst met python aanpassen en alle overbodige 
kolommen eruitgooien. 

Waar ook goed over moet worden nagedacht is het selecteren van data op een bepaald land. In de dataset zijn de waarnemingen genoteerd met de coordinaten, dus niet het land.

Als ik tijd over heb, is het leuk om ook te kijken of de broedperiode verschilt per land en of dit gecombineerd kan worden met temperatuurdata. 