import pyodbc
from app.database import get_connection, init_db

def populate_store():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Clear existing data (optional, be careful)
    # cursor.execute("DELETE FROM Wardrobe")
    # cursor.execute("DELETE FROM Product")
    # cursor.execute("DELETE FROM ProductCategory")
    # cursor.execute("DELETE FROM Store")
    
    # Check if data exists to avoid duplicates if run multiple times
    cursor.execute("SELECT COUNT(*) FROM Store")
    if cursor.fetchone()[0] > 0:
        print("Data already exists. Skipping population.")
        return

    print("Populating Store Data...")

    # 2. Insert Categories
    categories = [
        ("Shirts", "Tops and Shirts"),
        ("Pants", "Bottoms and Pants")
    ]
    
    cat_ids = {}
    for name, desc in categories:
        cursor.execute("INSERT INTO ProductCategory (category_name, category_description) OUTPUT INSERTED.product_category_id VALUES (?, ?)", (name, desc))
        cat_id = cursor.fetchone()[0]
        cat_ids[name.lower()] = cat_id

    # 3. Insert Stores (Brands)
    brands = [
        ("Nike", "https://static.vecteezy.com/system/resources/previews/020/336/719/non_2x/nike-logo-nike-icon-free-free-vector.jpg"),
        ("Adidas", "https://static.vecteezy.com/system/resources/previews/019/136/411/non_2x/adidas-logo-adidas-icon-free-free-vector.jpg"),
        ("Levi's", "https://static.vecteezy.com/system/resources/thumbnails/023/871/660/small_2x/levis-logo-brand-symbol-white-design-clothes-fashion-illustration-with-black-background-free-vector.jpg")
    ]

    store_ids = {}
    for name, img in brands:
        cursor.execute("INSERT INTO Store (store_name, store_image) OUTPUT INSERTED.store_id VALUES (?, ?)", (name, img))
        store_id = cursor.fetchone()[0]
        store_ids[name.lower().replace("'", "").replace(" ", "")] = store_id # nike, adidas, levis

    # 4. Insert Products
    # We will loop through the structure we know
    
    # Helper to insert
    def insert_product(store_key, cat_key, name, price, img_path):
        s_id = store_ids[store_key]
        c_id = cat_ids[cat_key]
        cursor.execute("""
            INSERT INTO Product (store_id, product_category_id, product_name, product_description, product_image, price)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (s_id, c_id, name, "Description for " + name, img_path, price))

    # Data from storeData.ts
    
    # Nike Shirts
    for i in range(1, 7):
        insert_product("nike", "shirts", f"Nike Athletic Shirt {i}", f"${45 + (i-1)*3}", f"store/NIKE/SHIRTS/image_{i}.png")
    # Nike Pants
    for i in range(1, 7):
        insert_product("nike", "pants", f"Nike Athletic Pants {i}", f"${65 + (i-1)*3}", f"store/NIKE/PANTS/image_{i}.png")

    # Adidas Shirts
    for i in range(1, 7):
        insert_product("adidas", "shirts", f"Adidas Performance Shirt {i}", f"${42 + (i-1)*3}", f"store/ADIDAS/SHIRTS/image_{i}.png")
    # Adidas Pants
    for i in range(1, 7):
        insert_product("adidas", "pants", f"Adidas Performance Pants {i}", f"${62 + (i-1)*3}", f"store/ADIDAS/PANTS/image_{i}.png")

    # Levis Shirts
    for i in range(1, 7):
        insert_product("levis", "shirts", f"Levi's Classic Shirt {i}", f"${55 + (i-1)*3}", f"store/LEVIS/SHIRTS/image_{i}.png")
    # Levis Pants
    for i in range(1, 7):
        insert_product("levis", "pants", f"Levi's Denim Pants {i}", f"${80 + (i-1)*3}", f"store/LEVIS/PANTS/image_{i}.png")

    conn.commit()
    conn.close()
    print("Store Data Populated Successfully!")

if __name__ == "__main__":
    populate_store()
