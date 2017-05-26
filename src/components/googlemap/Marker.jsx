import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';

export const MARKER_ANIMATION_DROP = Symbol('drop');
export const MARKER_ANIMATION_BOUNCE = Symbol('bounce');

/**
* Class represents google marker component.
* https://developers.google.com/maps/documentation/javascript/reference#Marker
*/
export default class Marker extends React.Component {

  // GOOGLE API defined
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker
  static eventMap = {
    onAnimationChanged: 'animation_changed',
    onClick: 'click',
    onClickableChanged: 'clickable_changed',
    onCursorChanged: 'cursor_changed',
    onDblClick: 'dblclick',
    onDrag: 'drag',
    onDragEnd: 'dragend',
    onDraggable_changed: 'draggable_changed',
    onDragStart: 'dragstart',
    onFlatChanged: 'flat_changed',
    onIconChanged: 'icon_changed',
    onMouseDown: 'mousedown',
    onMouseOut: 'mouseout',
    onMouseOver: 'mouseover',
    onMouseUp: 'mouseup',
    onPositionChanged: 'position_changed',
    onRightClick: 'rightclick',
    onShapeChanged: 'shape_changed',
    onTitleChanged: 'title_changed',
    onVisbleChanged: 'visible_changed',
    onZindexChanged: 'zindex_changed',
  }

  // GOOGLE API defined.
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerOptions
  static propTypes = {
    anchorPoint: T.shape({
      x: T.number,
      y: T.number,
    }),
    animation: T.symbol,
    attribution: T.object,
    clickable: T.shape({
      iosDeepLinkId: T.string,
      source: T.string,
      webUrl: T.string,
    }),
    crossOnDrag: T.bool,
    cursor: T.string,
    draggable: T.bool,
    icon: T.oneOfType([T.string, T.object]),
    label: T.oneOfType([T.string, T.object]),
    map: T.oneOfType([T.object, null]),
    opacity: T.number,
    optimized: T.bool,
    place: T.shape({
      location: T.object,
      placeId: T.string,
      query: T.string,
    }),
    position: T.object.isRequired,
    shape: T.shape({
      coods: T.arrayOf(T.number),
      type: T.string,
    }),
    title: T.string,
    visible: T.bool,
    zIndex: T.number,

    // Application defined props
    children: T.oneOfType([
      T.arrayOf(T.node),
      T.node,
    ]),
    google: T.oneOfType([
      T.object,
      null,
    ]),
  }

  // GOOGLE API defined.
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerOptions
  static defaultProps = {
    anchorPoint: null,
    animation: null,
    attribution: null,
    clickable: null,
    crossOnDrag: null,
    cursor: null,
    draggable: null,
    icon: null,
    label: null,
    map: null,
    opacity: null,
    optimized: null,
    place: null,
    shape: null,
    title: null,
    visible: null,
    zIndex: null,

    // Application defined props
    children: null,
    google: null,
  }

  constructor(props) {
    super(props);

    // Instantiate marker.
    this.marker = new this.props.google.maps.Marker();

    // Add event listeners.
    _.forEach(Marker.eventMap, (value, key) => {
      if (this.props[key]) {
        this.marker.addListener(value, evt => this.props[key](this, this.marker, this.props, evt));
      }
    });
  }

  /**
  * Lifecycle Method - componentDidMount
  * https://facebook.github.io/react/docs/react-component.html#componentdidmount
  */
  componentDidMount() {
    this.renderMarker();
  }

  /**
  * Lifecycle Method - componentDidUpdate
  * https://facebook.github.io/react/docs/react-component.html#componentdidupdate
  */
  componentDidUpdate() {
    this.renderMarker();
  }

  /**
  * Lifecycle Method - componentWillUnmount
  * https://facebook.github.io/react/docs/react-component.html#componentwillunmount
  */
  componentWillUnmount() {
    this.marker.setMap(null);

    // Clean up event listeners.
    _.forEach(Marker.eventMap, (value, key) => {
      if (this.props[key]) {
        this.props.google.maps.event.clearListeners(this.marker, value);
      }
    });
  }

  // Render the marker with its configuration.
  renderMarker() {
    const markerConfig = Object.assign({}, {
      anchorPoint: this.props.anchorPoint,
      animation: ((val) => {
        switch (val) {
          case MARKER_ANIMATION_DROP:
            return this.props.google.maps.Animation.DROP;
          case MARKER_ANIMATION_BOUNCE:
            return this.props.google.maps.Animation.BOUNCE;
          default:
            return null;
        }
      })(this.props.animation),
      attribution: this.props.attribution,
      clickable: this.props.clickable,
      crossOnDrag: this.props.crossOnDrag,
      cursor: this.props.cursor,
      draggable: this.props.draggable,
      icon: this.props.icon,
      label: this.props.label,
      map: this.props.map,
      opacity: this.props.opacity,
      optimized: this.props.optimized,
      place: this.props.place,
      position: this.props.position,
      shape: this.props.shape,
      title: this.props.title,
      visible: this.props.visible,
      zIndex: this.props.zIndex,
    });

    // Remove null configuration values.
    Object.keys(markerConfig).forEach((key) => {
      if (markerConfig[key] == null) {
        delete markerConfig[key];
      }
    });
    this.marker.setOptions(markerConfig);

    // Reguardless of the animation options set, reset them so they do not continue to animate.
    setTimeout(() => { this.marker.setAnimation(null); }, 750);
  }

  // Render the children with google, map and anchor. The anchor is intended for use with
  // and infor window so it has a point to mount to.
  renderChildren() {
    return React.Children.map(
      this.props.children,
      c => React.cloneElement(
        c,
        { google: this.props.google,
          map: this.props.map,
          anchor: this.marker,
        },
      ),
    );
  }

  // Render the children.
  render() {
    const children = this.renderChildren();
    return (<div>{ children }</div>);
  }
}
