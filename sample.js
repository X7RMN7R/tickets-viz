// This code sample uses the 'request' library:
// https://www.npmjs.com/package/request
var request = require('request');
var fs = require("fs");

var authData = JSON.parse(fs.readFileSync(".auth", "utf8"));
console.log(authData);

var jqlRequest = 'MES AND status in (Blocked, "In Progress", OPEN, Reopened, Reviewing, Tested, "Waiting for external release") AND Sous-projets = LP ORDER BY priority DESC, updated DESC';

var bodyData = `{
  "expand": [
    "names",
    "schema",
    "operations"
  ],
  "jql": "project = MES AND status in (Blocked, 'In Progress', OPEN, Reopened, Reviewing, Tested, 'Waiting for external release')",
  "maxResults": 15,
  "fieldsByKeys": false,
  "fields": [
    "summary",
    "status",
    "assignee"
  ],
  "startAt": 0
}`;

var options = {
    method: 'POST',
    url: 'https://vif-hub.atlassian.net/rest/api/3/search',
    auth: authData,
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: bodyData
};



request(options, function (error, response, body) {
   if (error) throw new Error(error);
   console.log(
      'Response: ' + response.statusCode + ' ' + response.statusMessage
   );
   console.log(body);
});
