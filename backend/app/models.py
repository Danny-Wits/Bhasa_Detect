from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    predictions = relationship("PredictionRecord", back_populates="user")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    age = Column(String)
    gender = Column(String)
    state = Column(String)
    district = Column(String)
    mothertongue = Column(String)
    qualification = Column(String)
    languages = Column(Text) # Stored as JSON string
    location = Column(String)

    user = relationship("User", back_populates="profile")

class PredictionRecord(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Optional link to user
    username = Column(String, index=True, nullable=True) # Legacy/Fallback
    expected_language = Column(String, nullable=True)
    predicted_language = Column(String)
    confidence = Column(Float)
    dogri_prob = Column(Float)
    english_prob = Column(Float)
    hindi_prob = Column(Float)
    duration_sec = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="predictions")
