var map;
var overlay;

var filter = '';
var filterForm = document.querySelector('#map-filter form');
filterForm.addEventListener('change', () => { updateFilter(); toggleOverlay(); toggleOverlay(); });

function updateFilter() {
    const formData = new FormData(filterForm);
    filter = Object.keys(Object.fromEntries(formData.entries())).join(',');
    console.log(filter);
}

updateFilter();

function initMap() {

    const args = {
        // center: { lat: 43.062840, lng: -2.493579 }, //Mondra
        // center: { lat: 43.306613, lng: -2.386335 }, //Mutr
        // center: { lat: 43.3067104, lng: -2.68408302 }, //Gern
        center: { lat: 40.7659477020942, lng: -111.96443036083478 }, //Salt City
        zoom: 15,
        zoomControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: 'satellite',
        scaleControl: false,
    }
    map = new google.maps.Map(document.querySelector(".map-frame"), args);

    overlay = new google.maps.ImageMapType({
        getTileUrl: function (tileCoord, zoom) {
            let bounds = MERCATOR.getTileBounds({ x: tileCoord.x - 1, y: tileCoord.y + 1, z: zoom });
            let lat = bounds.ne.lat + (bounds.ne.lat - bounds.sw.lat) / 2;
            let lng = bounds.ne.lng + (bounds.ne.lng - bounds.sw.lng) / 2;

            return `https://node.ecrop.ddns.net/process-image?api-key=uwu&center=${lat},${lng}&filter=${filter}`;
        },
    });

    overlay.setOpacity(0.6);
    map.overlayMapTypes.setAt(0, overlay);
}

function toggleOverlay() {
    map.overlayMapTypes.setAt(0, map.overlayMapTypes.getAt(0) ? null : overlay);
}

function loadMap() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA2pN0zoKDJLsPxCwfwWye92tKDCrkCXfw&callback=initMap&v=weekly";
    script.classList.add('injected');
    document.querySelector('head').append(script);
}

loadMap();

async function fetchImg() {
    const req = await fetch(`https://node.ecrop.ddns.net/process-image?api-key=uwu&center=${map.getCenter().lat()},${map.getCenter().lng()}`);
    const blob = await req.blob();
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    document.querySelector('main').append(img);
    console.log(map.getCenter().lat(), map.getCenter().lng());

}

var MERCATOR = {
    fromLatLngToPoint: function (latLng) {
        var siny = Math.min(Math.max(Math.sin(latLng.lat * (Math.PI / 180)),
            -.9999),
            .9999);
        return {
            x: 128 + latLng.lng * (256 / 360),
            y: 128 + 0.5 * Math.log((1 + siny) / (1 - siny)) * -(256 / (2 * Math.PI))
        };
    },

    fromPointToLatLng: function (point) {

        return {
            lat: (2 * Math.atan(Math.exp((point.y - 128) / -(256 / (2 * Math.PI)))) -
                Math.PI / 2) / (Math.PI / 180),
            lng: (point.x - 128) / (256 / 360)
        };

    },

    getTileAtLatLng: function (latLng, zoom) {
        var t = Math.pow(2, zoom),
            s = 256 / t,
            p = this.fromLatLngToPoint(latLng);
        return { x: Math.floor(p.x / s), y: Math.floor(p.y / s), z: zoom };
    },

    getTileBounds: function (tile) {
        tile = this.normalizeTile(tile);
        var t = Math.pow(2, tile.z),
            s = 256 / t,
            sw = {
                x: tile.x * s,
                y: (tile.y * s) + s
            },
            ne = {
                x: tile.x * s + s,
                y: (tile.y * s)
            };
        return {
            sw: this.fromPointToLatLng(sw),
            ne: this.fromPointToLatLng(ne)
        }
    },
    normalizeTile: function (tile) {
        var t = Math.pow(2, tile.z);
        tile.x = ((tile.x % t) + t) % t;
        tile.y = ((tile.y % t) + t) % t;
        return tile;
    }

}