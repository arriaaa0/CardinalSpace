import sqlite3

db_path = r'C:\Users\USER\Downloads\CardinalSpace\web\dev.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

if tables:
    print("Tables found:")
    for table in tables:
        print(f"  - {table[0]}")
else:
    print("No tables found in database")

conn.close()
