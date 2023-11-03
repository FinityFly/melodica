# Melodica
>*Presenting a musician's Swiss Army knife...*

![melodica_thumbnail](https://github.com/FinityFly/melodica/assets/56236512/b87b798f-724e-4439-b776-b141aaaae50b)

As a group of aspiring musicians and a newly formed band, we were in search of a fast and useful tool to assist us in learning and analyzing songs for our practices and performances. Our vision for this project was to create a tool that could visualize and isolate different instruments and elements within songs, allowing band members to play along and practice without losing the presence of other instruments or having to play over existing recordings of their own parts. The opportunity to develop a solution to our problem motivated us to create something practical and valuable that we could both use and take pride in. Therefore, the primary goal of this project is to aid us, as well as other aspiring musicians, in enhancing their practice sessions.

[Best Hack for All Arts winner of *McGill Artificial Intelligence Society Hacks 2023*](https://devpost.com/software/melodica-y0267b)

# Table of Contents
- [Melodica](#melodica)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Run](#run)
  - [Usage](#usage)
- [How It Works](#how-it-works)
  - [What It Does](#what-it-does)
  - [How We Built It](#how-we-built-it)
- [Contributors](#contributors)
- [License](#license)

# Getting Started
These instructions will help you get your own instance of Melodica up and running on your local machine for development and testing purposes. To use the application, follow the steps below:

## Prerequisites
Before you begin, make sure you have the following prerequisites installed:
- **Python 3.x**
  - Flask
  - Moisis (+Moises API key)
  - Basic Pitch
  - Mido
- **Node.js**
  - For P5.js and Three.js

## Installation
1. Clone the repository to your local machine:
```bash
git clone https://github.com/FinityFly/melodica.git
cd melodica
```
2. Install the Python dependencies and Node.js, all listed above

## Configuration
1. Create a **.env** file in the project root directory
```bash
touch .env
```
2. Open the **.env** file and add your Moises API key, assigned to "**MOISES_KEY**":
```js
MOISES_KEY=your-api-key-here
```

## Run
1. Start the Flask server with your respective alias of Python3
```bash
python3 app.py
```
2. Access the application in your web browser at **http://127.0.0.1:5000/**

## Usage
- Upload a song or music track to Melodica.
- Explore the separated instrumental stems and audio tracks
- Try out the timed chord feature to sing and/or play along with the song
- Use the provided audio visualizations to enhance your experience

# How It Works
## What It Does
Melodica is a web app that enables users to upload a song or music track, which it then separates and visualizes into distinct instrumentals and audio tracks. It also provides a timed chord feature that allows users to sing and play along with the song. Additionally, Melodica offers audio level and pitch visualizations for each instrument and provides the capability to manipulate and download each instrument track.

## How We Built It
Melodica utilizes two primary artificial intelligence technologies to analyze the waveform of a user-inputted song. Moises separates the various instrument stems and extracts the song's characteristics using multiple pre-trained recurrent models, while Spotify's open-source MIDI converter, Basic Pitch, transforms the isolated audio data into MIDI format. The web application's front end employs a Flask architecture that integrates a P5.js script to create various audio visualizations of the song. Additionally, Three.js was used to create haha funny spinning instruments animation for our loading screen while the program processed the song on the backend.

# Contributors
- **Vu Cao**: @mizly
- **Joel Cherian**: @SyphxN
- **Daniel Lu**: @FinityFly
- **Justin Xue**: @shoexue

# License
This project is licensed under the MIT License.
