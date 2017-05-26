import _ from 'lodash';
import * as actionType from '../types';

const findMarkerIdxByPlaceId = (markers, target) => _.findIndex(
  markers, marker => marker.place.placeId === target);
/**
* toggleMarkerIW will identify the clicked and current markes in the state, then toggle the
* the clicked markers info window show state. If there there is another marker with its
* info window open it will close that window.
*/
const toggleMakerIW = (state, action) => {
  const newMarkers = [...state.markers];

  // Find the clicked marker to toggle in the state.
  const clickedMarkerIdx = findMarkerIdxByPlaceId(newMarkers, action.payload.clickedId);
  if (clickedMarkerIdx < 0) return state; // Danger Will Robinson, abort!

  // Find the current marker in the state
  const currentMarkerIdx = findMarkerIdxByPlaceId(newMarkers, action.payload.currentId);

    // Toggle the clicked marker
  newMarkers[clickedMarkerIdx].showInfoWindow = !newMarkers[clickedMarkerIdx].showInfoWindow;

    // If there exists a curent marker that is not the one clicked and its info window is open,
    // then close it.
  if (currentMarkerIdx >= 0
      && action.payload.clickedId !== action.payload.currentId
      && (newMarkers[currentMarkerIdx].showInfoWindow)) {
    newMarkers[currentMarkerIdx].showInfoWindow = false;
  }

  return { ...state, markers: newMarkers, currentMarker: action.payload.clickedId };
};

/**
* mapReducer is responsible for handling dispatched actions that act on maps state.
*/
const mapReducer = (state = { markers: [], currentMarker: null }, action) => {
  switch (action.type) {
    // Sets current marker to new autocomplete marker, opens infowindow and closes any other
    // makrer info windows that are open.
    case actionType.MARKER_CHANGE_PLACE: {
      let newMarkers = [...state.markers];
      const markerIdx = findMarkerIdxByPlaceId(newMarkers, action.payload.id);

      // If marker already exists and the info window is closed, then toggle it.
      if (markerIdx >= 0) {
        if (!newMarkers[markerIdx].showInfoWindow) {
          return toggleMakerIW(state, {
            payload: {
              clickedId: action.payload.id,
              currentId: state.currentMarker,
            },
          });
        }
        return state;
      }
      const currentMarkerIdx = findMarkerIdxByPlaceId(newMarkers, state.currentMarker);
      // If there is a current marker set its info window to close.
      if (currentMarkerIdx >= 0) newMarkers[currentMarkerIdx].showInfoWindow = false;

      // Remove other autocomplete marker if found and push new autocomplete marker into state.
      newMarkers = _.filter(newMarkers, marker => marker.type !== action.meta.type);
      newMarkers.push(action.payload.marker);

      return { ...state, markers: newMarkers, currentMarker: action.payload.id };
    }

    // Update state with new markers.
    case actionType.MARKER_ADD_ALL: {
      const newMarkers = [...state.markers, ...action.payload.markers];
      return { ...state, markers: newMarkers };
    }

    // Remove all markers from state.
    case actionType.MARKER_REMOVE_ALL: {
      return { ...state, markers: [], currentMarker: null };
    }

    // Remove specific marker from state.
    case actionType.MARKER_REMOVE: {
      const newMarkers = _.filter(state.markers,
        marker => marker.place.placeId !== action.payload.id);

      return { ...state, markers: newMarkers, currentMarker: null };
    }

    // Toggle markers infow to show or not show.
    case actionType.MARKER_TOGGLE_IW: {
      return toggleMakerIW(state, action);
    }

    // Update the markers info window content when a marker is favorited.
    case actionType.MARKER_UPDATE_ON_SAVE: {
      const updatedMarkers = [...state.markers];
      const target = findMarkerIdxByPlaceId(updatedMarkers, action.payload.id);
      updatedMarkers[target].infoWindowContent = action.payload.content;
      updatedMarkers[target].type = action.payload.type;

      return { ...state, markers: updatedMarkers };
    }
    default: {
      return state;
    }
  }
};

export default mapReducer;
