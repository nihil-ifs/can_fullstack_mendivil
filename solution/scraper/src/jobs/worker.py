from src.jobs.csv_processor import procesar_automaticamente
import time

if __name__ == "__main__":
    print("Worker iniciado, procesando CSVs en cola...")
    while True:
        try:
            procesar_automaticamente()
        except Exception as e:
            print(f"[worker] Error al procesar CSVs: {e}")
        time.sleep(300) # Espera 5 minutos antes de revisar nuevamente
