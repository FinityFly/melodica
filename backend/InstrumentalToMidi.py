import requests
import os
import json
import time
from dotenv import load_dotenv
from basic_pitch.inference import predict

class InstrumentalToMidi:
    load_dotenv()
    MOISES_API_KEY = os.getenv('MOISES_KEY')
    AUTHORIZATION_HEADER = {'Authorization': MOISES_API_KEY}

    def __init__(self):
        pass

    def _get_moises_upload_url():
        upload_get_url = "https://developer-api.moises.ai/api/upload"
        upload_response = requests.get(upload_get_url, headers=InstrumentalToMidi.AUTHORIZATION_HEADER)
        return upload_response.json()

    def _upload_file(upload_file_url, file_path):
        file_header = {'content-type': 'multipart/form-data'}
        files = {'file': open(file_path, 'rb')}
        upload_file_put = requests.put(upload_file_url, headers=file_header, files=files)
        if upload_file_put.status_code == 200:
            print("File uploaded successfully!")
        else:
            print("File upload failed")

    def _post_file(download_url, workflow_id):
        post_file_url = "https://developer-api.moises.ai/api/job"
        post_file_header = {'content-type': 'application/json', 'Authorization': InstrumentalToMidi.MOISES_API_KEY}
        data = {'name': f'job_{time.strftime("%Y%m%d-%H%M%S")}', 'workflow': workflow_id, 'params': {'inputUrl': download_url}}
        
        job_request_post = requests.post(post_file_url, headers=post_file_header, data=json.dumps(data))
        if job_request_post.status_code == 200:
            print("Job created successfully!")
            return job_request_post.json()
        else:
            print("Job creation failed")
            return job_request_post.json()

    def _get_job_response(job_id):
        get_job_url = f"https://developer-api.moises.ai/api/job/{job_id}"
        get_job_response = requests.get(get_job_url, headers=InstrumentalToMidi.AUTHORIZATION_HEADER)

        while get_job_response.json()['status'] != 'SUCCEEDED':
            get_job_response = requests.get(get_job_url, headers=InstrumentalToMidi.AUTHORIZATION_HEADER)

        print("Job finished successfully!")
        return get_job_response.json()

    def _download_audio(url, filename):
        response = requests.get(url, allow_redirects=True)
        if response.status_code == 200:
            with open(filename, "wb") as file:
                file.write(response.content)
            print("Audio file downloaded successfully")
        else:
            print("Failed to download audio file")

    def get_info(self, filepath):
        upload_url = self._get_moises_upload_url()
        print(upload_url)

        self._upload_file(upload_url['uploadUrl'], filepath)

        post_file_response = self._post_file(upload_url['downloadUrl'], 'stem-separation')
        print(post_file_response)

        outputs = self._get_job_response(post_file_response['id'])
        print(outputs['result'])

        

        # for output_name, output_file in outputs['result'].items():
        #     filename = f'{output_name}_{time.strftime("%Y%m%d-%H%M%S")}'
        #     filepath = f'assets/output_wav/{filename}'
        #     self._download_audio(output_file, filepath + '.wav')
        #     model_output, midi_output, note_events = predict(filepath + '.wav')
        #     midi_output.write(filepath + '.mid')
        #     print(f"Converted {filename} to midi successfully")

    def getChords(self, filepath):
        upload_url = self._get_moises_upload_url()
        print(upload_url)

        self._upload_file(upload_url['uploadUrl'], filepath)

        post_file_response = self._post_file(upload_url['downloadUrl'], 'chord-extraction')
        print(post_file_response)

        outputs = self._get_job_response(post_file_response['id'])
        print(outputs['result'])