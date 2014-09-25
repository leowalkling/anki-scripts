var select_elements_local = function (parent) {
	var children = parent.childNodes;
    var selected_item = Math.floor(Math.random()*children.length);
	var new_node = document.createElement('span');
	new_node.innerHTML = children[selected_item].innerHTML;
    parent.parentNode.replaceChild(new_node, parent);
};
module.exports = function () {
	var parents = document.getElementsByClassName('b-select_elements');
	var i;
	for (i = 0; i < parents.length; i++) {
		if (parents[i].hasChildNodes()) {
			select_elements_local(parents[i]);
		}
	}
};