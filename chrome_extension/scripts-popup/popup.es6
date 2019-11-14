let _DEBUG_MODE = false;
let tab;
_DEBUG_MODE ? _debug(0, "Popup script started") : false;


let communication = new Communication();


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    tab = tabs[0].id;


});


function display(data) {

    console.log(JSON.stringify(data));

    if (data.login) {
        $(".username").text("DBLAB");

        $("#container-sign").addClass("d-none")
        $("#container-nav").removeClass("d-none")
        $("#containver-user").removeClass("d-none")

        let selector = $("#test-set-selector");
        selector.empty();
        data.answer_set.forEach(data => {
            var option = $('<option value='+data._pk+'>'+data._name+'</option>');
            selector.append(option);

        });

        // if(!data.page) {

        //     $("#main_content_show_button").css('color','red');
        //     $("#main_content_show_button").attr("disabled", true);

        // }
        // else {
        //     if (data.page.fields.answer === "") {

        //         $("#main_content_show_button").css('color','red');
        //         $("#main_content_show_button").attr("disabled", true);

        //     }
        // }

    } else {
        $(".container-login").show();

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

        // let _data = {
        //     "username":$("input[name='username']").val(),
        //     "password":$("input[name='password']").val(),
        // };

        communication.sendToBackground(Communication.JOIN(),{}, update);

    });
    $(".save-page").on("click", function() {

        communication.sendToBackground(Communication.SAVE_PAGE(),null, update);

    });

    $("#test-set-selector").change(event => {
        let _data = {
            "test_set_id": $(event.target).find(":selected").val()
        }
        communication.sendToBackground(Communication.TEST_SET_SITE(),_data, data => {

            $(".test-set-site-toltal-count").text(data.length);

        });
    });

    $('#nav-crawl, #nav-curation, #nav-evaluation, #nav-extraction').click(function(){
        $('.navbar-collapse').collapse('hide');
        $('#container-crawl').addClass("d-none")
        $('#container-evaluation').addClass("d-none")
        $('#container-curation').addClass("d-none")
        $('#container-extraction').addClass("d-none")
        
        switch(this.id) {
            case 'nav-crawl':
                $('#container-crawl').removeClass("d-none");
                $('.navbar-brand').text('Crawling');
                break;
            case 'nav-curation':
                $('#container-curation').removeClass("d-none");
                $('.navbar-brand').text('Curation');
                break;
            case 'nav-extraction':
                $('#container-extraction').removeClass("d-none");
                $('.navbar-brand').text('Extraction');
                break;
            case 'nav-evaluation':
                $('#container-evaluation').removeClass("d-none");
                $('.navbar-brand').text('Evaluation');
                break;

        }
    });
    $('#button-start-crawling').click((event) => {
        let selector = $("#test-set-selector > option:selected");
        $(event.target).text('stop');
        communication.sendToBackground(Communication.TEST_SET_SITE(),{test_set_id: selector.val()}, data => {
            $(".progress-total-count").text(data.length);

            let sites = data;

            communication.sendToBackground(Communication.JOB_CREATION(), null, data => {
                
                new Promise(resolve => {
                    sites.forEach((elem, index) => {

                        console.log(elem);

                        communication.sendToBackground(Communication.CRAWL_SITE(), {
                            job_id: data.job_id,
                            site: elem
                        
                        }, data => {
    
                            resolve(data);
                        });
                    })
                }).then(data=>{
    
                    $(".progress-current-count").text(index+1);
                    let value = (index+1) / data.length * 100
                    $(".progress-percent").text(value);
                    $(".progress-bar").attr("aria-valuenow", value);
                    $(".progress-bar").width(value+'%');
                    
                });
            
            
            });
            
        });
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
