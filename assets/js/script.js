const placesApiKey = "AIzaSyDg9V3D9j8G7AVVt1E9GiSY8Y_GIq9_hoE";
const johnsKey ="AIzaSyDRxqCXElTKQflYnaYgK0_-nAGX7GSPT5o"
const lat = 32.7767;
const lng = -96.7970;
const KEYWORD ='resturant'
// Testing google.gecoding api;
// fetch(locQueryUrl)
//     .then(function (response) {
//       // TODO: Handle response and check for errors
//     })
//     .then(function (locRes) {
//       // TODO: Update resultTextEl with search query
//       // TODO: Check if results exist, if not, show a message
//     })
//     .catch(function (error) {
//       console.error(error);
//     });



//============================================================end of testing block================================================================
// generates map on page, with given coordinates
let service;
let infowindow;

let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: lat, lng: lng },
    zoom: 8,
    
  });
  nearbySearch(lat,lng,KEYWORD);
  
  
}

initMap();

function nearbySearch(lat,lng,keyword) {
  const url = `https://floating-headland-95050.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${placesApiKey}&location=${lat},${lng}&radius=1500&keyword=${keyword}`;

fetch(url, {
  method: 'GET',
  headers: {
    'Origin': 'https://yourdomain.com',
    'X-Requested-With': 'XMLHttpRequest'
  }
})
.then(function (response){
  return response.json();
})
.then(function (data){
  // console.log(data);
  renderMarkers(data);
})
// .then(response => response.json())
// .then(data => console.log(data))
.catch(error => console.error('Error:', error));

}
function createMarker(place,index) {
  if (!place.results[index].geometry || !place.results[index].geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.results[index].geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.results[index].name || "");
    infowindow.open(map);
  });  
}

function renderMarkers(data){
  let count = 0;
  let i = 0;
  while (count < 5 && i < data.results.length) {
    if(data.results[i].rating > 4.3){
      createMarker(data,i);
      count++;
      i++;
    }
    else if(data.results[i].rating > 4) {
      createMarker(data,i);
      count++;
      i++;

    }
    else{
      i++;
    }
    
  }
}

initMap();



// const Places_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=resturants&location=-34.397,150.644&radius=5m&key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg`;
// let placesHeader = new Headers({
//   "X-Goog-FieldMask" :"cplaces.displayName,places.formattedAddress",
//   "Content-Type" : "application/json",
//   "X-Goog-API-Key": "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",});

// fetch(Places_URL,{
//   headers: {
//     "X-Goog-FieldMask" :"cplaces.displayName,places.formattedAddress",
//     "Content-Type" : "application/json",
//     "X-Goog-API-Key": "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",}})
// .then(function (response) {
//   if(response.ok){
//     console.log(response);
//     return response.jason();
//   }
//   else{
//     console.log('error');
//   }
// })
// // .then(function (locRes) {
// //   // TODO: Update resultTextEl with search query
// //   // TODO: Check if results exist, if not, show a message
// // })
// .catch(function (error) {
//   console.error(error);
// });