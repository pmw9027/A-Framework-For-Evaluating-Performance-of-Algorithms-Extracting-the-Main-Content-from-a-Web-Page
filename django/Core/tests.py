
import os
import django
import numpy

# django setting 파일 설정하기 및 장고 셋업
cur_dir = os.path.dirname(__file__)
os.chdir(cur_dir+'/../')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Server.settings')

django.setup()

from Core.models import *

print(TestSet.objects.get(id=1).pages.all())