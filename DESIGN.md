## Design Project

Visualisatie 1: Europese kaart broedvogels
Benodigde data bubbles: totale aantal vogels (of soorten) per land
Benodigde data landkleur: totaal aantal soorten per land en de totale landoppervlakte

Visualisatie 2: Piechart soortsamenstelling land
Benodigde data: Alle waarnemingen voor het geselecteerde land (= 100%), per soort een percentage

Visualisatie 3: Barchart (bars horizontaal) biodiversiteit (staat eigenlijk al in de landkaart)
Benodigde data: totaal aantal soorten per land en de totale landoppervlakte
Bar met europees gemiddelde in het midden in een andere kleur (erboven landen die het beter doen (in groen), eronder landen die het slechter doen (in rood)).
Interactie: in plaats van biodiversiteit per land, kan er ook een soort geselecteerd worden waardoor snel duidelijk wordt wat de beste landen zijn per soort.

Visualisatie 4: Barchart (bars verticaal) Gebruiker kan landen vergelijken voor 1 soort
Benodigde data: voor land x, y, z, het totale aantal waarnemingen voor de geselecteerde soort. Het europees gemiddelde voor die soort. 

Dataset: 
- heel erg groot
- waarnemingen zijn met coordinaten ingevuld. Dat is heel erg leuk, maar visualisaties 2, 3 en 4 worden moeilijker als de data niet op land is. 
	Als de dataset klein was geweest, was het ook mogelijk om dat on the fly in te vullen, maar nu is het waarschijnlijk sneller om het van te voren in python aan te passen. 
	Het nadeel is wel dat visualisatie 1 echt per land is, en niet per gebied. Het was leuk geweest om bijvoorbeeld ook natuurgebieden te kunnen herkennen doordat daar de broedvogeldichtheid
	groter is. 
	Het voordeel is dat visualisaties 2, 3 en 4 makkelijker te implementeren worden, en dat de dataset kleiner wordt.
- aanpassen m.b.v. python: 
	alleen kolommen soortnaam en coordinaten behouden
	coordinaten omzetten naar landnaam