class Communication {

    constructor() {  }

    static PORT_POPUP()            {   return "PORT POPUP"; }

    static ISLOGIN()            {   return 100; }
    static LOGIN()              {   return 101; }
    static JOIN()               {   return 103; }
    static LOGOUT()             {   return 102; }
    static STATUS()             {   return 10;  }
    static SAVE_PAGE()          {   return 200; }

    static JOB_QUERY()          {   return 801; }
    static JOB_CREATION()          {   return 802; }

    static CRAWL_SITE()          {   return 601; }
    static CRAWL_REQUEST()          {   return 602; }
    static CRAWL_RESPONSE_URLS()          {   return 603; }

    static EXTRACTION()          {   return 1201; }
    static EXTRACTION_QUERY()          {   return 1202; }
    static EXTRACTION_START()          {   return 1203; }
    static EXTRACTION_RESPONSE()          {   return 1204; }
    static EXTRACTION_REQUEST()          {   return 1205; }
    static EXTRACTION_PORT_POPUP()          {   return "DONE"; }

    static CURATION()          {   return 1401; }
    static CURATION_PORT_CONTENT()          {   return "1400"; }
    static CURATION_PORT_POPUP()          {   return "-1400"; }
    static CURATION_QUERY()          {   return 1402; }
    static CURATION_FLASH()          {   return 1403; }
    static CURATION_DELETE()          {   return 1404; }

    static EVALUATION()          {   return 1501; }
    static EVALUATION_QUERY()          {   return 1502; }
    static EVALUATION_START()          {   return 1503; }
    static EVALUATION_RESPONSE()          {   return 1504; }



    static PROCESS_RESULT()          {   return 1301; }

    static TEST_SET_SITE() {return 701;}
    static TEST_SET_PAGE() {return 1001;}
    static LOAD_PAGE() {return 1101;}




    static SAFARI_READER_MODE() {return 1;}
    static READABILITY() {return 2;}


    sendToBackground(_code,_data, callback) {
        _DEBUG_MODE ? _debug(0, "Message is sent to BackgroundScript (code:"+_code+")") : false;
        chrome.runtime.sendMessage({code:_code, data:_data}, function(response) {
            _DEBUG_MODE ? _debug(0, "Message is received from BackgroundScript\n"+JSON.stringify(response)) : false;
            if(response !== undefined) {
                callback(response.data);
            }
            else {
                _DEBUG_MODE ? _debug(0, "Error") : false;
            }
        });
    }
}

function _debug(_code, _message) {

    let _date = new Date();

    console.log(_code, _date.getHours()+':'+_date.getMinutes()+':'+_date.getSeconds(), _message);
    // console.log(_code, _date.format('hh:mm:ss'), _message);

}
