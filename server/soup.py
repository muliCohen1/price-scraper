import requests
from bs4 import BeautifulSoup
import re
import time
import email_sender
import input_output
import sys 
import json

sellers = {
    "kleyzemer":[["div", {"class": "title"}], ["div", {"class": "saleprice"}]],
    "alive": [["div", {"class": "sbj"}],  ["div", {"class": "num"}]],
    "ksp": [["span", {"class":"span-text-html"}], ["span", {"class": "span-new-price-get-item"}]],
    "wildguitars": [["h1", {"class":"product_title"}], ["span", {"class":"amount"}]],
    "halilit": [["span", {"itemprop":"name"}], ["span", {"class":"price_value"}]]

}  

class Product:
    headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
        }
    def __init__(self, url, title_selector, price_selector):
            self.url = url
            self.title_selector = title_selector
            self.price_selector = price_selector
            try:
                self.scrape()
            except AttributeError:
                email_sender.send("Something went wrong - Probably the scraped element no longer exists", self.url)
                
    def scrape(self):
        page = requests.get(self.url, headers = self.headers)
        soup = BeautifulSoup(page.content, 'html.parser')
        title = soup.find(self.title_selector[0], self.title_selector[1]).get_text()
        price = re.sub("[^0-9]", "", soup.find(self.price_selector[0], self.price_selector[1]).get_text()) #used to use [:4] becuase of avigil.co.il
        title = re.sub(r'[^\x00-\x7F]+|[/\\]',' ', "".join(filter(lambda c: not (ord(c) >= 1424 and ord(c) <= 1514), title))).strip() #remove all non ascii after removing all heb characters
        read_value = input_output.read_file(title)
       
        if read_value != price:
            input_output.write_file(title, price)
            email_sender.send([title, price, read_value], self.url)
        # print(title + " is only " + price)
        print(title)

with open('buyingData.json') as json_file:
        data = json.load(json_file)
        if isinstance(data, dict): 
            for i in data["inputFields"]:
                Product(i["item"], sellers[i["seller"]][0], sellers[i["seller"]][1])
        else:
            Product(i["item"], sellers["seller"][0], sellers["seller"][1])




