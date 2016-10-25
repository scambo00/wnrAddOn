module.exports = function(RED) {
	'use strict';
	
    var _ = require("lodash");
    var fmt = 'YYYY-MM-DD HH:mm';
	var device = "";
    var type = "";
    var powered = "";
    var brightness = "";
    var WinkCMDmsg = "";

    function wnrCmdMsgNode(config) {
        RED.nodes.createNode(this,config);
		
        var node = this;
	    var globalContext = this.context().global;
		
		//device="Outside"; // In this case, we're triggering a group. Put in your group's name here.
        //powered="on"; // on or off.
        //brightness=100; // Bulb brightness is from 0 (dim) to 100 (full brightness)
        //type="group"; // This is used in the next step of the flow. Your options are either "light", "lock", "group" or "scene"
		
	    var messages = {
            on:  createMsg('on', 'dot'),
            off: createMsg('off', 'ring'),
			true:  createMsg('on', 'dot'),
            false: createMsg('off', 'ring'),
			1:  createMsg('on', 'dot'),
            0: createMsg('off', 'ring'),
        };
		;
		
	    this.on('input', function(msg) {
            var event = messages[msg.payload];
	        if (event) {
				send(event, true);
            } 
	        else{
	            node.status({fill: 'red', shape: 'dot', text: 'payload must be \'on, true, 1\' or \'off, false, 0\''});	
	        }
        });
		
	    function createMsg(msgName, shape) {
			var filtered = _.pickBy(config, function (value, key) {
                return key && key.indexOf(msgName) === 0;
            });
            var event = _.mapKeys(filtered, function (value, key) {
                return key.substring(msgName.length).toLowerCase();
            });
			
            event.name = msgName.toUpperCase();
			event.shape = shape;
            event.callback = function () {
                send(event, false);
            };
            return event;
        }
		
	    function send(event, manual) {
			var powered = event.name.toLowerCase();
	    	WinkCMDmsg = globalContext.executeWinkCMD(config.winkName,config.winkType,powered,config.brightness);
            node.send(WinkCMDmsg);
			node.send(globalContext.send_ui_note('information',10*60*1000,config.ui_note,Math.floor(Math.random()*1000)));
	    	node.status({
	    		fill: manual ? 'blue' : 'green',
	    		shape: event.shape,
	    		text: event.name + ' - message sent'
            });
        }
	}
	RED.nodes.registerType("wnrCmdMsg",wnrCmdMsgNode);
}