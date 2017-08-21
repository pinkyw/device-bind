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
module.exports = React.createClass({
	getInitialState: function (){
		return {
			setValue: {"devMac": this.props.location.state.devmac}
		}
	},
	render: function(){
		return <div className="g-Container m-Devbinded">
				<h4 className="title">新设备激活</h4>
				<InputGroup label="设备MAC地址" name="devMac" setValue = {this.state.setValue} />
				<div className="errorTip"><i className="u-icon-failure"></i>该设备已经绑定了商户</div>
				<p>需要帮助请联系客户经理，或者拨打商户服务热线：<em>4008252525</em></p>
				<p>您页可以登录自服务平台对您的设备进行设置。</p>
				<p>自服务平台网址：<a href="http://pub.51awifi.com/" target="_blank">http://pub.51awifi.com/</a></p>
			</div>
	}
});