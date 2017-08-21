const React = require('react');
module.exports = React.createClass ({
	getInitialState: function (){
		var props = this.props; var val;
		if(props.setValue) val = props.setValue[props.name];
	    return { 
	    	validate: "", 
	    	value: val || "", 
	    	disable: val ? true : false,
	    	setValue: {}
	    }
	},
	componentWillReceiveProps(nextProps) {
		var name = this.props.name;
		if(nextProps.valid) this.setState({validate: nextProps.valid[name]});
		var sVal = nextProps.setValue || {};
		if(sVal[name] && sVal[name]!=this.state.value){
			this.setState({
				value: sVal[name],
				disable: true
			});
			this.props.handleBlur(name, sVal[name]);
		} else if(name!="devMac" && name!="account" && !sVal[name] && this.state.disable){
			this.setState({
				value: "",
				disable: false
			});
			this.props.handleBlur(name, "");
		}
    },
    handleChange: function(e){
    	this.setState({value: e.target.value});
    },
	handleBlur: function(name, e){
		if(this.props.handleBlur) this.props.handleBlur(name, e.target.value);
	},
	handleFocus: function(name, e){
		if(this.props.handleFocus) this.props.handleFocus(name, e);
	},
	render: function(){
		return	<div className="m-FormGroup formInput">
				<label>{this.props.label}：</label>
				<div className="formPanel">
					<input className={this.state.disable ? "m-Input disabled" : "m-Input"} value={this.state.value} disabled={this.state.disable ? "disabled" : ""} placeholder={this.props.placeholder || ("请输入" + this.props.label)} onBlur={this.handleBlur.bind(this, this.props.name)} onChange = {this.handleChange} onFocus={this.handleFocus.bind(this, this.props.name)}/>
					{this.state["validate"] ? <span className="m-ErrorTip">{this.state["validate"]}</span> : ""}
				</div>
			</div>
	}
});
