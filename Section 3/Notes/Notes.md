# Section 3 notes
## Section overview
In this course we will build an “uptime monitor” that allows users to enter URLs they want monitored and receive alerts when those resources “go down” or “come back up” these alerts will be sent via sms to a user rather than email

Requirements of the API
1. Listens on a port and accepts incoming HTTP requests for POST, GET, PUT, DELETE and HEAD
2. The API allows a client to connect, then create a new user, then edit and delete that user
3. The API allows users to “sign in” thich gives them a token that they can use for subsequent authenticated requests.
4. The API allows the user to “sign out” which invalidates their token.
5. The API allows a signed-in user to use their token to create a new “check”.
6. The API allows a signed-in user to edit or delete any of their checks.
7. In the background, workers perform all the “checks” at the appropriate times and send alerts to the users when a check changes its state from “up” to “down” or visa versa.

Environments
- On mac: “NODE_ENV=production node index.js”
- On Windows: “set NODE_ENV=production&& node index.js”
- On Powershell: “$env:NODE_ENV='production'; node index.js”
    - $env:NODE_DEBUG='workers'; node index.js

Adding HTTPS support
- Requires openssl https://www.openssl.org/
- HTTP typically is on port 80
- HTTPS typically is on port 443
