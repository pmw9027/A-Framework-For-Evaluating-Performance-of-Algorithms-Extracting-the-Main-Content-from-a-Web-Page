let _DEBUG_MODE = false;

_DEBUG_MODE ? _debug(0, "Background script started") : false;

class Job {
    constructor(cnt_tab, depth, breadth) {

        this._tabs = [];
        this._id = Job.id++;

        this._depth = depth;
        this._breadth = breadth;
        this._test_set_id = null;

        for (const i of Array(cnt_tab).keys()) {
            chrome.tabs.create(
                {
                    active: false
                },
                tab => {
                    this._tabs.push(new Tab(tab.id));
                }
            );
        }

        chrome.runtime.onMessage.addListener((this.listener).bind(this));
        chrome.tabs.onUpdated.addListener((this.onUpdatedLisntener).bind(this));

        this._tasks = [];

    }


    get test_set_id() {
        return this._test_set_id;
    }

    set test_set_id(value) {
        this._test_set_id = value;
    }

    get id() {
        return this._id;
    }

    get tabs() {
        return this._tabs;
    }


    get tasks() {
        return this._tasks;
    }

    start() {
        for (const i of Array(this._tabs.length).keys()) {
            this.run();
        }
    }

    run() {

        let _tab = null;
        let task = null;

        _tab = this.tabs.find(el => el.status == 'init' || el.status == 'done' || el.status == 'expired');

        if (!_tab) {


            setTimeout(this.run(), 2000);
        }
        else {
            if (this._tasks.length == 0) {

                console.log("Empty the list of task");

                _tab = this.tabs.find(el => el.status == 'running');
                if (!_tab) {

                    this.send_to_server();
                    this.stop();
                }
            }
            else {
                _tab.status = 'running';
                task = this._tasks.pop();
                _tab.task = task;
                let _timeout_var = setTimeout(() => {
                    _tab.status = 'expired';
                    this.run();
                }, 15000);
                _tab.timeout = _timeout_var;
                chrome.tabs.update(_tab.id, {url: task.protocol + "://" + task.domain}, tab => {

                });
            }
        }
    }

    send_to_server(page) {
        ajax_request(`/answer_set_manager/test-set/${this.test_set_id}/pages`, "POST", {'data': page},"json",
            xhr => {
                xhr.setRequestHeader("Authorization", "JWT "+SYSTEM.account.token);

            },
            data => {


            },
            null
        );
    }

    save_mhtml() {



    }


    stop() {
        for (const tab of this.tabs) {
            chrome.tabs.remove(tab.id);
        }
        chrome.runtime.onMessage.removeListener(this.listener);
        chrome.tabs.onUpdated.removeListener(this.onUpdatedLisntener);
    }

    listener(request, sender, sendResponse) {

        let _tab;

        switch (request.code) {
            case Communication.CRAWL_REQUEST():

                _tab  = this.tabs.find(el => el.id === sender.tab.id);
                let _data = {

                    depth:_tab.task.depth,
                    breadth: this._breadth

                };

                sendResponse(_data);

                break;
            case Communication.CRAWL_RESPONSE_URLS():
                _tab  = this.tabs.find(el => el.id === sender.tab.id);
                _tab.status = 'done';
                clearTimeout(_tab.timeout);

                chrome.pageCapture.saveAsMHTML({tabId:_tab.id}, mhtmlData => {
                    const reader = new FileReader();
                    reader.addEventListener('loadend', (e) => {
                        const text = e.srcElement.result;

                        let _data = {
                            'id': _tab.task.id,
                            // 'title': tab.title
                            'page': new Page(request.data.page.protocol, request.data.page.host, request.data.page.pathname)
                        };

                        _data['mhtmlData'] = text;
                        this.send_to_server(_data);


                        if (request.data.depth < this._depth) {
                            for (const pathname of request.data.urls.pathname) {
                                this.tasks.push(new Task(1, pathname.protocol, request.data.urls.host+pathname.pathname, request.data.depth + 1));
                            }
                        }

                        _tab.status = 'done';
                        this.run();
                        sendResponse();
                    });

                    if(typeof mhtmlData != 'undefined') {
                        reader.readAsText(mhtmlData);

                    }
                    else {
                        console.log("Fail");
                        let _tab = this.tabs.find(el => el.id == tabId);
                        _tab.status = 'done';
                        this.run();

                    }
                });

        }
    }

    onUpdatedLisntener(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            chrome.tabs.executeScript(tab.id,
                {
                    'file': 'scripts-content/get_url.es6',
                    'runAt': "document_end"
                },

                result => {

                });
        }
    }
}

Job.id = 1;

class Task {
    constructor(id, protocol, domain, depth) {
        this._id = id;
        this._protocol = protocol;
        this._domain = domain;
        this._depth = depth;
        this._test_set_id = null;

        this._page = new Page(protocol, '1', '1');
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
            this.isLogin();

        });
    }

    get token() {
        return this._token;
    }

    set token(value) {
        this._token = value;
    }

    isLogin() {

        ajax_request("/api-token-verify/","POST", {token: this.token},"json",
            null,
            data => {

                return true;
            },
            null


        );


        // ajax_request("/api-token-refresh/", "POST", {token: data['token']}, "json", null,
        //     function(data){
        //         sendResponse({code:Communication.LOGIN(),data: SYSTEM.account});
        //
        //         console.log(data);
        //
        //     }, (request, status, error) => {
        //         console.log(data);
        //
        //     }
        // );

    }

}
class AnswerSet {
    constructor(_pk, _name) {
        this._pk = _pk;
        this._name = _name;
    }
}

class Page {

    constructor(protocol, host, pathname) {
        this.protocol = protocol;
        this.host = host;
        this.pathname = pathname;
    }


