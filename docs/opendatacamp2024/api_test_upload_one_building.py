# --------------------------------
# task is to import building adress data via API as bulk upload
# using the existing initial files as there are for Colouring Dresden available
# --------------------------------

# --------------------------------
# import packages
# --------------------------------
import csv
import json
import os
#import sys
#import argparse

import requests
#from retrying import retry

import time
from time import gmtime, strftime

#import pandas as pd
#import geopandas as gpd
#import numpy as np

# --------------------------------
# useful functions
# --------------------------------


@retry(wait_exponential_multiplier=1000, wait_exponential_max=10000)
def update_building(building_id, data, api_key, base_url, headers, data_login):
    """Save data to a building
    """

    with requests.Session() as session:
        login = session.post(base_url + '/api/login', headers=headers, json=data_login)
        #print(login.text)
        #print('---------------------')


        r = session.post(
            "{}/api/buildings/{}.json".format(base_url, building_id),
            params={'api_key': api_key},
            json=data
        )
        #print(r.status_code)
        #print(r.text)
        #print(r.json())

    return r.status_code, r.text, r.json()

def make_row(location_number, location_street, location_town, location_postcode):
     return {'attributes': {'location_number': location_number, 'location_street': location_street, 'location_town':location_town, 'location_postcode':location_postcode}, 'user_attributes':{}}

# --------------------------------
# main parameters
# --------------------------------

# TEST DEV
api_url = r'url'
apikey = 'api-key'

headers = {
    "api_key":apikey}
data_login = {'username':'username', 'password':'pw'}

# --------------------------------
# upload data for one building with POST request
# --------------------------------

data_upload = json.loads(json.dumps(make_row(465,'test straße','Dresden',33333)))


res1, res2, res3 = update_building(40757, data_upload, apikey, api_url, headers, data_login)

