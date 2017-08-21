const React = require('react');
const SelectGroup = require('./SelectGroup.jsx');
module.exports = React.createClass ({
	getInitialState: function (){
	    return { 
	    	provinceValid: "",
	    	provinces: [{"key": "", "value": "省"}],
	    	provincesDefault: [{"key": "", "value": "省"}],
	    	cityValid: "",
	    	cities: [{"key": "", "value": "市"}],
	    	citiesDefault: [{"key": "", "value": "市"}],
	    	areaValid: "",
	    	areas: [{"key": "", "value": "区"}],
	    	areasDefault: [{"key": "", "value": "区"}],
	    	provinceDisable: false,
	    	cityDisable: false,
	    	areaDisable: false,
	    	provinceId: "",
	    	cityId: "",
	    	areaId: ""
	    }
	},
	componentWillReceiveProps(nextProps) {
		// 更新提示话术
		this.setState({
			provinceValid: nextProps.valid.provinceId,
			cityValid: nextProps.valid.cityId,
			areaValid: nextProps.valid.areaId
		});
		// 如果返回了默认值则回显不可修改
		var sVal = nextProps.setValue;
		if(sVal){
			if(sVal.provinceId &&sVal.provinceId != this.state.provinceId) this.setValue_province(sVal);
			if(sVal.cityId && sVal.cityId != this.state.cityId) this.setValue_city(sVal);
			if(sVal.areaId && sVal.areaId != this.state.areaId) this.setValue_area(sVal);
		} else {
			if(this.state.provinceDisable) this.loadData("provinces");
			if(this.state.cityDisable) this.setDefault_city();
			if(this.state.areaDisable) this.setDefault_area();
		}
	},
	// 回显值更新，通知给父级
	setValue: function (name, data) {
		var dic = {"province": "provinces", "city": "cities", "area": "areas"};
		if(data[name]){
			this.setState({[dic[name]]: [{"key": data[name + "Id"], "value": data[name]}], [name + "Disable"]: true}); 
			this.handleChange_update(name + "Id", data[name + "Id"]);
		} else if(name == "city" || name == "area"){
			this.loadData([dic[name]], data[ (name == "city" ? "province" : "city") + "Id"]);
		}
	},
	setValue_province: function(data){
		this.setValue("province", data);
	},
	setValue_city: function(data){
		// 如果有省，才需要更新市
		if(data.provinceId) this.setValue("city", data);
	},
	setValue_area: function(data){
		// 如果有市，才需要更新区
		if(data.cityId) this.setValue("area", data);
	},
	setDefault_city: function (){
		this.setState({
			cities: [{"key": "", "value": "市"}],
			cityDisable: false,
			cityId: ""
		});
		this.props.handleChange("cityId", "");
	},
	setDefault_area: function (){
		this.setState({
			areas: [{"key": "", "value": "区"}],
			areaDisable: false,
			areaId: ""
		});
		this.props.handleChange("areaId", "");
	},
	render: function(){
		return	<div className="formPanel province">
				<SelectGroup name = "province" options = {this.state.provinces} disable = {this.state.provinceDisable} handleChange = {this.handleChange} valid = {this.state.provinceValid}></SelectGroup>
				<SelectGroup name = "city" options = {this.state.cities} disable = {this.state.cityDisable} handleChange = {this.handleChange} valid = {this.state.cityValid}></SelectGroup>
				<SelectGroup name = "area" options = {this.state.areas} disable = {this.state.areaDisable} handleChange = {this.handleChange} valid = {this.state.areaValid}></SelectGroup>
			</div>
	},
	handleChange: function(name, value){
		this.setState({[name + "Valid"]: ""});
		// 前一级选择空，则后面的清空；
		if(!value) {
			if(name != "city") this.setDefault_city();
			if(name == "province") this.setDefault_area();
		} 
		// 选择省，请求市；选择市，请求区；
		else {
			if(name == "province") {
				this.loadData("cities", value);
				this.setDefault_area();
			}
			else if(name == "city") this.loadData("areas", value);
		}
		this.handleChange_update(name + "Id", value);
	},
	handleChange_update: function (name, value){
		this.setState({[name]: value});
		this.props.handleChange(name, value);
	},
	// 数据结构转成统一
	exchangeData: function (data) {
		var list = [];
		for(let i = 0; i < data.length; i++){
			list.push({"key": data[i].id, "value": data[i].areaName});
		}
		return list;
	},
	loadData: function(name, id){
		var dic = {"provinces": "province", "cities": "city", "areas": "area"};
		var c = this;
		fetch("/devbindsrv/" + name + (id ? "?parentid=" + id : ""),{
			method: 'get'
			})
			.then((res) => res.json())
			.then((res) => {
				var data = c.exchangeData(res.data);
				this.setState({
					[name]: this.state[name + "Default"].concat(data),
					[dic[name] + "Disable"]: false,
					[dic[name] + "Id"]: ""
				});
				this.props.handleChange(dic[name] + "Id", "");
			}
		);
	},
	componentDidMount: function () {
		// 初始化请求省
		this.loadData("provinces");
	}
});