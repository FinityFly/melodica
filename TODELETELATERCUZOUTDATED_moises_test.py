import requests
import os
import json
from dotenv import load_dotenv

def download_audio(url, file_name):
    response = requests.get(url, allow_redirects=True)
    if response.status_code == 200:
        with open(file_name, "wb") as file:
            file.write(response.content)
        print("Audio file downloaded successfully")
    else:
        print("Failed to download audio file")


load_dotenv()

MOISES_API_KEY = os.getenv('MOISES_KEY')
MOISES_UPLOAD_URL = "https://developer-api.moises.ai/api/upload"

authorization_header = {'Authorization': MOISES_API_KEY}

upload_response = requests.get(MOISES_UPLOAD_URL,  headers=authorization_header)

MOISES_FILE_UPLOAD_URL = upload_response.json()['uploadUrl']
MOISES_FILE_DOWNLOAD_URL = upload_response.json()['downloadUrl']

file_header = {'content-type': 'multipart/form-data'}
files = {'file': open('assets/input_samples/short_sample.mp3', 'rb')}

upload_file_put = requests.put(MOISES_FILE_UPLOAD_URL, headers=file_header, files=files)
if upload_file_put.status_code == 200:
    print("File upload successful!")
else:
    print("File did not upload")

MOISES_POST_URL = "https://developer-api.moises.ai/api/job"
post_header = {'content-type': 'application/json', 'Authorization': MOISES_API_KEY}
data = {'name': 'testJob', 'workflow': 'shibal', 'params': {'inputUrl': MOISES_FILE_DOWNLOAD_URL}}
print(MOISES_FILE_DOWNLOAD_URL)

job_request_post = requests.post(MOISES_POST_URL, headers=post_header, data=json.dumps(data))

if job_request_post.status_code == 200:
    print("Job created successfully!")
else:
    print("Job creation failed")

job_id = job_request_post.json()['id']

GET_JOB_URL = f"https://developer-api.moises.ai/api/job/{job_id}"
get_job_response = requests.get(GET_JOB_URL, headers=authorization_header)

print(get_job_response.json()['status'])
while get_job_response.json()['status'] != 'SUCCEEDED':
    get_job_response = requests.get(GET_JOB_URL, headers=authorization_header)


if get_job_response.json()['status'] == 'SUCCEEDED':
    print("Job finished successfully!")
else:
    print("Job failed/not finished")

results = get_job_response.json()['result']

print(results.keys())

for i in results.keys():
    print(i)
    download_audio(results[i], f'assets/output_{i}.mp3')