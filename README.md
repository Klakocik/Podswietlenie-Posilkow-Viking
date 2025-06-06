# Podświetlenie Posiłków Viking

[![Wersja](https://img.shields.io/badge/Wersja-1.0-brightgreen)](#) [![Licencja](https://img.shields.io/badge/Licencja-Open%20Source-blue)](#)

### Rozszerzenie do przeglądarki Chrome, które podświetla posiłki z najwyższą zawartością białka na stronie panel.kuchniavikinga.pl.

Plugin podświetla na kolor zielony posiłek z najwyższą zawartością białka, natomiast na niebiesko posiłki, które zawierają podany % białka posiłku z jego najwyższą zawartością(ustawiany przez użytkownika, domyślnie 90%).

![Przykład działania](images/example.png)

**Nowa funkcjonalność:**

![Nowa funkcjonalność - Kcal na 1g białka](images/kcal_per_protein.png)

Na powyższym screenie widoczna jest dodatkowa informacja "K/B: 16.5" oznaczająca ilość kcal przypadającą na 1g białka w danym posiłku.

## 📋 Spis treści

- [Funkcje](#-funkcje)
- [Instalacja](#-instalacja)
- [Użytkowanie](#-użytkowanie)
- [Konfiguracja](#-konfiguracja)
- [Uwagi](#-uwagi)
- [Licencja](#-licencja)

## ✨ Funkcje

- ✅ Automatycznie wykrywa i podświetla posiłki z wysoką zawartością białka
- ✅ Podświetla posiłek z najwyższą zawartością białka na zielono (domyślnie)
- ✅ Podświetla posiłki z zawartością białka powyżej konfigurowalnego progu na niebiesko (domyślnie)
- ✅ Konfigurowalny próg procentowy (domyślnie: 90%)
- ✅ Możliwość dostosowania kolorów podświetlenia
- ✅ Szybkie przywracanie domyślnych ustawień kolorów
- ✅ **Wyświetlanie ilości kcal przypadającej na 1g białka w danym posiłku** (np. "K/B: 16.5")

## 🚀 Instalacja

### 1. Pobierz, a następnie <ins>wypakuj</ins> to repozytorium  
![Przycisk pobrania](images/download.png)  
### 2. Otwórz Chrome i przejdź do `chrome://extensions/`  
### 3. Włącz "Tryb developera" przełącznikiem w prawym górnym rogu  
![Tryb developera](images/dev.png)  
### 4. Kliknij "Załaduj rozpakowane" i wybierz katalog zawierający pliki rozszerzenia  
![Wybór odpowiedniego katalogu](images/catalog.png)  
### 5. Ikona rozszerzenia powinna pojawić się na pasku narzędzi przeglądarki (możę być schowana w menu rozwijanym przycisku rozszerzeń (puzzel))  
Naciśnięcie ikony pozwala przejść do ustawień wtyczki  
![Ikona dodatku](images/extension.png)  

## 🍽️ Użytkowanie

1. Odwiedź stronę panel.kuchniavikinga.pl i otwórz szufladę wyboru posiłków
2. Rozszerzenie automatycznie podświetli posiłki na podstawie zawartości białka:
   - Posiłki z najwyższą zawartością białka będą podświetlone na zielono (domyślnie)
   - Posiłki z zawartością białka powyżej progu będą podświetlone na niebiesko (domyślnie)
   - Przy każdym posiłku wyświetlana jest informacja o ilości kcal przypadającej na 1g białka (K/B)

## ⚙️ Konfiguracja

1. Kliknij ikonę rozszerzenia na pasku narzędzi
2. Kliknij "Otwórz ustawienia", aby przejść do strony opcji
3. Ustaw próg procentowy używając pola numerycznego
4. Zmień kolory podświetlenia używając selektorów kolorów
5. Kliknij "Zapisz ustawienia", aby zastosować zmiany

![Strona ustawień](images/settings.png)

## 📄 Licencja

Ten projekt jest otwartoźródłowy.

---

Stworzone z ❤️ dla społeczności Viking od Kuchni