import pyodbc
from fastapi import HTTPException


# ------------------- Database Connection -------------------
#Server=localhost\SQLEXPRESS;Database=master;Trusted_Connection=True;
#-- sqlcmd -S DESKTOP-BC9BGJA\SQLEXPRESS -No -E
#--

#select @@Version 
#go
   
def get_connection():
    try:
        conn = pyodbc.connect(
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=DESKTOP-BC9BGJA\\SQLEXPRESS;"
            "DATABASE=virtual_wardrobe;"
            "Trusted_Connection=yes;"
        )
        return conn
    except Exception as e:
        print("Database connection failed:", e)
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")


# ------------------- Initialize DB -------------------
def init_db():
    conn = get_connection()
    c = conn.cursor()
    c.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
        CREATE TABLE users (
            id INT IDENTITY(1,1) PRIMARY KEY,
            name NVARCHAR(100) NOT NULL,
            email NVARCHAR(255) UNIQUE NOT NULL,
            password NVARCHAR(255) NOT NULL,
            otp NVARCHAR(10),
            otp_time FLOAT
        )
    """)
    conn.commit()
    conn.close()
    print("Database initialized")



