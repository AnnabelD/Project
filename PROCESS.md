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