import { Meteor } from 'meteor/meteor';
import { Picker } from 'meteor/meteorhacks:picker';
import fs from 'fs';
import SurveyCollection from '../imports/api/survey.collection';

Meteor.startup(() => {
    const Surveys = new SurveyCollection('surveys0');

    if (Meteor.isServer) {
	Meteor.publish('surveys0', function () {
	    return Surveys.find().cursor;
	});
    } else {
	Meteor.subscribe('surveys0');
    }
});

function json_from_survey_text_file(file_path, qn){
    var data = fs.readFileSync( file_path, 'utf8' );
    var lines = data.split("\n");
    
    var out = "\{ name: " + qn + ", value:[ ";
    lines.forEach( (line) => {
	if (line) {
	    var v = line.split(':')
	    var inc_out  = " \{ question:" + v[1] + ",";
	    inc_out = inc_out + " answers: [";
	    inc_out = inc_out + "  \{ type: \"1\", content: \"1\" \},";
	    inc_out = inc_out + "  \{ type: \"2\", content: \"2\" \},";
	    inc_out = inc_out + "  \{ type: \"3\", content: \"3\" \},";
	    inc_out = inc_out + "  \{ type: \"4\", content: \"4\" \},";
	    inc_out = inc_out + "  \{ type: \"5\", content: \"5\" \} ] \},";
	    out = out + inc_out;
	}
    });
    out = out + " ] \}";
    return(out);
}

Picker.route( '/upload', (params, req, res, next) =>
     {
	 const form = new formidable.IncomingForm(); 
	 form.parse(req, function(err, fields, files){ 
	     for ( file in Object.items(files)){
		 var json_file_text = json_from_survey_text_file( file.path,file.name);
		 var json_obj = JSON.parse(json_file_text);
		 dbClient.connect( url, {useUnifiedTopology:true},
			function(err, db) {
			    if (err) throw err;
			    var dbo = db.db("prod");
			    dbo.collection("surveys0").insertOne(
				json_obj,
				function(err, res) {
				    if (err) throw err;
				    db.close();
				});
			});
	     }
	 });
     });
