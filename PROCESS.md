## Dag 2

###### Coordinaten omzetten naar landnamen
Het idee was om eventueel ook de verspreiding binnen een land te laten zien, bijvoorbeeld door gebruikers op een land te laten klikken en in te zoomen op dat land.
De grote algemene bubbel per land zou dan verdwijnen, in plaats daarvan zou de verspreiding met behulp van stippen kunnen worden laten zien. 
Van dit idee ben ik afgestapt doordat de dataset heel groot is, en het is makkelijker om bij iedere waarneming een land te zetten i.p.v.een coordinaat. 
Dat zal visualisaties 2, 3 en 4 ook makkelijker maken. 
Proberen of het omzetten van coordinaten naar landnamen in python werkt via [dit voorbeeld](https://github.com/che0/countries/blob/master/countries.py).

## Dag 3
Het omzetten van coordinaten werkt niet via het vorige voorbeeld. Via een googleAPI lijkt het wel te werken voor het grote deel van de coordinaten. 
Nadeel: kan geen coordinaten op zee omzetten naar land. Bovendien heeft google een maximum aantal van requests die je dagelijks mag maken. 
Misschien toch met coordinaten werken en het bestand in tweeën splitsen?

## Dag 4
- coordinaten omzetten naar landnamen lijkt te lukken, het is wel idioot traag
- json lijkt ook te lukken
- inladen data nog testen
- andere data structuur gebruikt:
[{"landnaam":[{"Soortnaam": "aantal"},
	{"Soortnaam": "aantal"}],
	"landnaam":[{"Soortnaam": "aantal"},
	{"Soortnaam": "aantal"}]
}]. 

- Datamaps of svg?

## Dag 5
Programma dat coordinaten omzet naar landnamen is heel traag
- dataverwerking in scripts opgedeeld zodat ik niet lang hoef te wachten en tot de conclusie kom dat ik toch ergens een fout heb gemaakt
- coordinaten van dingen in zee worden niet herkend -> "None". Dus die filter ik eruit (naderhand). Ik heb voldoende data van op land
- zorgen datastructuur: [{json}] zodat forEach gebruikt kan worden
Waarschijnlijk moet de datastructuur van area ivm de twee datasets linken als volgt:
{"landnaam":"area",
"landnaam": "area"} 
Python script veranderen of in js? -> js werkt prima, maar het is sneller(qua laden) om het al in python te doen. 

## Dag 6
- totale dataset in tweeën gesplitst
- Van tweede deel nu een .txt (countriescoodump2.txt) met alle landen op volgorde
- ook scientific name meenemen in dataset zodat het overzichtelijker wordt (ipv 200 soorten per land, kan je ze nu onderverdelen in genus)
- Misschien een barchart maken met geni voor een land, als er dan op een genus wordt geklikt worden de soorten zichtbaar. Zorgt nog steeds voor te grote barchart
- Barchart geni met slider? Top 10 geni die voorkomen? Vervolgens klikken op Barchart waardoor tweede barchart te voorschijn komt
- Diversiteit Europese landen verschilt nauwelijk (227 geni per land, 499 soorten) alleen azerbaijan, kazachstan vallen erbuiten (gelukkig anders was er zeker iets mis gegaan met dataverwerking)
- resultaat om te vertellen: eu diversiteit is gelijk d.m.v. species map and genus map. 
- Misschien een visualisatie-idee: 2 landen selecteren, vervolgens komt eruit welke soorten verschillen (wel of niet aanwezig in het ene land, of vaker/minder aanwezig?)

## Dag 7
- barchart gemaakt voor 1 soort voor alle landen (pas later bedacht dat ik dat eigenlijk in de kaart wilde laten zien)
- geëxperimenteerd met bootstrap, lijkt wel handig voor de positionering van de elementen
- genus en specieschart voor 1 land gemaakt, sorteren gaat nog fout (x-waarden gaan niet mee), dus heb dat even uitgeschakeld
- barchart geni is nog veelste groot (specieschart laat alleen de soorten binnen een genus zien)
- Userinput van text gemaakt, maar is case sensitive, dus dat moet misschien anders. (Dropdownmenu misschien?)
- Uitvogelen hoe je makkelijk een kaart kan updaten. 

## Dag 8
- bespreken met iemand hoe de genus kaart moet (top 10?).
- Kan je ook de fills van een map veranderen? Nee dus een aparte legenda maken. 
- Het aanpassen van de map is nog tamelijk omslachtig doordat telkens alle data moet worden meegegeven voor het geval er op een land geklikt wordt
- het lukt niet om de "fills" binnen map aan te passen, daardoor klopt de legenda niet met wat er te zien is. 
- Heb besloten om alleen de top10 van een land te laten zien qua genus aangezien dat het meest overzichtelijk is. 
- te doen: 
	- check voor spelling input text species, geef misschien al suggesties
	- vergelijkingsvisualisaties: gebruiker kan 2 landen selecteren en 2 soorten? 


## Dag 10
- de datamap aangepast aan highresolution waardoor europa mooier wordt. Nadeel constante foutmeldingen met guernsey en isle of man alsde kaart geupdate wordt
- opgelost door die 2 te hardcoden en eruit te halen bij het data-inladen. Misschien niet de mooiste oplossing maar wel het simpelst.
- de twee grafieken van species willen niet naast elkaar staan (kaart en barchart). 

## Dag 11
- skip denk ik de area component van de visualisatie aangezien het niet echt veel zegt. Betekent wel dat ik geen queu meer nodig heb. (window.onload?). 
	Bespreken met iemand.
- code becommentarieerd
	
## Dag 13
- dropdownmenu is gelukt (misschien nog ergens een link creeren naar wikipedia voor meer info?)
- sommige grafieken passen niet mooi in een row waardoor alles er niet echt mooi uitziet (inline-block, vertical-align).
- doordat de 2 barcharts van genus top tien en de soorten van een genus door dezelfde functie worden gemaakt, kunnen de marges niet mooi worden aangepast aan de lengtes van de namen 
	(de soortnamen zijn veel langer)
- legenda datamaps wordt nu ook geupdate met behulp van jquery. 
- tooltip moet nog worden aangepast
- area component gaat eruit aangezien dat sterk beïnvloed wordt door aantal observaties (en de soortdichtheid kan nog steeds heel hoog zijn).

dingen voor to do:
	-- tooltip datamap 
	-- tooltip species chart
	-- zorgen dat de namen er niet constant afvallen bij de barcharts
	-- Brachnis Murre (of iets dergelijks) staat er heel vreemd in
	-- opmaak verbeteren

## Dag 14
- ik heb de functies gescheiden in aparte bestanden op barchart of map functies en een basis bestand (birds_europe.js) omdat dat me de duidelijkste onderverdeling leek. 
- Het is niet mooi dat er telkens zoveel met een functie mee wordt gegeven, maar het maakt de verwerking van de data wel een stuk simpeler
- (bijna) alles verandert in camelCase
- Namen vallen er niet meer af bij barcharts door de marges van de speciesMaps te vergroten
- scales globale variabelen gemaakt omdat er dan minder if-statements nodig zijn. 

## Dag 15
- laden vande pagina gaat een stuk trager (achtergrondfoto? verschillende scriptbestanden?)

## Dag 16
- op zich is de tijd van het laden nog wel acceptabel, vooral doordat de tekst wel al te zien is
- assen verbeterd, maar de eerste bar wil nog niet een stukje van de y-as komen te staan
- geprobeerd background-image op opacity 0.5 te zetten om de leesbaarheid te verhogen, maar dan wordt ook de tekst meteen vaag. Lukt niet om vervolgens de <p> en <text> elementen
	met css opacity op 1 te zetten.