    get downloadId() {
        return this._downloadId;
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
    set downloadId(downloadId) {

        this._downloadId = downloadId;

    }
}

tabs_count = 5;
tabs_id = [];

ACCOUNT = new Account();
SYSTEM = new System();

_DEBUG_MODE ? _debug(0, "Global valuables are initialed") : false;

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {

        let _from = sender.tab ? "script" : "extension";
        _DEBUG_MODE ? _debug(0, "Message is received from "+ _from + "(code:"+request.code+")\n"+JSON.stringify(request.data)) : false;

        let t_data = JSON.stringify(request.data);
        let _data;
        let _res;
        let job;
        let tab;
        
        switch(request.code) {
            case Communication.LOAD_PAGE():

                let url = "http://" + SYSTEM.host + ":" + SYSTEM.port + "/answer_set_manager/test-set/pages?test_set_id="+request.data['test_set_id']+"&index="+request.data['index'];
                let filename = "hyu/" +request.data['test_set_id']+'_'+ request.data['index'] + ".mhtml";

                console.log(filename);
                chrome.downloads.download({
                    url: url,
                    filename: filename
                }, downloadId => {
                    chrome.downloads.onChanged.addListener(downloadDelta => {
                        if (downloadDelta.state && downloadDelta.state.current === 'complete' && downloadDelta.id === downloadId) {
                            chrome.downloads.search({id: page.downloadId}, DownloadItem => {
                                chrome.tabs.update(tab.id, {url: "file://" + DownloadItem[0].filename});

                            });
                        }
                    });
                });

                break;
            case Communication.JOB_CREATION():
                job = new Job(request.data.cnt_tab, request.data.depth, request.data.breadth);

                job.test_set_id = request.data['test_set_id'];

                SYSTEM.jobs.push(job);
                
                sendResponse({
                    data:{
                        job_id: job.id
                    }
                });

                break;

            case Communication.TEST_SET_PAGE():
                ajax_request("/answer_set_manager/test-set/pages?test_set_id="+request.data['test_set_id'], "GET", null,"json",
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
                        _data.forEach(elem => {
                            job.tasks.push(new Task(elem.id, elem.protocol, elem.domain, 0));
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
            case Communication.STATUS():

                ajax_request("/answer_set_manager/answer-set", "GET", null,"json",
                    xhr => {
                        xhr.setRequestHeader("Authorization", "JWT "+ SYSTEM.account.token);

                    },
                    data => {
                        let _data = data['data'];
                        SYSTEM.answer_sets.length = 0;
                        _data.forEach(function (value, key) {
                            SYSTEM.answer_sets = new AnswerSet(value['id'], value['name']);

                        });


                        _data = {
                            login: true,
                            answer_set: SYSTEM.answer_sets,

                        };

                        sendResponse({code:Communication.STATUS(), data: _data});
                    },
                    null
                );

                _DEBUG_MODE ? _debug(0, "Message is respond to "+ _from + "(code:"+Communication.STATUS()+")\n"+JSON.stringify(_data)) : false;

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
                _DEBUG_MODE ? _debug(0, "Message is sent to Server (code:"+Communication.LOGIN()+")\n"+JSON.stringify(request.data)) : false;

                _data = {
                    grant_type:'password',
                    scope:'read write',
                    username:request.data['username'],
                    password:request.data['password']
                };

                ajax_request("/api-token-auth/", "POST", _data, "json",
                    function(xhr){
                        // xhr.setRequestHeader ("Authorization", "JWT " + btoa(SYSTEM.client_id + ":" +SYSTEM.client_secret));

                    },
                    function(data){
                        SYSTEM.intialize();
                        SYSTEM.account.isLogin = true;
                        SYSTEM.account.token = data['token'];
                        chrome.storage.local.set({'token': data['token']});


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
                _data = {
                    token:SYSTEM.account.token,
                    client_id:SYSTEM.client_id,
                    client_secret:SYSTEM.client_secret
                };

                ajax_request("/o/revoke_token/","POST", _data,"text",
                    function(xhr){

                        xhr.setRequestHeader("Authorization", "Bearer "+SYSTEM.account.token);

                    },
                    function(data){
                        SYSTEM.intialize();
                        sendResponse({code:Communication.LOGOUT(),data:123});
                    });
                break;
        }
    });



function _debug(_code, _message) {

    let _date = new Date();

    console.log(_code, _date.getHours()+':'+_date.getMinutes()+':'+_date.getSeconds(), _message);
    // console.log(_code, _date.format('hh:mm:ss'), _message);

}


function ajax_request(path, method, data, dataType, bf_callback, af_callback, er_callback) {

    $.ajax({
        url: "http://" + SYSTEM.host + ":"+SYSTEM.port+path,
        method: method,
        crossDomain: true,
        // contentType: "application/json; charset=utf-8",
        data:data,
        dataType: dataType,
        async: false,
        xhrFields: { withCredentials: true },
        beforeSend: function(xhr) {

            typeof bf_callback === 'function' && bf_callback(xhr);

        },
        success:function (data, status, xhr) {
            // _DEBUG_MODE ? _debug(0, "Message is received from Server (code:"+request.code+")\n"+JSON.stringify(data)) : false;
            // console.log(data);
            typeof af_callback === 'function' && af_callback(data);

            // _DEBUG_MODE ? _debug(0, "Message is respond to "+ _from + " (code:"+Communication.LOGIN()+")\n"+JSON.stringify(data)) : false;

        },
        error:function (request, status, error) {
            console.log(request, status, error);
            typeof er_callback === 'function' && er_callback(request, status, error);

        }
    });
}


function alertNotify(message)
{
    chrome.notifications.create("alert",{ type: "basic", iconUrl: "icons/icon.png", title: "PRINT EDIT WE", message: "" + message });
}
