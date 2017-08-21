const React = require('react');
const ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.HashHistory;
const Devbind = require('../devbind/Devbind.jsx');
const Devbinded = require('../devbind/Devbinded.jsx');
const DevbindSuccess = require('../devbind/DevbindSuccess.jsx');

module.exports = React.createClass({
	render: function() {
		return <Router history={hashHistory}>
			<Route path="/" component={Devbind}/>
			<Route path="/binded" component={Devbinded}/>
			<Route path="/bindSuccess" component={DevbindSuccess}/>
	  	</Router>
	}
});