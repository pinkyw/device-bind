require('es5-shim');
require('es5-shim/es5-sham');
require('es6-promise');
require('fetch-ie8');
const React = require('react');
const ReactDOM = require('react-dom');
require('../../css/biz/np.scss');
const Router = require('./router/Router.jsx');

ReactDOM.render((
	<Router/>
), document.getElementById('app'));
