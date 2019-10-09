from flask import Flask, request
from flask import render_template
from flask import jsonify
from flask import send_file, make_response
from flask_cors import CORS

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
import tensorflow.keras.utils as ku 

import numpy as np

import string

import re

import pickle

app = Flask(__name__, static_url_path='')
CORS(app)

# Run : FLASK_APP=model_server.py FLASK_DEBUG=1 flask run

# Load models
model = load_model("text_gen_model.h5")
	
with open('second_tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

def generate_text(seed_text, k = 4, max_sequence_len = 18):
	token_list = tokenizer.texts_to_sequences([seed_text])[0]
	token_list = pad_sequences([token_list], maxlen = max_sequence_len - 1, padding = 'pre')
	predicted = model.predict(token_list, verbose = 0)
	predicted = predicted.flatten()
	predicted = np.random.choice(len(predicted), k, p = predicted, replace = False)
	output_words = []
	for word, index in tokenizer.word_index.items():
		if index in predicted:
			output_words.append(word)
	return output_words

@app.route('/getWordSuggestion/<sentence>/<k>', methods=['GET'])
def get_word_chart(sentence, k):
	text = generate_text(str(sentence), int(k))
	return jsonify(text)
	

if __name__ == '__main__':
	app.run(host = '0.0.0.0', port = 34334)
	print("Running on localhost")