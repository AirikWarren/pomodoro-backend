# Tomato Timer

A simple productivity application for practicing the pomodoro time management technique with others over the internet., if you're interested in it solely in that capacity there is a live web client up at [tomatotimer.in](www.http://tomatotimer.in/)

## Developer / Contributer Quickstart _(WIP, last edited 03/21/2021)_

This quickstart is intentionally terse and is intended to be used as a quick reference when reading through the codebase rather than a comprehensive comprehensive guide directed at users of all experience levels.

Assistance with issues in the initial set-up (cloning repos, checking out new branches, initializing venvs, etc) are beyond the scope of this quickstart.


### Initial Set-Up
1) Clone this repository from the repo 
2) Checkout a new branch with a semi-descriptive name (ie. timer-bugfix)
3) Initialize a virtual environment 
4) Install the project build dependencies in requirements.txt 
5) verify correct installation by evoking  ```flask run``` from the project directory
### Project Structure 
License, readme, and deployment files excluded.
> app 

The bulk of the application logic resides in this director

 >> app/static

This (unsurprisingly) contains all the web client's static content, including all of the JavaScript

>> app/templates

The home of all the jinja templates.

>> app/helpers.py

Poorly named file, contains the server-side implementation of the Timer class.

The client-side counterpart of that class can be found in ```app/static/room.js```

>> app/routes.py

All URL routing and the majority of server-side logic lives here.

> config.py 

configuration variables

>pomodoro.py

entrypoint for the Flask app defined in the app director

>tests.py

Unit tests, utilizes the Python standard library rather than Flask's built-in testing capabilities.

