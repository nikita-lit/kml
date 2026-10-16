function setupLeafletJS()
{
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const kmlLayer = omnivore.kml('../data/map.kml')
        .on('ready', function() {
            map.fitBounds(kmlLayer.getBounds());

            kmlLayer.eachLayer(function(layer) {
                const name = document.createElement('strong');
                name.textContent = layer.feature?.properties?.name || 'Objekt';
                layer.bindPopup(name);
            });
        })
        .addTo(map);
}

setupLeafletJS();
