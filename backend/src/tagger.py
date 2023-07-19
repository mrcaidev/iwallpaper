import json
import os

import torch
from PIL import Image
from torch.nn import CrossEntropyLoss, Linear
from torch.optim import SGD
from torch.utils.data import DataLoader, Dataset, random_split
from torchvision.models import vgg16
from torchvision.transforms import Compose, Normalize, Resize, ToTensor
from tqdm import tqdm

# 数据处理
data_img_path = ""
data_label_path = ""


class ImageTransform:
    def __init__(self, resize, mean, std):
        self.data_transform = Compose(
            [
                Resize(resize),
                ToTensor(),
                Normalize(mean, std),
            ]
        )

    def __call__(self, img):
        return self.data_transform(img)


# 参数后期可以调整
resize = 224
mean = (0.485, 0.456, 0.406)
std = (0.229, 0.224, 0.225)


class DataProcess(Dataset):
    def __init__(self, data_path, label_path, transform):
        self.data_path = data_path
        self.data_path_list = os.listdir(self.data_path)
        self.label_path = label_path
        self.transform = transform
        with open(self.label_path, "r") as f:
            self.labels = json.load(f)

    def __getitem__(self, index):
        img_path = self.data_path + "/" + self.data_path_list[index]
        img = Image.open(img_path)
        img_transformed = self.transform(img)
        label = torch.tensor(self.labels[index]["vector"])
        return img_transformed, label

    def __len__(self):
        return len(self.data_path_list)


dataset = DataProcess(data_img_path, data_label_path, ImageTransform(resize, mean, std))

dataset_size = len(dataset)

train_ratio = 0.7
train_size = int(train_ratio * dataset_size)
val_size = dataset_size - train_size

train_dataset, val_dataset = random_split(dataset, [train_size, val_size])

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=64, shuffle=False)


# 创建网络模型
use_pretrained = True
net = vgg16(use_pretrained)
net.classifier[6] = Linear(in_features=4096, out_features=1000)
net.train()

loss = CrossEntropyLoss()
# 由于我们使用的是训练好的VGG框架，因此只需要训练原先的classifier的参数即可
# 可能预训练好的框架不能提供很好的壁纸图片特征提取，先试一试
params_to_update = []
update_param_names = ["classifier.6.weight", "classifier.6.bias"]
for name, param in net.named_parameters():
    if name in update_param_names:
        param.requires_grad = True
        params_to_update.append(param)
    else:
        param.requires_grad = False

optimizer = SGD(params_to_update, lr=0.01, momentum=0.9)


def train_model(net, dataloader, loss, optimizer, epochs):
    # 判断是否使用GPU
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    net.to(device)
    net.train()

    for epoch in range(epochs):
        print("Epoch {}/{}".format(epoch + 1, epochs))
        print("------------")
        epoch_loss = 0.0

        for inputs, labels in tqdm(dataloader):
            inputs = inputs.to(device)
            labels = labels.to(device)

            # 初始化optimizer
            optimizer.zero_grad()

            # forward
            with torch.set_grad_enabled(True):
                outputs = net(inputs)
                loss_value = loss(outputs, labels)

                # 反向传播
                loss_value.backward()
                optimizer.step()

                epoch_loss += loss_value.item() * inputs.size(0)

        epoch_loss = epoch_loss / len(dataloader.dataset)
        print("Loss: {:.4f}".format(epoch_loss))


train_model(net, train_dataset, loss, optimizer, 5)

# 保存训练好的参数
save_path = "./weights.pth"
torch.save(net.state_dict(), save_path)
