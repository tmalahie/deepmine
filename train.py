#!/usr/bin/python3
import os
import openai
from dotenv import load_dotenv
import json
import re

def read_file(file_name):
  with open(file_name, "r") as f:
    return f.read()

def write_file(file_name, content):
  with open(file_name, "w") as f:
    f.write(content)

code_prefix = "\n"
code_suffix = "\nprocess.exit(0);"

if __name__ == "__main__":
  load_dotenv()
  openai.api_key = os.environ.get('OPENAI_API_KEY')

  training_code = read_file("training.js")
  training_lines = re.findall(r'((?:^ {4}case ".+?":\n)+)((?:.+\n)+?) {6}break;', training_code, re.MULTILINE)
  training_lines_json = []
  for training_line in training_lines:
    comments = training_line[0].split("\n")
    code = training_line[1][0:-1]
    code = re.sub(r'^ {6}', '', code, flags=re.MULTILINE)
    for comment in comments:
      message_match = re.match(r'^ {4}case "(.+?)":', comment)
      if message_match:
        message = message_match[1].strip()
        if message != "<command>":
          training_lines_json.append(json.dumps({"prompt": message, "completion": code_prefix + code + code_suffix}))
  jsonl = "\n".join(training_lines_json)
  print("New training payload:")
  print(jsonl)
  write_file("training.jsonl", jsonl)

  try:
    print("Deleting old training file...")
    old_file = json.loads(read_file("training.json"))
    print(openai.File.delete(old_file["id"]))
    os.remove("training.json")
    print("Deleted")
  except:
    pass # no old file, or old file already deleted

  print("Uploading training file...")
  file_payload = openai.File.create(
    file=open("training.jsonl"),
    purpose='fine-tune'
  )
  print(file_payload)
  write_file("training.json", json.dumps(file_payload))
  print("Succesfully uploaded, payload saved at training.json")

  try:
    print("Deleting old trained model...")
    old_model = json.loads(read_file("model.json"))
    model_payload = openai.FineTune.retrieve(id=old_model["id"])
    print(openai.Model.delete(model_payload["fine_tuned_model"]))
    os.remove("model.json")
    print("Deleted")
  except:
    pass # no old trained model, or old model already deleted

  print("Training model from training file...")
  training_payload=openai.FineTune.create(
    training_file=file_payload["id"],
    model="davinci"
  )
  print(training_payload)
  write_file("model.json", json.dumps(training_payload))
  print("Successfully created fine-tuned model, payload saved at model.json")