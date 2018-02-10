import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";
import "../jquery-ui";
import "blueimp-file-upload";
import cloudinary from "cloudinary-jquery-file-upload";

const medium = "2vmin";

const modalStyle = {
	display: 'none', /* hidden by default */
	position: 'fixed', /* stay in place */
	zIndex: 1, /* sit on top */
	left: 0, top: 0, width: '100%', /* full width */
	height: '100%', /* full height */
	overflow: 'hide', /* enable scroll if needed */
	backgroundColor: 'rgba(0,0,0,0.4)',
	flexDirection: 'column',
	justifyContent: 'center',
	alignContent: 'center',
};

const modalContainer = {
	display: 'flex',
	flexDirection: "column",
	alignItems: 'center',
	alignContent: 'center',
	justifyContent: 'center',
	height: 'inherit',
};

const modalContentStyle = {
	margin: '0% auto',
	padding: '3vmin',
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
	fontSize: medium,
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
	fontSize: medium,
	textAlign: "center",
	flexGrow: 1,
	textTransform: "uppercase",
	color: "white",
	minHeight: 150,
	overflowX: "hidden",
};
const textAreaStyleDisabled = {
	maxWidth: "100%",
	boxSizing: "border-box",
	padding: "10px 0",
	background: "#606298",
	border: "none",
	fontSize: medium,
	textAlign: "center",
	flexGrow: 1,
	textTransform: "uppercase",
	color: "white",
	minHeight: 150,
	overflowX: "hidden",
};
const answerStyle = {
	maxWidth: "100%",
	boxSizing: "border-box",
	padding: "10px 0",
	background: "#060CE9",
	border: "none",
	fontSize: medium,
	textAlign: "center",
	flexGrow: 1,
	color: "white",
};
const playStyle = {
	backgroundColor: '#ff9900', /* green */
	border: 'white solid 1px',
	color: 'white',
	padding: '15px 2vw',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: medium,
	maxWidth: 200,
	//borderRadius:8,
	cursor: "pointer",
};
const cancelStyle = {
	backgroundColor: '#FFD700', /* green */
	border: 'white solid 1px',
	color: 'white',
	padding: '15px 2vw',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: medium,
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
	fontSize: medium,
	borderRadius: 8,
	cursor: "pointer",
};
const videoStyle = {
	backgroundColor: '#bb0000', /* green */
	border: 'white solid 5px',
	color: 'white',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: medium,
	borderRadius: 8,
	cursor: "pointer",
};
const saveStyle = {
	backgroundColor: '#4CAF50', /* green */
	border: 'white solid 1px',
	color: 'white',
	padding: '15px 2vw',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: medium,
	//borderRadius:8,
	cursor: "pointer",
};
const verticalFlexStyle = {
	flexDirection: "column",
};

