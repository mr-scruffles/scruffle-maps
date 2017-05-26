import React from 'react';
import { PropTypes as T } from 'prop-types';
import _ from 'lodash';
import ReactDOM from 'react-dom';

/**
* Class represents google autocomplete component.
* https://developers.google.com/maps/documentation/javascript/reference#PlacesService
*/
export default class AutoComplete extends React.Component {

  static propTypes = {
    // GOOGLE API defined.
    // https://developers.google.com/maps/documentation/javascript/reference#AutocompleteOptions
    bounds: T.object,
    componentRestrictions: T.shape({
      country: T.oneOfType([T.string, T.arrayOf(T.string)]),
    }),
    placeIdOnly: T.bool,
    strictBounds: T.bool,
    types: T.arrayOf(T.string),

    // Applicaiton defined props.
    google: T.oneOfType([T.object, null]),
    map: T.oneOfType([T.object, null]),
  }

  static defaultProps = {
    // GOOGLE API defined.
    // https://developers.google.com/maps/documentation/javascript/reference#AutocompleteOptions
    bounds: null,
    componentRestrictions: { country: 'us' },
    placeIdOnly: null,
    strictBounds: null,
    types: null,

    // Applicaiton defined props.
    google: null,
    map: null,
  }

  static eventMap = {
    onPlaceChanged: 'place_changed',
  }

  constructor(props) {
    super(props);
    this.placeService = new this.props.google.maps.places.PlacesService(this.props.map);
    this.searchBoxContainer = null;
  }

  /**
  * Lifecycle Method - componentDidMount
  * https://facebook.github.io/react/docs/react-component.html#componentdidmount
  */
  componentDidMount() {
    this.renderPlace();
  }

  /**
  * Lifecycle Method - shouldComponentUpdate
  * https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate
  */
  shouldComponentUpdate(nextProps) {
    let flag = true;
    // This component should only be mounted unless there is a change to the map or google object.
    if (this.props.google === nextProps.google && this.props.map === nextProps.map) {
      flag = false;
    }
    return flag;
  }

  /**
  * Lifecycle Method - componentWillUnmount
  * https://facebook.github.io/react/docs/react-component.html#componentwillunmount
  */
  componentWillUnmount() {
    // TODO: this component is not unmounting from DOM when navigating via react router.
    // Initial investigation suggests calling ReactDOM.render inside component mount is an issue.
    // This might be able to just be lifted out of this component and defined higher up just like
    // InfoWindow is. IW currently unmounts correctly when navigating via react router.
    ReactDOM.unmountComponentAtNode(this.searchBoxContainer);
    _.forEach(AutoComplete.eventMap, (value, key) => {
      if (this.props[key]) {
        this.props.google.maps.event.clearListeners(this.autocomplete, value);
      }
    });
  }

  /**
  * Returns google place service.
  */
  getPlaceService() {
    return this.placeService;
  }

  /**
  * Builds search box container that will be used to search for different places.
  * https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
  */
  renderPlace() {
    if (this.props.google && this.props.map) {
      // We have to create a div on the acutal DOM as opposed to the virtual DOM. So that when we
      // actuall render the component we can use the div as a parent. Google maps does not know how
      // to operate on anything other than a rendered DOM so we must have it rendered first so that
      // Google maps can act on it.
      this.searchBoxContainer = document.createElement('div');
      ReactDOM.render(
        (<div className="row my-5 mx-5" ref={(elem) => { this.autoCompleteComponent = elem; }}>
          <div className="col-sm">
            <div className="input-group">
              <input type="text" className="form-control" size="50" placeholder="Search for..." ref={(elem) => { this.inputRef = elem; }} />
            </div>
          </div>
        </div>),
      this.searchBoxContainer);

      const placeConfig = {
        bounds: this.props.bounds,
        componentRestrictions: this.props.componentRestrictions,
        placeIdOnly: this.props.placeIdOnly,
        strictBounds: this.props.strictBounds,
        types: this.props.types,
      };

      // Remove any null keys from config.
      Object.keys(placeConfig).forEach((key) => {
        if (placeConfig[key] == null) {
          delete placeConfig[key];
        }
      });

      // Renders autocomplete box in map.
      this.autocomplete = new this.props.google.maps.places.Autocomplete(
        this.inputRef, placeConfig);

      // Move autocomplete widget to top left of map.
      this.props.map.controls[
        this.props.google.maps.ControlPosition.TOP_LEFT].push(
          this.autoCompleteComponent);

      // Attach listeners to events.
      _.forEach(AutoComplete.eventMap, (value, key) => {
        if (this.props[key]) {
          this.autocomplete.addListener(
            value,
            () => this.props[key](this, this.autocomplete, this.props));
        }
      });
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
