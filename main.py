from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
import crud_operations
from database import engine, get_db

app = FastAPI()

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Include the router from crud_operations
app.include_router(crud_operations.router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)