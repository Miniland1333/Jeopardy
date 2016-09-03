import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import GameLi from "./GameLi";


var barStyle = {
    fontSize: 16,
    backgroundColor: "#f5f6f7",
    overflow:"auto"
};
var buttonStyle = {
    backgroundColor: '#FFD700', /* green */
    border: 'white solid 1px',
    color: 'white',
    padding: '15px 21px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: 20,
    //borderRadius:8,
    cursor:"pointer",
};
var loadButtonStyle = {
    backgroundColor: '#FFD700', /* green */
    color: 'white',
    padding: '16px 21px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: 20,
    border:"white solid 1px",
    //borderRadius:8,
    cursor:"pointer",
};
var pickerStyle = {
    backgroundColor: '#FFD700', /* green */
    border: 'white solid 1px',
    color: 'white',
    padding: '15px 0px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: 20,
    //borderRadius:8,
    cursor:"pointer",
};
var inputStyle={
    maxWidth:"100%",
    boxSizing: "border-box",
    padding: "10px 0",
    background: "transparent",
    border: "none",
    fontSize: 16,
    textAlign:"center",
    flexGrow:1
};
var dropdownStyle = {
    display: 'none',
    position: 'absolute',
    backgroundColor: '#f9f9f9',
    minWidth: 160,
    maxHeight:500,
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    overflow:"auto",
    color:"black",
};

var EditorHeader = React.createClass({
    propTypes:{
        gameList: PropTypes.array.isRequired,
        editorDatabase: PropTypes.array.isRequired,
        dbReady: PropTypes.bool.isRequired,
        onRoundChange: PropTypes.func.isRequired,
    },
    onUserInput:function (name){
        Meteor.call('editorDatabase.updateName',name.target.value);
    },
    handleNew:function (e) {
        if(confirm("This will delete all unsaved work. Continue?")) {
            Meteor.call('editorDatabase.init');
            $("#myDropdown").slideUp();
        }
    },
    handleLoad:function (e) {
        $("#myDropdown").slideToggle();
    },
    handleSave:function (e) {
        if(this.props.editorDatabase[0].name.trim()=="") {
            alert("Name field cannot be empty!");
        }else if(confirm("This will overwrite any game with the same name.\nEmpty Columns will be ignored\nContinue?")) {
            Meteor.call('gameDatabase.save',this.props.editorDatabase[0]);
        }
    },
    handleImport:function (e) {
        if(confirm("This will delete all unsaved work. Continue?")) {
            $("#myDropdown").slideUp();
            
            $("#fileToLoad").click();
        }
    },
    handleFile:function () {
        var fileToLoad = document.getElementById("fileToLoad").files[0];
        if(fileToLoad!="") {
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                var textFromFileLoaded = fileLoadedEvent.target.result;
                try{
                    textFromFileLoaded = JSON.parse(textFromFileLoaded);
                    Meteor.call('editorDatabase.load', textFromFileLoaded);
                }catch(err){
                    alert("Invalid File!");
                }
            };
            fileReader.readAsText(fileToLoad, "UTF-8");
            $("#fileToLoad").value="";
        }
    },
    destroyClickedElement:function(event) {
        document.body.removeChild(event.target);
    },
    handleExport:function (e) {
        var textToSave = JSON.stringify(this.props.editorDatabase[0]);
        var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
        var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
        var fileNameToSaveAs = this.props.editorDatabase[0].name.trim();
        
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        downloadLink.href = textToSaveAsURL;
        downloadLink.onclick = this.destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        
        downloadLink.click();
        
    },
    handleRound:function(e){
        var round = e.target.value;
        this.props.onRoundChange(round);
    },
    renderDropdown:function () {
        return ($.map(this.props.gameList,function(game){
            return (<GameLi key={game.name} game={game}/>)
        }))
    },
    refresh:function () {
        $(".Main").css({
            "height": window.innerHeight,
            "width":window.innerWidth,
        });
        $("body").css({
            "height": window.innerHeight,
            "width":window.innerWidth,
        });
        $("#myModal").css({
            "height": window.innerHeight,
            "width":window.innerWidth,
        });
    },
    renderInput:function () {
        return this.props.editorDatabase.map(thing=>
            <input
                spellCheck="true"
                key="input"
                type="text"
                placeholder="Type the Game name here"
                style={inputStyle}
                onChange={this.onUserInput}
                value={thing.name}
                onBlur={this.refresh}
            />
        );
    },
    /*    componentWillReceiveProps:function(newProps){
     console.log("EditorHeader is receiving "+newProps);
     },*/
    render: function (){
        return (
            <div>
                <div className="flex-container" style={barStyle}>
                    <button style={buttonStyle} id="New" onClick={this.handleNew}>New</button>
                    <div className="dropdown" style={{border:"none"}}>
                        <button style={loadButtonStyle} id="Load" onClick={this.handleLoad}>Load</button>
                        <ul className="dropdown-content" id="myDropdown" style={dropdownStyle}>
                            {this.renderDropdown()}
                        </ul>
                    </div>
                    <button style={buttonStyle} id="Save" onClick={this.handleSave}>Save</button>
                    
                    {this.renderInput()}
                    <select
                        style={pickerStyle}
                        id="selector"
                        onChange={this.handleRound}>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Final" >Final</option>
                    </select>
                    <button style={buttonStyle} id="Import" onClick={this.handleImport}>Import</button>
                    <button style={buttonStyle} id="Export" onClick={this.handleExport}>Export</button>
                    <input type="file" id="fileToLoad" accept=".txt" onChange={this.handleFile} style={{position:"absolute", width:0,height:0}}/>
                </div>
            </div>
        )
    }
});

module.exports = EditorHeader;