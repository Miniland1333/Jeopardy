import React from "react";
import QRCode from "qrcode.react";


export default class Connect extends React.Component {
	constructor(){
		super();
		this.state = {
			path:window.location.origin,
		}
	}
	render() {
		return <div className="flex-container" style={{flexDirection:"column", justifyContent:"space-around", alignItems:"center",flex:1}}>
			<QRCode value={this.state.path} size={300} bgColor="#060CE9" fgColor="#FFF" level="L"/>
			<input style={inputStyle} defaultValue={this.state.path} onChange={(e)=>this.setState({path: e.target.value})}/>
		</div>;
	}
}

const inputStyle = {
	fontSize: "6vw",
	backgroundColor: "transparent",
	color: "white",
	textAlign: "center",
	whiteSpace: "pre-wrap",
	width:"100%",
	border: 0,
};