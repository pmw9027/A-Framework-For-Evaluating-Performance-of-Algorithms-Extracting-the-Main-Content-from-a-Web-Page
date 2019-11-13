class Node {

    constructor(_index_number,_original_node, _parent_node) {



        this._index_number = _index_number;

        this._node = _original_node;

        this._number;

        this._parent_node = _parent_node;
        this._child_nodes = [];

        this._node_name = _original_node.nodeName;
        this._node_type = _original_node.nodeType;
        this._offsetLeft = _original_node.offsetLeft;
        this._offsetWidth = _original_node.offsetWidth;
        this._offsetHeight = _original_node.offsetHeight;

        // this._scrollHeight = _node.scrollHeight;

        this._clientWidth = _original_node.clientWidth;
        this._clientHeight = _original_node.clientHeight;
        // this._linkNum = _node.getthis._nodeementsByTagName('a').length;


        // this._childNum = _node.childNodes.length;


        this._linkRatio;


        this._avgLinkDepth;
        // this._textWordsLength = _node.textContent.trim().replace(/\s+/g, ' ').split(' ').length;


        this._childrenSiblingTagRatio;
        this._disCenter;
        this._checkFlag;

    }

    push(_node) {

        this._child_nodes.push(_node);
    }

    get textNodeNum() {

        let sum = 0;

        if (this._node.nodeName.toUpperCase() === "#TEXT") {

            sum = 1;

        } else {
            this._child_nodes.forEach(function (_child_node) {

                sum += _child_node.textNodeNum;

            });
        }

        return sum;
    }

    get nodesNum(){

        let sum = 1;

        if (this._child_nodes.length === 0) {

            let sum = 1;

        } else {

            this._child_nodes.forEach(function (_child_node) {

                sum += _child_node.nodesNum;

            });
        }

        return sum;

    }


    get node() {

        return this._node;
    }

    get nodeJson() {

        return {
            node_name: this._node_name,
            offsetLeft: this._offsetLeft,
            offsetWidth: this._offsetWidth,
            offsetHeight: this._offsetHeight,
            clientWidth: this._clientWidth,
            clientHeight: this._clientHeight,
            sum_of_nodes: this.nodesNum,
            sum_of_text_nodes: this.textNodeNum,


        };
    }

    get XPath() {
        if (this._node.id) {
            return `//*[@id="${this._node.id}"]`;
        }
        const parts = [];
        while (this._node && this._node.nodeType === Node.ELEMENT_NODE) {
            let nbOfPreviousSiblings = 0;
            let hasNextSiblings = false;
            let sibling = this._node.previousSibling;
            while (sibling) {
                if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE &&
                    sibling.nodeName == this._node.nodeName) {
                    nbOfPreviousSiblings++;
                }
                sibling = sibling.previousSibling;
            }
            sibling = this._node.nextSibling;
            while (sibling) {
                if (sibling.nodeName == this._node.nodeName) {
                    hasNextSiblings = true;
                    break;
                }
                sibling = sibling.nextSibling;
            }
            const prefix = this._node.prefix ? this._node.prefix + ":" : "";
            const nth = nbOfPreviousSiblings || hasNextSiblings
                ? `[${nbOfPreviousSiblings + 1}]` : "";
            parts.push(prefix + this._node.localName + nth);
            this._node = this._node.parentNode;
        }
        return parts.length ? "/" + parts.reverse().join("/") : "";
    }


}
