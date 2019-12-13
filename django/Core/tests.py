
import os
import django
import numpy as np
import torch, torch.utils.data, torch.nn as nn, torch.optim as optim
from django.forms.models import model_to_dict
from torch.utils.data.sampler import SubsetRandomSampler
import matplotlib.pyplot as plt
import math
from torchvision import datasets, transforms

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
            nn.Linear(self.hidden_size, self.hidden_size),
            nn.BatchNorm1d(self.hidden_size),
            nn.Sigmoid(),
            nn.Linear(self.hidden_size, self.hidden_size),
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


feature_set = ['offset_top', 'offset_left', 'offset_width', 'offset_height', 'num_chars', 'num_tags', 'num_links']
net = TwoLayerNetVerPyTorch(len(feature_set), 3, 1)
net.apply(weight_init)


MSE = nn.MSELoss()

ex_content_data = []
content_data = []
target_data = []

input_data = []


# class MyIterableDataset(torch.utils.data.IterableDataset):
class MyIterableDataset(datasets.VisionDataset):
    def __init__(self):

        super().__init__('./')
        self.data = []
        self.target = []

        self.c1 = []
        self.n1 = []

        self.c2 = []
        self.n2 = []


        for i in Node.objects.all().values_list('hyu',
                                                *feature_set,
                                                'page__predict__predictindex'):
            # self.data.append((torch.FloatTensor(i[1:5]), torch.FloatTensor([1 if i[0] == i[-1] else 0])))
            if i[0] == i[-1]:
                self.data.append(torch.FloatTensor(i[1:len(i)-1]))
                self.target.append(torch.FloatTensor([1 if i[0] == i[-1] else 0]))
            else:
                self.c2.append(torch.FloatTensor(i[1:len(i) - 1]))
                self.n2.append(torch.FloatTensor([1 if i[0] == i[-1] else 0]))

        indices = list(range(len(self.data) * 3))
        np.random.shuffle(indices)

        for i, j in enumerate(indices):

            self.data.append(self.c2[j])
            self.target.append(self.n2[j])

    def __iter__(self):

        return iter(self.data)

    def __getitem__(self, index):

        return self.data[index], self.target[index]

    def __len__(self):
        return len(self.data)

dataset = MyIterableDataset()

num_train = len(dataset)

epochs = 20000
learning_rate = 0.01
batch_size = 10
valid_size = 100

optimizer = optim.SGD(net.parameters(), lr=learning_rate)

indices = list(range(num_train))
split = num_train-valid_size
np.random.shuffle(indices)

train_idx, valid_idx = indices[:split], indices[split:]

train_sampler = SubsetRandomSampler(train_idx)
valid_sampler = SubsetRandomSampler(valid_idx)


train_loader = torch.utils.data.DataLoader(dataset, batch_size=1000, sampler=train_sampler)
valid_loader = torch.utils.data.DataLoader(dataset, batch_size=1000, sampler=valid_sampler)
train_loss_list = []
val_loss_list = []

print('Started to train')
for epoch in range(epochs):
    for i, (X, t) in enumerate(train_loader):
        Y = net(X)
        loss = MSE(Y, t)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if i % 100 == 0:
            with torch.no_grad():
                val_100_loss = []
                for j, (X, t) in enumerate(valid_loader):
                    Y = net(X)
                    loss = MSE(Y, t)
                    val_100_loss.append(loss)

                train_loss_list.append(loss)
                val_loss_list.append(np.asarray(val_100_loss).sum() / len(valid_loader))

            print(f"[{'%4d' % i }/{len(train_loader)}][{'%5d' % epoch}/{epochs}] loss: {loss}")

plt.plot(np.column_stack((train_loss_list, val_loss_list)))
plt.show()
