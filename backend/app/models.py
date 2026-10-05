from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .database import Base

class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, nullable=True)
    expected_language = Column(String, nullable=True)
    predicted_language = Column(String)
    confidence = Column(Float)
    dogri_prob = Column(Float)
    english_prob = Column(Float)
    hindi_prob = Column(Float)
    duration_sec = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
