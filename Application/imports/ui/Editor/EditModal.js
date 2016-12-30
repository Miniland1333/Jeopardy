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
			isSinglePlay: false,
			questionType:"text",
			questionText: this.props.question,
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
				$("#imageView").attr("src",textFromFileLoaded);
				$("#imageURL").val(textFromFileLoaded);
			};
			fileReader.readAsDataURL(fileToLoad);
			$("#fileToLoad").value="";
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
					Meteor.call('editorDatabase.updateQuestion',
						this.props.roundName,
						this.props.key1,
						this.props.key2,
						null, //Needs full package
						answer.val(),
						this.state.isSinglePlay);
					break;
				case "video":
					Meteor.call('editorDatabase.updateQuestion',
						this.props.roundName,
						this.props.key1,
						this.props.key2,
						null, //Needs full package
						answer.val(),
						this.state.isSinglePlay);
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
						<div className="flex-container" style={{maxHeight:100,maxWidth:200,justifyContent:"center"}}>
							<img id="imageView" style={{maxHeight:100,maxWidth:200,}} />
						</div>
						<input id="imageURL" placeholder="http://" style={{maxHeight:20,}}
						       onChange={
						       	()=>{$("#imageView").attr("src",$("#imageURL").val());
						       	this.setState({questionText: $("#question").val()});}}/>
						<input type="file" id="imageToLoad" accept="image/*" onChange={this.handleFile} style={{position:"absolute", width:0,height:0}}/>
					</div>
					<textarea spellCheck="true" id="question" defaultValue={this.state.questionText}
					          placeholder="Question" style={textAreaStyle}/>
				</div>;
				break;
			case "video":
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
		switch(this.state.questionType) {
			case "text":
				mediaButtons = <div className="flex-container " style={{justifyContent: "flex-start",flex:1}}>
					<button style={imageStyle} onClick={this.handleAddImage}>Add Image</button>
					<button style={videoStyle} onClick={this.handleAddVideo}>Add Video</button>
				</div>;
				break;
			case "image":
				mediaButtons = <div className="flex-container " style={{justifyContent: "flex-start",flex:1}}>
					<button style={imageStyle} onClick={this.handleRemoveImage}>Remove Image</button>
					<button style={imageStyle} onClick={()=>{$("#imageToLoad").click()}}>Upload Image</button>
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