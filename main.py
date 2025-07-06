from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel

import models
import crud_operations
from database import engine, get_db

app = FastAPI()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Include the router from crud_operations
app.include_router(crud_operations.router)
