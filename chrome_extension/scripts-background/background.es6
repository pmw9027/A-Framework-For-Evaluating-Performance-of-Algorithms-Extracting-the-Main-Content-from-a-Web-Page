let _DEBUG_MODE = true;

_DEBUG_MODE ? console.log(0, "Background script started") : false;


class Task {
    constructor(id, protocol, domain, depth) {

        this._job = null;
        this._id = id;
        this._protocol = protocol;
        this._domain = domain;
        this._depth = depth;
        this._test_set_id = null;
        this._page = new Page(id, protocol, domain, '1');
        this._downloadId = null;

        this._extractor = null;
    }

    get job() {
        return this._job;
    }

    set job(value) {
        this._job = value;
    }

    get extractor() {
        return this._extractor;
    }

    set extractor(value) {
        this._extractor = value;
    }

    get downloadId() {
        return this._downloadId;
    }

    set downloadId(value) {
        this._downloadId = value;
    }

    get test_set_id() {
        return this._test_set_id;
    }

    set test_set_id(value) {
        this._test_set_id = value;
    }

    get page() {
        return this._page;
    }

    set page(value) {
        this._page = value;
    }

    get depth() {
        return this._depth;
    }

    get protocol() {

        return this._protocol;
    }

    get id() {

        return this._id;
    }

    get domain() {

        return this._domain;
    }
}

class Tab {
    constructor(tab_id) {

        this._id = tab_id;
        this._status = 'init';
        this._task = null;
        this._timeout = null;

    }

    set timeout(timeout) {

        this._timeout = timeout;
    }

    get timeout() {

        return this._timeout;
    }

    set task(task) {

        this._task = task;
    }

    get task() {

        return this._task;
    }

    get status() {

        return this._status;
    }

    get tab() {

        return this._id;
    }

    set status(status) {

        this._status = status;
    }

    get id(){
        return this._id;
    }
}

class Account{
    constructor() {

        this._token = null;

        chrome.storage.local.get('token', data => {

            this._token = data['token'];
        });
    }

    get token() {
        return this._token;
    }

    set token(value) {
        chrome.storage.local.set({'token': value}, ()=> {
            this._token = value;
        });
    }

    isLogin() {

        ajax_request("/api-token-verify/","POST", {token: this.token},"json",
            null,
            data => {

                return true;
            },
            (request, status, error) => {



                return false;

            // console.log(request, status, error);

        });
    }

}


class Page {

