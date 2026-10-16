function setupOpenLayers()
{
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: '../data/map.kml',
                    format: new ol.format.KML({
                        iconUrlFunction: () => '../images/marker.svg'
                    })
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([24.7535, 59.4370]),
            zoom: 13
        })
    });

    map.addControl(new ol.control.ScaleLine());

    const popupDiv = document.createElement('div');
    popupDiv.id = 'object-name';

    const popup = new ol.Overlay({ element: popupDiv });
    map.addOverlay(popup);

    map.on('click', function(event) {
        const feature = map.forEachFeatureAtPixel(event.pixel, feature => feature);
        popupDiv.textContent = feature ? feature.get('name') || 'Objekt' : '';
        popup.setPosition(feature ? event.coordinate : undefined);
    });
}

setupOpenLayers();
