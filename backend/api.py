from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"The investors data you requested for does not exist",
        )
    return results


@router.get(
    "/commitments",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.GetInvestorCommitments],
)
def get_all_commitments_for_investor(
        investor_name: str = Query(..., description="Name of the investor to filter by"),
        db: Session = Depends(get_db)
):
    """
    Given investor name, get all commitments
    :param investor_name: str (query parameter)
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

    if not investor_commitments:  # Check for empty list instead of None
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No commitments found for investor: {investor_name}",
        )
    return investor_commitments


@router.get(
    "/commitments/summary",
    status_code=status.HTTP_200_OK,
    response_model=List[schemas.GetInvestorCommitmentSummary],
)
def get_all_commitment_summary_for_investor(
        investor_name: str = Query(..., description="Name of the investor to filter by"),
        db: Session = Depends(get_db)
):
    """
    Given investor name, get all commitments grouped by asset classes
    :param investor_name: str (query parameter)
    :param db:
    :return:
    """
    # First query - grouped by asset class
    asset_class_query = (
        db.query(
            models.Investor.commitment_asset_class.label("asset_class"),
            func.sum(models.Investor.commitment_amount).label("amount"),
        )
        .filter(models.Investor.investor_name == investor_name)  # Fixed hardcoded value
        .group_by(models.Investor.commitment_asset_class)
    )

    # Second query - total across all asset classes
    total_query = db.query(
        literal("all").label("asset_class"),
        func.sum(models.Investor.commitment_amount).label("amount"),
    ).filter(models.Investor.investor_name == investor_name)  # Fixed hardcoded value

    # Combine with UNION ALL
    combined_query = union_all(asset_class_query, total_query)

    # Execute the combined query with ordering
    results = db.execute(
        combined_query.order_by(combined_query.selected_columns.amount.desc())
    ).fetchall()

    if not results:  # Check for empty results
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No commitment summary found for investor: {investor_name}",
        )
    return results
