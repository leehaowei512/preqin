# API Endpoint Evoluation
## Original Implementation: Path Parameters
Chose path parameters as wanted to more clearly represent the resource hierarchy, where:
- `/investors` = giving you a investor high level view
- `/investors/investor_name/{investor_name}` = brings you to information regarding a specific investor
- `/investors/investor_name/{investor_name}/summary` = shows you the summary of the specific chosen investor

Wanted to show a clear split between the investor page and the investor commitment page

## Query Parameters
Changed to:
- `/investors`
- `/investors/commitments?investor_name={investor_name}`
- `/investors/commitments/summary?investor_name={investor_name}`

With the new /commitments and /commitments/summary and the query parameters, 
it makes the split between Investors and Investor Commitment clearer