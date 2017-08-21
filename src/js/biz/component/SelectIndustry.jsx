const React = require('react');
const SelectGroup = require('./SelectGroup.jsx');
module.exports = React.createClass ({
	getInitialState: function (){
	    return { 
	    	priIndustryValid: "",
	    	priIndustries: [{"key": "", "value": "一级行业"}],
	    	priIndustriesDefault: [{"key": "", "value": "一级行业"}],
	    	secIndustryValid: "",
	    	secIndustries: [{"key": "", "value": "二级行业"}],
	    	secIndustriesDefault: [{"key": "", "value": "二级行业"}],
	    	priDisable: false,
	    	secDisable: false,
	    	priIndustryCode: "",
	    	secIndustryCode: "",
	    }
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			priIndustryValid: nextProps.valid.priIndustryCode,
			secIndustryValid: nextProps.valid.secIndustryCode
		});
		// 如果返回了默认值则回显不可修改
		var sVal = nextProps.setValue;
		if(sVal){
			if(sVal.priIndustryCode != this.state.priIndustryCode) this.setValue_pri(sVal);
			if(sVal.secIndustryCode != this.state.secIndustryCode) this.setValue_sec(sVal);
		} else {
			if(this.state.priDisable) this.loadData("pri");
			if(this.state.secDisable) this.setDefault("sec");
		}
	},
	// 回显值更新，通知给父级
	setValue: function (num, data) {
		var industryCode = data[num + "IndustryCode"];
		if(industryCode) {
			this.setState({[num + "Industries"]: [{"key": industryCode, "value": data[num + "Industry"]}], [num + "Disable"]: true}); 
			this.handleChange_update(num + "IndustryCode", industryCode);
		} else if(num == "sec") {
			this.loadData("sec", data["priIndustryCode"]);
		}
	},
	setValue_pri: function(data){
		this.setValue("pri", data);
	},
	setValue_sec: function(data){
		// 如果有一级，才需要二级
		if(data.priIndustryCode) this.setValue("sec", data);
	},
	render: function(){
		return	<div className="formPanel industry">
				<SelectGroup name = "priIndustry" options = {this.state.priIndustries} disable = {this.state.priDisable} handleChange = {this.handleChange} valid = {this.state.priIndustryValid}></SelectGroup>
				<SelectGroup name = "secIndustry" options = {this.state.secIndustries} disable = {this.state.secDisable} handleChange = {this.handleChange} valid = {this.state.secIndustryValid}></SelectGroup>
			</div>
	},
	setDefault: function(name){
		this.setState({
			[name + "Industries"]: [{"key": "", "value": "二级行业"}],
			[name + "IndustryCode"]: "",
			[name + "Disable"]: false
		});
		this.props.handleChange(name + "IndustryCode", "");
	},
	handleChange: function(name, value){
		this.setState({[name + "Valid"]: ""});
		// 前一级选择空，则后面的清空；前一级选择，请求二级数据
		if(name == "priIndustry") value ? this.loadData("sec", value) : this.setDefault("sec");
		this.handleChange_update(name + "Code", value);
	},
	handleChange_update: function (name, value){
		this.setState({[name]: value});
		this.props.handleChange(name, value);
	},
	exchangeData: function (data) {
		var list = [];
		for(let i = 0; i < data.length; i++){
			list.push({"key": data[i].industryCode, "value": data[i].industryName});
		}
		return list;
	},
	loadData: function(name, code){
		var c = this;
		fetch("/devbindsrv/industrys" + (code ? "?parentcode=" + code : ""),{
			method: 'get'
			})
			.then((res) => res.json())
			.then((res) => {
				var data = c.exchangeData(res.data);
				this.setState({
					[name + "Industries"]: this.state[name + "IndustriesDefault"].concat(data),
					[name + "Disable"]: false,
					[name + "IndustryCode"]: ""
				});
				this.props.handleChange(name + "IndustryCode", "");
			}
		);
	},
	componentDidMount: function () {
		// 初始化请求一级行业
		this.loadData("pri");
	}
});