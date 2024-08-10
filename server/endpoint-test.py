"""
Simple Python script to test API endpoints.
"""
import json
import requests

url = "localhost:8080"
endpoint = input("Endpoint: ")
headers = json.loads(input("Headers (JSON stringified): "))
method = input("Method (leave blank for GET): ")

if method == "":
	method = "GET"
else:
	method = method.upper()

if method == "GET":
	res = requests.get(f"http://{url}/{endpoint}", headers=headers)
elif method == "POST":
	res = requests.post(f"http://{url}/{endpoint}", headers=headers)

print(res.text)