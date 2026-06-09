# Notification App BE

This is a simple backend project for Stage 6 of the Campus Notification System assessment.

## Approach

- load the API token from `.env`
- fetch notifications from the evaluation service using `axios`
- calculate a priority score for each notification
- sort notifications by highest score first
- return the top 10 notifications
- print the result to the console and save it to `output.json`

## Priority calculation

Each notification gets a score based on type and recency:

- Placement = 3
- Result = 2
- Event = 1

Recency bonus:

- less than 1 day old = +3
- less than 3 days old = +2
- less than 7 days old = +1
- older than 7 days = +0

Final score:

`priorityScore = typeWeight + recencyBonus`

## Run

1. Copy `.env.example` to `.env`
2. Add `ACCESS_TOKEN` in `.env`
3. Run:

```bash
npm install
npm start
```

The top 10 notifications will be printed and saved to `output.json`.
