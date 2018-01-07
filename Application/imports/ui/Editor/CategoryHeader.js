import PropTypes from "prop-types";
import React from "react";

import EditModal from "./EditModal";

export default class CategoryHeader extends React.Component {
	static propTypes = {
		roundName: PropTypes.string,
		key1: PropTypes.string,
		categoryName: PropTypes.string,
	};
	
	state = {
		EditModal: false,
	};
	
	handleQuestionHeaderClick = () => {
		if (!this.state.EditModal) {
			this.setState({EditModal: true});
		}
	};
	
	handleClose = () => {
		this.setState({EditModal: false});
	};
	
	render() {
		return (<div>
			<div className="Header" onClick={this.handleQuestionHeaderClick}
			     style={{fontSize: "2vmin"}}>{this.props.categoryName}</div>
			{this.state.EditModal ?
				<EditModal
					roundName={this.props.roundName}
					categoryName={this.props.categoryName}
					categoryExplanation={this.props.categoryExplanation}
					key1={this.props.key1}
					isHeader={true}
					handleClose={this.handleClose}
				/> : []}
		</div>)
	}
}