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
import sys
import argparse

import requests
from retrying import retry

import time
from time import gmtime, strftime

import pandas as pd
import geopandas as gpd
import numpy as np

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
# import files
# --------------------------------


# GeoJSON data or CSV data containing building data including adresses

# data preparation to fix problems with encoding --> it is required to read all single tiles to merge them into on data frame

# but unfortunately also required to repeat some differnt steps of data preparation as well


data_blds_adresses = pd.DataFrame()
data_blds_adresses['OBJEKT_ID'] = None
data_blds_adresses['HAUSNUMMER'] = None
data_blds_adresses['STRASSE'] = None
data_blds_adresses['ORTSAMT'] = None
data_blds_adresses['PLZ'] = None

dict_list = []

# giving directory name
dirname = 'output/cc/LOD2_shp'
 
# giving file extension
ext = ('shp')

zaehler_row_total = 0
 
# iterating over all files
for files in os.listdir(dirname):
    if files.endswith(ext):
        print('---------------------------')
        print(os.path.join(dirname, files))  # printing file name of desired extension
        current_data = gpd.read_file(os.path.join(dirname, files))
        #current_data.info() 


        gdf_selection = current_data[current_data['STRUKTUR']=='Boden']

        # make geometry valid to avoid TopologyExceptions (compare ST_MakeValid in PostGIS)
        # use buffer 0 to make geometry valid
        # use buffer 0.0001 to close sliver/ holes afters dissolve
        # use buffer 0.02 to close also larger sliver/ holes within the building geometries after dissolve
        # use buffer 0.05 to close also larger sliver/ holes within the building geometries after dissolve
        gdf_selection['geometry'] = gdf_selection.geometry.buffer(0.05)

        # dissolve by 'OBJEKT_ID'
        # https://www.earthdatascience.org/workshops/gis-open-source-python/dissolve-polygons-in-python-geopandas-shapely/
        gdf_dissolved = gdf_selection.dissolve(by='OBJEKT_ID')

        # OBJEKT_ID from index to column
        

        gdf_dissolved['OBJEKT_ID'] = gdf_dissolved.index
        gdf_dissolved = gdf_dissolved.reset_index(drop=True)


        #print(gdf_dissolved.head())


        sel_current_data = gdf_dissolved[['OBJEKT_ID', 'HAUSNUMMER', 'STRASSE', 'ORTSAMT', 'PLZ']]
        #print(sel_current_data.head(20))
        #data_blds_adresses = data_blds_adresses.append(sel_current_data, ignore_index=True)
        #data_blds_adresses = pd.concat([data_blds_adresses, sel_current_data], ignore_index=True)

        for index, row in sel_current_data.iterrows():
            dict_list.append({'OBJEKT_ID':row['OBJEKT_ID'], 'HAUSNUMMER':row['HAUSNUMMER'], 'STRASSE':row['STRASSE'], 'ORTSAMT':row['ORTSAMT'], 'PLZ':row['PLZ']})
            #print(dict_list)

            print('Zähler Zeilen Insgesamt: ' + str(zaehler_row_total), end="\r")
            zaehler_row_total = zaehler_row_total + 1

        del current_data, sel_current_data
    else:
        continue
#print(data_blds_adresses.head())
data_blds_adresses = pd.DataFrame.from_dict(dict_list)
print('-----------------------------------------------')
print('Output fused building tiles into one DataFrame')
data_blds_adresses.info()
print(data_blds_adresses.head())
print('-----------------------------------------------')


""" print(str(strftime("%Y_%m_%d-%H_%M_%S", gmtime())) + '  reading gebaeude_stadt_dresden_gesamt_mai2023_repair.csv')  
data_blds_adresses = pd.read_csv(r'output/cc/gebaeude_stadt_dresden_gesamt_mai2023_repair.csv', delimiter=',', encoding='utf-8')
print(data_blds_adresses.head())
data_blds_adresses.info() """

# import table for matching building IDs of Colouring Dresden with source IDs 
print(str(strftime("%Y_%m_%d-%H_%M_%S", gmtime())) + '  reading bld_geometry_id_source_id.csv')  
data_matching_table = pd.read_csv(r'output/cc/bld_geometry_id_source_id.csv', delimiter=';', encoding='utf-8')
print(data_matching_table.head())
data_matching_table.info()

# merge both files by source_id , keeping only relevant columns

data_matching_table = data_matching_table.rename(columns={'source_id': 'OBJEKT_ID'})
data_matching_table.info()


inner_merged_total = pd.merge(
     data_blds_adresses, data_matching_table, on=["OBJEKT_ID"]
)
print(inner_merged_total.shape)
print(inner_merged_total.head())
inner_merged_total.info()

# --------------------------------
# start session to API with login
# --------------------------------






# --------------------------------
# iterate over all items
# build request data
# request POST to edit the data
# --------------------------------
counter_buildings_with_adress = 0
for index, row in inner_merged_total.iterrows():
    #time.sleep(0.25)
    # check if adress is given for the current building
    # to reduce number of POST requests
    # only 64516 of 135598 buildings containt a postal adress
    if pd.isnull(row['HAUSNUMMER']) == False:
        counter_buildings_with_adress = counter_buildings_with_adress + 1

        data_upload = json.loads(json.dumps(make_row(row['HAUSNUMMER'],row['STRASSE'],row['ORTSAMT'],row['PLZ'])))
        #data_upload = json.loads(json.dumps(make_row(row['HAUSNUMMER'],'',row['ORTSAMT'],'')))

        res1, res2, res3 = update_building(row['geometry_id'], data_upload, apikey, api_url, headers, data_login)
        #print(res1)
        #print(res2)
        #print(res3)
        print(counter_buildings_with_adress, end="\r")  


  

print(counter_buildings_with_adress)    




#data_upload = json.loads('{"attributes":{"location_number":"TESTDATA", "location_street":"TESTDATA", "location_town":"TESTDATA", "location_postcode":"TESTDATA", "location_name":"TESTDATA"},"user_attributes":{}}')
#building_id = 41106

#data_upload = json.loads('{"building_attachment_form": "Detached"}')
#api_url = r''
#apikey = ''
#building_id = 2484765



""" with requests.Session() as session:
    headers = {
           "api_key":apikey}
    data_login = {'username':'xxx', 'password':'xxx'}
    
    print(api_url + '/api/login')
    post = session.post(api_url + '/api/login', headers=headers, json=data_login)
    print(post.text)
    print('---------------------')


    r = session.post(
        "{}/api/buildings/{}.json".format(api_url, building_id),
        params={'api_key': apikey},
        json=data_upload
    )
    print(r.status_code)
    print(r.text)
    print(r.json()) """

