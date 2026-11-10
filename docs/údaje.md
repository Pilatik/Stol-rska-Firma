Tento súbor slúži na určenie pre konfigurátor

Tvar kuchyne
Materiál čiel
Typ dvierok
Pracovná doska

také ako teraz

ale aby sa dala odhadnúť cena 
bude na to slúžiť takýto proces:



Vytvor JavaScriptovú logiku a HTML/CSS formulár pre kalkulačku/konfigurátor ceny kuchyne na mieru podľa nášho styleguide.md.

Vstupné prvky formulára (zvoľ radio buttony alebo <select> rozbaľovacie menu):
1. Tvar kuchyne:
   - Rovná (základná cena: 2 200 €)
   - Tvar L (základná cena: 3 100 €)
   - Tvar U (základná cena: 4 000 €)
   - S ostrovčekom (základná cena: 4 800 €)

2. Materiál dvierok a korpusu:
   - Laminát (+0 €)
   - Lakované MDF (+400 €)
   - Dýha (+700 €)
   - Masívne drevo (+1 200 €)

3. Typ dvierok:
   - Hladké (+0 €)
   - Bezúchytkové (profil/frézované) (+250 €)
   - Rámové (+350 €)

4. Pracovná doska:
   - Laminátová (+150 €)
   - Drevená (+450 €)
   - Kompaktná (+800 €)
   - Kameň alebo kompozit (+1 400 €)

Logika výpočtu (JavaScript):
- Vypočítaj celkovú minimálnu cenu: minPrice = sum(vybrané hodnoty).
- Vypočítaj maximálnu cenu s 12 % rezervou pre zameranie a detaily: maxPrice = Math.round((minPrice * 1.12) / 50) * 50.
- Výsledok zobrazuj okamžite pri každej zmene formulára (onchange event) vo formáte: "Orientačná cena: 5 100 € – 5 700 €".
