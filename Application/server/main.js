import { Meteor } from 'meteor/meteor';
import '../imports/simple-todos/api/tasks.js';
import '../imports/api/editorDatabase';
import '../imports/api/gameDatabase';
import '../imports/api/gameLogic';
import '../imports/api/gameQuestions';



Meteor.startup(() => {
  // code to run on server at startup
	Meteor.call("gameLogic.init");
    Meteor.onConnection(function (connection) {
        connection.onClose(function () {
            console.log("closed "+connection.id);
            Meteor.call('gameLogic.kick',0,connection.id);
        });
        console.log(connection.id);
    });
});
