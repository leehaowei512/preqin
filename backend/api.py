from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, literal, union_all
from sqlalchemy.orm import Session
from starlette import status

import models
import schemas
from database import get_db

router = APIRouter(prefix="/investors", tags=["Investors"])


@router.get(
    "/", status_code=status.HTTP_200_OK, response_model=List[schemas.GetInvestorSummary]
)
def get_investor_summary(db: Session = Depends(get_db)):
    """
    Gets summary view of investors
    :param db:
    :return:
    """
    results = (
        db.query(
            models.Investor.investor_name,
            models.Investor.investory_type,
            func.min(models.Investor.investor_date_added).label("investor_date_added"),
            func.sum(models.Investor.commitment_amount).label("commitment_amount"),
        )
        .group_by(
            models.Investor.investor_name,
            models.Investor.investory_type,
            models.Investor.commitment_currency,
        )
        .all()
    )

    if results is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"The investors data you requested for does not exist",
        )
    return results


@router.get(
    "/investor_name/{investor_name}",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.GetInvestorCommitments],
)
def get_all_commitments_for_investor(investor_name: str, db: Session = Depends(get_db)):
    """
    Given investor name, get all commitments
    :param investor_name: str
    :param db:
    :return:
    """
    investor_commitments = (
        db.query(
            models.Investor.id,
            models.Investor.commitment_asset_class,
            models.Investor.commitment_currency,
            models.Investor.commitment_amount,
        )
        .filter(models.Investor.investor_name == investor_name)
        .all()
    )

    if investor_commitments is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"The investor with name: {investor_name} you requested for does not exist",
        )
    return investor_commitments


@router.get(
    "/investor_name/{investor_name}/summary",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.GetInvestorCommitmentSummary],
)
def get_all_commitment_summary_for_investor(
    investor_name: str, db: Session = Depends(get_db)
):
    """
    Given investor name, get all commitments grouped by asset classes
    :param investor_name:
    :param db:
    :return:
    """
    # First query - grouped by asset class
    asset_class_query = (
        db.query(
            models.Investor.commitment_asset_class.label("asset_class"),
            func.sum(models.Investor.commitment_amount).label("amount"),
        )
        .filter(models.Investor.investor_name == "Cza Weasley fund")
        .group_by(models.Investor.commitment_asset_class)
    )

    if asset_class_query is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"The asset_class_query with name: {investor_name} you requested for does not exist",
        )

    # Second query - total across all asset classes
    total_query = db.query(
        literal("all").label("asset_class"),
        func.sum(models.Investor.commitment_amount).label("amount"),
    ).filter(models.Investor.investor_name == "Cza Weasley fund")

    # Combine with UNION ALL (more efficient than UNION in this case)
    combined_query = union_all(asset_class_query, total_query)

    # Execute the combined query with ordering
    results = db.execute(
        combined_query.order_by(combined_query.selected_columns.amount.desc())
    ).fetchall()

    return results
