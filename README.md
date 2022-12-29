# ApiRateLimit
# Node js has been used here. For database i have used mongodb.
# in order to run the project, run the command "npm run server"
1. Rate limit can be set through backend by calling post api 'rate' and providing "X" in json.
2. Once rate has been set /start is called to initialise the process.
3. Now we can call get /api to test out application, it will give desired output till rate limit is reached.
4. Json output will have info on how many times API has been called, call logs(timestamp), rate limit etc.
5. Once rate limit is reached, request timestamp will be stored into failed request and X-WAIT-TILL and X-RATE-LIMIT headers will be shown along with error 429.
6. Once the wait time is over, api will run successfully.
