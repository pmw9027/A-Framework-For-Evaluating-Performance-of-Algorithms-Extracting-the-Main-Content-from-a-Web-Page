class WebPage {


    static ATTR() {

        return "hyu";
    }

    constructor(document) {
        WebPage.IND = 0;
        this._root_node = document.getElementsByTagName('body')[0];


    }
    indexing(_parent_node = this._root_node) {

        let _child_nodes = _parent_node.childNodes;
        _child_nodes.forEach(function(_child_node){
            this.indexing(_child_node);

        },this);
        if (_parent_node.nodeType === 1 || _parent_node.nodeType === 3) {
            if (_parent_node.nodeName.toUpperCase() === "#TEXT") {

            } else {
                _parent_node.setAttribute(WebPage.ATTR(), WebPage.IND++)

            }
        }
    }
}