export default class EditModal extends React.Component {
	static defaultProps = {
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
	
	static propTypes = {
		roundName: PropTypes.string,
		categoryName: PropTypes.string,
		categoryExplanation: PropTypes.string,
		question: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		answer: PropTypes.string,
		isSinglePlay: PropTypes.bool,
		isHeader: PropTypes.bool,
		key1: PropTypes.string,
		key2: PropTypes.string,
		handleClose: PropTypes.func,
	};
	
	state = {
		isSinglePlay: this.props.isSinglePlay,
		questionType: "text",
		questionText: typeof this.props.question === "string" ? this.props.question : "",
		imageURL: this.props.question.image,
	};
	
	componentDidMount() {
		$("#myModal").fadeIn();
		if (typeof this.props.question === "string") {
			
		}
		else {
			if (this.props.question.type === "image") {
				this.setState({questionType: "image"});
				this.setState({questionText: this.props.question.text});
			}
			else {
				this.setState({questionType: "video"});
			}
		}
		$.cloudinary.config({cloud_name: 'hiqjgs7wz'});
		this.handleUpload();
	}
	
	componentDidUpdate() {
		this.handleUpload();
	}
	
	handleUpload = () => {
		$("#cloudinary-fileupload").cloudinary_fileupload({maxFileSize: 40000000}).bind('cloudinarydone', (e, data) => {
			data.result.url = data.result.url.replace(/.mov$/gi, ".mp4");
			data.result.url = data.result.url.replace(/^http:/i, "https:");
			const imageURL = $("#imageURL");
			this.setState({imageURL: data.result.url});
			
			imageURL.effect("highlight", {color: "#05f308"});
			imageURL.val(data.result.url);
		}).bind('fileuploadprogress', function (e, data) {
			const $uploadProgress = $('#uploadProgress');
			$uploadProgress.val(Math.round((data.loaded * 100.0) / data.total));
			$uploadProgress.prop('title', Math.round((data.loaded * 100.0) / data.total))
		}).bind('fileuploadfail', function (e, data) {
			let array = $.map(data.messages, function (value, index) {
				return value;
			});
			const $uploadProgress = $('#uploadProgress');
			$uploadProgress.val(0);
			$uploadProgress.prop('title', "Upload Progress");
			console.log(array);
			alert(array);
			$('#cloudinary-fileupload').effect("highlight", {color: "#ff5c7c"});
		});
	};
	
	handleAddImage = () => {
		this.setState({questionText: $("#question").val()});
		this.setState({questionType: "image"});
	};
	
	handleAddVideo = () => {
		this.setState({questionText: $("#question").val()});
		this.setState({questionType: "video"});
	};
	
	parseVID = (videoURL) => {
		let videoID = videoURL.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
		if (videoID != null) {
			console.log("video id = ", videoID[2]);
			
			return videoID[2];
		}
		else {
			console.log("Invalid URL");
			return null;
		}
	};
	
	handleTime = () => {
		let VID = $("#VID").val();
		let start = $("#Start").val();
		let end = $("#End").val();
		const extraTime = function () {
			let extra = "";
			let min = 0;
			if (start != "") {
				if (start.includes(":")) {
					let tempArray = start.split(":");
					start = parseInt(tempArray[0] * 60, 10) + parseInt(tempArray[1], 10);
				}
				min = start;
				extra += "&start=" + start;
			}
			if (end != "") {
				if (end.includes(":")) {
					let tempArray = end.split(":");
					end = parseInt(tempArray[0] * 60, 10) + parseInt(tempArray[1], 10);
				}
				if (end > min) {
					extra += "&end=" + end;
				}
			}
			return extra;
		};
		if (VID != null) {
			videoURL = "https://www.youtube.com/embed/" + VID + "?autoplay=1&disablekb=1&iv_load_policy=3&modestbranding=1&controls=0&showinfo=0&rel=0" + extraTime();
			
			$("#Embed").val(videoURL);
			$("#videoView").attr("src", videoURL);
		}
	};
	
	handleSeconds = (JQuery) => {
		let working = JQuery.val();
		if (!working.includes(":") && working != "") {
			if (working % 60 < 10) {
				JQuery.val(Math.floor(working / 60) + ":0" + working % 60);
			}
			else {
				JQuery.val(Math.floor(working / 60) + ":" + working % 60);
			}
		}
	};
	
	handleRemoveImage = () => {
		this.setState({questionText: $("#question").val()});
		this.setState({questionType: "text"});
	};
	
	handleRemoveVideo = () => {
		this.setState({questionType: "text"});
	};
	
	handlePlay = () => {
		this.setState({isSinglePlay: !this.state.isSinglePlay})
	};
	
	handleExit = () => {
		$("#myModal").fadeOut(this.props.handleClose);
	};
	
	handleComplete = () => {
		if (this.props.isHeader) {
			Meteor.call('editorDatabase.updateCategory',
				this.props.roundName,
				this.props.key1,
				$("#category").val(),
				$("#categoryExplanation").val());
		}
		else {
			const question = $("#question");
			const answer = $("#answer");
			let bundle;
			switch (this.state.questionType) {
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
					let image = $("#imageURL").val();
					if (image != undefined) {
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
					}
					else {
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
					if (VID != "") {
						bundle = {
							type: "video",
							URL: $("#Embed").val(),
							VID: VID,
							start: $("#Start").val(),
							end: $("#End").val(),
						};
						Meteor.call('editorDatabase.updateQuestion',
							this.props.roundName,
							this.props.key1,
							this.props.key2,
							bundle,
							answer.val(),
							this.state.isSinglePlay);
						break;
					}
					else {
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
		this.handleExit();
	};
	
	getValue = () => {
		let value;
		let multiplier;
		switch (this.props.roundName) {
			case "Jeopardy":
				multiplier = 1;
				break;
			
			case "DoubleJeopardy":
				multiplier = 2;
				break;
			case "FinalJeopardy":
				return "";
		}
		switch (this.props.key2) {
			case "question1":
				value = 200;
				break;
			case "question2":
				value = 400;
				break;
			case "question3":
				value = 600;
				break;
			case "question4":
				value = 800;
				break;
			case "question5":
				value = 1000;
				break;
		}
		return " - $" + value * multiplier;
	};
	
	renderModalContent = () => {
		if (this.props.isHeader) {
			return <div className="flex-container" style={verticalFlexStyle}><h1>Category Name</h1>
				<input id="category" defaultValue={this.props.categoryName} placeholder="Category Name"
				       spellCheck="true" style={headerStyle}/>
				<div style={{height:10}}/>
				{this.props.roundName!=="FinalJeopardy"?<textarea id="categoryExplanation" defaultValue={this.props.categoryExplanation} placeholder="Category Explanation"
				       spellCheck="true" style={headerStyle}/>:null}</div>
		}
		let questionContent;
		switch (this.state.questionType) {
			case "text":
				questionContent = <textarea spellCheck="true" id="question" defaultValue={this.state.questionText}
				                            placeholder="Question" style={textAreaStyle}/>;
				break;
			case "image":
				questionContent = <div className="flex-container">
					<div className="flex-container"
					     style={{maxWidth: 200, background: "#f2f3ea", flexDirection: "column", borderRight:"4px solid white"}}>
						<div className="flex-container"
						     style={{maxHeight: 100, maxWidth: 200, justifyContent: "center", flex: 1, backgroundColor:"#060ce9"}}>
							{!this.state.imageURL || !this.state.imageURL.includes(".mp4") ?
								<img id="imageView" src={this.state.imageURL}
								     style={{maxHeight: 100, maxWidth: 200,}}/> :
								<video id="imageView" src={this.state.imageURL}
								       style={{maxHeight: 100, maxWidth: 200,}} autoPlay controls/>}
						</div>
						<input id="imageURL" placeholder="Type link http://" type="url"
						       defaultValue={this.state.imageURL}
						       style={{maxHeight: 20,}}
						       onChange={
							       () => {
								       let value = $("#imageURL").val();
								       $("#imageView").attr("src", value);
								       this.setState({
									       imageURL: value,
									       questionText: $("#question").val()
								       });
							       }}/>
						<div style={{border:"1px solid black"}}/>
						<input name="file" type="file" id="cloudinary-fileupload" accept="image/*,video/mp4"
						       title="Upload a file"
						       data-cloudinary-field="imageURL"
						       data-form-data="{ &quot;upload_preset&quot;:  &quot;dem5rqai&quot;, &quot;callback&quot;: &quot;/cloudinary_cors.html&quot;}"/>
						<div title="File size must be below this limit!">10MB photo/40MB video limit</div>
						<progress id="uploadProgress" value={0} max={100} title="Upload Progress"
						          style={{width: "100%"}}/>
					</div>
					{!this.state.imageURL || !this.state.imageURL.includes(".mp4") ?
						<textarea spellCheck="true" id="question" defaultValue={this.state.questionText}
						          placeholder="Question" style={textAreaStyle}/> :
						<div className="flex-container" style={{flex: 1, flexDirection: "column"}}>
							<textarea
								spellCheck="true" id="question" defaultValue={this.state.questionText}
								placeholder="Question" style={textAreaStyleDisabled} disabled/>
							<div>Video Question-Text disabled</div>
						</div>}
				</div>;
				break;
			//https://www.youtube.com/embed/j-_F5xSjrdY?autoplay=1&disablekb=1&controls=0&showinfo=0&rel=0
			case "video":
				questionContent = <div className="flex-container"
				                       style={{maxWidth: "100%", maxHeight: 120, background: "#f2f3ea", flexGrow: 1}}>
					<iframe id="videoView" width="213" height="120" src={this.props.question.URL}
					        style={{flex: 0, border: "none", background: "black"}}/>
					<div className="flex-container" style={{flex: 1, flexDirection: "column"}}>
						<div className="flex-container" style={{flex: 1}}>
							<div style={{width: 80}}>Video URL</div>
							<input id="videoURL" type="url" placeholder="http://www.youtube.com/" style={{flex: 1}}
							       onChange={
								       () => {
									       let videoURL = $("#videoURL").val();
									       let VID = this.parseVID(videoURL);
									       if (VID != null) {
										       videoURL = "https://www.youtube.com/embed/" + VID + "?autoplay=1&disablekb=1&iv_load_policy=3&modestbranding=1&controls=0&showinfo=0&rel=0";
										       $("#Start").val("");
										       $("#End").val("");
										
										       $("#VID").val(VID);
										       $("#Embed").val(videoURL);
										       $("#videoView").attr("src", videoURL);
									       }
								       }
							       }/>
						</div>
						<div className="flex-container" style={{flex: 1}}>
							<div style={{width: 80}}>Video ID</div>
							<input disabled id="VID" defaultValue={this.props.question.VID}
							       style={{flex: 1, background: "#f2f3ea"}}/>
						</div>
						
						<div className="flex-container" style={{flex: 1}}>
							<div style={{width: 80}}>Start Time</div>
							<input id="Start" defaultValue={this.props.question.start} placeholder="00:00"
							       style={{flex: 1}} onChange={this.handleTime} onBlur={() => {
								this.handleSeconds($("#Start"));
							}}/>
						</div>
						<div className="flex-container" style={{flex: 1}}>
							<div style={{width: 80}}>End Time</div>
							<input id="End" defaultValue={this.props.question.end} placeholder="00:00" style={{flex: 1}}
							       onChange={this.handleTime} onBlur={() => {
								this.handleSeconds($("#End"));
							}}/>
						</div>
						<div className="flex-container" style={{flex: 1}}>
							<div style={{width: 80}}>Embed URL</div>
							<input disabled="true" id="Embed" defaultValue={this.props.question.URL}
							       style={{flex: 1, background: "#f2f3ea"}}/>
						</div>
					</div>
				</div>;
				break;
		}
		return <div className="flex-container" style={verticalFlexStyle}>
			<h1>Question{this.getValue()}</h1>
			{questionContent}
			<h2>Answer</h2>
			<input id="answer" spellCheck="true" defaultValue={this.props.answer}
			       placeholder="Answer" style={answerStyle}/></div>
	};
	
	renderButtons = () => {
		let mediaButtons;
		switch (!this.props.isHeader && this.state.questionType) {
			case "text":
				mediaButtons = <div className="flex-container " style={{justifyContent: "flex-start", flex: 1}}>
					<button style={imageStyle} onClick={this.handleAddImage}>Add Image/Video</button>
					<button style={videoStyle} onClick={this.handleAddVideo}>Add Youtube</button>
				</div>;
				break;
			case "image":
				mediaButtons = <div className="flex-container " style={{justifyContent: "flex-start", flex: 1}}>
					<button style={imageStyle} onClick={this.handleRemoveImage}>Remove Image/Video</button>
				</div>;
				break;
			case "video":
				mediaButtons = <div className="flex-container " style={{justifyContent: "flex-start", flex: 1}}>
					<button style={videoStyle} onClick={this.handleRemoveVideo}>Remove YouTube</button>
				</div>;
				break;
		}
		
		return <div className="flex-container " style={{flex: 1}}>
			{mediaButtons}
			<div className="flex-container " style={{justifyContent: "flex-end", flex: 1}}>
				{!this.props.isHeader && this.props.roundName != "FinalJeopardy" ?
					<button style={playStyle} onClick={this.handlePlay}>Single
						Play {this.state.isSinglePlay ? "ON  " : "OFF"}</button> : ""}
				<button style={cancelStyle} onClick={this.handleExit}>Close</button>
				<button style={saveStyle} onClick={this.handleComplete}>Save</button>
			</div>
		</div>
	};
	
	render() {
		return (
			<div id="myModal" style={modalStyle}>
				<div style={modalContainer}>
					<div className="modal-content flex-container" style={modalContentStyle}>
						{this.renderModalContent()}
						{this.renderButtons()}
					</div>
				</div>
			</div>
		)
	}
}