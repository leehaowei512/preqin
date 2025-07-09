# preqin
Problem statement:
https://bitbucket.org/preqindevelopment/preqin-fullstack-interview-task/src/main/

# Architecture
![architecture_diagram.png](architecture_diagram.png)
- Database: Postgres
= ORM: SQLAlchemy
- API: FastAPI
- Server: Local network hosting
- ASGI (Asynchronous Server Gateway Interface) Server: uvicorn
- Frontend: React + JavaScript

## Development
- Dependency management: poetry
- Language: Python + JavaScript


# Usage
## Virtual Environment
poetry is used to managed dependencies as well as virtual environment

cd into either `frontend` or `backend` and run `eval $(poetry env activate)`

## Installation
- `poetry install`
- `npm run setup`

## Set Up
### .env file
- Create .env at root level with following values and format:
```
DB_NAME="investors"
DB_USER="leehaowei"
DB_PASSWORD=yourpassword
DB_HOST="localhost"
DB_PORT="5432"

TABLE_NAME="investor_table"

REACT_APP_API_BASE_URL=http://localhost:8000
```

### backend
- `cd backend`
- `poetry install`
- `eval $(poetry env activate)`
- Run in psql `CREATE DATABASE investors`, manually create investors database
- Run `setup.py`, this will import the csv into the postgres database

## Run
### Running backend
- `cd backend`
- `uvicorn main:app --reload` ASGI web server

### Running frontend
- `cd frontend`
- `npm start`

# Results
## Investors Page
![investors.png](investors.png)
## Investor Commitment Page
![investor_commitments.png](investor_commitments.png)

# Limitations
## Scalability
There is no pagination/search capabilities, as it is designed for the current data.csv size. Increasing the data size will lead to problems.

## Testing
### front end
- limited coverage
- Covered: components, util functions
- Not covered: main pages, E2E testing (e.g. Selenium)

### backend
- limited coverage
- Covered: fastapis
- Not covered: models, schemas, setup, database, ...

## Deployment/Portability
Currently only done through local, therefore lacks in CICD, containerization, kubernetes, ...