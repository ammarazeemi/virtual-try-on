





############################################################################
# app/routes/avatar.py
import os
import uuid
import shutil
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from app.utils.cartoonizer import cartoonize_image_file
from app.database import get_connection

router = APIRouter()

# Base folders (inside backend project)
BASE_UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
USER_UPLOAD_DIR = os.path.join(BASE_UPLOAD_DIR, "user_images")
AVATAR_BASE_DIR = os.path.join(BASE_UPLOAD_DIR, "avatars")
AVATAR_TEMP_DIR = os.path.join(AVATAR_BASE_DIR, "temp")
AVATAR_FINAL_DIR = os.path.join(AVATAR_BASE_DIR, "final")

# Ensure directories exist
os.makedirs(USER_UPLOAD_DIR, exist_ok=True)
os.makedirs(AVATAR_TEMP_DIR, exist_ok=True)
os.makedirs(AVATAR_FINAL_DIR, exist_ok=True)


# ---------------- Upload original image ----------------
@router.post("/upload")
async def upload_avatar(user_id: int = Form(...), file: UploadFile = File(...)):
    """
    Save the uploaded original image to uploads/user_images/
    Return a server-relative temp path (e.g. uploads/user_images/<name>)
    """
    try:
        ext = os.path.splitext(file.filename)[1] or ".jpg"
        filename = f"user_{user_id}{ext}"
        save_path = os.path.join(USER_UPLOAD_DIR, filename)

        # Save uploaded file
        with open(save_path, "wb") as f:
            f.write(await file.read())

        # Return relative path that frontend (and server) can use
        rel_path = os.path.relpath(save_path).replace("\\", "/")  # e.g. uploads/user_images/...
        return JSONResponse(content={"status": "ok", "temp_image_path": rel_path})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {e}")


# ---------------- Generate cartoon avatar ----------------
# @router.post("/generate")
# async def generate_avatar(user_id: int = Form(...), image_path: str = Form(...)):
#     """
#     Convert server-saved original image -> cartoon avatar saved in uploads/avatars/temp/
#     Accepts:
#       - user_id: int
#       - image_path: relative path returned by /upload (uploads/user_images/...)
#     Returns:
#       - avatar_path (relative): uploads/avatars/temp/<avatar_uuid>.png
#     """
#     try:
#         # Resolve absolute input path
#         in_path = image_path if os.path.isabs(image_path) else os.path.abspath(os.path.join(os.getcwd(), image_path))
#         if not os.path.exists(in_path):
#             raise HTTPException(status_code=400, detail="Uploaded image not found on server")
#
#         # Output (temp) path
#         out_filename = f"avatar_{user_id}_{uuid.uuid4().hex}.png"
#         out_path = os.path.join(AVATAR_TEMP_DIR, out_filename)
#
#         # Run cartoonizer (will lazy-load model inside cartoonizer.py)
#         cartoonize_image_file(in_path, out_path)
#
#         rel_out = os.path.relpath(out_path).replace("\\", "/")  # e.g. uploads/avatars/temp/xxx.png
#         return JSONResponse(content={"status": "ok", "avatar_path": rel_out})
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Avatar generation failed: {e}")

@router.post("/generate")
async def generate_avatar(userId: int = Form(...), file: UploadFile = File(...)):
    """
    Upload image -> cartoonize -> save in uploads/avatars/temp/
    Returns:
      avatar_path: relative path to cartoonized image
    """
    try:
        # Save uploaded temporarily in memory
        temp_input = os.path.join(AVATAR_TEMP_DIR, f"input_{uuid.uuid4().hex}.png")

        with open(temp_input, "wb") as f:
            f.write(await file.read())

        # Output cartoon avatar
        avatar_filename = f"avatar_{userId}_{uuid.uuid4().hex}.png"
        avatar_output = os.path.join(AVATAR_TEMP_DIR, avatar_filename)

        cartoonize_image_file(temp_input, avatar_output)

        # Remove original immediately ✅
        os.remove(temp_input)

        rel_out = os.path.relpath(avatar_output).replace("\\", "/")
        return JSONResponse(content={"status": "ok", "avatar_path": rel_out})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
