import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';


const modalStyle = {
	display: 'none', /* hidden by default */
	position: 'fixed', /* stay in place */
	zIndex: 1, /* sit on top */
	left: 0, top: 0, width: '100%', /* full width */
	height: '100%', /* full height */
	overflow: 'hide', /* enable scroll if needed */
	backgroundColor: 'rgba(0,0,0,0.4)',
};
const modalContentStyle = {
	margin: '15% auto',
	padding: 20,
	border: '1px solid #888',
	width: '80%',
	backgroundColor: "#fefefe",
	color: "black",
	flexDirection: "column",
	boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)",
};
const headerStyle = {
	maxWidth: "100%",
	boxSizing: "border-box",
	padding: "10px 0",
	background: "#060CE9",
	border: "none",
	fontSize: 16,
	textAlign: "center",
	flexGrow: 1,
	textTransform: "uppercase",
	color: "white",
};
const textAreaStyle = {
	maxWidth: "100%",
	boxSizing: "border-box",
	padding: "10px 0",
	background: "#060CE9",
	border: "none",
	fontSize: 16,
	textAlign: "center",
	flexGrow: 1,
	textTransform: "uppercase",
	color: "white",
	minHeight: 120,
};
const answerStyle = {
	maxWidth: "100%",
	boxSizing: "border-box",
	padding: "10px 0",
	background: "#060CE9",
	border: "none",
	fontSize: 16,
	textAlign: "center",
	flexGrow: 1,
	color: "white",
};
const playStyle = {
	backgroundColor: '#ff9900', /* green */
	border: 'white solid 1px',
	color: 'white',
	padding: '15px 21px',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: 20,
	width: 200,
	//borderRadius:8,
	cursor: "pointer",
};
const cancelStyle = {
	backgroundColor: '#FFD700', /* green */
	border: 'white solid 1px',
	color: 'white',
	padding: '15px 21px',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: 20,
	//borderRadius:8,
	cursor: "pointer",
};
const imageStyle = {
	backgroundColor: '#6690ff', /* green */
	border: 'white solid 5px',
	color: 'white',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: 20,
	borderRadius:8,
	cursor: "pointer",
};
const videoStyle = {
	backgroundColor: '#bb0000', /* green */
	border: 'white solid 5px',
	color: 'white',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: 20,
	borderRadius:8,
	cursor: "pointer",
};
const saveStyle = {
	backgroundColor: '#4CAF50', /* green */
	border: 'white solid 1px',
	color: 'white',
	padding: '15px 21px',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: 20,
	//borderRadius:8,
	cursor: "pointer",
};
const buttonHolderStyle = {
	justifyContent: "flex-end",
};
const verticalFlexStyle = {
	flexDirection: "column",
};

