import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Echo from 'laravel-echo';
import Index from './router';
const WSHOST = process.env.REACT_APP_WS_HOST;

class App extends Component {
  componentDidMount() {
    window.Pusher = require('pusher-js');
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: 'test002',
      // wsHost: `${"172.20.10.4"}`,
      wsHost: WSHOST,
      wsPort: 6001,
      forceTLS: false,
      dsiableStats: true,
    });
  }

  render() {
    return <Index />;
  }
}

export default withRouter(App);
