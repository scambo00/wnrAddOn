module.exports = function(RED) {
    function wnrRobotsNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
            node.send(msg);
        });
    }
    RED.nodes.registerType("wnrRobots",wnrRobotsNode);
}