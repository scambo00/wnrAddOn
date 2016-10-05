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
		var key = config.trigger;
		var myGlobal = RED.settings.functionGlobalContext;
       		
        this.on('input', function(msg) {
			
			var trigger = myGlobal[key];
			trigger = String(trigger);
			
			if ( key in myGlobal ) {
								
				if (trigger == config.onmatch){
				outmsg.payload = config.onpayload;
				outmsg.topic   = config.ontopic;
				node.status({
					fill: 'green', 
					shape: 'dot', 
					text: 'match found: ' +key + ": " +config.onmatch
				});
				node.send(outmsg);
		        
			    }
                else if (trigger == config.offmatch){
				outmsg.payload = config.offpayload;
				outmsg.topic   = config.offtopic;
				node.status({
					fill: 'blue', 
					shape: 'dot', 
					text: 'match found: ' +key + ": " +config.offmatch
				});				
				node.send(outmsg);
			    }
			    else{
				node.status({
					fill: 'red', 
					shape: 'dot', 
					text: 'match not found: ' +key 
				});
			    }	
			}
            else{
				node.error("Variable '" + key + "' does not exist in 'context.global'");
			}		
        });
		
		
	}
    RED.nodes.registerType("wnrGlobalVars",wnrGlobalVars);
}



