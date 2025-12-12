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
    
    # --- Store Tables ---
    c.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Store' AND xtype='U')
        CREATE TABLE Store (
            store_id INT IDENTITY(1,1) PRIMARY KEY,
            store_name NVARCHAR(100) NOT NULL,
            store_image NVARCHAR(MAX)
        )
    """)

    c.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProductCategory' AND xtype='U')
        CREATE TABLE ProductCategory (
            product_category_id INT IDENTITY(1,1) PRIMARY KEY,
            category_name NVARCHAR(100) NOT NULL,
            category_description NVARCHAR(255)
        )
    """)

    c.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Product' AND xtype='U')
        CREATE TABLE Product (
            product_id INT IDENTITY(1,1) PRIMARY KEY,
            store_id INT FOREIGN KEY REFERENCES Store(store_id),
            product_category_id INT FOREIGN KEY REFERENCES ProductCategory(product_category_id),
            product_name NVARCHAR(100) NOT NULL,
            product_description NVARCHAR(255),
            product_image NVARCHAR(MAX),
            price NVARCHAR(50)
        )
    """)

    c.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Wardrobe' AND xtype='U')
        CREATE TABLE Wardrobe (
            wardrobe_id INT IDENTITY(1,1) PRIMARY KEY,
            user_id INT FOREIGN KEY REFERENCES users(id),
            product_id INT FOREIGN KEY REFERENCES Product(product_id),
            date_time_stamp DATETIME DEFAULT GETDATE()
        )
    """)

    conn.commit()
    conn.close()
    print("Database initialized")



