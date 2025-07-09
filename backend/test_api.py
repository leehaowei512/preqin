import pytest
from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)


def test_get_investor_summary():
    # Given
    api_endpoint = "/investors/"
    expected_status_code = 200
    expected_results = [
        {
            "commitment_amount": 4083000000,
            "investor_date_added": "2010-06-08",
            "investor_name": "Mjd Jedi fund",
            "investory_type": "bank",
        },
        {
            "commitment_amount": 2430000000,
            "investor_date_added": "2002-05-29",
            "investor_name": "Cza Weasley fund",
            "investory_type": "wealth manager",
        },
        {
            "commitment_amount": 3492000000,
            "investor_date_added": "2000-07-06",
            "investor_name": "Ioo Gryffindor fund",
            "investory_type": "fund manager",
        },
        {
            "commitment_amount": 3930000000,
            "investor_date_added": "1997-07-21",
            "investor_name": "Ibx Skywalker ltd",
            "investory_type": "asset manager",
        },
    ]

    # When
    response = client.get(api_endpoint)

    # Then
    assert response.status_code == expected_status_code
    assert response.json() == expected_results


@pytest.mark.parametrize(
    "investor_name, expected_length",
    [
        ("Mjd Jedi fund", 83),
        ("Cza Weasley fund", 59),
        ("Ioo Gryffindor fund", 75),
        ("Ibx Skywalker ltd", 83)
    ]

)
def test_get_all_commitments_for_investor(investor_name, expected_length):
    # Given
    api_endpoint = f"/investors/commitments?investor_name=" + investor_name
    expected_status_code = 200

    # When
    response = client.get(api_endpoint)

    # Then
    assert response.status_code == expected_status_code
    assert len(response.json()) == expected_length


@pytest.mark.parametrize(
    "investor_name, expected_num_asset_classes, total_amount",
    [
        ("Mjd Jedi fund", 7, 4083000000),
        ("Cza Weasley fund", 7, 2430000000),
        ("Ioo Gryffindor fund", 7, 3492000000),
        ("Ibx Skywalker ltd", 7, 3930000000)
    ]

)
def test_get_all_commitment_summary_for_investor(investor_name, expected_num_asset_classes, total_amount):
    # Given
    api_endpoint = f"/investors/commitments/summary?investor_name=" + investor_name
    expected_status_code = 200

    # When
    response = client.get(api_endpoint)

    # Then
    assert response.status_code == expected_status_code
    result = response.json()
    assert len(result) == expected_num_asset_classes
    for asset_class in result:
        if asset_class.get("asset_class") == "all":
            investor_total_amount = asset_class.get("amount")
            assert investor_total_amount == total_amount
