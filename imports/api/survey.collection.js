import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
const JSON = require('dirty-json');

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

function to_json( text_doc_file, name ){
    return JSON.parse(json_from_survey_text_file(file_path, qn));
}

class SurveyCollection extends Mongo.Collection {
    constructor( coll ){
	super(coll);
    };
    insert( text_doc ){
	var name = text_doc.file.split('.')[0];
	return Mongo.Collection.prototype.call(insert)(to_json( text_doc.file, name ));
    };
};

export default SurveyCollection;
