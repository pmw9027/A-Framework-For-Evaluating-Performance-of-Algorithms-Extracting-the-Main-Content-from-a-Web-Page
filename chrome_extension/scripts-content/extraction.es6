chrome.runtime.sendMessage({
    code: Communication.EXTRACTION_QUERY(),

}, response => {

    let _data = {

    };

    if (response.extractor == 1) {
        if (article == null) {
            _data['readable'] = false;

        }
    }
    else if (response.extractor == 2) {

        article = new Readability(document).parse();
        // let readerable = isProbablyReaderable(document);


    }

    chrome.runtime.sendMessage(
        {
            code: Communication.EXTRACTION_RESPONSE(),
            data: _data
        }
    );
});