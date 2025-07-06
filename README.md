# preqin
https://bitbucket.org/preqindevelopment/preqin-fullstack-interview-task/src/main/

## Virtual Environment
`eval $(poetry env activate)`

## Installation
- `poetry install`
- `npm run setup`

## Set Up
- Create .env with following format:
```
DB_NAME=investors
DB_USER=leehaowei
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432

TABLE_NAME=investor_table

REACT_APP_API_BASE_URL=http://localhost:8000
```

### backend
- `cd backend`
- `poetry install`
- `eval $(poetry env activate)`
- `cd db`
- Run `CREATE DATABASE investors`, manually create investors database
- Run `setup.py`, this will import the csv into the postgres database

## Runs
### Running backend
`uvicorn main:app --reload`

### Running frontend
`npm start`