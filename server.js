const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

const pages = {
    '/': 'index.html',
    '/leaflet': 'leaflet.html',
    '/openlayers': 'openlayers.html',
    '/cesium': 'cesium.html',
    '/comparison': 'comparison.html'
};

for (const route in pages)
{
    const file = pages[route];
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'views/' + file));
    })
}

app.listen(port, () => {
    console.log(`Server: http://localhost:${port}`);
});
