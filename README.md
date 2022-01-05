# iBull Stock Trades

iBull is a social trading brokerage company that focuses on providing financial and copy trading services for anyone
 without much experience on it.
 
They have to develop a new API to allow them to manage a collection of stock trades of their users. They have
 a huge number of transactions, and their team cannot be in charge of developing this API.
 
## Requirements

The API has the following endpoints:

* `GET /trades` returns a collection of all trades
* `POST /trades` handles the creation of a new trade
* `DELETE /trades` removes all existing trades
* `GET /trades/user/<id>` returns a trade with the given user id
* `GET /stocks/<stock_symbol>/price?start=<start_date>&end=<end_date>` returns the highest and lowest price for the given stock symbol

The company has also defined how should be the Trade JSON object. Here you could see an example: 

```json
{
    "id": 1,
    "type": "buy",
    "user": {
      "id": 1,
      "name": "John Doe"
    },
    "symbol": "ABX",
    "shares": 15,
    "price": 134.27,  
    "timestamp": "2020-12-12 10:00:00"
}
```

The CTO of the company has defined an [OpenAPI](https://swagger.io/specification/) definition file for that API. [That
 file](./api.specs.yaml) specifies every endpoint of the API, accepted values and returned statuses, so you have to follow that in order
 to implement the expected behaviour. 

### Constraints

Due to the business logic of their business, here you could find a list of constraints for each
 endpoint of the API. 
 
* `GET /trades`
    * The response code is 200, and the response body is an array of all trade objects ordered by their 
    ids in ascending order.
 
* `POST /trades`
    * Expects a JSON Trade object **with** an id property as a body payload. 
    * If the Trade id already exists, it returns an HTTP 400 error
    * If the shares value is out of the accepted range [10, 30], 
    the type value is invalid (i.e., not 'buy' or 'sell'), or the price is out of the accepted range [130.42, 195.65], 
    the API must return error code 400. 
    * If everything goes right, the response code is 201, and the response body is the created trade object.
    
* `DELETE /trades`
    * The response code is 200 with an empty body.
    
* `GET /trades/users/<id>`
    * If the given User Id does not exist, it will return 404.
    * If everything goes right, the response code will be 201, and should be ordered in ascending order by Trade Id.  

* `GET /stocks/<symbol>/price?start=<start_date>&end=<end_date>`
    * If there are no Trades for the requested Stock symbol, it will return HTTP 404 response code. 
    * In any other case, it should return maximum and minimum price for the period in the given data range (both inclusive).
    * The response body should contain the following three fields:
        * `symbol` the symbol for the requested stock
        * `highest` the highest price for the requested stock symbol in the given date range
        * `lowest`  the lowest price for the requested stock symbol in the given date range 

## What are we looking for?

* **Put all tests in green**. Implement the previous requirements, in order to make tests pass. Feel free to 
use any dependency or service to improve your solution.

* **A well-designed solution and architecture**. Avoid duplication, extract re-usable code
where makes sense. We want to see that you can create an easy-to-maintain codebase.

* **Test as much as you can**. One of the main pain points of maintaining other's code
comes when it does not have tests. So try to create tests covering, at least, the main classes. The provided tests **will
not be used** to calculate your code coverage nor test quality.  

## Example requests

### `POST /trades`
```json
{
   "id": 1,
   "type": "buy",
   "user": {
      "id": 1,
      "name": "David"
   },
   "symbol": "AC",
   "shares": 28,
   "price": 162.17,
   "timestamp": "2020-06-14 13:13:13"
}
```
```json
{
   "id": 4,
   "type": "buy",
   "user": {
      "id": 1,
      "name": "David"
   },
   "symbol": "AC",
   "shares": 12,
   "price": 137.39,
   "timestamp": "2020-06-25 13:44:13"
}
```

### `GET /trades/users/1`
```json
{
      "id": 1,
      "type": "buy",
      "user": {
         "id": 1,
         "name": "David"
      },
      "symbol": "AC",
      "shares": 28,
      "price": 162.17,
      "timestamp": "2020-06-14 13:13:13"
   },
   {
      "id": 4,
      "type": "buy",
      "user": {
         "id": 1,
         "name": "David"
      },
      "symbol": "AC",
      "shares": 12,
      "price": 137.39,
      "timestamp": "2020-06-25 13:44:13"
   }
```

### `GET /stocks/AC?start=2020-06-13&end=2020-06-26`
```json
{
   "symbol": "AC",
   "highest": 162.17,
   "lowest": 137.39
}
```