from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, text

from config import Config
from database import Base


class Investor(Base):
    __tablename__ = Config.TABLE_NAME
    id = Column(Integer, primary_key=True, nullable=False)
    investor_name = Column(String, nullable=False)
    investory_type = Column(String, nullable=False)
    investor_country = Column(String, nullable=False)
    investor_date_added = Column(TIMESTAMP(timezone=True), server_default=text("now()"))
    investor_last_updated = Column(
        TIMESTAMP(timezone=True), server_default=text("now()")
    )
    commitment_asset_class = Column(String, nullable=False)
    commitment_amount = Column(Integer, nullable=False)
    commitment_currency = Column(String, nullable=False)
