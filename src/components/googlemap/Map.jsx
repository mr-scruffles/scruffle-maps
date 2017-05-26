import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';

/**
* Class represents google map component.
* https://developers.google.com/maps/documentation/javascript/reference#Map
*/
export default class Map extends React.Component {

  // GOOGLE API defined
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Map
  static eventMap = {
    onBoundsChanged: 'bounds_changed',
    onCenterChanged: 'center_changed',
    onClick: 'click',
    onDblClick: 'dblclick',
    onDrag: 'drag',
    onDragEnd: 'dragend',
    onDragStart: 'dragstart',
    onHeadingChanged: 'heading_changed',
    onIdle: 'idle',
    onMapTypeIdChanged: 'maptypeid_changed',
    onMouseMove: 'mousemove',
    onMouseOut: 'mouseout',
    onMouseOver: 'mouseover',
    onProjectionChanged: 'projection_changed',
    onResize: 'resize',
    onRightClick: 'rightclick',
    onTileLoaded: 'tilesloaded',
    onTiltChanged: 'tilt_changed',
    onZoomChanged: 'zoom_changed',
  };

  static propTypes = {
    // GOOGLE API defined.
    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions
    backgroundColor: T.string,
    center: T.shape({
      lat: T.number,
      lng: T.number,
    }),
    clickableIcons: T.bool,
    disableDefaultUI: T.bool,
    disableDoubleClickZoom: T.bool,
    draggable: T.bool,
    draggableCursor: T.string,
    draggingCursor: T.string,
    fullscreenControl: T.bool,
    fullscreenControlOptions: T.object,
    gestureHandling: T.string,
    heading: T.number,
    keyboardShortcuts: T.bool,
    mapTypeControl: T.bool,
    mapTypeControlOptions: T.object,
    mapTypeId: T.object,
    maxZoom: T.number,
    minZoom: T.number,
    noClear: T.bool,
    panControl: T.bool,
    panControlOptions: T.object,
    rotateControl: T.bool,
    rotateControlOptions: T.object,
    scaleControl: T.bool,
    scaleControlOptions: T.object,
    scrollwheel: T.bool,
    signInControl: T.bool,
    streetView: T.object,
    streetViewControl: T.bool,
    streetViewControlOptions: T.object,
    styles: T.arrayOf(T.Object),
    tilt: T.number,
    zoom: T.number,
    zoomControl: T.number,
    zoomControlOptions: T.number,

    // Application defined
    children: T.oneOfType([
      T.arrayOf(T.node),
      T.node,
    ]),
    google: T.object.isRequired,
  }

  static defaultProps = {
    // GOOGLE API defined.
    // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions
    backgroundColor: null,
    center: {
      lat: 37.746045,
      lng: -122.450525,
    },
    clickableIcons: null,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    draggable: null,
    draggableCursor: null,
    draggingCursor: null,
    fullscreenControl: null,
    fullscreenControlOptions: null,
    gestureHandling: null,
    heading: null,
    keyboardShortcuts: null,
    mapTypeControl: null,
    mapTypeControlOptions: null,
    mapTypeId: null,
    maxZoom: null,
    minZoom: null,
    noClear: null,
    panControl: null,
    panControlOptions: null,
    rotateControl: null,
    rotateControlOptions: null,
    scaleControl: null,
    scaleControlOptions: null,
    scrollwheel: false,
    signInControl: null,
    streetView: null,
    streetViewControl: null,
    streetViewControlOptions: null,
    styles: null,
    tilt: null,
    zoom: 13,
    zoomControl: null,
    zoomControlOptions: null,

    // Application defined
    children: null,
  };

  constructor(props) {
    super(props);
    this.map = null;
  }

  /**
  * Lifecycle Method - componentDidMount
  * https://facebook.github.io/react/docs/react-component.html#componentdidmount
  */
  componentDidMount() {
    const mapConfig = {
      backgroundColor: this.props.backgroundColor,
      center: new this.props.google.maps.LatLng(this.props.center.lat, this.props.center.lng),
      clickableIcons: this.props.clickableIcons,
      disableDefaultUI: this.props.disableDefaultUI,
      disableDoubleClickZoom: this.props.disableDoubleClickZoom,
      draggable: this.props.draggable,
      draggableCursor: this.props.draggableCursor,
      draggingCursor: this.props.draggingCursor,
      fullscreenControl: this.props.fullscreenControl,
      fullscreenControlOptions: this.props.fullscreenControlOptions,
      gestureHandling: this.props.gestureHandling,
      heading: this.props.heading,
      keyboardShortcuts: this.props.keyboardShortcuts,
      mapTypeControl: this.props.mapTypeControl,
      mapTypeControlOptions: this.props.mapTypeControlOptions,
      mapTypeId: this.props.mapTypeId,
      maxZoom: this.props.maxZoom,
      minZoom: this.props.minZoom,
      noClear: this.props.noClear,
      panControl: this.props.panControl,
      panControlOptions: this.props.panControlOptions,
      rotateControl: this.props.rotateControl,
      rotateControlOptions: this.props.rotateControlOptions,
      scaleControl: this.props.scaleControl,
      scaleControlOptions: this.props.scaleControlOptions,
      scrollwheel: this.props.scrollwheel,
      signInControl: this.props.signInControl,
      streetView: this.props.streetView,
      streetViewControl: this.props.streetViewControl,
      streetViewControlOptions: this.props.streetViewControlOptions,
      styles: this.props.styles,
      tilt: this.props.tilt,
      zoom: this.props.zoom,
      zoomControl: this.props.zoomControl,
      zoomControlOptions: this.props.zoomControlOptions,
    };

    // Remove null options.
    Object.keys(mapConfig).forEach((key) => {
      if (mapConfig[key] == null) {
        delete mapConfig[key];
      }
    });

    // Instantiate the map and attach it to the ref that was rendered initially.
    this.map = new this.props.google.maps.Map(this.mapRef, mapConfig);

    // Attach listeners to events.
    _.forEach(Map.eventMap, (value, key) => {
      if (this.props[key]) {
        this.map.addListener(value, this.props[key]);
      }
    });

    // Only after the map has rendered on the dom we must update to build children. At this
    // point the the map and google objects are available so that the children can render.
    this.forceUpdate();
  }

  /**
  * Lifecycle Method - componentWillUnmount
  * https://facebook.github.io/react/docs/react-component.html#componentwillunmount
  */
  componentWillUnmount() {
    _.forEach(Map.eventMap, (value, key) => {
      if (this.props[key]) {
        this.props.google.maps.event.clearListeners(this.map, value);
      }
    });
  }

  // Returns google map.
  getMap() {
    return this.map;
  }

  // Give all the children references to both map and google objects.
  renderChildren() {
    let children = null;
    if (this.map && this.props.google) {
      children = React.Children.map(this.props.children,
        c => React.cloneElement(c,
          {
            map: this.map,
            google: this.props.google,
          },
        ),
      );
    }
    return children;
  }

  /**
  * Lifecycle Method - render
  * https://facebook.github.io/react/docs/react-component.html#render
  */
  render() {
    // Render the component and set a ref so that we can later create google maps
    // at that mount point. While the map is loaing (the internet can be slow) render
    // a spinner.
    return (
      <div>
        <div
          id="google-map"
          className="d-flex justify-content-center align-items-center"
          style={{ minWidth: '85vw', minHeight: '85vh' }}
          ref={(elem) => { this.mapRef = elem; }}
        >
          <h1 className="map-loading">
            <i className="fa fa-spinner fa-pulse" /> Loading ...
          </h1>
        </div>
        { this.renderChildren() }
      </div>
    );
  }
}
