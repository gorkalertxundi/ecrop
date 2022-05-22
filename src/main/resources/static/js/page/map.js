let map;

function initMap() {
    const args = {
        center: { lat: 48.714728, lng: -79.998672 },
        zoom: 15,
        zoomControl: true,
        streetViewControl: false,
        mapTypeId: 'satellite'
    }
    map = new google.maps.Map(document.querySelector(".map-frame"), args);
    console.log(map);

    const imageMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            // "https://mts0.google.com/vt/lyrs=s&hl=en&x=" + coord.x + "&y=" + coord.y + "&z=" + zoom;
            let x = coord.x / (2 ** zoom);
            let y = coord.y / (2 ** zoom);
            return `https://node.ecrop.ddns.net/process-image?api-key=uwu&center=${x},${y}`;
        }
    });

    map.overlayMapTypes.push(imageMapType);
}

const loadMap = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyA2pN0zoKDJLsPxCwfwWye92tKDCrkCXfw&callback=initMap&v=weekly";
    script.classList.add('injected');
    document.querySelector('head').append(script);
};

loadMap();

const fetchImg = async () => {
    const req = await fetch(`https://node.ecrop.ddns.net/process-image?api-key=uwu&center=${map.getCenter().lat()},${map.getCenter().lng()}`);	
    const blob = await req.blob();
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    document.querySelector('main').append(img);
}