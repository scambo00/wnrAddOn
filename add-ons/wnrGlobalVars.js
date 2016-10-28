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
       	node.status({});
		
		node.previous = {};
		node.on('input', function(msg) {
			if ( key in myGlobal ) {
		        var trigger = String(myGlobal[key]);
				
			    if (trigger == config.condition){
				    outmsg.payload = config.truePayload;
				    outmsg.topic   = config.topic;
				    node.status({
					    fill: 'green', 
					    shape: 'dot', 
					    text: 'Condtion:true' +key + ' == ' +trigger
				    });
				}
                else{
				    outmsg.payload = config.falsePayload;
				    outmsg.topic   = config.topic;
				    node.status({
					    fill: 'blue', 
					    shape: 'dot', 
					    text: 'Condtion:false' +key + ' == ' +trigger
				    });				
				}
				if(config.rbe){
				    if (outmsg.payload !== node.previous) {
                        node.previous = outmsg.payload;
                        node.send(outmsg);
                    }	
				}
				else{
				    node.send(outmsg);
				}
				
								
            }			
		    else{
		        node.error(" The Variable '" + key + "' does not exist in 'context.global'");
			    node.status({
					fill: 'red', 
					shape: 'dot', 
					text: 'Variable: ' + key + ' does not exist in context.global'
				});		
		    }
		});
	}
        
    RED.nodes.registerType("wnrGlobalVars",wnrGlobalVars);
}



