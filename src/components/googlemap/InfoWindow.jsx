import React from 'react';
import { PropTypes as T } from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';

/**
* Class represents google info window component.
* https://developers.google.com/maps/documentation/javascript/reference#InfoWindow
*/
export default class InfoWindow extends React.Component {

  // GOOGLE API defined
  // https://developers.google.com/maps/documentation/javascript/reference#InfoWindow
  static eventMap = {
    onCloseClick: 'closeclick',
    onContentChanged: 'content_changed',
    onDomReady: 'domready',
    onPositionChanged: 'position_changed',
    onZindexChanged: 'zindex_changed',
  }

  // GOOGLE API defined
  // https://developers.google.com/maps/documentation/javascript/reference#InfoWindowOptions
  static propTypes = {
    content: T.oneOfType([T.string, T.object, null]),
    disableAutoPan: T.bool,
    maxWidth: T.number,
    pixelOffset: T.shape({
      height: T.number,
      width: T.number,
    }),
    position: T.object,
    zIndex: T.number,

    // Application defined props
    google: T.object,
    map: T.object,
    anchor: T.object,
    showInfoWindow: T.bool,
  }

  // GOOGLE API defined
  // https://developers.google.com/maps/documentation/javascript/reference#InfoWindowOptions
  static defaultProps = {
    content: null,
    disableAutoPan: null,
    maxWidth: null,
    pixelOffset: null,
    position: null,
    zIndex: null,

    // Applicaiton defined props.
    google: null,
    map: null,
    anchor: null,
    showInfoWindow: null,
  }

  constructor(props) {
    super(props);

    // Create info window.
    this.infoWindow = new this.props.google.maps.InfoWindow();

    // Attach listeners to events.
    _.forEach(InfoWindow.eventMap, (value, key) => {
      if (this.props[key]) {
        this.infoWindow.addListener(
          value,
          () => this.props[key](this, this.InfoWindow, this.props));
      }
    });
  }

  /**
  * Lifecycle Method - componentDidMount
  * https://facebook.github.io/react/docs/react-component.html#componentdidmount
  */
  componentDidMount() {
    // An info window must mount to a position or anchor. In this case and anchor represents a
    // marker. The position must be a google.maps.LatLng or google.maps.LatLngLiteral.
    if (this.props.position || this.props.anchor) {
      this.renderInfoWindow();
    }
  }

  /**
  * Lifecycle Method - componentDidUpdate
  * https://facebook.github.io/react/docs/react-component.html#componentdidupdate
  */
  componentDidUpdate() {
    this.renderInfoWindow();
  }

  /**
  * Lifecycle Method - componentWillUnmount
  * https://facebook.github.io/react/docs/react-component.html#componentwillunmount
  */
  componentWillUnmount() {
    // Clean up DOM elements created for content.
    this.infoWindow.close();
    ReactDOM.unmountComponentAtNode(this.props.content);

    _.forEach(InfoWindow.eventMap, (value, key) => {
      if (this.props[key]) {
        this.props.google.maps.event.clearListeners(this.infoWindow, value);
      }
    });
  }

  // Renders the infowindow on the map.
  renderInfoWindow() {
    const infoWindowConfig = {
      content: this.props.content,
      disableAutoPan: this.props.disableAutoPan,
      maxWidth: this.props.maxWidth,
      pixelOffset: this.props.pixelOffset,
      position: this.props.position,
      zIndex: this.props.zIndex,
    };

    // Remove any null keys.
    Object.keys(infoWindowConfig)
      .forEach((key) => {
        if (infoWindowConfig[key] == null) {
          delete infoWindowConfig[key];
        }
      });

    this.infoWindow.setOptions(infoWindowConfig);
    const { map, anchor } = this.props;
    if (this.props.showInfoWindow) {
      // Bias position of infor window on anchor with a lat lng fallback.
      anchor ? this.infoWindow.open(map, anchor) : this.infoWindow.open(map);
    } else {
      this.infoWindow.close();
    }
  }

  /**
  * Lifecycle Method - render
  * https://facebook.github.io/react/docs/react-component.html#render
  */
  render() {
    return null;
  }
}
