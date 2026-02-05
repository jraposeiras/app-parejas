import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

URL = "https://www.sport2fit.com"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

def scrape_jugadores():
    try:
        response = requests.get(URL, headers=headers)
        response.encoding = 'utf-8' # Asegura tildes y eñes
        soup = BeautifulSoup(response.text, 'html.parser')
        
        jugadores = []
        
        # Buscamos las filas de la tabla de jugadores
        # En Sport2Fit suelen estar en tablas dentro de la sección de equipo
        filas = soup.find_all('tr')
        
        for fila in filas:
            columnas = fila.find_all('td')
            # Filtramos filas que tengan al menos nombre y puntos
            if len(columnas) >= 2:
                nombre = columnas[0].get_text(strip=True)
                puntos = columnas[-1].get_text(strip=True) # Los puntos suelen ser la última columna
                
                # Solo añadimos si parece un nombre real y puntos numéricos
                if nombre and puntos.replace('.', '').isdigit():
                    jugadores.append({
                        "nombre": nombre,
                        "puntos": puntos
                    })

        data = {
            "fecha_actualizacion": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            "club": "Club de Campo de Vigo",
            "jugadores": jugadores
        }

        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
            
        print(f"Éxito: {len(jugadores)} jugadores encontrados.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    scrape_jugadores()
