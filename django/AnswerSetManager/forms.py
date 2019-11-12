from django import forms


class UploadFileForm(forms.Form):
    # title = forms.CharField(max_length=50)
    file = forms.FileField()


class PageForm(forms.Form):
    page_id = forms.IntegerField(required=False)
    domain = forms.CharField(max_length=255, required=False)
    url = forms.CharField(max_length=255, required=False)
    protocol = forms.CharField(max_length=255, required=False)
    mhtmlData = forms.CharField(required=False)


class PredictForm(forms.Form):
    page_id = forms.IntegerField(required=False)
    content_extractor = forms.IntegerField(required=False)
    predicts = forms.MultipleChoiceField(required=False)
    readable = forms.BooleanField(required=False)


class EvaluationPostForm(forms.Form):
    predict = forms.IntegerField(required=False)
    performance_metric_id = forms.IntegerField(required=True)
    recall = forms.FloatField(required=True)
    precision = forms.FloatField(required=True)
    # performance_value = forms.FloatField(required=True)
