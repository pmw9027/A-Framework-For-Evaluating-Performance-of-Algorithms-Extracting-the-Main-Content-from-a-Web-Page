let _DEBUG_MODE = false;
let tab;
_DEBUG_MODE ? _debug(0, "Popup script started") : false;


let communication = new Communication();


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    tab = tabs[0].id;

});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        let elem = null;
        let progress_bar = null;
        let value = null;
        switch (request.code) {
            case Communication.PROCESS_RESULT():
                let elem_total  = $(".progress-total-count");
                elem  = $(".progress-current-count");
                progress_bar = $(".progress-bar");
                value = parseInt(progress_bar.attr("aria-valuenow")) + 1;
                elem_total.text(request.data.total);
                progress_bar.attr("style", `width: ${(request.data.done / request.data.total) * 100}%`);

                console.log(request.data);

                if(parseInt(elem.text()) < request.data.done) {

                    $(elem).text(parseInt(request.data.done));

                }

                break;
        }
    }
);


function display(data) {

    $("#container-sign").addClass("d-none");

    if (data.login) {

        $(".username").text("DBLAB");
        $("#container-nav").removeClass("d-none");
        $("#containver-user").removeClass("d-none");

        let selector = $(".test-set-selector");
        selector.empty();
        let option = $('<option disabled selected value>Choose One...</option>');
        selector.append(option);


        data.answer_set.forEach(data => {
            option = $('<option value='+data.id+'>'+data.name+'</option>');
            selector.append(option);

        });

        let selector_extractor = $("#extractor-selector");
        selector_extractor.empty();
        option = $('<option disabled selected value>Choose One...</option>');
        selector_extractor.append(option);
        data.extractors.forEach(data => {
            option = $('<option value='+data.id+'>'+data.name+'</option>');
            selector_extractor.append(option);

        });
    } else {
        $("#container-sign").removeClass("d-none");

    }
}
function update() {


    communication.sendToBackground(Communication.STATUS(),null, display);
}

window.onload = function() {

    update();

    $("#login-button").on("click", function() {

        let _username = $("input[name='username']").val();
        let _password = $("input[name='password']").val();



        if (_username === "" || _password == "") {
            chrome.notifications.create("alert",{ type: "basic", iconUrl: "icons/icon.png", title: "Login", message: "Password or Username is empty"});
        }
        else {

            let _data = {
                "username": _username,
                "password": _password,
            };
            communication.sendToBackground(Communication.LOGIN(),_data, update);

        }
    });

    $("#logout-button").on("click", function() {

        communication.sendToBackground(Communication.LOGOUT(),{}, update);

    });

    $("#join-button").on("click", function() {

        communication.sendToBackground(Communication.JOIN(),{}, update);

    });
    $(".save-page").on("click", function() {

        communication.sendToBackground(Communication.SAVE_PAGE(),null, update);

    });

    $(".test-set-selector").change(event => {

        let val = $(event.target).find(":selected").val();
        let _data = {
            "test_set_id": val
        };

        communication.sendToBackground(Communication.TEST_SET_SITE(),_data, data => {
            $(".test-set-site-toltal-count").text(data.length);
        });

        communication.sendToBackground(Communication.TEST_SET_PAGE(),_data, data => {

            $(".test-set-page-total-count").text(data.length);
        });

    });

    $("#button_left, #button_right").on("click", function(event) {

        let result = parseInt($(".test-set-page-cnt-count").text()) + parseInt(event.target.getAttribute('value'));
        if (0 < result && result < parseInt($(".test-set-page-total-count").text()) + 1) {
            $(".test-set-page-cnt-count").text(result);

            communication.sendToBackground(Communication.LOAD_PAGE(),{
                'test_set_id': $(".test-set-selector > option:selected").last().val(),
                'index': result
            }, update);

        }
    });

    $('#nav-crawl, #nav-curation, #nav-evaluation, #nav-extraction').click(function(event){
        $('.navbar-collapse').collapse('hide');
        $('#container-content').removeClass("d-none");
        $('#nav-crawl, #nav-curation, #nav-evaluation, #nav-extraction').removeClass("active");

        $(event.target).addClass("active");
        $('#container-button').addClass("d-none");
        $('#container-moving-page').addClass("d-none");
        $('#depth-input-container').addClass("d-none");
        $('#breadth-input-container').addClass("d-none");
        $('#extractor-selector-container').addClass("d-none");

        switch(this.id) {
            case 'nav-crawl':
                $('.navbar-brand').text('Crawling');
                $('#depth-input-container').removeClass("d-none");
                $('#breadth-input-container').removeClass("d-none");
                $('#container-button').removeClass("d-none");

                break;
            case 'nav-curation':
                $('#container-button').addClass("d-none");
                $('#container-moving-page').removeClass("d-none");
                $('.navbar-brand').text('Curation');
                break;
            case 'nav-extraction':

                $('#extractor-selector-container').removeClass("d-none");
                $('.navbar-brand').text('Extraction');
                break;
            case 'nav-evaluation':
                $('#container-evaluation').removeClass("d-none");
                $('.navbar-brand').text('Evaluation');
                break;

        }
    });

    $('#button-start').click((event) => {
        let selector = $("#test-set-selector > option:selected");
        let selector2 = $("#container-nav").find(".active");

        if ($(event.target).text() == 'start'){
            $(event.target).text('stop');

        }
        else {
            $(event.target).text('start');

        }

        let _id = selector2.attr('id');

        // let sites = data;
        let depth = parseInt($("#depth-input").val());
        let breadth = parseInt($("#breadth-input").val());
        let cnt_tab = parseInt($("#tabs-input").val());
        let extractor = parseInt($("#extractor-selector").val());

        switch (_id) {
            case 'nav-extraction':
                communication.sendToBackground(Communication.JOB_CREATION(), {
                    task_id:1,
                    type: 'extraction',
                    test_set_id: selector.val(),
                    cnt_tab: cnt_tab,
                    extractor: extractor,

                }, data => {
                    communication.sendToBackground(Communication.EXTRACTION(), {
                        job_id: data.job_id,
                        test_set_id: selector.val(),
                    }, data => {

                        // resolve(data);

                    });
                });
                break;

            case 'nav-crawl':
                communication.sendToBackground(Communication.JOB_CREATION(), {
                    task_id:1,
                    type: 'crawling',
                    breadth: breadth,
                    depth: depth,
                    cnt_tab: cnt_tab,

                    test_set_id: selector.val(),
                    extractor: extractor,

                }, data => {
                    communication.sendToBackground(Communication.CRAWL_SITE(), {
                        job_id: data.job_id,
                        test_set_id: selector.val(),
                    }, data => {

                        // resolve(data);

                    });
                });


                break;
        }
    });
};


function _debug(_code, _message) {

    let _date = new Date();

    console.log(_code, _date.getHours()+':'+_date.getMinutes()+':'+_date.getSeconds(), _message);
    // console.log(_code, _date.format('hh:mm:ss'), _message);

}


const POPUPCOMMAND = {

    a:1,
    b:2


};

function validate(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|/;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) theEvent.preventDefault();
    }
}
