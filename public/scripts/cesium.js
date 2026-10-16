async function setupCesium()
{
    Cesium.Ion.defaultAccessToken = '';

    const viewer = new Cesium.Viewer('map', {
        baseLayer: new Cesium.ImageryLayer(new Cesium.OpenStreetMapImageryProvider({
            url: 'https://tile.openstreetmap.org/',
            maximumLevel: 19
        })),
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        baseLayerPicker: false,
        geocoder: false,
        animation: false,
        timeline: false,
        requestRenderMode: true,
        homeButton: false,
        navigationInstructionsInitiallyVisible: false,
        fullscreenElement: 'map'
    });

    const response = await fetch('../data/map.kml');
    const kml = new DOMParser().parseFromString(await response.text(), 'text/xml');

    // Keep the KML colors and use the same local marker as OpenLayers.
    const markerUrl = new URL('../images/marker.svg', window.location.href).href;
    kml.querySelectorAll('Icon href').forEach(function(icon) {
        icon.textContent = markerUrl;
    });
    kml.querySelectorAll('hotSpot').forEach(function(anchor) {
        anchor.setAttribute('x', '0.5');
        anchor.setAttribute('y', '0');
        anchor.setAttribute('xunits', 'fraction');
        anchor.setAttribute('yunits', 'fraction');
    });

    const data = await Cesium.KmlDataSource.load(kml, {
        camera: viewer.scene.camera,
        canvas: viewer.scene.canvas,
        clampToGround: true
    });
    viewer.dataSources.add(data);

    const positions = Array.from(kml.querySelectorAll('coordinates')).flatMap(function(node) {
        return node.textContent.trim().split(/\s+/).map(function(coordinate) {
            const [longitude, latitude, height] = coordinate.split(',').map(Number);
            return Cesium.Cartesian3.fromDegrees(longitude, latitude, height || 0);
        });
    });
    const bounds = Cesium.BoundingSphere.fromPoints(positions);
    const view = new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-55), bounds.radius * 3);
    const rectangle = Cesium.Rectangle.fromCartesianArray(positions);
    const padding = Math.max(rectangle.width, rectangle.height) * 0.1;
    rectangle.west -= padding;
    rectangle.east += padding;
    rectangle.south -= padding;
    rectangle.north += padding;

    function showAll(duration)
    {
        if (viewer.scene.mode === Cesium.SceneMode.SCENE2D)
            viewer.camera.flyTo({ destination: rectangle, duration: duration });
        else
            viewer.camera.flyToBoundingSphere(bounds, { offset: view, duration: duration });
    }

    document.getElementById('show-all').addEventListener('click', function() {
        showAll(1);
    });
    viewer.scene.morphComplete.addEventListener(function() { showAll(0); });
    showAll(0);
}

setupCesium();
