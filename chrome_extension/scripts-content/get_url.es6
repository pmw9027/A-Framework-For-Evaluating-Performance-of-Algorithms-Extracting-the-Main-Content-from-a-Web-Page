chrome.runtime.sendMessage({
    code: Communication.CRAWL_REQUEST(),
}, function(response) {


    let links = document.links;
    let arr = [];


    for(let i=0; i < links.length; i++) {
        arr.push(links[i].href);
    }

    let path_names = [];
    let url;
    let ran_num;



    while(path_names.length < response.breadth && arr.length) {

        ran_num = getRandomInt(arr.length);
        try {
            url = new URL(arr[ran_num]);


            if (url.host == window.location.host && url.pathname != window.location.pathname) {
                path_names.push(
                    {
                        protocol: url.protocol.replace(":", ""),
                        pathname: url.pathname

                    }
                );
            }
            arr.splice(ran_num, 1);

        }
        catch (error) {
            arr.splice(ran_num, 1);
        }
    }

    let meta = document.querySelector("meta[name=description]");

    if(meta != null)
        meta = meta.getAttribute("content");


    let _data = {
        page: {
            protocol: window.location.protocol.replace(":", ""),
            host: window.location.host,
            title: window.document.title,
            description: meta,
            pathname: window.location.pathname,
            depth:response.depth,

        },
        nodes: webPage.nodes,
        urls: {
            host: window.location.host,
            pathname: path_names
        }
    };

    chrome.runtime.sendMessage({
        code: Communication.CRAWL_RESPONSE_URLS(),
        data: _data
    }, function(response) {

    });
});


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}