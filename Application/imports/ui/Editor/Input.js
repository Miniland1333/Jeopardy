import React, {Component, PropTypes} from 'react';


var InputField = React.createClass({
    propTypes:{
        Style:React.PropTypes.object.isRequired,
        Value:React.PropTypes.object.isRequired,
        onUserInput:React.PropTypes.func.isRequired,
    },
    handleChange(e){
        this.props.onUserInput(e.target.value);
    },

    render(){
        return(
            <input
                type="text"
                placeholder="Type the Game name here"
                style={this.props.Style}
                onChange={this.handleChange}
                value={this.props.Value.name}
            />)
    }
});

module.exports = InputField;