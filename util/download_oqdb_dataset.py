import argparse
import urllib.request
import json
import sys
import os

def remove_accent_in_response(json_file):
	for quiz in json_file["quizz"]:
		for i, cat in enumerate(json_file["quizz"][quiz]):
			json_file["quizz"][quiz][i]["reponse"] = cat.pop("réponse")
	return json_file

def remove_accent(json_file):
	json_file["redacteur"] = json_file.pop("rédacteur")
	json_file["theme"] = json_file.pop("thème")
	json_file["difficulte"] = json_file.pop("difficulté")
	json_file["quizz"]["debutant"] = json_file["quizz"].pop("débutant")
	json_file["quizz"]["confirme"] = json_file["quizz"].pop("confirmé")
	json_file = remove_accent_in_response(json_file)
	return json_file

def download(url):
	try:
		res = urllib.request.urlopen(url)
		res_body = res.read()
		j = json.loads(res_body.decode("utf-8"))
		return j
	except:
		print("Error while downloading or parsing file")
		sys.exit()
		
def save_file(filename, json_file, model_path):
	filename = os.path.join(model_path, filename)
	with open(filename, 'w') as f:
		json.dump(json_file, f)
	
if __name__ == "__main__":
	
	parser = argparse.ArgumentParser(description = 'Download a json dataset')

	parser.add_argument(
							'--f', 
							type = str,
							help = 'The output filename',
							required = True
						)

	parser.add_argument(
							'--u', 
							type = str,
							help = 'The download URL'
						)
						
	parser.add_argument(
							'--d', 
							type = str,
							help = 'The saving directory',
							required = True
						)

	args = parser.parse_args()
	filename = args.f
	url = args.u
	model_path = ""
	model_path = args.d

	if ".json" not in filename:
		print("Filename : {filename} should have .json as an extension")
		sys.exit()
		
	json_file = download(url)
	json_file = remove_accent(json_file)
	save_file(filename, json_file, model_path)
	print(f"Done downloading and converting {os.path.join(model_path, filename)}")

