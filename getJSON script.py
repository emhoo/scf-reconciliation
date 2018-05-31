import requests
import json
import datetime
     
with open("secrets.txt") as f:
    secrets = f.read()

with open("config_getJSON.txt") as f:
    config = f.read().split(",")

url = "https://int.seeclickfix.com/api/v2/issues/"

querystring = {"request_types":config[0],"details":"true"}

headers = {
    'Authorization': secrets,
    'Cache-Control': "no-cache",
}

response = requests.request("GET", url, headers=headers, params=querystring)

pages = response.json()["metadata"]["pagination"]["pages"]

with open("metadata.txt", "w+") as f:
    f.truncate()
    f.write(datetime.datetime.now().strftime("%Y-%m-%d"))

for c in config:
    with open("data/seeclickfix_" + c + ".json", "w+") as f:
        data = {}
        data["issues"] = []
        page = response.json()["metadata"]["pagination"]["page"]
        while(page != None):
            querystring = {"request_types":c,"page":page,"details":"true"}
            response = requests.request("GET", url, headers=headers, params=querystring)
            data["issues"] += response.json()["issues"]
            page = response.json()["metadata"]["pagination"]["next_page"]
        f.write(json.dumps(data))
