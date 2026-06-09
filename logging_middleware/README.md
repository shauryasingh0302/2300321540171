# Logging Middleware

A simple JavaScript logging middleware example for a backend assessment.

## Installation

Run:

    npm install

## Create .env

Copy the example file and set your token:

    cp .env.example .env
    # or create .env manually

Update `.env` with a real token:

    ACCESS_TOKEN=your_token

## Run

    npm test

## Example usage

    const Log = require("./logger");

    await Log(
      "backend",
      "info",
      "service",
      "Vehicle scheduling started"
    );
