import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';


var modalStyle = {
    display: 'none', /* hidden by default */
    position: 'fixed', /* stay in place */
    zIndex: 1, /* sit on top */
    left: 0, top: 0, width: '100%', /* full width */
    height: '100%', /* full height */
    overflow: 'auto', /* enable scroll if needed */
    backgroundColor: 'rgba(0,0,0,0.4)'};
var modalContentStyle ={margin: '15% auto',
    padding: 20, border: '1px solid #888', width: '80%'};

var EditModal = React.createClass({
    propTypes:{
        roundName:React.PropTypes.string,
        game:React.PropTypes.object
    },
    handleQuestionClick:function () {
        {/*<div id="modal">Hank</div>*/}
    },
    
    render:function () {
        return(
            <div id="myModal" style={modalStyle}>
                <div className="modal-content" style={modalContentStyle}>
                    <p>Some text in the Modal..</p>
                </div>
            </div>
        )
    }
    
});

module.exports = EditModal;