/**
 * Created by Henry on 8/27/2016.
 * Storage for all available games
 */
//Available only to Server and Editor
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const editorDatabase = new Mongo.Collection('editorDatabase');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('editorDatabase', function editorDatabasePublication() {
        return editorDatabase.find();
    });
}

Meteor.methods({
    'editorDatabase.init'(){
        editorDatabase.remove({});
        //initializes editorDatabase
        editorDatabase.insert({
            name:"",
            Jeopardy:null,
            DoubleJeopardy:null,
            FinalJeopardy:null,
        });
        console.log(editorDatabase.find().fetch());

    },
    'editorDatabase.loadJSON'(json){
        Meteor.call('editorDatabase.init');
    },
    'editorDatabase.updateName'(name){
        check(name, String);
        editorDatabase.update({},{$set:{name : name}});
        console.log(editorDatabase.find().fetch());
    },
});