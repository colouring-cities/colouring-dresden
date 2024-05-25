# Open Data Camp 2024 in Dresden

A warm welcome to the Open Data Camp 2024 in Dresden and to the Colouring Dresden project!

The project Colouring Dresden is organised  by the [**Leibniz-Institute of Ecological Urband Regional Development (IOER)**](https://www.ioer.de/projekte/colouring-dresden) and its partners.
It is a part of the global [**Colouring Cities Research Programme (CCRP)**](https://colouringcities.org/).

## Challenge

Colouring Dresden is a part of the challenge "Digitaler Energiezwilling für Dresden" and offers the opportunity:
- to use a dataset containing crowd-sourced collected building attributes
  - dataset on Zenodo: [**Crowd-sourced collected building attributes of the Colouring Dresden project (from 06 March 2023 to 01 October 2023)**](https://zenodo.org/records/10653065)
- to code new features within the Colouring Dresden platform (like implementing new map styles e.g. on building level, integrate and link different datasets, classify buildings into energy classes etc)
    - source code [on GitHub](https://github.com/colouring-cities/colouring-dresden), please use branch "opendatacamp2024"
    - [docs](https://github.com/colouring-cities/colouring-dresden/tree/opendatacamp2024/docs/opendatacamp2024)


Challenge description (in german) see on website of the ODC: https://www.dresden.de/de/wirtschaft/wirtschaftsstandort/projekte-kooperationen/open-data-camp-2024.php


## About Colouring Dresden

- Goal is to collect attributes for each building, like age, number of storeys, material
- collecting a more precise dataset to describe buildings and to fill current gaps in existing datasets
- make spatial modeling easier e.g. for AI prediction algorithm, for research or planning in the fields of climate adaption (flooding, heavy rain indicents, heat) or climate change (energy, reduction of CO2, ...)
- everybody can contribute, just creating an account
- Tutorial How to Map: https://colouring.dresden.ioer.info/mitmachen
- part of international research network Colouring Cities Research Programme (CCRP)


### Data categories
- All building attributes (about 40) are assigned to a thematic category (so-called "tiles")
- currently, seven are in use. Further will be enabled in future

![categories of Colouring Dresden](images/categories.png)
- documentation of categories see: https://colouring.dresden.ioer.info/kacheln
- energy category is currently in progress, see reserach project "Building Trust" https://colouring.dresden.ioer.info/buildingtrust

### Further material
- Platform: https://colouring.dresden.ioer.de/
- Project page: https://colouring.dresden.ioer.info/
- CCRP Landing page: https://colouringcities.org/
- CCRP Manual / Wiki: https://github.com/colouring-cities/manual/wiki
- Documents on Zenodo (e.g. protocolls, slides, posters): [on Zenodo](https://zenodo.org/communities/ioer_dresden/search?page=1&size=20&q=&keywords=Colouring%20Dresden) --> search "Colouring Dresden" within IOER community
- X / Twitter: https://twitter.com/colouringdd
- Instagram: https://www.instagram.com/colouringdd/


## How to contribute in the challenge?
### Dataset (with crowd-sourced collected building information)
usage of a dataset containing crowd-sourced collected building attributes
  - dataset on Zenodo: [**Crowd-sourced collected building attributes of the Colouring Dresden project (from 06 March 2023 to 01 October 2023)**](https://zenodo.org/records/10653065)

### Coding new features in platform 
Coding new features within the Colouring Dresden platform (like implementing new map styles e.g. on building level, integrate and link different datasets, classify buildings into energy classes etc)
    - source code [on GitHub](https://github.com/colouring-cities/colouring-dresden), please use branch "opendatacamp2024"
    - [docs](https://github.com/colouring-cities/colouring-dresden/tree/opendatacamp2024/docs/opendatacamp2024)
#### Software architecture
![software architecture of Colouring Dresden](images/architecture.png)

#### Setting up a local dev environment

[Workflow to set up dev environment by importin image file of Ubuntu-VM / VirtualBox](setup_import_vm.md)

[Workflow to set up dev environment in a VirtualBox Ubuntu-VM from scratch using a DB Dump](setup_create_new_vm.md)



### Data model
for data model in database see here:
[Data model database](https://user-images.githubusercontent.com/899988/219654125-32fe21f8-4b3b-425c-868f-c507870cbe06.png) 

### Adding new attributes
- care about
  - adding column in ´buildings´ database table / migrations
  - adding new attributes to API 
  - adding new mapstyle for map renderer
- workflow see [here](https://github.com/colouring-cities/colouring-core/blob/master/docs/adding-new-fields.md)


### Adding new builing attributes to API
- add new field in: app/src/api/config/dataFields.ts
**for simple datatype field like numeric or varchar**
```bash
name_attribute: {
    edit: true,
    verify: true
},
```
**for building attribute as JSONB datatype**
```bash
name_attribute: {
    edit: true,
    verify: false,
    asJson: true,
    sqlCast: 'jsonb'
},
```
- add new attribute to datafield config
app/src/frontend/config/data-fields-config.ts

IMPORTANT: energy category always is labeld as **sutainability** in the source code!

for a attribute with select / DropDown to only use pre-defined values:
```bash
    name_attribute: {
        category: Category.Sustainability,
        title: "Wohnungsgröße",
        tooltip: "Wie groß ist Ihre Wohnung?",
        example: "",
        items: [
            "0-20qm",
            "20-40qm",
            "40-60qm",
            "60-80qm",
            "80-100qm"
        ]
    },
```
for a normal string or numeric datatype attribute:
```bash
    name_attribute: {
        category: Category.Sustainability,
        title: "xxx",
        tooltip: "Hinweistext bei Klick auf das I",
        example: "",
    },

```

### add new building map style for new attributes

- add map legend incl. colour boxes of legend:
app/src/frontend/config/category-maps-config.ts

- add new map style to XML (compare syntax from Mapnik or Geoserver)
app/map_styles/polygon.xml

- add new map style to config list of tile renderer / Mapnik
app/src/frontend/config/tileserver-config.ts

- select data from database with SQL query, e.g. do some calc in database 
```bash
SELECT col_A / col_b * col_C AS "coefficient" 
FROM buildings 
WHERE col_A IS NOT NULL;
```
in
app/src/tiles/dataDefinition.ts


### API endpoints
check files in app/src/api/routes

(sorry, that openapi doc is outdated, should be updated soon!)