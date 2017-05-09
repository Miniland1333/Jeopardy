/**
 * Created by Henry on 8/25/2016.
 */
import React from "react";
import DocumentTitle from "react-document-title";


var divstyle = {
	margin: '0 auto',
	padding: '1em',
	fontFamily: 'Helvetica',
	fontSize: '1.1em',
	display: "block",
	textAlign: "center",
	maxWidth: "40em",
	color: "white"
};
var h1style = {
	fontWeight: 300,
	margin: '1em 0',
	padding: '0 0 0.25em 0',
	borderBottom: '1px dotted #ccc',
	textAlign: 'center',
	fontSize: '3em',
	lineHeight: '1.1em',
	display: "block"
};
var pstyle = {
	margin: '0 0 0.5em 0',
	lineHeight: '1.8em',
	fontSize: '1.2em'
};


function PageNotFound() {
	return (
		<DocumentTitle title='Page Not Found'>
			<div style={divstyle}>
				<h1 style={h1style}>Page Not Found</h1>
				<p style={pstyle}>The specified page was not found on this website. Please check the URL for mistakes
					and try again.</p>
			</div>
		</DocumentTitle>
	)
}

module.exports = PageNotFound;