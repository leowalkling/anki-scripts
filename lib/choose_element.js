var cookie = require('cookie');
var choose_element_local = function (parent, reset_cookies) {
	var children = parent.childNodes;
    var id = parent.getAttribute('cid');
    var choices = [];
    for (var i = 0; i < children.length; i++) {
        if (children[i].hasChildNodes()) { choices.push(children[i]); }
    }
    var cookies = cookie.parse(document.cookie);
    var selected_item;
    if (reset_cookies || typeof(cookies[id])==='undefined'){
        selected_item = Math.floor(Math.random()*choices.length);
        if (isCookiesAllowed()) {
            document.cookie = cookie.serialize(id, selected_item);
        }
    }
    else {
        selected_item = cookies[id];
    }
	var new_node = document.createElement('span');
	new_node.innerHTML = choices[selected_item].innerHTML;
    parent.parentNode.replaceChild(new_node, parent);
};
var isCookiesAllowed = function () {
    return (location.protocol === 'file' || location.protocol === 'http');
};
module.exports = function (reset_cookies) {
    var parents;
    while ((parents = document.getElementsByClassName('choose_element')).length > 0) {
        parents = document.getElementsByClassName('choose_element');
        if (parents.item(0).hasChildNodes()) {
            choose_element_local(parents.item(0),(typeof reset_cookies === 'undefined') ? false : reset_cookies);
        }
    }
};