
class System{

    constructor() {


        this._tabCurModes = [];
        this._account = new Account();

        // this._host = "dbdev.hanyang.ac.kr";
        // this._port = "80";

        this._host = "127.0.0.1";
        this._port = "8000";

        this._pages = [];
        this._answer_sets = [];
        this._cur_page_index = 0;

        this._jobs = []
      
    }

    get resources_html() {

        console.log(this._resourcedoc);
        return this._resourcedoc;
    }

    get jobs() {


        return this._jobs;
    }

    intialize() {

        chrome.storage.local.set({'token': null});

        this._account = new Account();
        this._pages = [];
        this._cur_page_index = 0;

    }


    get tabCurModes() {
        return this._tabCurModes;
    }

    get client_secret() {
        return this._client_secret;
    }

    get client_id() {
        return this._client_id;
    }

    get host() {
        return this._host;
    }

    get port() {
        return this._port;
    }

    set account(value) {
        this._account = value;
    }

    get account() {
        return this._account;
    }

    set pages(value) {
        this._pages.push(value);
    }

    set answer_sets(value) {
        this._answer_sets.push(value);
    }

    getPage(_index) {

        return this._pages[_index];
    }
    get CurPage() {
        return this._pages[this.cur_page_index-1];
    }

    get pages() {
        return this._pages;
    }
    get pageSize() {

        return this._pages.length;
    }

    get answer_sets() {
        return this._answer_sets;
    }

    get cur_page_index() {
        return this._cur_page_index;
    }

    page_move(value) {

        if (0 < this.cur_page_index + value && this.cur_page_index + value < this.pageSize + 1) {
            if (value === 1) {
                this._cur_page_index++;

            }
            else if (value === -1) {
                this._cur_page_index--;

            }

            return this.CurPage;
        }
        else {

            return 0;
        }
    }

}