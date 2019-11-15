let _DEBUG_MODE = false;

_DEBUG_MODE ? _debug(0, "Background script started") : false;


class Job {
    constructor() {

        this._tabs = []
        this._id = Job.id++;
        chrome.tabs.create(
            {
                active:false
            }, 
            tab => {

                this._tabs.push(new Tab(tab.id));

            });
        
            this._tasks = [];

    }


    get id(){
        return this._id;
    }

    get tabs() {
        return this._tabs;
    }

    get tasks() {
        return this._tasks;
    }

    run() {

        let _tab = null;
        let task = null;
        while(1) {
            
            _tab = this.tabs.find(el => el.status == 'init' || el.status == 'done')

            if (!_tab) {
                setTimeout(function () {
                }, 1000);
                
                continue;
            }
            _tab.status = 'running'


            if (this._tasks.length == 0) {
                break;
            }

            task = this._tasks.pop();

            chrome.tabs.update(_tab.id, {url: task.protocol+"://" + task.domain}, tab => {
                console.log(tab);

                chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
                    console.log(tab);

                    if (tabId == tab.id && changeInfo.status == 'complete') {
                        let _tab = this.tabs.find(el => el.id == tabId);
                        console.log(_tab);
                        _tab.status = 'done'
                        
                    }
                });
            });
        }
    }
}
Job.id = 1;

class Task {
    constructor(protocol, domain) {
        this._protocol = protocol;
        this._domain = domain;
    }

    get protocol() {

        return this._protocol;
    }

    get domain() {

        return this._domain;
    }
}

class Tab {
    constructor(tab_id) {
        this._id = tab_id;
        this._status = 'init'

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
    constructor(_username) {

        this._isLogin = false;
        this._token = null;

    }

    get isLogin() {
        return this._isLogin;
    }


    set isLogin(value) {
        this._isLogin = value;
    }


    get token() {
        return this._token;
    }

    set token(value) {
        this._token = value;
    }
}
class AnswerSet {
    constructor(_pk, _name) {
        this._pk = _pk;
        this._name = _name;
    }
}

class Page {

    constructor(_pk) {
        this._answer = new Answer();
        this._pk = _pk;
        this._url = null;
        this._downloadId = null;
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

isLogin(ACCOUNT);

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
            case Communication.JOB_CREATION():

                job = new Job();
                SYSTEM.jobs.push(job);
                
                sendResponse({
                    data:{
                        job_id: job.id
                    }
                })

                break;
            case Communication.CRAWL_SITE():
                
                job = SYSTEM.jobs.find(el => el.id == request.data.job_id);

                if (typeof job == 'undefined') {
                    console.log("Error 1");
                    // break;
                }

                ajax_request("/answer_set_manager/test-set/"+request.data['test_set_id'], "GET", null,"json",
                    xhr => {
                        xhr.setRequestHeader("Authorization", "JWT "+SYSTEM.account.token);

                    },
                    data => {
                        let _data = data['data'];
                        
                        _data.forEach(elem => {

                            job.tasks.push(new Task(elem.protocol, elem.domain));
                            
                        });

                        job.run();
                        
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
                        xhr.setRequestHeader("Authorization", "JWT "+SYSTEM.account.token);

                    },
                    data => {
                        let _data = data['data'];
                        SYSTEM.answer_sets.length = 0;
                        _data.forEach(function (value, key) {
                            SYSTEM.answer_sets = new AnswerSet(value['id'], value['name']);
                            
                        });
                        _data = {
                            login: SYSTEM.account.isLogin,
                            list_size: SYSTEM.pageSize,
                            list_num: SYSTEM.cur_page_index,
                            answer_set: SYSTEM.answer_sets,
                            page:SYSTEM.CurPage,
                            check_mode:true
                            
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
                        chrome.pageCapture.saveAsMHTML({tabId:tabs[0].id}, mhtmlData => {

                            let file = new File([mhtmlData], "name");

                            console.log(file);

                            const reader = new FileReader();

                            reader.addEventListener('loadend', (e) => {
                                const text = e.srcElement.result;

                                _data = response.data;
                                _data['mhtmlData'] = text;

                                ajax_request("/answer_set_manager/pages", "POST", _data, "json", function (xhr) {

                                    xhr.setRequestHeader("Authorization", "Bearer "+SYSTEM.account.token);

                                }, null, null);

                            });
                            reader.readAsText(mhtmlData);

                            new Page();

                        });
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
                        sendResponse({code:Communication.LOGIN(),data: SYSTEM.account});
                        
                        
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

function isLogin(account) {
    $.ajax({
        url: "http://" + SYSTEM.host + ":"+SYSTEM.port+"/accounts/api/account",
        method: "GET",
        crossDomain: true,
        dataType: "json",
        async: false,
        xhrFields: { withCredentials: true },
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer "+account.token);
            // xhr.setRequestHeader("Cookie", "session=1234");
            // xhr.setRequestHeader ("Authorization", "Basic " + btoa('IEtdGS3FRYsg7EX7NY2QPL6mMShzeYjHmlvrxyIS' + ":" + '7toYm6rQeqWNiJHLzo0mh2nh4nYafe1obIg1kafmVixMDG3eAkyfJntCfbxaZNgDGvznIGp3pNMGfFL5XOMzc4dvLAhAADhimgwOxJe5dsnRN6y8GE2gdAdYfWFDRMz6'));
        },
        success:function (data, status, xhr) {
            _DEBUG_MODE ? _debug(0, "Message is received from Server \n"+JSON.stringify(data)) : false;
            if (data.status === 1) {
                // account.isLogin(true);

            }
            else {

            }
        },
        error:function (a, b, c) {

            // console.log(a);

            console.log(a, b, c)
        }
    });
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
            // console.log(a);
            console.log(request, status, error);
            typeof er_callback === 'function' && er_callback(request, status, error);

        }
    });
}


function alertNotify(message)
{
    chrome.notifications.create("alert",{ type: "basic", iconUrl: "icons/icon.png", title: "PRINT EDIT WE", message: "" + message });
}
