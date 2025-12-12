from pydantic import BaseModel
from typing import List, Dict, Optional

class Brand(BaseModel):
    id: str
    name: str
    description: str
    image: str
    categories: List[str]

class Category(BaseModel):
    id: str
    name: str
    description: str

class ClothingItem(BaseModel):
    id: str
    name: str
    description: str
    price: str
    image: str # URL to the image
    category: str

class StoreDataResponse(BaseModel):
    brands: List[Brand]
    categories: Dict[str, List[Category]]
    clothes: Dict[str, Dict[str, List[ClothingItem]]]

class InitStoreRequest(BaseModel):
    pass # No body needed for now, just triggers population
