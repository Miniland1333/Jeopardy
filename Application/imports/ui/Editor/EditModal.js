import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';


var modalStyle = {
    display: 'none', /* hidden by default */
    position: 'fixed', /* stay in place */
    zIndex: 1, /* sit on top */
    left: 0, top: 0, width: '100%', /* full width */
    height: '100%', /* full height */
    overflow: 'auto', /* enable scroll if needed */
    backgroundColor: 'rgba(0,0,0,0.4)',
};
var modalContentStyle = {
    margin: '15% auto',
    padding: 20,
    border: '1px solid #888',
    width: '80%',
    backgroundColor: "#fefefe",
    color:"black",
    flexDirection:"column",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)",
};
var headerStyle = {
    maxWidth:"100%",
    boxSizing: "border-box",
    padding: "10px 0",
    background: "#060CE9",
    border: "none",
    fontSize: 16,
    textAlign:"center",
    flexGrow:1,
    textTransform:"uppercase",
    color:"white",
};
var answerStyle = {
    maxWidth:"100%",
    boxSizing: "border-box",
    padding: "10px 0",
    background: "#060CE9",
    border: "none",
    fontSize: 16,
    textAlign:"center",
    flexGrow:1,
    color:"white",
};
var playStyle = {
    backgroundColor:'#ff9900', /* green */
    border: 'white solid 1px',
    color: 'white',
    padding: '15px 21px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: 20,
    width:200,
    //borderRadius:8,
    cursor:"pointer",
};
var cancelStyle = {
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
var saveStyle = {
    backgroundColor: '#4CAF50', /* green */
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
var buttonHolderStyle = {
    justifyContent : "flex-end",
};
var verticalFlexStyle = {
    flexDirection:"column",
};

var EditModal = React.createClass({
    getInitialState:function () {
      return{
          isSinglePlay:false,
      }
    },
    getDefaultProps: function () {
        return {
            roundName:"",
            categoryName:"",
            question:"",
            answer:"",
            isSinglePlay:false,
            isHeader:false,
            key1:"",
            key2:"",
            handleClose:function(){},
        };
    },
    propTypes:{
        roundName:React.PropTypes.string,
        categoryName:React.PropTypes.string,
        question:React.PropTypes.string,
        answer:React.PropTypes.string,
        isSinglePlay:React.PropTypes.bool,
        isHeader:React.PropTypes.bool,
        key1:React.PropTypes.string,
        key2:React.PropTypes.string,
        handleClose:React.PropTypes.func,
    },
    componentDidMount :function () {
        $("#myModal").fadeIn();
        //set isHeader
        if(this.props.isHeader){
        }else{
            this.setState({isSinglePlay:this.props.isSinglePlay});
        }
    },
    handlePlay:function () {
        this.setState({isSinglePlay:!this.state.isSinglePlay})
    },
    handleCancel:function(){
        $("#myModal").fadeOut(this.props.handleClose);
    },
    handleComplete:function () {
        if(this.props.isHeader){
            Meteor.call('editorDatabase.updateCategory',
                this.props.roundName,
                this.props.key1,
                $("#category").val());
        }else{
            Meteor.call('editorDatabase.updateQuestion',
                this.props.roundName,
                this.props.key1,
                this.props.key2,
                $("#question").val(),
                $("#answer").val(),
                this.state.isSinglePlay);
        }
        this.handleCancel();
    },
    render:function () {
        return(
            <div id="myModal" style={modalStyle}>
                <div className="modal-content flex-container" style={modalContentStyle}>
                    {
                            this.props.isHeader?<div className="flex-container" style={verticalFlexStyle}><h1>Category Name</h1>
                            <input id="category" defaultValue={this.props.categoryName} placeholder="Category Name" style={headerStyle}/></div>:<div className="flex-container" style={verticalFlexStyle}>                    <h1>Question</h1>
                        <textarea id="question"  defaultValue={this.props.question} placeholder="Question" style={headerStyle}/>
                        <h2>Answer</h2><input id="answer" defaultValue={this.props.answer} placeholder="Answer" style={answerStyle}/></div>
    
                    }
                    <div  className="flex-container " style={buttonHolderStyle}>
                        {!this.props.isHeader?<button style={playStyle} onClick={this.handlePlay}>Single Play {this.state.isSinglePlay?"ON  ":"OFF"}</button>:""}
                        <button  style={cancelStyle} onClick={this.handleCancel}>Close</button>
                        <button  style={saveStyle} onClick={this.handleComplete}>Save</button>
                    </div>
                </div>
            </div>
        )
    }
    
});

module.exports = EditModal;