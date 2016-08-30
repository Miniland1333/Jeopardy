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
        var categoryTemplate = {
            categoryName:"categoryName",
        };
        for(var i=1;i<=5;i++){
            categoryTemplate["question"+i] = {
                isSinglePlay:false,
                    question:"question"+i,
                    answer:"answer"+i,
            };
/*            categoryTemplate["question"+i] = {
                isSinglePlay:false,
                question:"",
                answer:"",
            };*/
        }
        
        var gameTemplate = {};
        for(var j=1;j<=6;j++){
            gameTemplate["category"+j] = categoryTemplate;
        }
        
        editorDatabase.insert({
            name:"",
            Jeopardy:gameTemplate,
            DoubleJeopardy:gameTemplate,
            FinalJeopardy:{
                category:"",
                question:"",
                answer:"",
            },
        });
        console.log(editorDatabase.find().fetch());

    },
    'editorDatabase.loadJSON'(json){
        editorDatabase.remove({});
        editorDatabase.insert({

        });
    },
    'editorDatabase.updateName'(name){
        check(name, String);
        editorDatabase.update({},{$set:{name : name}});
        console.log(editorDatabase.find().fetch());
    },
});