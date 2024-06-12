import datetime
from sqlalchemy import Column, DateTime, Integer, String, Boolean, func
from database import Base

class Review(Base):
  __tablename__ = "reviews"

  id = Column(Integer, primary_key=True, index=True)
  text = Column(String, index=True)
  isPositive = Column(Boolean, index=True)
  updatedAt = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)