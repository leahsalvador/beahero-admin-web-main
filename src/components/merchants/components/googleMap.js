import React from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
const GOOGLE_MAPS_APIKEY = process.env.REACT_APP_GOOGLE_API_KEY;

function GoogleMap(props) {
  const { location, setLocation } = props;

  const geoCodeReverse = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((response) => response.json())
        .then((responseData) => {
          return resolve(responseData.results[0]);
        });
    }).catch((err) => console.log('err', err));
  };

  const onMapClick = async (props, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    const address = await geoCodeReverse(lat, lng);

    setLocation({
      title: 'Pinned Location',
      name: address && address.formatted_address,
      position: { lat, lng },
      address: address && address.formatted_address,
    });
  };

  const handleMapReady = (mapProps, map) => {
    map.setOptions({
      draggableCursor: 'default',
      draggingCursor: 'pointer',
    });
  };

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(function (position) {
  //     setCurrentLocation({
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude,
  //     });
  //   });
  // }, []);

  // Object.keys(currentLocation).length > 0 &&
  // currentLocation.constructor === Object &&
  // console.log("currentLocation", currentLocation)

  console.log('location', location);

  const handleCenter = () => {
    return location &&
      location.position &&
      location.position.lat === 0 &&
      location.position.lng === 0
      ? { lat: 15.8949, lng: 120.2863 }
      : location && location.position
      ? location.position
      : { lat: 15.8949, lng: 120.2863 };
  };

  return (
    <>
      {
        <Map
          google={props.google}
          zoom={10}
          onClick={onMapClick}
          center={handleCenter()}
          initialCenter={handleCenter()}
          onReady={handleMapReady}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          {Object.keys(location).length > 0 &&
            location.constructor === Object && (
              <Marker
                title={location.title}
                name={location.name}
                position={location.position}
              />
            )}
        </Map>
      }
    </>
  );
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
})(GoogleMap);
