import requests
import urllib.request
import os
import json
import time
from dotenv import load_dotenv
from basic_pitch.inference import predict
from mido import MidiFile

class InstrumentalToMidi:
    load_dotenv()
    MOISES_API_KEY = os.getenv('MOISES_KEY')
    AUTHORIZATION_HEADER = {'Authorization': MOISES_API_KEY}

    def __init__(self):
        pass

    def _get_moises_upload_url(self):
        upload_get_url = "https://developer-api.moises.ai/api/upload"
        upload_response = requests.get(upload_get_url, headers=InstrumentalToMidi.AUTHORIZATION_HEADER)
        return upload_response.json()

    def _upload_file(self, upload_file_url, filepath):
        file_header = {'content-type': 'multipart/form-data'}
        files = {'file': open(filepath, 'rb')}
        upload_file_put = requests.put(upload_file_url, headers=file_header, files=files)
        if upload_file_put.status_code == 200:
            print("File uploaded successfully!")
        else:
            print("File upload failed")

    def _post_file(self, download_url, workflow_id):
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

    def _get_job_response(self, job_id):
        get_job_url = f"https://developer-api.moises.ai/api/job/{job_id}"
        get_job_response = requests.get(get_job_url, headers=InstrumentalToMidi.AUTHORIZATION_HEADER)

        while get_job_response.json()['status'] != 'SUCCEEDED':
            get_job_response = requests.get(get_job_url, headers=InstrumentalToMidi.AUTHORIZATION_HEADER)

        print("Job finished successfully!")
        return get_job_response.json()

    def _download_audio(self, url, filename):
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
        return outputs
    
    def parse_info(self, results):
        for output_name, output_file in results.items():
            filename = output_name
            # filename = f'{output_name}_{time.strftime("%Y%m%d-%H%M%S")}'
            wavfilepath = f'static/assets/output_wav/{filename}'
            midifilepath = f'static/assets/output_midi/{filename}'
            if output_name in ['bass_output', 'drum_output', 'other_output', 'vocal_output']:
                self._download_audio(output_file, wavfilepath + '.wav')
                model_output, midi_output, note_events = predict(wavfilepath + '.wav')
                midi_output.write(midifilepath + '.mid')
                f = open(f"static/assets/output_txt/{filename}.txt", "w")
                mid = MidiFile(midifilepath + '.mid', clip=True)
                max,min=0,128
                bpm = 60000000/mid.tracks[0][0].tempo
                tbs = mid.ticks_per_beat

                for msg in mid.tracks[1]:
                    if(msg.type) == "note_on" and msg.time>0:
                        if msg.note>max:
                            max = msg.note
                        if msg.note<min:
                            min = msg.note
                        f.write(str(msg.note) + " " + str(msg.time/tbs*60/bpm) + "\n")
                f.write(str(min) + " " +  str(max))
                f.close()
                print(f"Converted {filename} to midi successfully")
            elif output_name == 'bpm_output':
                pass
            elif output_name == 'key_output':
                pass
            elif output_name == 'beats_output':
                pass
            elif output_name == 'chord_output':
                response = requests.get(output_file)
                json_data = response.json()
                with open(f"static/assets/output_json/{filename}.json", "w") as f:
                    json.dump(json_data, f)
                    f.close()