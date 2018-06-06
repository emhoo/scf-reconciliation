import requests
import json
     
with open("secrets.txt") as f:
    secrets = f.read()

#Gets list of issue type IDs
url = "https://crm-int.seeclickfix.com/api/v2/organizations/417/issues"
headers = {
    'Authorization': secrets,
    'Cache-Control': "no-cache",
}

response = requests.request("GET", url, headers=headers)
issueTypes = response.json()["metadata"]["query"]["request_types"].split(",")

#Gets actual issue JSONs
url = "https://int.seeclickfix.com/api/v2/issues/"

with open("data/seeclickfix_all.json", "w+") as f:
    querystring = {"request_types":issueTypes[0],"status":"open,acknowledged,closed,archived"}
    response = requests.request("GET", url, headers=headers, params=querystring)
    data = {}
    data["issues"] = []
    for i in issueTypes:
        page = response.json()["metadata"]["pagination"]["page"]
        while(page != None):
            querystring = {"request_types":i,"page":page,"status":"open,acknowledged,closed,archived","per_page":"100"}
            response = requests.request("GET", url, headers=headers, params=querystring)
            data["issues"] += response.json()["issues"]
            page = response.json()["metadata"]["pagination"]["next_page"]
    f.write(json.dumps(data))
