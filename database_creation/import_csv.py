# import_csv.py
import psycopg2
import csv
import json

CSV_FILE_PATH = "data.csv"
TABLE_NAME = "investor_table"


def decompose_row(values: list) -> str:
    print(f"length: {len(values)}")
    output = ', '.join(f"'{value}'" for value in values)
    print(output)
    return output


def get_config() -> dict:
    # get connection config
    with open('db_config.json', 'r', encoding='utf-8') as file:
        credentials = json.load(file)
    print(credentials)
    return credentials


# Database connection
conn = psycopg2.connect(
    user=get_config().get("user"),
    dbname=get_config().get("db_name")
    # host="localhost",
    # port=5432
)
cur = conn.cursor()

# Create table
create_table = (
    f"""CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
        Id SERIAL PRIMARY KEY,
        InvestorName varchar(100),
        InvestoryType varchar(20),
        InvestorCountry varchar(100),
        InvestorDateAdded DATE,
        InvestorLastUpdated DATE,
        CommitmentAssetClass varchar(100),
        CommitmentAmount INT,
        CommitmentCurrency varchar(255)
    );"""
)
cur.execute(create_table)

# Import and Insert CSV
with open(CSV_FILE_PATH, 'r') as f:
    reader = csv.reader(f)
    next(reader)  # Skip header if exists
    for index, row in enumerate(reader):
        row_cleaned = decompose_row(row)

        insert_query = f'INSERT INTO investor_table VALUES ({index}, {row_cleaned})'
        cur.execute(insert_query)

conn.commit()
print("verification")
print(cur.execute(f"SELECT * FROM {TABLE_NAME}"))
cur.close()
conn.close()
print("connection_closed")
