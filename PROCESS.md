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



