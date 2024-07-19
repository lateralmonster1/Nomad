const placesApiKey = "AIzaSyDg9V3D9j8G7AVVt1E9GiSY8Y_GIq9_hoE";
const johnsKey = "AIzaSyDRxqCXElTKQflYnaYgK0_-nAGX7GSPT5o";
const nearbyPlacesKey = "AIzaSyDXuU0_U1U28mH_SLMkz5xk25qc4djTuFI";
// lat/lng variables set location in map for initMap()
let lat = 32.7767;
let lng = -96.797;
const KEYWORD = "resturant";
let map;
let marker;
let geocoder;
let response;

// generates map on page with given coordinates
let service;
let infowindow;

// creates map on page
async function initMap() {
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  // map takes in lat/long coordinates from ("lat" and "lng" variables (defined above)?)
  map = new Map(document.getElementById("map"), {
    center: { lat: lat, lng: lng },
    zoom: 15,
    mapId: "demo",
  });
  marker = new google.maps.Marker({
    map,
  });
  geocoder = new google.maps.Geocoder();

  //   nearbySearch(lat, lng, KEYWORD);
}

initMap();
// runs API search for locations nearby target, defined by same lat-long

function nearbySearch(lat, lng, keyword) {
  const url = `https://floating-headland-95050.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${nearbyPlacesKey}&location=${lat},${lng}&radius=1500&keyword=${keyword}`;

  fetch(url, {
    method: "GET",
    headers: {
      Origin: "https://breannacamacho.github.io/Nomad/",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      renderMarkers(data);
    })

    .catch((error) => console.error("Error:", error));
}
async function createMarker(place, index) {
  if (!place.results[index].geometry || !place.results[index].geometry.location)
    return;

  // const cMarker = new google.maps.Marker({
  //   map,
  //   position: place.results[index].geometry.location,
  //   title: place.results[index].name,
  //   icon: {
  //     url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  //   },
  //   content: pin.element,
  //   gmpClickable: true,
  // });
  // console.log(place.results[index]);
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  infowindow = new InfoWindow();

  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );

  const pin = new PinElement({
    glyph: "V",
    scale: 1.25,
    background: "blue",
    glyphColor: "white"
  });
  const cMarker = new AdvancedMarkerElement({
    position: place.results[index].geometry.location,
    map,
    title: place.results[index].name,
    content: pin.element,
    gmpClickable: true,
  });

  google.maps.event.addListener(cMarker, "click", () => {
    infowindow.setContent(place.results[index].name || "");
    infowindow.open(map);
  });

  // Add a click listener for each marker, and set up the info window.
  cMarker.addListener("click", ({ domEvent, latLng }) => {
    const { target } = domEvent;

    infowindow.close();
    infowindow.setContent(`<p>${cMarker.title}</p>
      <p>Location: ${place.results[index].vicinity}</p>
      <p>Discription: ${place.results[index].types[0]}</p>
      <p>Status: ${place.results[index].business_status}</p>
      <p>Overall User Rating: ${place.results[index].rating}</p>
      <p>Number of Reviews: ${place.results[index].user_ratings_total}</p>
      <a href="https://maps.google.com/?q=${place.results[index].name} ${place.results[index].vicinity}" target="_blank">Check them out on Google Maps</a>`);
    infowindow.open(cMarker.map, cMarker);
  });
}

function renderMarkers(data) {
  let count = 0;
  let i = 0;
  while (count < 10 && i < data.results.length) {
    if (data.results[i].rating >= 4.7) {
      createMarker(data, i);
      count++;
      i++;
    } else if (data.results[i].rating >= 4.5) {
      createMarker(data, i);
      count++;
      i++;
    } else {
      i++;
    }
  }
  console.log(data.results[0]);
}

document.addEventListener("DOMContentLoaded", function () {
  const hotelForm = document.getElementById("hotel-form");
  const mainPageSection = document.getElementById("main-page");
  const landingPageSection = document.getElementById("landing-page");

  hotelForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const hotelInput = document.getElementById("hotel-input").value;
    document.getElementById("location").textContent = hotelInput;

    geocode({ address: hotelInput });

    landingPageSection.classList.add("hide");
    mainPageSection.classList.remove("hide");
  });

  newSearchLink.addEventListener("click", function (event) {
    event.preventDefault();
    mainPageSection.classList.add("hide");
    landingPageSection.classList.remove("hide");
  });

  initMap();
});

// Geocoding API code VVV

// Function to store data in localStorage
function storeData(query) {
  let searchData = JSON.parse(localStorage.getItem("searchResults")) || [];
  searchData.push(query);
  localStorage.setItem("searchResults", JSON.stringify(searchData));
}

function clear() {
  marker.setMap(null);
}

function geocode(request) {
  // clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      // console.log(results);

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      // response.innerText = JSON.stringify(result, null, 2);

      // console.log(results[0].geometry.location.lat());
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      nearbySearch(lat, lng, KEYWORD);

      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

initMap();
