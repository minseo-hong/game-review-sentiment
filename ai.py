import torch
import torch.nn as nn
from torchtext.data import Field, LabelField, TabularDataset
from torchtext.data.utils import get_tokenizer
import spacy
from sklearn.model_selection import train_test_split
import pandas as pd

df = pd.read_csv('steam_reviews.csv')
df = df.drop(['Game', 'Game ID'], axis=1)
df = df.rename(columns={'Review': 'text', 'Review Type': 'label'})

train_data, test_data = train_test_split(df, test_size=0.2, random_state=42)
train_data, valid_data = train_test_split(train_data, test_size=0.25, random_state=42)

TEXT = Field(tokenize='spacy', tokenizer_language='en_core_web_sm')
LABEL = LabelField(dtype=torch.float)

train_csv_path = 'train.csv'
valid_csv_path = 'valid.csv'
test_csv_path = 'test.csv'

train_data.to_csv(train_csv_path, index=False)
valid_data.to_csv(valid_csv_path, index=False)
test_data.to_csv(test_csv_path, index=False)

fields=[('text', TEXT), ('label', LABEL)]

train_data, valid_data, test_data = TabularDataset.splits(
  path='.',
  train=train_csv_path,
  validation=valid_csv_path,
  test=test_csv_path,
  format='csv',
  fields=fields
)

VOCAB_MAX_SIZE = 25000

TEXT.build_vocab(train_data, max_size=VOCAB_MAX_SIZE, min_freq = 5)
LABEL.build_vocab(train_data)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class GRU(nn.Module):
  def __init__(self, input_dim, embedding_dim, hidden_dim, output_dim):
    super().__init__()
    self.embedding = nn.Embedding(input_dim, embedding_dim)
    self.gru = nn.GRU(embedding_dim, hidden_dim)
    self.fc = nn.Linear(hidden_dim, output_dim)
      
  def forward(self, text):
    embedded = self.embedding(text)
    _, hidden = self.gru(embedded)
    return self.fc(hidden.squeeze(0))

INPUT_DIM = len(TEXT.vocab)
EMBEDDING_DIM = 100
HIDDEN_DIM = 256
OUTPUT_DIM = 1

model = GRU(INPUT_DIM, EMBEDDING_DIM, HIDDEN_DIM, OUTPUT_DIM)
model.load_state_dict(torch.load('game-review-gru-model.pt', map_location=device))
model.to(device)
model.eval()

nlp = spacy.load('en_core_web_sm')
tokenizer = get_tokenizer('spacy', language='en_core_web_sm')

def predict_sentiment(sentence):
  model.eval()
  tokens = [token.text for token in nlp(sentence)]
  indices = [TEXT.vocab.stoi[token] for token in tokens]
  tensor = torch.LongTensor(indices).to(device)
  tensor = tensor.unsqueeze(1)
  prediction = torch.sigmoid(model(tensor))
  return prediction.item()