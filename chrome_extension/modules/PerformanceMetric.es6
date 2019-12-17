class PerformanceMetric {
    constructor(answers, predicts) {
        this.answers = answers;
        this.predicts = predicts;
        // this.highlight_predict();
        // this.highlight_answer();
    }

    highlight_answer() {
        this.answers.forEach(answer => {
            $(answer[0]).effect("highlight",  {color: 'blue', "opacity": ".50"},20000);

            console.log(answer);

        });
    }
    highlight_predict() {
        console.log(this.predicts);

        this.predicts.forEach(predict => {
            $(predict[0]).effect("highlight",  {color: 'red', "opacity": ".50"}, 20000);
            console.log(predict);

        });
    }

    words() {
        if (this.answers.length === 0 && this.predicts.length === 0) {
            return {
                performance_metric_id: 1,
                precision: 1,
                recall: 1,
            };
        }

        else if (this.answers.length === 0 || this.predicts.length === 0) {
            return {
                performance_metric_id: 1,
                precision: 0,
                recall: 0,
            };

        }
        else {
            let a_words_list=[];
            let p_words_list=[];
            this.answers.forEach(answer => {
                if(answer[0])
                    a_words_list += answer[0].textContent.match(/\b(\w+)\b/g);

            });
            this.predicts.forEach(predict => {
                if(predict[0])
                    p_words_list += predict[0].textContent.match(/\b(\w+)\b/g);

            });

            let a_words_set = new Set(a_words_list);
            let p_words_set = new Set(p_words_list);
            let count = 0;

            for (let word of a_words_set) {
                if (p_words_set.has(word)) {
                    count++;
                }
            }


            return {
                performance_metric_id: 2,
                precision: count / p_words_set.size,
                recall: count / a_words_set.size,
            };
            // COMMUNICATION.sendToBackground(Communication.ERROR(), error.toString(), null);
        }
    }

    textLCS() {

        if (this.answers.length === 0 && this.predicts.length === 0) {
            return {
                performance_metric_id: 1,
                precision: 1,
                recall: 1,
            };
        }
        else if (this.answers.length === 0 || this.predicts.length === 0) {
            return {
                performance_metric_id: 1,
                precision: 0,
                recall: 0,
            };

        }
        else {
            let a_words_list=[];
            let p_words_list=[];


            this.answers.forEach(answer => {

                if(answer[0])
                    a_words_list += answer[0].textContent.match(/\b(\w+)\b/g);

            });
            this.predicts.forEach(predict => {
                console.log(predict);
                if(predict[0])
                    p_words_list += predict[0].textContent.match(/\b(\w+)\b/g);

            });
            if(a_words_list.length > 12000 || p_words_list.length > 12000)
                return false;

            let count = longestCommonSubsequence(a_words_list, p_words_list);

            return {
                performance_metric_id: 3,
                precision: count.length/p_words_list.length,
                recall: count.length/a_words_list.length,
            }
        }
    }

    basedbyarea() {
        if (this.answers.length === 0 && this.predicts.length === 0) {
            return {
                performance_metric_id: 1,
                precision: 1,
                recall: 1,
            };
        }

        else if (this.answers.length === 0 || this.predicts.length === 0) {
            return {
                performance_metric_id: 1,
                precision: 0,
                recall: 0,
            };

        }
        else {

            let total_answer_area = 0, total_predict_area = 0, total_common_area = 0;

            this.answers.forEach(answer => {
                if (answer[0] !== undefined) {
                    let a_right = answer[0].getBoundingClientRect().right;
                    let a_left = answer[0].getBoundingClientRect().left;
                    let a_top = answer[0].getBoundingClientRect().top;
                    let a_bottom = answer[0].getBoundingClientRect().bottom;
                    let answer_width = a_right - a_left;
                    let answer_height = a_bottom - a_top;
                    total_answer_area += answer_width * answer_height;

                    this.predicts.forEach(predict => {
                        if (answer[0]&& predict[0]){


                            let p_right = predict[0].getBoundingClientRect().right;
                            let p_left = predict[0].getBoundingClientRect().left;
                            let p_top = predict[0].getBoundingClientRect().top;
                            let p_bottom = predict[0].getBoundingClientRect().bottom;

                            let predict_width = p_right - p_left;
                            let predict_height = p_bottom - p_top;
                            total_predict_area += predict_width * predict_height;

                            if (!(a_right < p_left || a_left > p_left || a_bottom < p_top || a_top > p_bottom)) {

                                let a = a_left > p_left ? a_left : p_left;
                                let b = a_right < p_right ? a_right : p_right;

                                let c = b - a;

                                let d = a_top > p_top ? a_top : p_top;
                                let e = a_bottom < p_bottom ? a_bottom : p_bottom;

                                let f = e - d;

                                let g = c * f;
                                total_common_area += g;

                            }
                        }
                    })
                }
            });


            if (total_predict_area === 0 || total_answer_area === 0) {
                return {
                    performance_metric_id: 1,
                    precision: 0,
                    recall: 0,
                };
            }
            else {
                return {
                    performance_metric_id: 1,
                    precision: (total_common_area / total_predict_area) > 1 ? 1: total_common_area / total_predict_area,
                    recall: (total_common_area / total_answer_area) > 1 ? 1: total_common_area / total_answer_area,
                };
            }

        }
    }

    get result() {

        return [
            this.words(),
            this.textLCS(),
            this.basedbyarea(),
        ]
    }
}