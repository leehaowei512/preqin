import datetime

from pydantic import BaseModel


class GetInvestorSummary(BaseModel):
    investor_name: str
    investory_type: str
    investor_date_added: datetime.date
    commitment_amount: int

    class Config:
        orm_mode = True


class GetInvestorCommitments(BaseModel):
    id: int
    commitment_asset_class: str
    commitment_currency: str
    commitment_amount: int

    class Config:
        orm_mode = True


class GetInvestorCommitmentSummary(BaseModel):
    asset_class: str
    amount: int

    class Config:
        orm_mode = True
