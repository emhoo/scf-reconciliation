import requests
import json
import datetime
     
with open("secrets.txt") as f:
    secrets = f.read()

url = "https://int.seeclickfix.com/api/v2/issues/"

querystring = {"request_types":"11386","details":"true"}

headers = {
    'Authorization': secrets,
    'Cache-Control': "no-cache",
}

response = requests.request("GET", url, headers=headers, params=querystring)

pages = response.json()["metadata"]["pagination"]["pages"]

with open("metadata.txt", "w+") as f:
    f.truncate()
    f.write(datetime.datetime.now().strftime("%Y-%m-%d"))

with open("seeclickfix.json", "w+") as f:
    data = {}
    data["issues"] = []
    page = response.json()["metadata"]["pagination"]["page"]
    while(page != None):
        querystring = {"request_types":"11386","page":page,"details":"true"}
        response = requests.request("GET", url, headers=headers, params=querystring)
        data["issues"] += response.json()["issues"]
        page = response.json()["metadata"]["pagination"]["next_page"]
    f.write(json.dumps(data))
