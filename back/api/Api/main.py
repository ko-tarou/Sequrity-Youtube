from fastapi import FastAPI
from api import notice, user, channel, video, category, comment, channel_subscription
from db.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    print("Database tables created (if not exist).")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notice.router)
app.include_router(user.router)
app.include_router(channel.router)
app.include_router(video.router)
app.include_router(category.router)
app.include_router(comment.router)
app.include_router(channel_subscription.router)