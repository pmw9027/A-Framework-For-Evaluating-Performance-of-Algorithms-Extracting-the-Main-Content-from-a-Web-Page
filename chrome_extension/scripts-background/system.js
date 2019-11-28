
class System{

    constructor() {

        this._account = new Account();

        // this._host = "dbdev.hanyang.ac.kr";
        // this._port = "80";

        this._host = "127.0.0.1";
        this._port = "8000";
        this._jobs = [];


    }

    intialize(callback) {
        chrome.storage.local.set({'token': null}, () => {
            this._account = new Account();
            this._job = [];
            callback();
        });
    }


    get jobs() {
        return this._jobs;
    }

    push_job(value) {
        this._jobs.push(value);
    }

    get host() {
        return this._host;
    }

    get port() {
        return this._port;
    }

    get account() {

        return this._account;
    }
}