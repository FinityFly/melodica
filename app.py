from flask import Flask, render_template, request, redirect, send_from_directory
import instrumental_to_midi as itm
import os

app = Flask(__name__)

# Configure the uploads folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('upload.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)

    file = request.files['file']

    if file.filename == '':
        return redirect(request.url)
    
    if file:
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)
        melodica = itm.InstrumentalToMidi()
        outputs = melodica.get_info(filename)
        melodica.parse_info(outputs['result'])
        return render_template('audio.html', audio_src=filename)

if __name__ == '__main__':
    app.run(debug=True)
