from fastapi import APIRouter, HTTPException, Depends, Request
from app.database import get_connection
from app.schemas.store_schema import StoreDataResponse, Brand, Category, ClothingItem
import pyodbc

router = APIRouter()

@router.get("/data", response_model=StoreDataResponse)
def get_store_data(request: Request):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        # Fetch Stores (Brands)
        cursor.execute("SELECT store_id, store_name, store_image FROM Store")
        stores = cursor.fetchall()

        # Fetch Categories
        cursor.execute("SELECT product_category_id, category_name, category_description FROM ProductCategory")
        db_categories = cursor.fetchall()

        # Fetch Products
        cursor.execute("""
            SELECT p.product_id, p.store_id, p.product_category_id, p.product_name, p.product_description, p.product_image, p.price, pc.category_name
            FROM Product p
            JOIN ProductCategory pc ON p.product_category_id = pc.product_category_id
        """)
        products = cursor.fetchall()

        # Construct Response
        brands = []
        categories_map = {}
        clothes_map = {}
        
        base_url = str(request.base_url).rstrip("/")

        # Helper to map DB IDs to string IDs for frontend compatibility
        # We'll use the names as IDs for simplicity where possible or keep numeric IDs as strings
        
        # Process Categories first to have a map
        cat_id_map = {row.product_category_id: row.category_name.lower() for row in db_categories}
        
        # We need to structure categories per brand as per frontend expectation
        # The current frontend has 'categories' as a map of brand_id -> list of categories.
        # But our DB has global categories. We will assign all global categories to all brands for now, 
        # or filter based on products if we want to be smarter. 
        # Let's assume all brands have all categories for now to match the hardcoded data structure roughly.
        
        # However, the frontend data had:
        # categories: { nike: [shirts, pants], adidas: [shirts, pants], ... }
        
        # Let's build the brands list first
        store_id_map = {} # int -> str (e.g. 1 -> 'nike')

        for row in stores:
            s_id = row.store_id
            s_name = row.store_name
            s_slug = s_name.lower().replace(" ", "").replace("'", "") # simple slug
            store_id_map[s_id] = s_slug
            
            # Determine categories for this store based on products? 
            # Or just hardcode 'shirts' and 'pants' if that's what we have.
            # Let's look at what categories exist in DB.
            
            brand_cats = []
            for cat_row in db_categories:
                cat_slug = cat_row.category_name.lower()
                brand_cats.append(cat_slug)

            brands.append(Brand(
                id=s_slug,
                name=s_name,
                description=f"Description for {s_name}", # Placeholder or add to DB
                image=row.store_image if row.store_image else "",
                categories=brand_cats
            ))

            # Initialize clothes map for this brand
            clothes_map[s_slug] = {}
            for cat_slug in brand_cats:
                clothes_map[s_slug][cat_slug] = []

            # Populate categories map
            categories_map[s_slug] = []
            for cat_row in db_categories:
                categories_map[s_slug].append(Category(
                    id=cat_row.category_name.lower(),
                    name=cat_row.category_name,
                    description=cat_row.category_description if cat_row.category_description else ""
                ))

        # Process Products
        for row in products:
            p_id = str(row.product_id)
            s_id = row.store_id
            c_id = row.product_category_id
            p_name = row.product_name
            p_desc = row.product_description
            p_img = row.product_image
            p_price = row.price
            cat_name = row.category_name.lower()
            
            if s_id in store_id_map:
                s_slug = store_id_map[s_id]
                
                # Ensure category exists in map (it should)
                if s_slug in clothes_map and cat_name in clothes_map[s_slug]:
                    # Fix image path to be a full URL if it's relative
                    # Assuming images are stored as 'store/BRAND/CAT/img.png' in DB
                    # We need to prepend the backend URL.
                    
                    full_image_path = ""
                    if p_img:
                        full_image_path = f"{base_url}/uploads/{p_img}" if not p_img.startswith("http") else p_img

                    clothes_map[s_slug][cat_name].append(ClothingItem(
                        id=p_id,
                        name=p_name,
                        description=p_desc if p_desc else "",
                        price=p_price if p_price else "",
                        image=full_image_path,
                        category=cat_name
                    ))

        return StoreDataResponse(
            brands=brands,
            categories=categories_map,
            clothes=clothes_map
        )

    except Exception as e:
        print(f"Error fetching store data: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
