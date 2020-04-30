// This code sample uses the 'request' library:
// https://www.npmjs.com/package/request
var request = require('request');
var fs = require("fs");
var _ = require('lodash');

var authData = JSON.parse(fs.readFileSync(".auth", "utf8"));
console.log(authData);

var bodyData = {
  "expand": [
    "names",
    "schema",
    "operations"
  ],
  "maxResults": 50,
  "fieldsByKeys": false,
  "fields": [
    "summary",
    "priority",
    "customfield_11131" // Offres
  ],
  "startAt": 0
};

var jqlRoot = "project = MES AND Sous-projets = LP AND issuetype = Bug AND status in (Blocked, 'In Progress', OPEN, Reopened, Reviewing, 'Waiting for external release')";
bodyData.jql = jqlRoot;

var body = JSON.stringify(bodyData);

var options = {
    method: 'POST',
    url: 'https://vif-hub.atlassian.net/rest/api/3/search',
    auth: authData,
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    body: body
};

request(options, function (error, response, responseBody) {
   if (error) throw new Error(error);
   console.log(
      'Response: ' + response.statusCode + ' ' + response.statusMessage
   );

   responseData = JSON.parse(responseBody);
   console.log(responseData.total);
   console.log(_.countBy(responseData.issues, getOffer));
   //console.log(responseData.issues[0].fields)
   console.log(_.countBy(responseData.issues, getPriority));
});

function getOffer(issue) {
  return issue.fields.customfield_11131.value;
}

function getPriority(issue) {
  return issue.fields.priority.name;
}
