import sqlite3

# 连接到 SQLite 数据库
conn = sqlite3.connect('keywords.db')
cursor = conn.cursor()

# 尝试添加新的列
try:
    cursor.execute("ALTER TABLE keywords ADD COLUMN status TEXT DEFAULT 'active';")
    print("Column 'status' added successfully.")
except sqlite3.OperationalError as e:
    print("Error:", e)

# 提交更改并关闭连接
conn.commit()
conn.close()
