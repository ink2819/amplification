# Amplification Archive Map

A spatial interface for exploring the [Amplification Project’s](https://www.theamplificationproject.org/) digital archive.

This project is a narrative-driven interactive web map built with Leaflet, visualizing 76 artworks from the Amplification Project archive based on associated geographic metadata. It is structured on the [leaflet-sidebar-v2](https://github.com/noerw/leaflet-sidebar-v2) template. The map enables users to explore artworks by geographic reference—whether that's the site of creation, exhibition, or thematic relevance.

## Updating and Integration

The project supports ongoing updates by allowing maintainers of the map or Amplification Project web development team to replace the map’s dataset with a new CSV export. This process transforms and aggregates raw data into a format suitable for mapping (based on the structure of a sample export provided by the archive’s web developer).

To simplify this process, a Jupyter notebook (`data_formatter.ipynb`) is included for data cleaning and reformatting. The notebook contains markdown explanations for each transformation step, allowing non-technical collaborators or future maintainers to understand and troubleshoot as needed. (This notebook is currently in progress.)

### Update Workflow

1. Replace the existing `artworks.csv` file with the new CSV export from the Amplification archive.
2. Open and run `data_formatter.ipynb` to generate a cleaned dataset (`cleaned_data.csv`).
3. Launch `index.html` to render the updated map.

## Repository Structure

```text
AMPLIFICATION/
├── css/
│   ├── customstyles.css             # Custom css I modified for the map
│   ├── leaflet-sidebar.css          # in-template css
│   └── leaflet-sidebar.min.css      # in-template css
├── js/
│   ├── customScript.js              # Custom js I created for the map
│   ├── leaflet-sidebar.js           # in-template js
│   └── leaflet-sidebar.min.js       # in-template js
├── data/
│   ├── artworks.csv                 # Raw dataset used for mapping
│   ├── data_formatter.ipynb         # Script to re-format data for the map
│   ├── cleaned_data_{{date}}.csv    # Cleaned dataset (generated from the script*with 1~2manual clean up*)
│   ├── countryCords.csv             # Country/State coordinate lookup for the connecting lines
│   ├── countryList_alts.csv         # RegionList with alterations
│   └── stateList.csv                # List of state names 
├── mapLayers/
│   ├── countries.geojson            #countries shape files
│   ├── state.json                   #states shape files
├── scss/
│   ├── _base.scss
│   └── leaflet-sidebar.scss
├── index.html                       # the map
└── README.md                        

```

## Acknowledgements

Artworks Data: [Amplification Project](https://www.theamplificationproject.org/)
Leaflet Template: [leaflet-sidebar-v2](https://github.com/noerw/leaflet-sidebar-v2)
Countries Shapefile: [datasets/geo-countries](https://github.com/datasets/geo-countries/blob/b0b7794e15e7ec4374bf183dd73cce5b92e1c0ae/data/countries.geojson)
States Shapefile:[loganpowell/census-geojson](https://github.com/loganpowell/census-geojson/blob/master/GeoJSON/20m/2022/state.json)
Country/State Coordinates: Manually aggregated from [Google Open Data] (https://developers.google.com/public-data)
Country Names: [umpirskycountry-list](https://github.com/umpirsky/country-list) + Manual Modification

Debug and Trouble shooting: ChatGPT 04-mini-high

## Project Workflow
- **Cleaning**  
  - Created `data_formatter.ipynb` to extract country/state names, reformat fields and append image links  
  - Output `cleaned_data_{{date}}.csv`  
  - Manually remove two dummy/test entries and fix any parsing errors  

- **Mapping**  
  - Load cleaned CSV and GeoJSON layers into `index.html`  
  - Configure base map, state and country highlight layers  
  - Populate sidebar with artwork cards  

- **Interactions**  
  - Integrate click handlers: region → open sidebar menu  
  - Draw dashed lines connecting the clicked region to all related regions  
  - After UX testing & in-class feedback:  
    - Added tooltips showing region name and artwork count  
    - Implemented hover effect to lower fill opacity on hover  
    - Added new field in each data card listing all associated regions  

- **Documentation**  
  - Write README with file structure and usage instructions
  - After in-class and assignment feedback:  
    - Changed data from source urls to local files
    - Improved file structure explanation
    - Separated inline styles/scripts of my original work from the templates into `css/customstyles.css` and `js/customScript.js`
