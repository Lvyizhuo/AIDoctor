
from sqlalchemy import Column, Integer, String, DateTime, Text, Date, Boolean, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Member(Base):
    """家庭成员表"""
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(50), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    rel_ship = Column(String(20), nullable=False)
    gender = Column(String(10), nullable=True)
    birth_date = Column(Date, nullable=True)
    blood_type = Column(String(5), nullable=True)
    height = Column(Integer, nullable=True)
    weight = Column(Integer, nullable=True)
    allergies = Column(Text, nullable=True)
    medical_history = Column(Text, nullable=True)
    is_self = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="members")