export const EditModal = React.createClass({
	getInitialState: function () {
		return {
			isSinglePlay: this.props.isSinglePlay,
			questionType:"text",
			questionText: typeof this.props.question==="string"?this.props.question:"",
		}
	},
	getDefaultProps: function () {
		return {
			roundName: "",
			categoryName: "",
			question: "",
			answer: "",
			isSinglePlay: false,
			isHeader: false,
			key1: "",
			key2: "",
			handleClose: function () {
			},
		};
	},
	propTypes: {
		roundName: React.PropTypes.string,
		categoryName: React.PropTypes.string,
		question: React.PropTypes.oneOfType([React.PropTypes.string,React.PropTypes.object]),
		answer: React.PropTypes.string,
		isSinglePlay: React.PropTypes.bool,
		isHeader: React.PropTypes.bool,
		key1: React.PropTypes.string,
		key2: React.PropTypes.string,
		handleClose: React.PropTypes.func,
	},
	componentDidMount: function () {
		$("#myModal").fadeIn();
		if(typeof this.props.question==="string") {
			
		}else{
			if (this.props.question.type=="image"){
				this.setState({questionType: "image"});
				this.setState({questionText: this.props.question.text});
			}else{
				this.setState({questionType: "video"});
			}
		}
	},
	handleAddImage:function () {
		this.setState({questionText: $("#question").val()});
		this.setState({questionType: "image"});
	},
	handleAddVideo:function () {
		this.setState({questionText: $("#question").val()});
		this.setState({questionType: "video"});
	},
	handleFile:function () {
		var fileToLoad = document.getElementById("imageToLoad").files[0];
		if(fileToLoad!="") {
			var fileReader = new FileReader();
			fileReader.onload = function (fileLoadedEvent) {
				var textFromFileLoaded = fileLoadedEvent.target.result;
				console.log(fileToLoad.size);
				if(fileToLoad.size>1500000){
					alert("File exceeds individual limit of 1MB!")
				}else {
					$("#imageView").attr("src", textFromFileLoaded);
					$("#imageURL").val(textFromFileLoaded);
				}
			};
			fileReader.readAsDataURL(fileToLoad);
			$("#fileToLoad").value="";
		}
	},
	parseVID:function (videoURL) {
		let videoID = videoURL.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
		if(videoID != null) {
			console.log("video id = ",videoID[2]);
			
			return videoID[2];
		} else {
			console.log("Invalid URL");
			return null;
		}
	},
	handleTime:function () {
		let VID = $("#VID").val();
		let start = $("#Start").val();
		let end = $("#End").val();
		const extraTime = function () {
			let extra = "";
			let min=0;
			if(start!=""){
				if(start.includes(":")){
					let tempArray = start.split(":");
					start = parseInt(tempArray[0]*60,10)+parseInt(tempArray[1],10);
				}
				min = start;
				extra+="&start="+start;
			}
			if (end != ""){
				if(end.includes(":")) {
					let tempArray = end.split(":");
					end = tempArray[0] * 60 + tempArray[1];
				}
				if(end > min) {
					extra += "&end=" + end;
				}
			}
			return extra;
		};
		if(VID!=null){
			videoURL = "https://www.youtube.com/embed/"+VID+"?autoplay=1&disablekb=1&controls=0&showinfo=0&rel=0"+extraTime();
			
			$("#Embed").val(videoURL);
			$("#videoView").attr("src",videoURL);}
	},
	handleSeconds:function (JQuery) {
		let working = JQuery.val();
		if(!working.includes(":")&&working!=""){
			if(working%60<10){
				JQuery.val(Math.floor(working / 60) + ":0" + working % 60);
			}else {
				JQuery.val(Math.floor(working / 60) + ":" + working % 60);
			}
		}
	},
	handleRemoveImage:function () {
		this.setState({questionText: $("#question").val()});
		this.setState({questionType: "text"});
	},
	handleRemoveVideo:function () {
		this.setState({questionType: "text"});
	},
	handlePlay: function () {
		this.setState({isSinglePlay: !this.state.isSinglePlay})
	},
	handleCancel: function () {
		$("#myModal").fadeOut(this.props.handleClose);
	},
	handleComplete: function () {
		if (this.props.isHeader) {
			Meteor.call('editorDatabase.updateCategory',
				this.props.roundName,
				this.props.key1,
				$("#category").val());
		} else {
			const question = $("#question");
			const answer = $("#answer");
			let bundle;
			switch (this.state.questionType){
				case "text":
					Meteor.call('editorDatabase.updateQuestion',
						this.props.roundName,
						this.props.key1,
						this.props.key2,
						question.val(),
						answer.val(),
						this.state.isSinglePlay);
					break;
				case "image":
					let image =$("#imageView").attr("src");
					if(image!=undefined) {
						bundle = {
							type: "image",
							image: image,
							text: question.val(),
						};
						Meteor.call('editorDatabase.updateQuestion',
							this.props.roundName,
							this.props.key1,
							this.props.key2,
							bundle,
							answer.val(),
							this.state.isSinglePlay);
					}else{
						Meteor.call('editorDatabase.updateQuestion',
							this.props.roundName,
							this.props.key1,
							this.props.key2,
							"",
							"",
							false);
					}
					break;
				case "video":
					let VID = $("#VID").val();
					if(VID!=""){
						bundle ={
							type:"video",
							URL:$("#Embed").val(),
							VID:VID,
							start:$("#Start").val(),
							end:$("#End").val(),
						};
						Meteor.call('editorDatabase.updateQuestion',
							this.props.roundName,
							this.props.key1,
							this.props.key2,
							bundle,
							answer.val(),
							this.state.isSinglePlay);
						break;
					}else {
						Meteor.call('editorDatabase.updateQuestion',
							this.props.roundName,
							this.props.key1,
							this.props.key2,
							"",
							"",
							false);
					}
					break;
			}
		}
		this.handleCancel();
	},
	renderModalContent: function () {
		if (this.props.isHeader) {
			return <div className="flex-container" style={verticalFlexStyle}><h1>Category Name</h1>
				<input id="category" defaultValue={this.props.categoryName} placeholder="Category Name"
				       spellCheck="true" style={headerStyle}/></div>
		}
		let questionContent;
		switch(this.state.questionType) {
			case "text":
				questionContent = <textarea spellCheck="true" id="question" defaultValue={this.state.questionText}
				                            placeholder="Question" style={textAreaStyle}/>;
				break;
			case "image":
				questionContent = <div className="flex-container">
					<div className="flex-container" style={{maxWidth:200, maxHeight:120, background: "#f2f3ea", flexDirection:"column",}}>
						<div className="flex-container" style={{maxHeight:100,maxWidth:200,justifyContent:"center",flex:1}}>
							<img id="imageView" src={this.props.question.image} style={{maxHeight:100,maxWidth:200,}} />
						</div>
						<input id="imageURL" placeholder="http://" type="url" defaultValue={this.props.question.image} style={{maxHeight:20,}}
						       onChange={
							       ()=>{$("#imageView").attr("src",$("#imageURL").val());
								       this.setState({questionText: $("#question").val()});}}/>
						<input type="file" id="imageToLoad" accept="image/*" onChange={this.handleFile} style={{position:"absolute", display:"none", width:0,height:0}}/>
					</div>
					<textarea spellCheck="true" id="question" defaultValue={this.state.questionText}
					          placeholder="Question" style={textAreaStyle}/>
				</div>;
				break;
			//https://www.youtube.com/embed/j-_F5xSjrdY?autoplay=1&disablekb=1&controls=0&showinfo=0&rel=0
			case "video":
				questionContent = <div className="flex-container" style={{maxWidth:"100%",maxHeight:120, background: "#f2f3ea",flexGrow:1}}>
					<iframe id="videoView" width="213" height="120" src={this.props.question.URL} style={{flex:0, border:"none", background:"black"}}></iframe>
					<div className="flex-container" style={{flex:1, flexDirection:"column"}}>
						<div className="flex-container" style={{flex:1}}>
							<div style={{width:80}}>Video URL</div>
							<input id="videoURL" type="url" placeholder="http://www.youtube.com/" style={{flex:1}}
							       onChange={
								       ()=>{
									       let videoURL = $("#videoURL").val();
									       let VID = this.parseVID(videoURL);
									       if(VID!=null){
										       videoURL = "https://www.youtube.com/embed/"+VID+"?autoplay=1&disablekb=1&controls=0&showinfo=0&rel=0";
										       $("#Start").val("");
										       $("#End").val("");
										
										       $("#VID").val(VID);
										       $("#Embed").val(videoURL);
										       $("#videoView").attr("src",videoURL);}
								       }
							       }/>
						</div>
						<div className="flex-container" style={{flex:1}}>
							<div style={{width:80}}>Video ID</div>
							<input disabled id="VID" defaultValue={this.props.question.VID} style={{flex:1,background:"#f2f3ea"}}/>
						</div>
						
						<div className="flex-container" style={{flex:1}}>
							<div style={{width:80}}>Start Time</div>
							<input id="Start" defaultValue={this.props.question.start} placeholder="00:00" style={{flex:1}} onChange={this.handleTime} onBlur={()=>{this.handleSeconds($("#Start"));}}/>
						</div>
						<div className="flex-container" style={{flex:1}}>
							<div style={{width:80}}>End Time</div>
							<input id="End"   defaultValue={this.props.question.end}   placeholder="00:00" style={{flex:1}} onChange={this.handleTime} onBlur={()=>{this.handleSeconds($("#End"));}}/>
						</div>
						<div className="flex-container" style={{flex:1}}>
							<div style={{width:80}}>Embed URL</div>
							<input disabled="true" id="Embed" defaultValue={this.props.question.URL} style={{flex:1, background:"#f2f3ea"}}/>
						</div>
					</div>
				</div>;
				break;
		}
		return <div className="flex-container" style={verticalFlexStyle}>
			<h1>Question</h1>
			{questionContent}
			<h2>Answer</h2>
			<input id="answer" spellCheck="true" defaultValue={this.props.answer}
			       placeholder="Answer" style={answerStyle}/></div>
	},
	renderButtons: function () {
		let mediaButtons;
		switch(!this.props.isHeader&&this.state.questionType) {
			case "text":
				mediaButtons = <div className="flex-container " style={{justifyContent: "flex-start",flex:1}}>
					<button style={imageStyle} onClick={this.handleAddImage}>Add Image</button>
					<button style={videoStyle} onClick={this.handleAddVideo}>Add Video</button>
				</div>;
				break;
			case "image":
				mediaButtons = <div className="flex-container " style={{justifyContent: "flex-start",flex:1}}>
					<button style={imageStyle} onClick={this.handleRemoveImage}>Remove Image</button>
					{/*<button style={imageStyle} onClick={()=>{$("#imageToLoad").click()}}>Upload Image</button>*/}
				</div>;
				break;
			case "video":
				mediaButtons = <div className="flex-container " style={{justifyContent: "flex-start",flex:1}}>
					<button style={videoStyle} onClick={this.handleRemoveVideo}>Remove Video</button>
				</div>;
				break;
		}
		
		return <div className="flex-container " style={{flex:1}}>
			{mediaButtons}
			<div className="flex-container " style={{justifyContent: "flex-end",flex:1}}>
				{!this.props.isHeader && this.props.roundName != "FinalJeopardy" ?
					<button style={playStyle} onClick={this.handlePlay}>Single
						Play {this.state.isSinglePlay ? "ON  " : "OFF"}</button> : ""}
				<button style={cancelStyle} onClick={this.handleCancel}>Close</button>
				<button style={saveStyle} onClick={this.handleComplete}>Save</button>
			</div>
		</div>
	},
	render: function () {
		return (
			<div id="myModal" style={modalStyle}>
				<div className="modal-content flex-container" style={modalContentStyle}>
					{this.renderModalContent()}
					{this.renderButtons()}
				</div>
			</div>
		)
	}
	
});

module.exports = EditModal;