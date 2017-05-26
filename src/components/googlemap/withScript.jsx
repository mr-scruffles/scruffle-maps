import React from 'react';
import { PropTypes as T } from 'prop-types';
import scriptjs from 'scriptjs';
import _ from 'lodash';

const LOADING_STATE_NONE = Symbol('none');
const LOADING_STATE_DONE = Symbol('done');

/**
* Class represents an HOC component that is responsible for wrapping the map container
* and handling the loading of the google maps script.
*/
const withScript = (WrappedComponent) => {
  class WithScript extends React.Component {
    static displayName = `withScript(${WithScript.getDisplayName(WrappedComponent)})`;

    static getDisplayName(wc) {
      return wc.displayName || wc.name || 'Component';
    }

    static propTypes = {
      opts: T.object.isRequired,
    }

    // Build the google map api script url.
    static buildApiUrl(opts) {
      if (!opts.apiKey) {
        return null;
      }
      const urlBase = 'https://maps.googleapis.com/maps/api/js';
      const params = {
        key: opts.apiKey,
        callback: opts.callback,
        libraries: (opts.libraries || ['places']).join(','),
        client: opts.client,
        v: opts.version || '3.27',
        channel: null,
        language: null,
        region: null,
      };
      const urlParams = _.reduce(params, (result, value, key) => {
        if (value) result.push(`${key}=${value}`);
        return result;
      }, []).join('&');

      return `${urlBase}?${urlParams}`;
    }

    // Constructs HOC with intial state.
    constructor(props) {
      super(props);
      this.state = {
        loadStatus: LOADING_STATE_NONE,
        url: WithScript.buildApiUrl(this.props.opts),
      };
      this.handleScriptLoad = this.handleScriptLoad.bind(this);
    }

    /**
    * Lifecycle Method - componentDidMount
    * https://facebook.github.io/react/docs/react-component.html#componentdidmount
    */
    componentDidMount() {
      scriptjs(this.state.url, this.handleScriptLoad);
    }

    // When the script(s) finish laoding set the state.
    handleScriptLoad() {
      this.setState({
        loadStatus: LOADING_STATE_DONE,
        google: window.google,
      });
    }

    // Once google maps api has been loaded render the map container.
    render() {
      const props = Object.assign({}, this.props, {
        google: this.state.google,
      });
      if (this.state.loadStatus !== LOADING_STATE_DONE) return null;
      return (
        <WrappedComponent
          {...props}
        />);
    }
  }
  return WithScript;
};

export default withScript;
