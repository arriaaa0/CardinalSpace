import sqlite3
import uuid
from datetime import datetime

db_path = r'C:\Users\USER\Downloads\CardinalSpace\web\dev.db'
admin_hash = '$2b$12$6ZXnKt3a5QQ5oBqlSKbSTeZuhIPjIiGM9jWnVywTVn/QPqloDlLrq'
user_hash = '$2b$12$HJQZ1a7B9rmUSaZraEGbUewRgZRK.VY8zMVtqpmIaddT50Smcek8.'
admin_id = str(uuid.uuid4())
user_id = str(uuid.uuid4())
now = datetime.now().isoformat()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Check if admin exists
    cursor.execute("SELECT * FROM User WHERE email = ?", ('admin@example.com',))
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (admin_id, 'Admin User', 'admin@example.com', admin_hash, 'ADMIN', now, now))
        print('✓ Created admin user')
    else:
        print('✓ Admin user already exists')

    # Check if test user exists
    cursor.execute("SELECT * FROM User WHERE email = ?", ('user@example.com',))
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, 'Test User', 'user@example.com', user_hash, 'USER', now, now))
        print('✓ Created test user')
    else:
        print('✓ Test user already exists')

    conn.commit()
    print('\n✓ Database seeding complete!')
    print('\nTest credentials:')
    print('Admin: admin@example.com / admin123')
    print('User:  user@example.com / user123')

except Exception as e:
    print(f'Error: {e}')
    conn.rollback()
finally:
    conn.close()
