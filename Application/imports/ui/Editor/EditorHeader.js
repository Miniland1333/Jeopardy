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
    padding: '15px 6px',
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
        if(this.props.editorDatabase[0].name.trim()==""){
            alert("Name field cannot be empty!");
        }else if(confirm("This will overwrite any game with the same name. Continue?")) {
            Meteor.call('gameDatabase.save',this.props.editorDatabase[0]);
        }
    },
    handleImport:function (e) {
        if(confirm("This will delete all unsaved work. Continue?")) {
            $("#myDropdown").slideUp();
        }
    },
    handleExport:function (e) {
        
    },
    handleRound:function(e){
        var round = e.target.value;
        this.props.onRoundChange(round);
    },
    renderDropdown:function () {
        console.log(this.props.gameList);
        return ($.map(this.props.gameList,function(game){
            return (<GameLi key={game.name} game={game}/>)
        }))
    },
    renderInput:function () {
        console.log(this.props.editorDatabase);
        if(this.props.editorDatabase.length==0){
            Meteor.call('editorDatabase.init')
        }
        return this.props.editorDatabase.map(thing=>
            <input
                key="input"
                type="text"
                placeholder="Type the Game name here"
                style={inputStyle}
                onChange={this.onUserInput}
                value={thing.name}
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
                    <button style={buttonStyle} id="Save"onClick={this.handleSave}>Save</button>
                    
                    {this.renderInput()}
                    <select
                        style={pickerStyle}
                        id="selector"
                        onChange={this.handleRound}>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Final" >Final</option>
                    </select>
                    <button style={buttonStyle} id="Import"onClick={this.handleImport}>Import</button>
                    <button style={buttonStyle} id="Export"onClick={this.handleExport}>Export</button>
                
                </div>
            </div>
        )
    }
});

module.exports = EditorHeader;