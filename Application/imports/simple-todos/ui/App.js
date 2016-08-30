import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import DocumentTitle from 'react-document-title'
import ReactDOM from 'react-dom';



import { Tasks } from '../api/tasks.js';
import Task from './Task.js';

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Meteor.call('tasks.insert', text);


        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
        ReactDOM.findDOMNode(this.refs.textInput).blur();
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;
        console.log(this.props.tasks);
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        console.log(filteredTasks.map((task) => (
            <Task key={task._id} task={task} />
        )));
        return filteredTasks.map((task) => (
            <Task key={task._id} task={task} />
        ));
    }
    static componentWillReceiveProps(newProps){
    console.log("App is receiving "+newProps);
    }
    render() {
        return (
            <DocumentTitle title='Jeopardy'>
                <div className="container">
                    <header>
                        <h1>Todo List ({this.props.incompleteCount})</h1>
                        <label className="hide-completed">
                            <input
                                type="checkbox"
                                readOnly
                                checked={this.state.hideCompleted}
                                onClick={this.toggleHideCompleted.bind(this)}
                            />
                            Hide Completed Tasks
                        </label>
                        <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                            <input
                                type="text"
                                ref="textInput"
                                placeholder="Type your team name"
                            />
                        </form>
                    </header>

                    <ul>
                        {this.renderTasks()}
                    </ul>
                </div>
            </DocumentTitle>
        );
    }
}

App.propTypes = {
    tasks: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
    Meteor.subscribe('tasks');

    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    };
}, App);