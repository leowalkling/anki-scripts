var shuffle_elements_local = function (parent) {
	var children = parent.childNodes;
    var j;
    var nodes_to_shuffle = [];
    var targets = [];
    var child;
    for (j = 0; j < children.length; j++) {
    	child = children[j];
    	if (child.className !== 'shuffle_elements-skip') {
    		nodes_to_shuffle.push(child.cloneNode(true));
    		targets.push(child);
    	}
    }
    targets.forEach(function (target) {
		var new_node_index = Math.floor(Math.random()*nodes_to_shuffle.length);
		var new_node = nodes_to_shuffle[new_node_index];
		parent.replaceChild(new_node, target);
		nodes_to_shuffle.splice(new_node_index, 1);
    });
};
module.exports = function () {
	var parents = document.getElementsByClassName('b-shuffle_elements');
	var i;
	for (i = 0; i < parents.length; i++) {
		if (parents[i].hasChildNodes()) {
			shuffle_elements_local(parents[i]);
		}
	}
};