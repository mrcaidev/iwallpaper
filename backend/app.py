import logging

logging.basicConfig(
    filename="app.log",
    format="[%(asctime)s] %(levelname)s (%(name)s): %(message)s",
    level=logging.DEBUG,
)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from src.root import router as root_router
from src.scraper import router as scraper_router
from src.searcher import router as searcher_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)
app.add_middleware(GZipMiddleware)

app.include_router(root_router)
app.include_router(scraper_router)
app.include_router(searcher_router)
