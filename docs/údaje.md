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

5. Približná dĺžka kuchynskej linky:
   - Input políčko (number input) pre dĺžku v metroch (napr. výchozia hodnota 4 m, krokovanie po 0.5 m, rozsah 2 až 10 m).
   - Checkbox alebo prepínač: "Neviem / Odhadnúť štandardnú veľkosť (4 m)". Ak je zaškrtnutý, vstup pre dĺžku sa sivou farbou deaktivuje a počíta sa s 4 m.


Logika výpočtu (JavaScript):
- Referenčná štandardná dĺžka = 4.0 m.
- Ak je zaškrtnutá možnosť "Neviem", odhadovaná dĺžka = 4.0 m. Inak vezmi zadané číslo z inputu.
- Vypočítaj koeficient dĺžky = odhadovaná dĺžka / 4.0.
- Vypočítaj základnú sumu = (cena tvaru + materiál + dvierka + doska).
- Vypočítaj minPrice = Math.round((základná suma * koeficient dĺžky) / 50) * 50.
- Vypočítaj maxPrice = Math.round((minPrice * 1.12) / 50) * 50 (s 12 % rezervou pre zameranie).
- Výsledok aktualizuj okamžite pri každej zmene vo formulári (events: change, input) vo formáte:
  "Orientačná cena: 4 200 € – 4 700 €" 
  s podtextom: "*Konečná cena sa presne stanoví až po osobnom zameraní majstrom."