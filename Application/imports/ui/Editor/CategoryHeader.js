import PropTypes from 'prop-types';
import React from "react";

import EditModal from "./EditModal";

var CategoryHeader = React.createClass({
	getInitialState: function () {
		return {
			EditModal: false,
		};
	},
	propTypes: {
		roundName: PropTypes.string,
		key1: PropTypes.string,
		categoryName: PropTypes.string,
	},
	handleQuestionHeaderClick: function () {
		if (!this.state.EditModal) {
			//alert("You clicked "+this.props.roundName+","+this.props.key1);
			this.setState({EditModal: true});
		}
	},
	handleClose: function () {
		this.setState({EditModal: false});
	},
	render: function () {
		return (<div>
			<div className="Header" onClick={this.handleQuestionHeaderClick}
			     style={{fontSize: "2vmin"}}>{this.props.categoryName}</div>
			{this.state.EditModal ?
				<EditModal
					roundName={this.props.roundName}
					categoryName={this.props.categoryName}
					key1={this.props.key1}
					isHeader={true}
					handleClose={this.handleClose}
				/> : []}
		</div>)
	}
	
});

module.exports = CategoryHeader;