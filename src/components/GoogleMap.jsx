import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as action from './redux/actions/map';
import Map from './googlemap/Map';
import Marker from './googlemap/Marker';
import AutoComplete from './googlemap/AutoComplete';
import InfoWindow from './googlemap/InfoWindow';
import withScript from './googlemap/withScript';
import * as actionType from './redux/types';
import * as mapHelper from '../utils/MapHelper';

const MARKER_TYPE_AUTOCOMPLETE = Symbol('autocomplete');

// Disable eslint, anonymous HOC default to 'component' when debugging for dispaly name.
// eslint-disable-next-line prefer-arrow-callback
const MapContainer = _.flowRight(withScript)(function container(props) {
  const { onMapMounted, google } = props;
  return (
    <Map
      ref={onMapMounted}
      google={google}
      disableDefaultUI={false}
      disableDoubleClickZoom={false}
    >
      <AutoComplete
        onPlaceChanged={props.onPlaceChanged}
        componentRestrictions={{ country: 'us' }}
      />
      {props.markers.map(marker => (
        <Marker
          key={marker.place.placeId}
          onClick={props.onMarkerClicked}
          place={marker.place}
          placeDetails={marker.placeDetails}
          position={marker.place.location}
        >
          <InfoWindow
            onCloseClick={props.onInfoWindowClosed}
            content={marker.infoWindowContent}
            maxWidth={marker.maxWidth}
            showInfoWindow={marker.showInfoWindow}
            position={marker.place.location}
          />
        </Marker>
      ))}
    </Map>
  );
});
MapContainer.displayName = 'MapContaier';

/**
* Class represents map continer component. This class will manage  all the interactions and state
* with google maps.
*/
class GoogleMap extends React.Component {
  static propTypes = {
    dispatch: T.func.isRequired,
    markers: T.arrayOf(T.object).isRequired,
  };

  static contextTypes = {
    store: T.object,
  }

  /**
  * Lifecycle Method - componentDidMount
  * https://facebook.github.io/react/docs/react-component.html#componentdidmount
  */
  componentDidMount() {
    this.props.dispatch(action.getFavorites(this.handleOnMarkerUnFavorite.bind(this)));
  }

  /**
  * Lifecycle Method - componentWillUnmount
  * https://facebook.github.io/react/docs/react-component.html#componentwillunmount
  */
  componentWillUnmount() {
    this.props.dispatch(action.removeAllFavorites());
  }

  onMapMounted(googleMap) {
    if (!googleMap) return;
    this.googleMap = googleMap;
  }

  // Dispatch action to remove favorite when user clicks unfavorite.
  handleOnMarkerUnFavorite(e, placeId) {
    this.props.dispatch(action.removeFavorite(placeId));
  }

  // Dispatch action to toggle info window when user closes info window.
  handleOnInfoWindowClose(clazzRef) {
    this.props.dispatch(action.toggleMarkerIW(
      clazzRef.props.anchor.getPlace().placeId, null, actionType.TOGGLE_TYPE_INFO_WINDOW));
  }

  // Dispatch action to toggle infow window when user clicks on marker.
  handleOnMarkerClicked(marker) {
    this.props.dispatch(action.toggleMarkerIW(
      marker.getPlace().placeId,
      this.context.store.getState().mapState.currentMarker,
      actionType.TOGGLE_TYPE_MARKER));
  }

  // Dispatch action to save marker when user clicks on favorite.
  handleOnMarkerSave(e, placeDetails, place) {
    this.props.dispatch(
      action.saveFavorite(placeDetails, place, this.handleOnMarkerUnFavorite.bind(this)));
  }

  isMarkerSaved(target) {
    const markers = this.context.store.getState().mapState.markers;
    const idx = _.findIndex(markers, marker => marker.place.placeId === target);
    return idx >= 0;
  }

  // Dispatch action to handle new autocomplete marker.
  handleOnPlaceChanged(clazzRef, autoComplete) {
    const place = autoComplete.getPlace();
    const placeService = clazzRef.getPlaceService();

    // Adjust viewport to center on marker.
    if (place.geometry.viewport) {
      this.googleMap.getMap().fitBounds(place.geometry.viewport);
    } else {
      this.googleMap.getMap().setCenter(place.geometry.location);
      this.googleMap.getMap().setZoom(17);  // Why 17? Because it looks good.
    }
    // Fetch details about the marker from googles place service.
    placeService.getDetails(
      { placeId: place.place_id },
      (details, status) => {
        if (status === clazzRef.props.google.maps.places.PlacesServiceStatus.OK) {
          const placeDetails = {
            formatted_phone_number: details.formatted_phone_number,
            website: details.website,
            name: details.name,
            rating: details.rating,
          };
          // Create marker object and buid info window content from place details.
          const marker = {
            placeDetails,
            type: MARKER_TYPE_AUTOCOMPLETE,
            place: {
              location: place.geometry.location,
              placeId: place.place_id,
            },
            infoWindowContent: mapHelper.buildInfoWindow(
              placeDetails,
              e => this.handleOnMarkerSave(e, placeDetails, place),
              mapHelper.hasFavorite(
                this.context.store.getState().mapState.markers, place.place_id)),
            showInfoWindow: true,
            maxWidth: 180,
          };
          this.props.dispatch(
            action.changePlace(marker, place.place_id, MARKER_TYPE_AUTOCOMPLETE));
        } else {
          console.log('There was an issue querying PlacesService. See https://developers.google.com/maps/documentation/javascript/reference#PlacesServiceStatus  STATUS:', status);
        }
      },
    );
  }

  /**
  * Lifecycle Method - render
  * https://facebook.github.io/react/docs/react-component.html#render
  */
  render() {
    return (
      <MapContainer
        markers={this.props.markers}
        onMapMounted={node => this.onMapMounted(node)}
        opts={{ apiKey: process.env.GOOGLE_MAP_API_KEY }}
        onPlaceChanged={(clazz, obj) => this.handleOnPlaceChanged(clazz, obj)}
        onInfoWindowClosed={(clazz, obj) => this.handleOnInfoWindowClose(clazz, obj)}
        onMarkerClicked={(clazz, obj, evt) => this.handleOnMarkerClicked(obj, evt)}
      />
    );
  }
}

const mapStateToProps = state => ({
  markers: state.mapState.markers,
  currentMarker: state.mapState.currentMarker,
});

export default connect(mapStateToProps)(GoogleMap);
