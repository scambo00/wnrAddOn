// Licensed under the MIT license, see LICENSE file.
// Author: Will Scarangello (https://github.com/scambo00)
module.exports = function(RED) {
    function wnrTriggersNode(config) {
        RED.nodes.createNode(this,config);
		this.config = config;
        this.state = {};
        var node = this;
		var globalContext = this.context().global;
		var outmsg = {
						payload : "",
						topic : ""
					};
		var key = config.trigger;
		var myGlobal = RED.settings.functionGlobalContext; 
		
        this.on('input', function(msg) {
			
			if (myGlobal[key]==config.onmatch){
				outmsg.payload = config.onpayload;
				outmsg.topic   = config.ontopic;
				node.status({
					fill: 'green', 
					shape: 'dot', 
					text: 'match found: ' +key + ": " +config.onmatch
				});
				node.send(outmsg);
		        
			}
            else if (myGlobal[key]==config.offmatch){
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
			
        });
		
		
	}
    RED.nodes.registerType("wnrTriggers",wnrTriggersNode);
}



