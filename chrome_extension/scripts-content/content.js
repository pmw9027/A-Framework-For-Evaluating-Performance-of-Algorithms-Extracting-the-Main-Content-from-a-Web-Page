
class SystemContent {
    constructor() {
        this._answer_set_check_mode = new AnswerSetCheckMode();
        this._communication = new Communication();
        this._webPage = null;
        this._toolbarHeight = 31;
        this._isFirefox = false;
        this.selectCount = [];
        this.selectElement = [];

    }
    get communication() {
        return this._communication;
    }

    get isFirefox() {
        return this._isFirefox;
    }

    get toolbarHeight() {
        return this._toolbarHeight;
    }

    webPage_initialization() {

        this.webPage = new WebPage(document.body);

    }

    set webPage(value) {
        this._webPage = value;
    }

    get webPage() {
        return this._webPage;
    }

    get answer_set_check_mode() {
        return this._answer_set_check_mode;
    }
}

class AnswerSetCheckMode {
    constructor() {
        this._mode = false;
        this._selectedNode = null;
    }
    get selectedNode() {
        return this._selectedNode;
    }

    set selectedNode(value) {
        this._selectedNode = value;
    }

    get mode() {
        return this._mode;
    }

    set mode(value) {
        this._mode = value;
    }

    switch() {
        this.mode(!this.mode)
    }

    signal() {

        this.mode ? SYSTEMCONTENT.answer_set_check_mode.check_mode_on() : SYSTEMCONTENT.answer_set_check_mode.check_mode_off();
    }

    check_mode_on() {
        this._mode = true;

        $("*").hover(
            function(event) {
                event.stopPropagation();

                SYSTEMCONTENT.answer_set_check_mode.selectedNode($(this));
                $(this).highlightOverlay()
            },
            function() {

            });

        _DEBUG_MODE ? _debug(1, "Menu Node Checking Mode is activated") : false;
    }
    check_mode_off() {
        this._mode = false;

        $.destroyHighlightOverlay();

        // This code is not working
        // $('*').off('hover');

        $('*').off('mouseenter mouseleave');
        _DEBUG_MODE ? _debug(1, "Menu Node Checking Mode is deactivated") : false;
    }
}

SYSTEMCONTENT = new SystemContent();

window.onload = function() {

    SYSTEMCONTENT.webPage_initialization();

    _DEBUG_MODE ? _debug(0, "Started function named 'window.onload'") : false;
    _DEBUG_MODE ? _debug(0, "Initialed valuables") : false;
    _DEBUG_MODE ? _debug(0, "Send Data") : false;


    // let _data = {todo: Communication.SENDING, webpage: webPage.Json, nodes: webPage.nodesJson};
    // communication.sendToBackground(_data);

    _DEBUG_MODE ? _debug(0, "Send Data") : false;

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

        _DEBUG_MODE ? _debug(0, "Received message code: "+ request.code) : false;

        switch(request.code){

            case Communication.SAVE_PAGE():

                sendResponse({data:SYSTEMCONTENT.webPage.Json});

                break;
            case Communication.CONTENT_CHECK_MODE():
                _DEBUG_MODE ? _debug(1, "Main Contents Checking Procedure started") : false;

                // SYSTEMCONTENT.answer_set_check_mode.signal();

                break;
            case Communication.ANSWER_CHECK():

                if(SYSTEMCONTENT.answer_set_check_mode.mode) {
                    console.log(SYSTEMCONTENT.answer_set_check_mode.selectedNode());
                    // SYSTEMCONTENT.webPage.content_nodes.add(SYSTEMCONTENT.answer_set_check_mode.selectedNode())
                }
                break;
            case Communication.MENU_INITIAL():

                sendResponse(
                    {
                        "_CHECK_MODE_STATUS":_CHECK_MODE_STATUS,
                        "_MENU_NODES":webPage.menuNodes
                    }
                );

                break;

            case "initializeGUI":

                if (!allowedScheme(document.URL)) break;  /* make sure scheme is allowed - otherwise no response */

                loadGUI();

                sendResponse({ });  /* confirm content script has been loaded */

                break;
            case 'execute':

                // webPage = new WebPage(document.body);

                break;
            case 'send_dom':

                // webPage.paintCandidateNodes();
                // new WebPage(document.body);

                // console.log(webPage.nodesJson);

                // let _data = {code: SYSTEMCONTENT.communication.SENDING2, webpage: webPage.Json, nodes: webPage.nodesJson};
                // SYSTEMCONTENT.communication.sendToBackground(_data);


                let _data = [];
                SYSTEMCONTENT.communication.sendToBackground(Communication.CONTENT_ANSWER(), _data, callback =>  {


                });



                break;

            default:

                console.log("Wrong Command");
                break;
        }
    });

    _DEBUG_MODE ? _debug(0, "Contents Script Finished") : false;
};

function _debug(_code, _message) {

    let _date = new Date();

    console.log(_code, _date.getHours()+':'+_date.getMinutes()+':'+_date.getSeconds(), _message);
    // console.log(_code, _date.format('hh:mm:ss'), _message);

}