    constructor(id, protocol, host, pathname=null) {

        this._id = id;
        this.protocol = protocol;
        this.host = host;
        this.pathname = pathname;

    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get pk() {
        return this._pk;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    get answer() {
        return this._answer;
    }
}

tabs_count = 5;
tabs_id = [];

ACCOUNT = new Account();
SYSTEM = new System();


_DEBUG_MODE ? console.log(0, "Global valuables are initialed") : false;

let port_content = null;
let port_popup = null;
chrome.runtime.onConnect.addListener(function(port) {
    _DEBUG_MODE ? console.log(0, "A port is connected (port.name: "+port.name+")") : false;
    switch (port.name) {
        case Communication.CURATION_PORT_POPUP():
            port_popup = port;
            break;
        case Communication.CURATION_PORT_CONTENT():
            port_content = port;
            break;

    }

    port.onMessage.addListener(function(msg) {
        _DEBUG_MODE ? console.log(0, "A message is received from a port (port.name: "+port.name+")") : false;

        switch(port.name) {
            case Communication.CURATION_PORT_POPUP():

                switch (msg.command) {

                }

                port_content.postMessage({command: Communication.CURATION_FLASH()});
                break;
            case Communication.CURATION_PORT_CONTENT():

                port.postMessage({answer: "Madame2"});
                break;

        }
    });
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        let _from = sender.tab ? "script" : "extension";
        _DEBUG_MODE ? console.log(0, "Message is received from "+ _from + "(code:"+request.code+")") : false;

        let t_data = JSON.stringify(request.data);
        let _data;
        let _res;
        let job;
        let tab;

        let _url = '';




        switch(request.code) {
            case Communication.EVALUATION():

                ajax_request(`/answer_set_manager/test-set/${request.data['test_set_id']}/pages`, "GET", null,"json",
                    null,
                    data => {
                        job = SYSTEM.jobs.find(el => el.id == request.data.job_id);

                        let _data = data['data'];
                        let _task = null;
                        _data.forEach(elem => {

                            _task = new Task(elem.id, elem.protocol, elem.domain, 0);
                            _task.job = job;
                            job.tasks = _task;

                        });

                        job.start();

                        sendResponse({
                            data: _data
                        });

                    },
                    null
                );

                break;
            case Communication.EVALUATION_RESPONSE():


                ajax_request(`/answer_set_manager/test-set/${request.data['test_set_id']}/pages`, "POST", request.data,"json",
                    null,
                    data => {

                    },
                    null
                );


                break;
            case Communication.LOAD_PAGE():

                // let url = `http://${ SYSTEM.host }:${ SYSTEM.port }/answer_set_manager/test-set/${request.data['test_set_id']}/pages/${request.data['index']}`;
                // let filename = "hyu/" +request.data['test_set_id']+'_'+ request.data['index'] + ".mhtml";


                let _url = `http://${SYSTEM.host}:${SYSTEM.port}/answer_set_manager/test-set/${request.data['test_set_id']}/pages/${request.data['index']}`;
                chrome.downloads.download({
                    url: _url,
                    filename: `hyu/${request.data['index']}.mhtml`
                }, downloadId => {


                });

                break;
            case Communication.CURATION():
                job = SYSTEM.jobs.find(el => el.id == request.data.job_id);
                job.start();

                break;
            case Communication.JOB_CREATION():
                job = new Job(request.data.cnt_tab, request.data.depth, request.data.breadth);
                job.test_set_id = request.data['test_set_id'];
                job.type = request.data['type'];
                job.extractor = request.data['extractor'];
                SYSTEM.push_job(job);

                sendResponse({
                    data: {
                        job_id: job.id

                    }
                });

                break;

            case Communication.TEST_SET_PAGE():
                ajax_request(`/answer_set_manager/test-set/${request.data['test_set_id']}/pages`, "GET", null,"json",
                    xhr => {
                        xhr.setRequestHeader("Authorization", "JWT "+SYSTEM.account.token);

                    },
                    data => {
                        let _data = data['data'];
                        sendResponse({
                            data: _data
                        });
                    },
                    null
                );

                break;
            case Communication.EXTRACTION():
                _DEBUG_MODE ? console.log(0, "Extraction Process Starting..") : false;

                job = SYSTEM.jobs.find(el => el.id == request.data.job_id);

                if (typeof job == 'undefined') {
                    _DEBUG_MODE ? console.log(0, "Error") : false;

                    break;
                }
                ajax_request(`/answer_set_manager/test-set/${request.data['test_set_id']}/pages`, "GET", null,"json",
                    xhr => {
                        xhr.setRequestHeader("Authorization", "JWT "+SYSTEM.account.token);

                    },
                    data => {

                        let _data = data['data'];
                        let _task = null;
                        _data.forEach(elem => {

                            _task = new Task(elem.id, elem.protocol, elem.domain, 0);
                            _task.job = job;
                            job.tasks = _task;

                        });

                        job.start();

                        sendResponse({
                            data: _data
                        });
                    },
                    null
                );

                break;
            case Communication.CRAWL_SITE():

                job = SYSTEM.jobs.find(el => el.id == request.data.job_id);

                if (typeof job == 'undefined') {
                    console.log("Error 1");
                }

                ajax_request("/answer_set_manager/test-set/"+request.data['test_set_id'], "GET", null,"json",
                    xhr => {
                        xhr.setRequestHeader("Authorization", "JWT "+SYSTEM.account.token);

                    },
                    data => {
                        let _data = data['data'];
                        let task = null;
                        _data.forEach(elem => {

                            task = new Task(elem.id, elem.protocol, elem.domain, 0);
                            task.job = job;
                            task.page = new Page(elem.id, elem.protocol, elem.domain);
                            job.tasks.push(task);

                        });

                        job.start();
                        
                        sendResponse({
                            data: _data
                        });
                    },
                    null
                );
                break;
            case Communication.TEST_SET_SITE():
                    ajax_request("/answer_set_manager/test-set/"+request.data['test_set_id'], "GET", null,"json",
                    xhr => {
                        xhr.setRequestHeader("Authorization", "JWT "+SYSTEM.account.token);

                    },
                    data => {
                        let _data = data['data'];
                        sendResponse({
                            data: _data
                        });
                    },
                    null
                );
                break;
            // Status
            case Communication.STATUS():
                ajax_request("/answer_set_manager/answer-set", "GET", null,"json",
                    null,
                    data => {
                        _data = {
                            login: true,
                            answer_set: data['data'],

                        };

                        ajax_request("/answer_set_manager/extractors", "GET", null,"json",
                            null,
                            data => {

                                _data['extractors'] = data['data'];
                                sendResponse({data: _data});

                            }
                        );

                    },
                    () => {
                        _data = {
                            login: false,

                        };

                        sendResponse({code:Communication.STATUS(), data: _data});

                    });

                _DEBUG_MODE ? console.log(0, "Message is respond to "+ _from + "(code:"+Communication.STATUS()) : false;
                break;
            case Communication.SAVE_PAGE():
                chrome.tabs.query({active:true}, tabs=> {

                    chrome.tabs.sendMessage(tabs[0].id, {code:Communication.SAVE_PAGE()},response => {

                    });
                });

                break;
            case Communication.JOIN():


                chrome.tabs.update({url:"http://"+SYSTEM.host+":"+SYSTEM.port});


                break;
            case Communication.ISLOGIN():


                sendResponse({});
                break;
            // Login
            case Communication.LOGIN():
                _DEBUG_MODE ? console.log(0, "Message is sent to Server (code:"+Communication.LOGIN()+")") : false;

                _data = {
                    grant_type:'password',
                    scope:'read write',
                    username:request.data['username'],
                    password:request.data['password']
                };

                ajax_request("/api-token-auth/", "POST", JSON.stringify(_data), "json",
                    function(xhr){
                        // xhr.setRequestHeader ("Authorization", "JWT " + btoa(SYSTEM.client_id + ":" +SYSTEM.client_secret));

                    },
                    function(data){


                        SYSTEM.intialize(() => {

                        });

                        SYSTEM.account.token = data.token;


                        sendResponse({'data': data});

                    },
                    function (request, status, error) {
                        if (request.status === 400) {
                            chrome.notifications.create("alert",{ type: "basic", iconUrl: "icons/icon.png", title: "Login", message: "Password or Username is wrong"});
                        }
                        else {


                        }
                    });

                break;
            case Communication.LOGOUT():
                SYSTEM.intialize(sendResponse);
                break;
        }
    });


function ajax_request(path, method, data, dataType, bf_callback, af_callback, er_callback) {
    $.ajax({
        url: "http://" + SYSTEM.host + ":"+SYSTEM.port+path,
        method: method,
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        data:data,
        dataType: dataType,
        async: false,
        xhrFields: { withCredentials: true },
        beforeSend: function(xhr) {


            xhr.setRequestHeader("Authorization", "JWT "+ SYSTEM.account.token);
            typeof bf_callback === 'function' && bf_callback(xhr);

        },
        success:function (data, status, xhr) {
            typeof af_callback === 'function' && af_callback(data);

        },
        error:function (request, status, error) {
            typeof er_callback === 'function' && er_callback(request, status, error);

        }
    });
}


function alertNotify(message)
{
    chrome.notifications.create("alert",{ type: "basic", iconUrl: "icons/icon.png", title: "PRINT EDIT WE", message: "" + message });
}
