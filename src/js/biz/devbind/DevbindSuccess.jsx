/**
 * 创建日期: 2017-06-05 10:28
 * 创建作者: 王璐平 525627328@qq.com
 * 文件名称: DevbindSuccess
 * 版本: v1.0
 * 功能: xx
 * 修改记录: xx
 */
const React = require('react');
const ReactDOM = require('react-dom');
const complete = require('../../../img/icon_complete.png');
const erweima = require('../../../img/erweima.png');
const qianming = require('../../../img/qianming.png');
module.exports = React.createClass({
	render: function(){
		return <div className="g-Container m-DevbindSuccess">
				<h4 className="title">新设备激活</h4>
				<div className="successTip"><img className="u-icon-complete" src={complete}/>新设备激活成功。</div>
				<p>请关注微信公众号：爱wifi商户服务，进入爱WiFi微站配置店铺个性化广告页</p>
				<p>扫一扫以下二维码或长按二维码进行识别</p>
				<img className="u-icon-erweima" src={erweima}/><br/>
				<img className="u-icon-qianming" src={qianming} />
			</div>
	}
});