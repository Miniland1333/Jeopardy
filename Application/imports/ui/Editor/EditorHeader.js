import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

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
var dropdownStyle = {
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

var EditorHeader = React.createClass({
    getInitialState: function () {
        return {
            nameInput: "",
            round:"Single"
        };
    },
    handleName:function (e){
        // Find the text field via the React ref
        const name = ReactDOM.findDOMNode(this.refs.nameInput).value.trim();
        this.setState({nameInput:e.target.value});

        Meteor.call('editorDatabase.updateName',name);
        ReactDOM.findDOMNode(this.refs.textInput).value = name;
        //ReactDOM.findDOMNode(this.refs.nameInput).value = name;
        //console.log(ReactDOM.findDOMNode(this.refs.nameInput).value);
    },
    handleNew:function (e) {
        if(confirm("This will delete all unsaved work. Continue?")) {
            Meteor.call('editorDatabase.init');
        }
    },
    handleLoad:function (e) {
        if(confirm("This will delete all unsaved work. Continue?")) {

        }
    },
    handleSave:function (e) {
        if(confirm("This will delete all unsaved work. Continue?")) {

        }
    },
    handleImport:function (e) {
        if(confirm("This will delete all unsaved work. Continue?")) {

        }
    },
    handleExport:function (e) {

    },
    handleRound:function(e){
        var round = e.target.value;
        this.props.onRoundChange(round);
    },
    renderInput(){
        if(this.props.databaseName!=undefined) {
            return (
                <input
                    type="text"
                    ref="nameInput"
                    placeholder="Type the Game name here"
                    style={inputStyle}
                    onChange={this.handleName}
                    value={this.props.databaseName.name}
                />);
        }
    },
    render: function (){

        return (
            <div>
                <div className="flex-container" style={barStyle}>
                    <button style={buttonStyle} id="New" onClick={this.handleNew}>New</button>
                    <button style={buttonStyle} id="Load" onClick={this.handleLoad}>Load</button>
                    <button style={buttonStyle} id="Save"onClick={this.handleSave}>Save</button>
                    {this.renderInput()}
                    <select
                        style={dropdownStyle}
                        id="selector"
                        onChange={this.handleRound}>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Final" >Final</option>
                    </select>
                    <button style={buttonStyle} id="Import"onClick={this.handleImport}>Import</button>
                    <button style={buttonStyle} id="Export"onClick={this.handleExport}>Export</button>

                </div>
                <p ref="textInput">{this.state.nameInput}</p>
            </div>
        )
    }
});


EditorHeader.propTypes = {
    gameList: PropTypes.object.isRequired,
    editorDatabase: PropTypes.object.isRequired
};

module.exports = EditorHeader;