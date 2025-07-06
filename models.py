from database import Base
from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean, text


class Investor(Base):
    __tablename__ = "investor_table"
    id = Column(Integer,primary_key=True,nullable=False)
    investorname = Column(String, nullable=False)
    investorytype = Column(String, nullable=False)
    investorcountry = Column(String, nullable=False)
    investordateadded = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    investorlastupdated = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
    commitmentassetclass = Column(String,nullable=False)
    commitmentamount = Column(Integer, nullable=False)
    commitmentcurrency = Column(String, nullable=False)
