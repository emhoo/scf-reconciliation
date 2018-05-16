import requests
     
with open("secrets.txt") as f:
    secrets = f.read()

url = "https://int.seeclickfix.com/api/v2/issues/"

querystring = {"request_types":"11386","per_page":"5","details":"true"}

headers = {
    'Authorization': "Basic c2VlY2xpY2tmaXhAdG93bm9mY2hhcGVsaGlsbC5vcmc6ZGV2dGVzdCEhIQ==",
    'Cache-Control': "no-cache",
}

response = requests.request("GET", url, headers=headers, params=querystring)

with open("seeclickfix.json", "w+") as f:
    f.truncate()
    f.write(response.text)
