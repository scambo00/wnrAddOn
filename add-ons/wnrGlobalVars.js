// Licensed under the MIT license, see LICENSE file.
// Author: Will Scarangello (https://github.com/scambo00)
module.exports = function(RED) {
    function wnrGlobalVars(config) {
        RED.nodes.createNode(this,config);
		this.config = config;
        this.state = {};
        var node = this;
		var outmsg = {
						payload : "",
						topic : ""
					};
		var key = config.variable;
		var myGlobal = RED.settings.functionGlobalContext;
       	
		if ( key in myGlobal ) {
			node.status({});
		    
			this.on('input', function(msg) {
			    var trigger = myGlobal[key];
			    trigger = String(trigger);
			
			    if (trigger == config.condition){
				    outmsg.payload = config.truePayload;
				    outmsg.topic   = config.topic;
				    node.status({
					    fill: 'green', 
					    shape: 'dot', 
					    text: key + ' == ' +config.condition
				    });
				}
                else{
				    outmsg.payload = config.falsePayload;
				    outmsg.topic   = config.topic;
				    node.status({
					    fill: 'blue', 
					    shape: 'dot', 
					    text: key + ' != ' +config.condition + '\n== ' +trigger
				    });				
				}
				node.send(outmsg);
		    });
	    }	
		else{
		    node.error("Variable '" + key + "' does not exist in 'context.global'");
			node.status({
					fill: 'red', 
					shape: 'dot', 
					text: 'Variable: ' + key + ' does not exist in context.global'
				    });		
		}
    }
    RED.nodes.registerType("wnrGlobalVars",wnrGlobalVars);
}



