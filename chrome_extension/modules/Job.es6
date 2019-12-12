class Job {

    static EXTRACTION()            {   return 100; }
    static CRAWLING()              {   return 101; }
    static CURATION()              {   return 102; }

    constructor(cnt_tab, depth, breadth) {

        this._tabs = [];
        this._id = Job.id++;
        this._depth = depth;
        this._type = null;
        this._breadth = breadth;
        this._test_set_id = null;
        this._extractor = null;

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

        this._tasks = [];
        this._tasks_cnt_total = 0;
        this._tasks_cnt_done = 0;
        this._tasks_cnt_error = 0;

    }

    get extractor() {
        return this._extractor;
    }

    set extractor(value) {
        this._extractor = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
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


    set tasks(value) {
        this._tasks_cnt_total += 1;
        this._tasks.push(value);
    }

    start() {

        chrome.tabs.onUpdated.addListener((this.onUpdatedLisntener).bind(this));
        chrome.runtime.onMessage.addListener((this.onMessageListener).bind(this));


        if (this.type == Job.EXTRACTION()) {

            _DEBUG_MODE ? console.log(0, "Extraction Job Started..") : false;
            chrome.downloads.onChanged.addListener((this.onDownloadListener).bind(this));


        }
        else if (this.type == Job.CRAWLING()) {


        }

        else if (this.type == Job.CURATION()) {


            _DEBUG_MODE ? console.log(0, "Extraction Job Started..") : false;
            chrome.downloads.onChanged.addListener((this.onDownloadListener).bind(this));


        }


        for (const i of Array(this._tabs.length).keys()) {

            this.run();
        }
    }

    run() {

        let _tab = null;
        let task = null;

        _tab = this.tabs.find(el => el.status == 'init' || el.status == 'done' || el.status == 'expired');
        _tab.status = 'running';

        if (!_tab) {

            setTimeout(this.run(), 2000);
        }
        else {
            if (this._tasks.length == 0) {

                console.log("Empty the list of task");
                _tab = this.tabs.find(el => el.status == 'running');
                if (!_tab) {

                    this.stop();

                }
            }
            else {
                _tab.task = this._tasks.pop();

                let _timeout_var = setTimeout(() => {
                    _tab.status = 'expired';
                    this.run();
                }, 15000);
                _tab.timeout = _timeout_var;

                if (this.type == Job.EXTRACTION()) {
                    _DEBUG_MODE ? console.log(0, "One Task of Extraction Ran") : false;

                    let _url = `http://${SYSTEM.host}:${SYSTEM.port}/answer_set_manager/test-set/${_tab.task.job.test_set_id}/pages/${_tab.task.id}`;

                    chrome.downloads.download({
                        url: _url,
                        filename: `hyu/${_tab.task.id}.mhtml`
                    }, downloadId => {

                        _tab.task.downloadId = downloadId;


                    });
                }
                else if (this.type == Job.CRAWLING()) {

                    let _url = _tab.task.protocol + "://" + _tab.task.domain;

                    chrome.tabs.update(_tab.id, {url: _url}, tab => {

                    });
                }
            }
        }
    }

    stop() {
        for (const tab of this.tabs) {
            chrome.tabs.remove(tab.id);
        }
        chrome.runtime.onMessage.removeListener(this.onUpdatedLisntener);
        chrome.tabs.onUpdated.removeListener(this.onUpdatedLisntener);
    }

    onMessageListener(request, sender, sendResponse) {
        _DEBUG_MODE ? console.log(0, "Received a Message") : false;

        let _tab;
        let _url;
        let _data;
        switch (request.code) {
            case Communication.JOB_QUERY():
                sendResponse({
                    job_type: this.type

                });

                break;
            case Communication.EXTRACTION_QUERY():
                sendResponse({
                    extractor: this.extractor

                });
                break;
            case Communication.EXTRACTION_RESPONSE():
                _DEBUG_MODE ? console.log(0, `Received a Message`) : false;


                _tab  = this.tabs.find(el => el.id === sender.tab.id);
                _url = `/answer_set_manager/extractors/${this.extractor}`;
                _data = {
                    'page_id':_tab.task.page.id,
                    'readable':request.data.readable,
                    'content':request.data.content,

                };


                ajax_request(_url, 'POST',
                    JSON.stringify(_data),
                    "json",
                    null,
                    response => {
                        _DEBUG_MODE ? console.log(0, "Sent a Message to Server") : false;
                        _tab.status = 'done';
                        clearTimeout(_tab.timeout);
                        this.run();
                        _DEBUG_MODE ? console.log(0, "Task Ran") : false;

                        this._tasks_cnt_done += 1;
                        chrome.runtime.sendMessage(
                            {
                                code:Communication.PROCESS_RESULT(),
                                data: {
                                    total: this._tasks_cnt_total,
                                    done: this._tasks_cnt_done,
                                    error: this._tasks_cnt_error,
                                }
                            }
                        );
                    },
                    null,
                );

                break;
            case Communication.CRAWL_REQUEST():
                _DEBUG_MODE ? console.log(0, "Received a Message from Content") : false;

                _tab  = this.tabs.find(el => el.id === sender.tab.id);

                _data = {

                    depth:_tab.task.depth,
                    breadth: this._breadth

                };

                sendResponse(_data);

                break;
            case Communication.CRAWL_RESPONSE_URLS():
                _tab  = this.tabs.find(el => el.id === sender.tab.id);

                chrome.pageCapture.saveAsMHTML({tabId:_tab.id}, mhtmlData => {
                    const reader = new FileReader();
                    reader.addEventListener('loadend', (e) => {
                        const text = e.srcElement.result;

                        let _data = {
                            'id': _tab.task.id,
                            'protocol': request.data.page.protocol,
                            'host': request.data.page.host,
                            'title': request.data.page.title,
                            'description': request.data.page.description,
                            'pathname': request.data.page.pathname,
                            'depth': request.data.page.depth,
                            'nodes': JSON.stringify(request.data.nodes)
                        };

                        _data['mhtmlData'] = text;



                        ajax_request(`/answer_set_manager/test-set/${_tab.task.job.test_set_id}/pages`, "POST", JSON.stringify(_data), "json",
                            null,
                            response => {


                            },
                            (request, status, error) => {
                                console.log(request, status, error);

                            }
                        );


                        console.log(request.data.page.depth, this._depth, request.data.urls.pathname);

                        if (request.data.page.depth < this._depth) {
                            let _task = null;
                            for (const pathname of request.data.urls.pathname) {

                                _task = new Task(1, pathname.protocol, request.data.urls.host+pathname.pathname, request.data.page.depth + 1);
                                _task.job = _tab.task.job;

                                this.tasks.push(_task);

                            }
                        }
                        clearTimeout(_tab.timeout);
                        _tab.status = 'done';
                        this.run();
                        sendResponse();
                    });

                    if(typeof mhtmlData != 'undefined') {
                        reader.readAsText(mhtmlData);

                    }
                    else {

                        clearTimeout(_tab.timeout);
                        _tab.status = 'done';

                        // Need of Process

                        this.run();

                    }
                });
                break;
        }
    }
    onDownloadListener(downloadDelta) {
        if (downloadDelta.state && downloadDelta.state.current === 'complete') {
            chrome.downloads.search(
                {
                    id: downloadDelta.id

                },
                DownloadItem => {

                    _DEBUG_MODE ? console.log(0, "One MHTML file download completed") : false;

                    let tab = this.tabs.find(el => el.task.downloadId == downloadDelta.id && el.task != null);

                    let _id = null

                    if (this.type == Job.CURATION()){

                        _id = null

                    }
                    else {

                        _id = tab.id;

                    }

                    chrome.tabs.update(_id, {url: "file://" + DownloadItem[0].filename});

                }
            );
        }
    }

    onUpdatedLisntener(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            _DEBUG_MODE ? console.log(0, "Content Load Completely") : false;

            if (this.type == Job.EXTRACTION()) {

                chrome.runtime.sendMessage(
                    {
                        code:Communication.EXTRACTION_START(),
                        data: {

                        }
                    }
                );
            }
            else if (this.type == Job.CRAWLING()) {
                chrome.tabs.executeScript(tab.id,
                    {
                        'file': 'scripts-content/indexing.es6',
                        'runAt': "document_end"
                    },
                    result => {
                        chrome.tabs.executeScript(tab.id,
                            {
                                'file': 'scripts-content/get_url.es6',
                                'runAt': "document_end"
                            },
                            result => {

                            }
                        );
                    }
                );
            }
        }
    }
}

Job.id = 1;