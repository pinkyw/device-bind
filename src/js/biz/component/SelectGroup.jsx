const React = require('react');
module.exports = React.createClass ({
	getInitialState: function (){
	    return { "options": {}, "validate": "", "value": "", "disable": false};
	},
	componentWillReceiveProps(nextProps) {
		// console.log(nextProps);
		this.setState({
			options: nextProps.options,
			validate: nextProps.valid,
			disable: nextProps.disable
		});
    },
	handleChange: function(name, e){
		let i = e.target.options.selectedIndex;
		let key = e.target.options[i].value;
		this.setState({"value": key});
		this.props.handleChange(name, key);
	},
	render: function(){
		var options = this.state.options; var opt = [];
		for(let i = 0; i < options.length; i++){
	  		opt.push(<option value={options[i].key} key={i}>&nbsp;&nbsp;{options[i].value}&nbsp;&nbsp;</option>);
		}
		var name = this.props.name;
		return	<div className="selectPanel">
				<select className={this.state.disable ? "m-Select disabled" : "m-Select"} disabled={this.state.disable ? "disabled" : ""} value={this.state.value} onChange={this.handleChange.bind(this, name)}>{opt}</select>
				{this.state["validate"] ? <span className="m-ErrorTip">{this.state["validate"]}</span> : ""}
	  		</div>
	}
});
