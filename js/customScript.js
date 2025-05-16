
    const map = L.map("map", { zoomControl: false }).setView([41, -74], 3);
    const highlightColor = "#508e88";
    const connectionLines = L.layerGroup().addTo(map);
    const sidebar = L.control.sidebar({ container: "sidebar", position: "left" }).addTo(map).open("about");
    const sidebarMenu = document.querySelector("#home .sidebar-menu");

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; Stadia Maps, OpenMapTiles & OpenStreetMap',
      maxZoom: 20
    }).addTo(map);

    const works = [];
    const locationLookup = {};

    function loadLocationCoords() {
      return new Promise(resolve => {
        Papa.parse('./data/countryCords.csv', {
          header: true,
          download: true,
          complete: function(results) {
            results.data.forEach(row => {
              if (row.name && row.latitude && row.longitude) {
                locationLookup[row.name.trim()] = [
                  parseFloat(row.latitude),
                  parseFloat(row.longitude)
                ];
              }
            });
            resolve();
          }
        });
      });
      }

    function loadWorksAndLayers() {
      Papa.parse('./data/cleaned_data_2025-05-07.csv', {
        header: true,
        download: true,
        complete: function(results) {
          results.data.forEach(row => {
          const states = Object.keys(row)
            .filter(k => k.startsWith("state") && row[k])
            .map(k => row[k]);

          console.log(`States for "${row.Title}":`, states);

          const entry = {
            title: row.Title,
            author: row.Author,
            publishedOn: row["Date of Creation"],
            slug: row.Slug,
            img: row["Main Image / Cover"],
            countries: Object.keys(row)
              .filter(k => k.startsWith("country") && row[k] && !["United States", "United States of America"].includes(row[k]))
              .map(k => row[k]),
            states: states
          };

          works.push(entry);
          });
          const regionCounts = {};
          works.forEach(work => {
            work.countries.forEach(c => regionCounts[c] = (regionCounts[c]||0) + 1);
            work.states   .forEach(s => regionCounts[s] = (regionCounts[s]||0) + 1);
          });

          loadShapeLayers(regionCounts);
        }
      });
    }

    function loadShapeLayers(regionCounts) {
  fetch('./mapLayers/countries.geojson')
    .then(res => res.json())
    .then(countryData => {
      const countryLayer = L.geoJSON(countryData, {
        filter: feature =>
          feature.properties.name !== "United States" &&
          feature.properties.name !== "United States of America",

        style: feature => {
          const name  = feature.properties.name;
          const count = regionCounts[name] || 0;
          return {
            fillColor:   count > 0 ? highlightColor : 'transparent',
            color:       '#ccc',
            weight:      1,
            fillOpacity: count > 0 ? 0.8 : 0
          };
        },

        onEachFeature: (feature, layer) => {
          const name  = feature.properties.name;
          const count = regionCounts[name] || 0;

          layer.bindTooltip(`${name}: ${count} artwork${count !== 1 ? 's' : ''}`, {
            sticky: true,
            direction: 'auto'
          });

          if (count > 0) {
            layer.on('mouseover', () => {
              layer.setStyle({ fillOpacity: 0.5 });
            });
            layer.on('mouseout', () => {
              countryLayer.resetStyle(layer);
            });
          }

          layer.on('click', () => showWorksByRegion(name));
        }
      }).addTo(map);
    });

  fetch('./mapLayers/state.json')
    .then(res => res.json())
    .then(stateData => {
      const stateLayer = L.geoJSON(stateData, {
        style: feature => {
          const name  = feature.properties.NAME;
          const count = regionCounts[name] || 0;
          return {
            fillColor:   count > 0 ? highlightColor : 'transparent',
            color:       '#ccc',
            weight:      1,
            fillOpacity: count > 0 ? 0.8 : 0
          };
        },

        onEachFeature: (feature, layer) => {
          const name  = feature.properties.NAME;
          const count = regionCounts[name] || 0;

          layer.bindTooltip(`${name}: ${count} artwork${count !== 1 ? 's' : ''}`, {
            sticky: true,
            direction: 'auto'
          });

          if (count > 0) {
            layer.on('mouseover', () => {
              layer.setStyle({ fillOpacity: 0.5 });
            });
            layer.on('mouseout', () => {
              stateLayer.resetStyle(layer);
            });
          }

          layer.on('click', () => showWorksByRegion(name));
        }
      }).addTo(map)
       .bringToFront(); 
    });
}


    function showWorksByRegion(regionName) {
      sidebarMenu.innerHTML = `<h4>Works in ${regionName}</h4>`;
      connectionLines.clearLayers();

      const matched = works.filter(work =>
        work.states.includes(regionName) || work.countries.includes(regionName)
      );

      if (matched.length === 0) {
        sidebarMenu.innerHTML += "<p class='lorem'>No works found in this region.</p>";
        return;
      }

      matched.forEach(work => {
        const card = document.createElement("div");
        card.className = "sidebar-card";
        card.innerHTML = `
          <a href="https://www.theamplificationproject.org/projects/${work.slug}" target="_blank">
            <img src="${work.img}" alt="${work.title}">
            <strong>${work.title}</strong><br/>
            <em>By ${work.author}</em><br/>
            <small> ${work.publishedOn}</small><br/>
            <small> Associated Regions: ${work.states} ${work.countries}</small>
          </a>
        `;
        sidebarMenu.appendChild(card);

        const linkedPlaces = [...work.states, ...work.countries]
          .filter(name => name !== regionName && locationLookup[name]);

        linkedPlaces.forEach(dest => {
          const from = locationLookup[regionName];
          const to = locationLookup[dest];
          if (from && to) {
            const line = L.polyline([from, to], {
              color: highlightColor,
              weight: 1.5,
              opacity: 0.6,
              dashArray: "4"
            });
            connectionLines.addLayer(line);
          }
        });
      });

      sidebar.open("home");
    }

    loadLocationCoords().then(loadWorksAndLayers);
 