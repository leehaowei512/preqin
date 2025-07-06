# setup.py
import psycopg2
import csv

from config import Config

CSV_FILE_PATH = "data/data.csv"


class DatabaseImporter:
    def __init__(self):
        self.conn = self._get_connection()
        self.cur = self.conn.cursor()
        self.table_name = Config.TABLE_NAME

    @staticmethod
    def _get_connection() -> psycopg2.extensions.connection:
        """Create DB connection using environment variables"""
        print(f"USER: {Config.DB_USER}")
        return psycopg2.connect(
            dbname=Config.DB_NAME,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            host=Config.DB_HOST,
            port=Config.DB_PORT
        )

    def create_table(self) -> None:
        """Create table with proper schema"""
        self.cur.execute(f"""
           CREATE TABLE IF NOT EXISTS {self.table_name} (
               id SERIAL PRIMARY KEY,
               investor_name VARCHAR(100),
               investory_type VARCHAR(20),
               investor_country VARCHAR(100),
               investor_date_added DATE,
               investor_last_updated DATE,
               commitment_asset_class VARCHAR(100),
               commitment_amount INTEGER,
               commitment_currency VARCHAR(3)
           );
       """)
        self.conn.commit()

    def import_csv(self, csv_path: str) -> None:
        """Bulk insert CSV data"""
        def decompose_row(values: list) -> str:
            print(f"length: {len(values)}")
            output = ', '.join(f"'{value}'" for value in values)
            print(output)
            return output

        with open(csv_path, 'r') as f:
            reader = csv.reader(f)
            next(reader)  # Skip header
            for index, row in enumerate(reader):
                row_cleaned = decompose_row(row)

                insert_query = f'INSERT INTO {self.table_name} VALUES ({index}, {row_cleaned})'
                self.cur.execute(insert_query)
        self.conn.commit()

    def shutdown(self) -> None:
        self.cur.close()
        self.conn.close()


if __name__ == "__main__":
    importer = DatabaseImporter()
    importer.create_table()
    importer.import_csv(csv_path=CSV_FILE_PATH)
    importer.shutdown()
