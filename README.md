# preqin
https://bitbucket.org/preqindevelopment/preqin-fullstack-interview-task/src/main/

## Virtual Environment
`eval $(poetry env activate)`

## Installation
- `poetry install`
- `npm run setup`

## Set Up
- In database_creation, add `db_config.json`, contains postgres login username
```
{
    "user": "xxxx",
    "db_name": "investors"
}
```
- Run `CREATE DATABASE investors`, manually create a investors database
- Run `import_csv.py`, this will import the csv into the postgres database

## Runs
### Running backend
`uvicorn main:app --reload`

### Running frontend
`npm start`