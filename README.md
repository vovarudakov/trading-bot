## Description

Node.js application that fetches and analyzes changes happening on the Binance cryptocurrency exchange over a specific period of time.

Application has 1 endpoint
```bash
POST localhost:3000/trades/analyze

{
  "symbol": string,
  "startTime": timestamp in ms,
  "endTime": timestamp in ms
  "limit": limit default 500, max 1000 
}
```
Example: 
```bash
POST localhost:3000/trades/analyze

{
  "symbol": "BNBBTC",
  "startTime": 1740060576444,
  "endTime": 1740060616692
}
```

Response contains of the following fields:
1. totalTrades - total amount of trades made by the period
2. priceDecreasedTotalTimes - how many times the price was decreased between the trades
3. priceIncreasedTotalTimes - how many times the price was increased between the trades
4. maxIncreasedBy - highest amount of how price was increased between trades
5. maxDecreasedBy - highest amount of how price was decreased between trades
6. tradeWithLowestPrice - information about the trade which had lowest price
7. tradeWithHighestPrice - information about the trade which had highest price

Response example:
```
{
  "totalTrades": 12,
  "priceDecreasedTotalTimes": 5,
  "priceIncreasedTotalTimes": 6,
  "maxIncreasedBy": 0.000001999999999999398,
  "maxDecreasedBy": 0.000002999999999999531,
  "tradeWithLowestPrice": {
    "tradeId": 190295866,
    "price": "0.00669100",
    "quantity": "0.05100000",
    "firstTradeId": 269146996,
    "lastTradeId": 269146996,
    "timestamp": 1740060616692,
    "isMaker": true,
    "isBestPriceMatch": true
  },
  "tradeWithHighestPrice": {
    "tradeId": 190295859,
    "price": "0.00669600",
    "quantity": "0.29800000",
    "firstTradeId": 269146989,
    "lastTradeId": 269146989,
    "timestamp": 1740060593672,
    "isMaker": false,
    "isBestPriceMatch": true
  }
}
```

Limit is restricted by Binance API `GET /api/v3/aggTrades`
@see https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints

Next steps:
1. Save aggregated data by time range into a database to avoid the API limits and/or memory load if needed to analyze data for a longer time period 
2. Add unit tests for services and improve e2e tests
3. Improve data analytics e.g. introducing forecast
4. Add API documentation tool e.g. OpenAPI
5. Standardize error handling and error codes
6. Add retries and fallback servers for Binance API

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
