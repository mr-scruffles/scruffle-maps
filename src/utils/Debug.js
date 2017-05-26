import _ from 'lodash';
/**
* Class WithDebug uses Inheritance Inversion. The HOC extends the wrapped component. This is a
* simple debugging class to help expose the state and props of the wrappe component at each
* lifecycle step.
*
* NOTE: This class is amazining useful when you wnat to see a components lifecycle.
*/
const WithDebug = (WrappedComponent) => {
  class Debug extends WrappedComponent {

    static displayName = `withDebug(${Debug.getDisplayName(WrappedComponent)})`;

    static getDisplayName(wc) {
      return wc.displayName || wc.name || 'Component';
    }
    static shouldLog(options, target) {
      return !_.find(options, elem => elem === 'all' || elem === target);
    }

    static log(methodName, componentData) {
      if (Debug.shouldLog(componentData.currentProps.disableDebug, methodName)) {
        console.groupCollapsed(`${Debug.displayName} ${methodName} (${componentData ? Object.keys(componentData) : ''})`);
        _.forEach(componentData, (value, key) => {
          console.group(key);
          console.dir(value);
          console.groupEnd();
        });
        console.groupEnd();
      }
    }

    /**
    * Lifecycle Method - componentWillMount
    * https://facebook.github.io/react/docs/react-component.html#componentwillmount
    */
    componentWillMount() {
      Debug.log('componentWillMount', { currentProps: this.props, currentState: this.state });
      if (typeof super.componentWillMount === 'undefined') {
        return;
      }
      super.componentWillMount();
    }

    /**
    * Lifecycle Method - componentDidMount
    * https://facebook.github.io/react/docs/react-component.html#componentdidmount
    */
    componentDidMount() {
      Debug.log('componentDidMount', { currentProps: this.props, currentState: this.state });
      if (typeof super.componentDidMount === 'undefined') {
        return;
      }
      super.componentDidMount();
    }

    /**
    * Lifecycle Method - componentWillReceiveProps
    * https://facebook.github.io/react/docs/react-component.html#componentwillreceiveprops
    */
    componentWillReceiveProps(nextProps) {
      Debug.log('componentWillReceiveProps', { currentProps: this.props, nextProps, currentState: this.state });
      if (typeof super.componentWillReceiveProps === 'undefined') {
        return;
      }
      super.componentWillReceiveProps(nextProps);
    }

    /**
    * Lifecycle Method - shouldComponentUpdate
    * https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate
    */
    shouldComponentUpdate(nextProps, nextState) {
      let flag = true;
      if (typeof super.shouldComponentUpdate !== 'undefined') {
        flag = super.shouldComponentUpdate(nextProps, nextState);
      }
      Debug.log(`shouldComponentUpdate - ${flag}`, { currentProps: this.props, nextProps, currentState: this.state, nextState });
      return flag;
    }

    /**
    * Lifecycle Method - componentWillUpdate
    * https://facebook.github.io/react/docs/react-component.html#componentwillupdate
    */
    componentWillUpdate(nextProps, nextState) {
      Debug.log('componentWillUpdate', { currentProps: this.props, nextProps, currentState: this.state, nextState });
      if (typeof super.componentWillUpdate === 'undefined') {
        return;
      }
      super.componentWillUpdate(nextProps, nextState);
    }

    /**
    * Lifecycle Method - componentDidUpdate
    * https://facebook.github.io/react/docs/react-component.html#componentdidupdate
    */
    componentDidUpdate(prevProps, prevState) {
      Debug.log('componentDidUpdate', { currentProps: this.props, prevProps, currentState: this.state, prevState });
      if (typeof super.componentDidUpdate === 'undefined') {
        return;
      }
      super.componentDidUpdate(prevProps, prevState);
    }

    /**
    * Lifecycle Method - componentWillUnmount
    * https://facebook.github.io/react/docs/react-component.html#componentwillunmount
    */
    componentWillUnmount() {
      Debug.log('componentWillUnmount', { currentProps: this.props, currentState: this.state });
      if (typeof super.componentWillUnmount === 'undefined') {
        return;
      }
      super.componentWillUnmount();
    }

    /**
    * Lifecycle Method - render
    * https://facebook.github.io/react/docs/react-component.html#render
    */
    render() {
      Debug.log('render', { currentProps: this.props, currentState: this.state });
      if (typeof super.render === 'undefined') {
        return null;
      }
      return super.render();
    }
  }
  return Debug;
};

export default WithDebug;
