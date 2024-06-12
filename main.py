import datetime
from fastapi import FastAPI, Depends
from googletrans import Translator
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ai import predict_sentiment
from database import Base, engine, SessionLocal
from models import Review as ReviewModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/assets", StaticFiles(directory="frontend/dist/assets"))

translator = Translator()

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()

class Review(BaseModel):
  id: int
  text: str
  isPositive: bool
  updatedAt: datetime.datetime

  class Config:
    orm_mode = True

class ReviewCreate(BaseModel):
  text: str
  isPositive: bool

class ReviewUpdate(BaseModel):
  text: Optional[str] = None
  isPositive: Optional[bool] = None

class ReviewAIPositiveRequest(BaseModel):
  text: str

class ReviewAIPositiveResponse(BaseModel):
  isPositive: bool
  score: float

class ReviewMetrics(BaseModel):
  total: int
  positive: int
  negative: int
  positivePercent: float
  negativePercent: float

@app.get("/")
def index():
  return FileResponse("frontend/dist/index.html")

@app.get("/reviews/", response_model=list[Review])
def get_reviews(db: Session = Depends(get_db)):
  reviews = db.query(ReviewModel).order_by(ReviewModel.updatedAt.desc()).all()
  return reviews

@app.get("/reviews/metrics/count/", response_model=ReviewMetrics)
def get_reviews_metrics(db: Session = Depends(get_db)):
  total = db.query(ReviewModel).count()
  positive = db.query(ReviewModel).filter(ReviewModel.isPositive == True).count()
  negative = db.query(ReviewModel).filter(ReviewModel.isPositive == False).count()
  positivePercent = (positive / total) * 100.0
  negativePercent = (negative / total) * 100
  return ReviewMetrics(total=total, positive=positive, negative=negative, positivePercent=positivePercent, negativePercent=negativePercent)

@app.get("/reviews/{review_id}", response_model=Review)
def get_reviews(review_id: int, db: Session = Depends(get_db)):
  review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
  return review

@app.post("/reviews/", response_model=Review)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
  db_review = ReviewModel(
    text=review.text, 
    isPositive=review.isPositive
  )
  db.add(db_review)
  db.commit()
  db.refresh(db_review)
  return db_review

@app.post("/reviews/ai/is-positive/", response_model=ReviewAIPositiveResponse)
def sentiment_review(review: ReviewAIPositiveRequest):
  tranlated_text = translator.translate(review.text).text
  sentiment = predict_sentiment(tranlated_text)
  isPositive = True if sentiment > 0.5 else False
  return ReviewAIPositiveResponse(isPositive=isPositive, score=sentiment)

@app.patch("/reviews/{review_id}", response_model=Review)
def update_review(review_id: int, review: ReviewUpdate, db: Session = Depends(get_db)):
  db_review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
  if review.text is not None:
    db_review.text = review.text
  if review.isPositive is not None:
    db_review.isPositive = review.isPositive
  db.commit()
  db.refresh(db_review)
  return db_review

@app.delete("/reviews/{review_id}", response_model=Review)
def delete_review(review_id: int, db: Session = Depends(get_db)):
  db_review = db.query(ReviewModel).filter(ReviewModel.id == review_id).first()
  db.delete(db_review)
  db.commit()
  return db_review