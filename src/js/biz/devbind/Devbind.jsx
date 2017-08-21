/**
 * 创建日期: 2017-05-18 10:28
 * 创建作者: 王璐平 525627328@qq.com
 * 文件名称: devbind
 * 版本: v1.0
 * 功能: xx
 * 修改记录: xx
 */
const React = require('react');
const ReactDOM = require('react-dom');
const InputGroup = require('./../component/InputGroup.jsx');
const SelectProvince = require('./../component/SelectProvince.jsx');
const SelectIndustry = require('./../component/SelectIndustry.jsx');
var ReactRouter = require('react-router');
var History = ReactRouter.History;
module.exports = React.createClass({
	mixins: [ History ],
	getInitialState: function (){
		return {
			postData: {},
			validate: {},
			setValue: {},
			errorTip: ""
		}
	},
	handleBlur: function(name, value){
		if(typeof(value) != "string") value = value.target.value;
		this.setState({errorTip: ""});
		// 如果是账号，校验是否请求过且符合规范
		if(name == "account" && this.state.postData.account != value && this.validate({account: value}, this.accountStrategy)) {
			fetch("/devbindsrv/merchant/" + value,{
				method: 'get'
				})
				.then((res) => res.json())
				.then((res) => {
					this.setState({"setValue": res.data});
				}
			);
		}
		this.setPostData(name, value);
	},
	handleFocus: function (name, e){
		this.setValidate(name, "");
	},
	setValidate: function (name, value){
		var data = this.state.validate;
		data[name] = value;
		this.setState({validate: data});
	},
	// 设置提交的数据
	setPostData: function(name, value){
		this.setValidate(name, "");
		var data = this.state.postData;
		data[name] = value;
		this.setState({postData: data});
	},
	componentWillMount: function(){
		this.accountStrategy = {account: {required: true, regx: /^(1[0-9]{10})?$/, "name": "商户手机号"}};
		this.strategies = {
			devMac: {required: true, regx: /^[0-9A-Za-z]{12}$/, "name": "设备MAC地址"},
			broadbandAccount: {required: true, regx: /^[0-9]{1,50}$/, "name": "宽带账号"},
			account: this.accountStrategy.account,
			merchantName: {required: true, regx: /^[0-9A-Za-z\u4e00-\u9fa5]{1,50}$/,"name": "门店名称","errorMsg": "请输入中文、英文、数字组合，50字符以内。"},
			contactWay: {required: true,  regx: /^[0-9-,]{1,50}$/,"name": "门店电话","errorMsg": "请输入数字、连接符（-）、逗号（,）的组合，50位以内字符。"},
			priIndustryCode: {required: true, "name": "一级行业", "sel": true},
			secIndustryCode: {required: true, "name": "二级行业", "sel": true},
			ssidPrefix: {required: false, regx:/^[0-9A-Za-z]{0,4}?$/, "name": "SSID"},
			ssidSuffix: {required: true, regx:/^[0-9A-Za-z]{1,5}?$/,"name": "SSID"},
			provinceId: {required: true, "name": "省", "sel": true},
			cityId: {required: true, "name": "市", "sel": true},
			areaId: {required: true, "name": "区", "sel": true},
			address: {required: true,regx: /^[0-9A-Za-z\u4e00-\u9fa5]{1,100}$/, "name": "详细地址","errorMsg": "请输入中文、英文、字母、数字组合，100位以内。"},
			jobNumber: {required: true, "name": "服务人员工号"},
		};
	},
	validate: function (data, strategies) {
		var errorMsg = "";
		for(let a in strategies){
			if(this.state.validate[a]) return false;
			else {
				let strategy = strategies[a];
				let tip = strategy.sel ? "请选择" : "请输入";
				if(strategy.required && !data[a]) errorMsg = strategy.errorMsg || (tip + strategy.name);
				else if(data[a] && strategy.regx && !strategy.regx.test(data[a])) errorMsg = strategy.errorMsg || (tip + "正确的" + strategy.name);
				if(errorMsg) {
					this.setValidate(a, errorMsg);
					return false;
				}
			}
		}
		return true;
	},
	submitHandler: function (e){
		e.preventDefault();
		var postData = this.state.postData;
		var c = this;
		this.setState({errorTip: ""});
		if(this.validate(postData, this.strategies)) {
			if(this.state.setValue && this.state.setValue.id) postData.merchantId = this.state.setValue.id;
			fetch('/devbindsrv/device/bind', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(postData)
			})
			.then((res) => res.json())
			.then((res) => {
				// 如果已绑定则跳页
				if(res.code == "E2410001") c.history.pushState({devmac: postData.devMac}, "/binded");
				else if(res.msg) this.setState({errorTip: res.msg});
				else if(res.code == "0") c.history.pushState(null, "/bindSuccess");
			});
		}
	}, 
	render: function () {
		return	<div className="g-Container">
				<h4 className="title">新设备激活</h4>
				<form onSubmit={this.submitHandler}>
					<InputGroup label="设备MAC地址" name="devMac" handleBlur = {this.handleBlur} setValue = {this.state.setValue} valid = {this.state.validate} handleFocus={this.handleFocus} />
					<InputGroup label="宽带账号" name="broadbandAccount" handleBlur = {this.handleBlur} setValue = {this.state.setValue} valid = {this.state.validate} handleFocus={this.handleFocus} />
					<InputGroup label="商户手机号" name="account" handleBlur = {this.handleBlur} valid = {this.state.validate} handleFocus={this.handleFocus} />
					<InputGroup label="门店名称" name="merchantName" handleBlur = {this.handleBlur} setValue = {this.state.setValue} valid = {this.state.validate} handleFocus={this.handleFocus} />
					<InputGroup label="门店电话" name="contactWay" placeholder="请输入门店联系方式" setValue = {this.state.setValue} handleBlur = {this.handleBlur} valid = {this.state.validate} handleFocus={this.handleFocus} />
					<div className="m-FormGroup formInput">
						<label>所在行业：</label>
						<SelectIndustry setValue = {this.state.setValue} handleChange = {this.setPostData} valid = {this.state.validate}/>
					</div>
					<div className="m-FormGroup formInput">
						<label>SSID修改：</label>
						<div className="formPanel SSID">
							<b>aWifi-</b>
							<div className="inputPanel">
								<input className="m-Input" placeholder="0-4位字母或数字(选填)" onBlur={this.handleBlur.bind(this,"ssidPrefix")} valid = {this.state.validate} onFocus={this.handleFocus.bind(this, "ssidPrefix")}/>
								{this.validateDom(this.state.validate.ssidPrefix)}
							</div>
							<b>-</b>
							<div className="inputPanel">
								<input className="m-Input" placeholder="1-5位字母或数字（必填）" onBlur={this.handleBlur.bind(this, "ssidSuffix")} valid = {this.state.validate} onFocus={this.handleFocus.bind(this, "ssidSuffix")}/>
								{this.validateDom(this.state.validate.ssidSuffix)}
							</div>
						</div>
					</div>
					<div className="m-FormGroup formInput">
						<label>所在地区：</label>
						<SelectProvince valid = {this.state.validate} setValue = {this.state.setValue} handleChange = {this.setPostData} />
					</div>
					<InputGroup label="详细地址" name="address" placeholder="请输入详细地址：街道，路牌，门牌号（可选）" setValue = {this.state.setValue} handleBlur = {this.handleBlur} valid = {this.state.validate} handleFocus={this.handleFocus} />
					<InputGroup label="服务人员工号" name="jobNumber" placeholder="建议输入装维人员工号" handleBlur = {this.handleBlur} valid = {this.state.validate} handleFocus={this.handleFocus} />
					<p className="tip">提示：爱WiFi定制光猫终端，宽带如果桥接改路由，请装维人员通过IVR触发ITMS配置下发和宽带密码重置（IVR一键电话为：11831480-2）。</p>
					<div className="btnPanel">
						<button className="u-btn-sure" type="submit">确定激活</button>
						{this.validateDom(this.state.errorTip)}
					</div>
				</form>
			</div>
	},
	validateDom: function (msg){
		if(msg) return <span className="m-ErrorTip">{msg}</span>;
	},
	componentDidMount: function () {
		var gw_mac = this.props.location.query.gw_mac;
		var c = this;
		if(gw_mac){
			fetch("/devbindsrv/device/check?devmac=" + gw_mac, {
				method: "get"
				})
				.then((res) => res.json())
				.then((res) => {
				if(res.code == "E2410001"){
					c.history.pushState({devmac: gw_mac}, "/binded");
				} else {
					var data = c.state.setValue;
					data.devMac = gw_mac;
					this.setState({"setValue": data});
					if (res.code == "E2410002") c.setValidate("devMac", res.msg);
				}
			});
		}
	}
});
