
import os
import django
import numpy as np
import torch, torch.utils.data, torch.nn as nn, torch.optim as optim
from django.forms.models import model_to_dict
from torch.utils.data.sampler import SubsetRandomSampler
import matplotlib.pyplot as plt

# django setting 파일 설정하기 및 장고 셋업
cur_dir = os.path.dirname(__file__)
os.chdir(cur_dir+'/../')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Server.settings')

django.setup()

from Core.models import *
plt.ion()


class TwoLayerNetVerPyTorch(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super().__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size

        self.network1 = nn.Sequential(
            nn.Linear(self.input_size, self.hidden_size),
            nn.BatchNorm1d(self.hidden_size),
            nn.Sigmoid(),
            nn.Linear(self.hidden_size, self.output_size),
            nn.Sigmoid(),
        )

    def forward(self, x):
        return self.network1(x)


def weight_init(m):
    if m.__class__.__name__.find('Linear') != -1:
        m.weight.data.uniform_(0.0, 1.0)
        m.bias.data.fill_(0)


device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
print(device)

epochs = 10000
learning_rate = 0.1
batch_size = 100
valid_size = 100

net = TwoLayerNetVerPyTorch(4, 3, 1)
net.apply(weight_init)

optimizer = optim.SGD(net.parameters(), lr=learning_rate)

MSE = nn.MSELoss()

ex_content_data = []
content_data = []
target_data = []

input_data = []

# for i in TestSet.objects.get(id=1).pages.all():
#     for j in i.node_set.all():
#         a = list(model_to_dict(j, fields=['offset_top', 'offset_left', 'offset_width', 'offset_height']))
#         try:
#             if i.predict_set.get(content_extractor_id=2).predictindex_set.get().predict_index == j.hyu:
#                 content_data.append(a)
#                 target_data.append(1)
#             else:
#                 ex_content_data.append(a)
#         except Predict.DoesNotExist:
#             pass

# Predict.objects.all(

# PredictIndex.objects.all().select_related('predict_id').values('predict_id', 'predict_index')

# print(Node.objects.all().values('page__predict__id').query)
# print(Node.objects.all().values())

X = []
Y = []

for i in Node.objects.all().values_list('hyu', 'offset_top', 'offset_left', 'offset_width', 'offset_height', 'page__predict__predictindex'):
    if i[0] == i[-1]:
        X.append(i[1:-1])
        Y.append([i[-1]])


arr = np.append(X, Y, axis=0)

print(arr)

# print(content_nodes)

no_content_nodes = [i for i in Node.objects.all().values_list('hyu', 'offset_top', 'offset_left', 'offset_width', 'offset_height',
                                                 'page__predict__predictindex') if i[0] != i[-1]]

# print(len(content_nodes), len(no_content_nodes))


dataset = np.array(content_nodes)
num_train = len(dataset)


indices = list(range(num_train))
np.random.shuffle(indices)

split = num_train - valid_size
train_idx, valid_idx = indices[:split], indices[split:]


train_sampler = SubsetRandomSampler(train_idx)
train_loader = torch.utils.data.DataLoader(dataset, batch_size=batch_size, sampler=train_sampler)

#
# train_sampler = SubsetRandomSampler(train_idx)
# valid_sampler = SubsetRandomSampler(valid_idx)
#


#
#
train_loss_list = []


print('Started to train')
for epoch in range(1):
    for (X, t) in enumerate(train_loader):
        # print(X, t)

        #             print(f"[{'%3d' % j }/{len(dataloader)}][{'%5d' % epoch}/{epochs}] loss: {loss}")

        break
#         Y = net(X)
#         loss = MSE(Y, t)
#         optimizer.zero_grad()
#         loss.backward()
#         optimizer.step()
#
#         if j % 100 == 0:
#
#     train_loss_list.append(loss)
#
# plt.plot(train_loss_list)
