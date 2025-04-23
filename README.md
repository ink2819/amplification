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

---
├── /data
│   └── artworks.json         # Raw data set used for mapping(update this directly)
│   └── data_formatter.ipynb      #script to re-format data for the map
│   └── cleaned_data_{{date}}.csv      #cleaned data (generated from the script)
├── /js
│   └── leaflet-sidebar.js
│   └── leaflet-sidebar.min.js
├── /css
│   └── leaflet-sidebar.css     
│   └── leaflet-sidebar.min.css
├── /scss
│   └── leaflet-sidebar.scss     
│   └── _base.scss
├── index.html                
└── README.md   
---