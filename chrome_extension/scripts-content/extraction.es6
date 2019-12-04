chrome.runtime.sendMessage({
    code: Communication.EXTRACTION_QUERY(),

}, response => {

    let _data = {

    };


    if (response.extractor == 1) {


        console.log(document)

        let finderJS = new ReaderArticleFinder(document);
        let readable = finderJS.isReaderModeAvailable();

        console.log(finderJS, readable);

        _data['readable'] = readable;

        if (readable) {
            let hyu = article.getAttribute('hyu');

            _data['predicts'] = [hyu]
        }

    }
    else if (response.extractor == 2) {

        article = new Readability(document).parse();
        // let readerable = isProbablyReaderable(document);


    }


    console.log(_data);

    chrome.runtime.sendMessage(
        {
            code: Communication.EXTRACTION_RESPONSE(),
            data: _data
        }
    );
});