#
# # ---------------- Save avatar permanently + DB insert ----------------
# @router.post("/save")
# async def save_avatar(userId: int = Form(...), avatarName: str = Form(...), avatarPath: str = Form(...)):
#     """
#     Move avatarPath (temp file) -> uploads/avatars/final/avatar_{userId}.ext
#     Delete the temp file.
#     Insert a record into avatars table.
#     Returns the relative final path.
#     """
#     try:
#         # Resolve source absolute path
#         src = avatarPath if os.path.isabs(avatarPath) else os.path.abspath(os.path.join(os.getcwd(), avatarPath))
#         if not os.path.exists(src):
#             raise HTTPException(status_code=400, detail="Avatar file not found on server")
#
#         # Final filename format (F1): avatar_{userId}.ext (overwrite if exists)
#         ext = os.path.splitext(src)[1] or ".png"
#         final_filename = f"avatar_{userId}{ext}"
#         dest = os.path.join(AVATAR_FINAL_DIR, final_filename)
#
#         # If final exists, remove it (we are keeping one final per user)
#         if os.path.exists(dest):
#             os.remove(dest)
#
#         # Move temp -> final
#         shutil.move(src, dest)
#
#         # Insert (or update) DB record
#         conn = get_connection()
#         c = conn.cursor()
#
#         # Ensure avatars table exists
#         c.execute("""
#         IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='avatars' AND xtype='U')
#         CREATE TABLE avatars (
#             avatar_id INT IDENTITY(1,1) PRIMARY KEY,
#             user_id INT,
#             avatar_name NVARCHAR(255),
#             avatar_path NVARCHAR(500),
#             created_at DATETIME
#         )
#         """)
#         conn.commit()
#
#         # Option: delete existing rows for this user to keep only latest (you can choose otherwise)
#         c.execute("DELETE FROM avatars WHERE user_id=?", (userId,))
#         conn.commit()
#
#         saved_abs = os.path.abspath(dest)
#         c.execute(
#             "INSERT INTO avatars (user_id, avatar_name, avatar_path, created_at) VALUES (?, ?, ?, ?)",
#             (userId, avatarName, saved_abs, datetime.now())
#         )
#         conn.commit()
#         conn.close()
#
#         rel_dest = os.path.relpath(dest).replace("\\", "/")  # e.g. uploads/avatars/final/avatar_123.png
#         return JSONResponse(content={"status": "ok", "message": "Avatar saved", "saved_path": rel_dest})
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to save avatar: {e}")
@router.post("/save")
async def save_avatar(userId: int = Form(...), avatarPath: str = Form(...)):
    try:
        src = os.path.abspath(os.path.join(os.getcwd(), avatarPath))
        if not os.path.exists(src):
            raise HTTPException(status_code=400, detail="File not found")

        # Final location
        final_filename = f"avatar_{userId}.png"
        dest = os.path.join(AVATAR_FINAL_DIR, final_filename)

        if os.path.exists(dest):
            os.remove(dest)

        shutil.move(src, dest)

        conn = get_connection()
        c = conn.cursor()

        # ensure avatars table exists
        c.execute("""
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='avatars' AND xtype='U')
        CREATE TABLE avatars (
            avatar_id INT IDENTITY(1,1) PRIMARY KEY,
            user_id INT,
            avatar_path NVARCHAR(500),
            created_at DATETIME
        )
        """)
        conn.commit()

        # Remove previous avatar for user
        c.execute("DELETE FROM avatars WHERE user_id=?", (userId,))
        conn.commit()

        saved_abs = os.path.abspath(dest)
        c.execute(
            "INSERT INTO avatars (user_id, avatar_path, created_at) VALUES (?, ?, ?)",
            (userId, saved_abs, datetime.now())
        )
        conn.commit()
        conn.close()

        rel_dest = os.path.relpath(dest).replace("\\", "/")
        return JSONResponse(content={"status": "ok", "saved_path": rel_dest})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- Fetch user's latest avatar (optional) ----------------
@router.get("/get-avatar/{user_id}")
async def get_avatar(user_id: int):
    try:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT avatar_path FROM avatars WHERE user_id=? ORDER BY created_at DESC", (user_id,))
        avatar = c.fetchone()
        conn.close()
        if not avatar:
            return JSONResponse(status_code=404, content={"status": "not_found", "message": "No avatar found"})
        # avatar[0] is absolute path in DB — convert to relative if inside uploads
        abs_path = avatar[0]
        # if abs path is inside project uploads, give relative path for frontend
        project_root = os.path.abspath(os.getcwd())
        if abs_path.startswith(project_root):
            rel = os.path.relpath(abs_path).replace("\\", "/")
            return JSONResponse(content={"status": "ok", "avatar_path": rel})
        return JSONResponse(content={"status": "ok", "avatar_path": abs_path})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


