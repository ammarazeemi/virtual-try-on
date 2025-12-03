from fastapi import FastAPI
from app.database import init_db
from app.routes import auth, avatar
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.utils.cartoonizer import load_model  # ✅ NEW

import os
app = FastAPI(title="Virtual Wardrobe API")

init_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ensure uploads folder exists (relative to project backend folder)
uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "uploads"))
os.makedirs(uploads_dir, exist_ok=True)

# mount static so /uploads/<path> serves files from backend/app/uploads
# NOTE: adjust the directory path if your uploads live in backend/app/uploads
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")
# Include all authentication routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(avatar.router, prefix="/avatar", tags=["Avatar Management"])

@app.on_event("startup")  # ✅ MODEL WILL LOAD ONE TIME ONLY
async def startup_event():
    print("🔥 Preloading cartoonizer model...")
    load_model()
@app.get("/")
def home():
    return {"message": "Backend running successfully with SQL Server"}
