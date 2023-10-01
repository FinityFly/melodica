from flask import Flask, render_template, request, redirect, send_from_directory, jsonify
import instrumental_to_midi as itm
import os
import json

app = Flask(__name__, static_url_path='/static')
filename = ''

# Configure the uploads folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    global filename
    if 'file' not in request.files:
        return redirect(request.url)

    file = request.files['file']

    if file.filename == '':
        return redirect(request.url)
    
    if file:
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        return render_template('audio.html', audio_src=filename)

@app.route('/perform_additional_processing')
def perform_additional_processing():
    global filename
    # Perform your additional processing tasks here
    # Replace this with your actual processing logic
    melodica = itm.InstrumentalToMidi()
    outputs = melodica.get_info(filename)
    melodica.parse_info(outputs['result'])

    with open('static/assets/output_json/links.json', 'w') as fp:
        json.dump(outputs['result'], fp)

    # For example, let's assume you want to send a message "Processing complete"
    response_data = {"message": "Processing complete"}

    # Return the response as JSON
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
