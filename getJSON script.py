import requests
     
with open("secrets.txt") as f:
    secrets = f.read()

url = "https://int.seeclickfix.com/api/v2/issues/"

querystring = {"request_types":"11386","details":"true"}

headers = {
    'Authorization': secrets,
    'Cache-Control': "no-cache",
}

response = requests.request("GET", url, headers=headers, params=querystring)

with open("seeclickfix.json", "w+") as f:
    f.truncate()
    f.write(response.text)
