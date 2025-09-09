from db import SessionLocal
from sqlalchemy import text

def test_connection():
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT 1;"))
        print("Conexión exitosa:", result.scalar_one())
        db.close()
    except Exception as e:
        print("Error en la conexión:", e)

if __name__ == "__main__":
    test_connection()
