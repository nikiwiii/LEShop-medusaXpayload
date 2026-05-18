# 🛍️ Le Shop — Medusa v2 + Next.js Storefront & Payload CMS Monorepo

Witamy w **Le Shop**! Jest to zaawansowany ekosystem e-commerce składający się z silnika sklepowego **Medusa v2** (backend), nowoczesnego frontendu **Next.js 15** (storefront) oraz zintegrowanego systemu zarządzania treścią **Payload CMS v3** wbudowanego bezpośrednio w projekt storefrontu.

Ten przewodnik pomoże Ci szybko skonfigurować i uruchomić cały projekt w środowisku lokalnym.

---

## 🏗️ Architektura projektu

Projekt jest zorganizowany w formie monorepo i dzieli się na dwa główne foldery:

```text
le_shop/
├── medusa/             # Backend sklepu (Medusa v2) – port 9000
│   └── src/            # Logika biznesowa, workflowy, subskrybenci i skrypty synchronizacji
├── storefront/         # Frontend Next.js 15 + Payload CMS v3 (embedded) – port 8000
│   └── src/            # Interfejs użytkownika, widoki Next.js oraz konfiguracja Payload CMS
├── docker/             # Skrypty pomocnicze Docker (inicjalizacja baz danych)
├── .env                # Główny plik konfiguracyjny środowiska
└── docker-compose.yml  # Definicja kontenerów dla bazy danych, Redis oraz aplikacji
```

---

## 🛠️ Wymagania wstępne

Zanim rozpoczniesz, upewnij się, że masz zainstalowane:
- **Node.js** w wersji **v20** lub nowszej.
- **Docker** oraz **Docker Compose** (dla bazy danych PostgreSQL i kolejki Redis).
- Menedżery pakietów: **npm** (używany w backendzie Medusa) oraz **Yarn** (używany w storefront).

---

## ⚙️ Konfiguracja środowiska (`.env`)

W głównym folderze projektu (`le_shop/`) znajduje się plik `.env`. Steruje on konfiguracją baz danych, portami oraz kluczami szyfrującymi dla wszystkich usług.

Upewnij się, że plik `.env` zawiera poprawne dane:
- **Porty domyślne:**
  - Frontend (`storefront`): `8000`
  - Backend (`medusa`): `9000`
  - Baza danych (`postgres`): `5434`
  - Kolejka (`redis`): `6379`
- **Nazwy baz danych:**
  - `medusa_db` (dla Medusa backend)
  - `payload_db` (dla Payload CMS)

---

## 🚀 Jak uruchomić projekt

Istnieją dwie metody uruchomienia projektu: za pomocą **Docker Compose** (szybki start całego środowiska) lub **lokalnie/manualnie** (najlepsze do codziennego programowania z automatycznym odświeżaniem kodu).

### Metoda A: Szybki start z Docker Compose (Zalecana)

Docker automatycznie postawi bazę danych PostgreSQL (tworząc obie bazy), serwer Redis, zainstaluje zależności i uruchomi backend oraz frontend.

1. Upewnij się, że Twój program Docker Desktop jest uruchomiony.
2. W głównym katalogu projektu (`le_shop/`) uruchom polecenie:
   ```bash
   docker compose up --build
   ```
3. Aplikacje będą dostępne pod adresami:
   - **Frontend (Storefront):** [http://localhost:8000](http://localhost:8000)
   - **Payload CMS Panel:** [http://localhost:8000/admin](http://localhost:8000/admin) (zintegrowany ze storefrontem)
   - **Backend Medusa API:** [http://localhost:9000](http://localhost:9000)
   - **Medusa Admin Panel:** [http://localhost:9000/app](http://localhost:9000/app)

---

### Metoda B: Uruchomienie lokalne (Najlepsze do developmentu)

Ta metoda pozwala na szybsze przeładowywanie kodu (Hot Reloading) i łatwiejsze debugowanie.

#### Krok 1: Uruchomienie bazy danych i Redis przez Docker
Nie musisz instalować PostgreSQL i Redis lokalnie. Uruchom tylko te usługi w tle za pomocą Dockera:
```bash
docker compose up -d postgres redis
```

#### Krok 2: Konfiguracja i uruchomienie Backend Medusa
1. Przejdź do folderu `medusa/`:
   ```bash
   cd medusa
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom migracje bazy danych, aby utworzyć wymagane tabele:
   ```bash
   npx medusa db:migrate
   ```
4. Uruchom serwer developerski backendu:
   ```bash
   npm run dev
   ```
   Backend Medusa będzie działał na porcie `9000`, a panel administratora Medusa na [http://localhost:9000/app](http://localhost:9000/app).

#### Krok 3: Konfiguracja i uruchomienie Storefront & Payload CMS
1. Otwórz nowe okno terminala w głównym katalogu `le_shop/` i przejdź do folderu `storefront/`:
   ```bash
   cd storefront
   ```
2. Zainstaluj zależności za pomocą Yarn:
   ```bash
   yarn install
   ```
3. Uruchom serwer developerski frontendu:
   ```bash
   yarn dev
   ```
   Frontend Next.js wraz z panelem administracyjnym Payload CMS będzie działał na porcie `8000` ([http://localhost:8000](http://localhost:8000)).

---

## 🔄 Synchronizacja danych (Medusa <-> Payload CMS)

Projekt zawiera wbudowaną integrację i skrypty synchronizacji produktów oraz kategorii pomiędzy bazą danych Medusa a Payload CMS.

Aby zsynchronizować dane, upewnij się, że backend Medusa działa, przejdź do folderu `medusa/` i uruchom:

- **Synchronizacja produktów:**
  ```bash
  npm run sync:payload
  ```
- **Synchronizacja kategorii produktowych:**
  ```bash
  npm run sync:categories
  ```

---

## 🛠️ Rozwiązywanie problemów (FAQ)

### 1. Błąd logowania do Medusa Admin na localhost (CORS / Cookies)
Jeśli napotkasz problem z logowaniem do panelu Medusa Admin na porcie `9000` w przeglądarce, upewnij się, że w konfiguracji Medusy ciasteczka sesyjne nie wymagają HTTPS w środowisku developerskim (opcja `cookieOptions: { sameSite: "lax", secure: false }`).

### 2. Baza danych nie chce się zainicjalizować
Jeśli po raz pierwszy uruchamiasz bazę danych przez Docker Compose, skrypt z pliku `docker/init-db.sh` powinien automatycznie stworzyć bazę `payload_db` obok głównej bazy `medusa_db`. Jeśli baza Payload nie powstała, możesz zalogować się do Postgresa i utworzyć ją ręcznie:
```bash
docker exec -it medusa_postgres psql -U medusa -d medusa_db -c "CREATE DATABASE payload_db;"
```

### 3. Folder `storefront` nie pojawia się w Git
Jeśli Git w głównym katalogu ignoruje zmiany wewnątrz `storefront`, upewnij się, że usunięto zagnieżdżone repozytorium `.git` z folderu `storefront` oraz wyczyszczono cache submodułu:
```powershell
# W głównym katalogu projektu:
Remove-Item -Recurse -Force storefront\.git
git rm --cached storefront
git add storefront
```
