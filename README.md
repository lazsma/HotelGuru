# HotelGuru
Rendszerfejlesztés beszámoló - 9. csapat

## Backend

### Adatbázis létrehozása

A solution explorerben jobb klikk a HotelGuru/HotelGuru-ra. A helyes path a következő:
HotelGuru\backend\HotelGuru\HotelGuru>

```
flask db init
flask db migrate
flask db upgrade
```

Ezután az adatbázis elérhető lesz.

### Adatbázis frissítése

A solution explorerben jobb klikk a HotelGuru/HotelGuru-ra. A helyes path a következő:
HotelGuru\backend\HotelGuru\HotelGuru>

```
flask db migrate
flask db upgrade
```

Ezután a frissített adatbázis használható.



### Titkositáshoz kulcs

honlap rsa kulcs generáláshoz: https://cryptotools.net/rsagen
   -kiválasztasz egy kulcs hosszott és rányomsz a gombra a kulcs létrehozásához

## private to public key

2048 length van használva a projetben
csak bemásolod a private-key.perm fájl tartalmát a private key alatti szöveg mezőbe és az oldal már adja is a hozzá tartozó public kulcsot

