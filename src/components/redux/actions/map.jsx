import _ from 'lodash';
import * as mapHelper from '../../../utils/MapHelper';
import * as actionType from '../types';

const isDev = process.env.NODE_ENV === 'development';

const createAction = (type = null, payload = {}, meta = {}) => ({
  type,
  payload,
  meta,
});

/**
* Defines action for when a new autocomplete result is chosen.
*
* marker      - The marker object.
* id          - The id that uniquely describes the place.
* markerType  - The type of marker.
*/
export const changePlace = (marker, id, markerType) => {
  const action = createAction();
  action.type = actionType.MARKER_CHANGE_PLACE;
  action.payload = {
    marker,
    id,
  };
  action.meta = { type: markerType };
  return action;
};

/**
* Defines action to toggle the info window.
*
* clickedId - The unique identifier for the marker clicked.
* currentId - The unique identifeir for the currently selected marker.
*/
export const toggleMarkerIW = (clickedId, currentId) => {
  const action = createAction();
  action.type = actionType.MARKER_TOGGLE_IW;
  action.payload = {
    clickedId,
    currentId,
  };
  return action;
};

/**
* Defines action to remove all marker favorites.
*/
export const removeAllFavorites = () => {
  const action = createAction();
  action.type = actionType.MARKER_REMOVE_ALL;
  return action;
};

/**
* Defines action to remove all marker favorites.
*
* markers  - Array of marker objects.
*/
export const addMarkers = (markers) => {
  const action = createAction();
  action.type = actionType.MARKER_ADD_ALL;
  action.payload = { markers };
  return action;
};

/**
* Defines action to update a marker when its favorited.
*
* details   - The info window details.
* type      - The maker type (db or autocomplete).
* id        - The unique identifier for the marker.
* callback  - Callback handle to favorite/unfavorite markers.
*/
export const updateMarkerOnSave = (details, type, id, callback) => {
  const action = createAction();
  action.type = actionType.MARKER_UPDATE_ON_SAVE;
  action.payload = {
    content: mapHelper.buildInfoWindow(details, evt => callback(evt, id), true),
    type,
    id,
  };
  return action;
};

/**
* Defines action to update a marker when its favorited.
*
* placeDetails  - The info window details.
* place         - The googl map place result.
*                 https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
* callback      - Callback handle to favorite/unfavorite markers.
*/
export const saveFavorite = (placeDetails, place, callback) => (dispatch) => {
  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });

  const body = JSON.stringify({
    placeDetails,
    type: 'db',
    place: {
      location: place.geometry.location,
      placeId: place.place_id,
    },
    showInfoWindow: false,
    maxWidth: 180,
  });

  const init = {
    method: 'post',
    headers,
    body,
  };

  fetch(new Request(`${process.env.API}/markers`, init))
  .then((response) => {
    if (response.ok) {
      dispatch(updateMarkerOnSave(placeDetails, 'db', place.place_id, callback));
      if (isDev) console.log('SUCCESS: Marker Saved.');
    } else {
      throw Error(response.statusText);
    }
  })
  .catch((err) => {
    console.log('ERROR: Could not save marker.', err);
  });
};

/**
* Defines action to remove a favorited marker.
*
* placeDetails  - The info window details.
* place         - The googl map place result.
*                 https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
* callback      - Callback handle to favorite/unfavorite markers.
*/
export const removeFavorite = id => (dispatch) => {
  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });

  const init = {
    method: 'get',
    headers,
  };
    // Find favorite.
  fetch(new Request(`${process.env.API}/markers?place.placeId=${id}`, init))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw Error(response.statusText);
    })
    .then((responseJson) => {
      const marker = responseJson[0];
      init.method = 'delete';
      // Delete favorite.
      fetch(new Request(`${process.env.API}/markers/${marker.id}`, init))
      .then((response) => {
        if (response.ok) {
          dispatch(createAction(actionType.MARKER_REMOVE, { id }));
          if (isDev) console.log(`SUCCESS: Marker ${marker.id}, deleted.`);
        } else {
          throw Error(response.statusText);
        }
      });
    })
    .catch((err) => {
      console.log('ERROR: Could not remove marker.', err);
    });
};

/**
* Defines action to get all favorites.
*
* callback      - Callback handle to favorite/unfavorite markers.
*/
export const getFavorites = callback => (dispatch) => {
  fetch(`${process.env.API}/markers`)
    .then((response) => {
      if (response.ok) return response.json();
      throw Error(response);
    })
    .then((markers) => {
      const newMarkers = [...markers];
      _.forEach(markers, (value, key) => {
        newMarkers[key].infoWindowContent = mapHelper.buildInfoWindow({
          formatted_phone_number: newMarkers[key].placeDetails.formatted_phone_number,
          website: newMarkers[key].placeDetails.website,
          name: newMarkers[key].placeDetails.name,
          rating: newMarkers[key].placeDetails.rating,
        },
        evt => callback(evt, newMarkers[key].place.placeId),
        true);
      });
      dispatch(addMarkers(newMarkers));
      if (isDev) console.log('SUCCESS: Markers retrieved.');
    })
    .catch((err) => {
      console.log('ERROR: Could not fetch data', err);
    });
};
