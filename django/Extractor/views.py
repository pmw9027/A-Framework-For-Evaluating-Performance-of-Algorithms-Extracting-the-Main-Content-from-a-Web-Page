from django.shortcuts import render
from rest_framework.views import APIView
from django.http import JsonResponse, FileResponse, HttpResponseNotFound, HttpResponse



class ExtractorAPIView(APIView):

    def get(self, extractor_id=None):
        if extractor_id:

            model = TheModelClass(*args, **kwargs)
            model.load_state_dict(torch.load(PATH))
            model.eval()

            return JsonResponse()
        else:
            pass
