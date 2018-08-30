import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";

import GameLi from "./GameLi";
import deepEqual from "deep-equal";


export default class EditorHeader extends React.Component {
	static propTypes = {
		gameList: PropTypes.array.isRequired,
		editorDatabase: PropTypes.object.isRequired,
		dbReady: PropTypes.bool.isRequired,
		onRoundChange: PropTypes.func.isRequired,
	};

	onUserInput = (name) => {
		Meteor.call('editorDatabase.updateName', name.target.value);
	};

	handleNew = () => {
		if (!this.checkDifference() || confirm("This will delete all unsaved work. Continue?")) {
			Meteor.call('editorDatabase.init');
			$("#myDropdown").slideUp();
		}
	};

	handleLoad = () => {
		$("#myDropdown").slideToggle();
	};

	handleSave = () => {
		if (this.props.editorDatabase.name.trim() == "") {
			alert("Name field cannot be empty!");
		}
		else if (confirm("This will overwrite any game with the same name.\nEmpty Columns will be ignored\nContinue?")) {
			Meteor.call('gameDatabase.save', this.props.editorDatabase);
		}
	};

	handleImport = () => {
		if (!this.checkDifference() || confirm("This will delete all unsaved work. Continue?")) {
			$("#myDropdown").slideUp();

			$("#fileToLoad").click();
		}
	};

	handleFile = () => {
		const fileToLoad = document.getElementById("fileToLoad").files[0];
		if (fileToLoad) {
			const fileReader = new FileReader();
			fileReader.onload = function (fileLoadedEvent) {
				let textFromFileLoaded = fileLoadedEvent.target.result;
				try {
					textFromFileLoaded = JSON.parse(textFromFileLoaded);
					Meteor.call('editorDatabase.load', textFromFileLoaded);
				} catch (err) {
					alert("Invalid File!");
				}
			};
			fileReader.readAsText(fileToLoad, "UTF-8");
		}
		$("#fileToLoad").val("");
	};

	destroyClickedElement = (event) => {
		document.body.removeChild(event.target);
	};

	handleExport = () => {
		const textToSave = JSON.stringify(this.props.editorDatabase, null, "\t");
		const textToSaveAsBlob = new Blob([textToSave], {type: "application/json"});
		const textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
		const fileNameToSaveAs = this.props.editorDatabase.name.trim() + '.json';

		const downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		downloadLink.href = textToSaveAsURL;
		downloadLink.onclick = this.destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);

		downloadLink.click();

	};

	handleRound = (e) => {
		const round = e.target.value;
		this.props.onRoundChange(round);
	};

	renderDropdown = () => {
		const self = this;
		const dropdown = [<li key="username" style={{
			position: "relative",
			listStyle: "none",
			padding: 15,
			borderBottom: "#eee solid 1px",}}>
			<span className="text">User: {this.props.student}</span>
		</li>];
		return dropdown.concat($.map(this.props.gameList, function (game) {
			return (<GameLi key={game.name} game={game} checkDifference={() => self.checkDifference()}/>)
		}));
	};

	refresh = () => {
		$(".Main").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		$("body").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		$("#myModal").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
	};

	renderInput = () => {
		return <input
				spellCheck="true"
				key="input"
				type="text"
				placeholder="Type the Game name here"
				style={inputStyle}
				onChange={this.onUserInput}
				value={this.props.editorDatabase.name}
				onBlur={this.refresh}
			/>;
	};

	render() {
		return (
			<div>
				<div className="flex-container" style={barStyle}>
					<button style={buttonStyle} id="New" onClick={this.handleNew}>New</button>
					<div className="dropdown" style={{border: "none"}}>
						<button style={loadButtonStyle} id="Load" onClick={this.handleLoad}>Load</button>
						<ul className="dropdown-content" id="myDropdown" style={dropdownStyle}>
							{this.renderDropdown()}
						</ul>
					</div>
					{this.checkDifference() ? <button style={{
							backgroundColor: '#8bd248', // green
							border: 'white solid 1px',
							color: 'black',
							padding: '15px 1vw',
							textAlign: 'center',
							textDecoration: 'none',
							display: 'inline-block',
							fontSize: medium,
							cursor: "pointer",
							transition: "1s",
						}} id="Save" onClick={this.handleSave}>Save changes</button> :
						<button style={buttonStyle} id="Save">Save updated</button>
					}
					{this.renderInput()}
					<select
						style={pickerStyle}
						id="selector"
						onChange={this.handleRound}>
						<option value="Single">Single</option>
						<option value="Double">Double</option>
						<option value="Final">Final</option>
					</select>
					<button style={buttonStyle} id="Import" onClick={this.handleImport}>Import</button>
					<button style={buttonStyle} id="Export" onClick={this.handleExport}>Export</button>
					<input type="file" id="fileToLoad" accept=".txt,.json" onChange={this.handleFile}
					       style={{position: "absolute", display: "none", width: 0, height: 0}}/>
				</div>
			</div>
		)
	}

	needsSaving() {
		if (this.checkDifference()) {
			$("#Save").hide("slide");
		}
		else {
			$("#Save").show("slide");
		}
	}

	checkDifference() {
		const editorDatabase = this.props.editorDatabase;
		const saved = this.props.gameList.find((game) => game.name === editorDatabase.name);

		return !(saved
			&& deepEqual(saved.Jeopardy, editorDatabase.Jeopardy)
			&& deepEqual(saved.DoubleJeopardy, editorDatabase.DoubleJeopardy)
			&& deepEqual(saved.FinalJeopardy, editorDatabase.FinalJeopardy))
	}
}

const medium = "2vmin";

const barStyle = {
	fontSize: 16,
	backgroundColor: "#f5f6f7",
	overflow: "auto"
};
const buttonStyle = {
	backgroundColor: '#FFD700', // yellow
	border: 'white solid 1px',
	color: 'black',
	padding: '15px 1vw',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: medium,
	transition: "1s",
	cursor: "pointer",
};
const loadButtonStyle = {
	backgroundColor: '#FFD700', // yellow
	color: 'black',
	padding: '16px 1vw',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: medium,
	border: "white solid 1px",
	//borderRadius:8,
	cursor: "pointer",
};
const pickerStyle = {
	backgroundColor: '#FFD700', // yellow 
	border: 'white solid 1px',
	color: 'black',
	padding: '15px 0px',
	textAlign: 'center',
	textDecoration: 'none',
	display: 'inline-block',
	fontSize: medium,
	//borderRadius:8,
	cursor: "pointer",
};
const inputStyle = {
	maxWidth: "100%",
	boxSizing: "border-box",
	padding: "10px 0",
	background: "transparent",
	border: "none",
	fontSize: medium,
	textAlign: "center",
	flexGrow: 1
};
const dropdownStyle = {
	display: 'none',
	position: 'absolute',
	backgroundColor: 'white',
	minWidth: 160,
	maxHeight: 500,
	boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
	overflow: "auto",
	color: "black",
	margin: 0,
	padding: 0,
};
