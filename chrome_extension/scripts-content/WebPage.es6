class WebPage {


    static ATTR() {

        return "hyu";
    }

    constructor(document) {
        WebPage.IND = 0;
        this._root_node = document.getElementsByTagName('body')[0];
        this._nodes = [];


    }
    indexing(_parent_node = this._root_node) {

        let _child_nodes = _parent_node.childNodes;
        _child_nodes.forEach(function(_child_node){
            this.indexing(_child_node);

        },this);
        if (_parent_node.nodeType === 1 || _parent_node.nodeType === 3) {
            if (_parent_node.nodeName.toUpperCase() === "#TEXT") {

            } else {

                let node = new PageNode(WebPage.IND, _parent_node);

                this.pushNode(node.nodeJson);
                _parent_node.setAttribute(WebPage.ATTR(), WebPage.IND++)

            }
        }
    }


    get nodes() {
        return this._nodes;
    }

    pushNode(value) {

        this._nodes.push(value);
    }

}