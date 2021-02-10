'''URL routing / view functions'''
import json 
from flask import redirect, url_for, jsonify, request, render_template
from app import server, helpers 

@server.route('/')
@server.route('/index')
@server.route('/about')
def index():
    return render_template("index.html")

@server.route('/room/<name>', methods=['GET', 'POST'])
def room_browser(name):
    if request.method == 'GET':
        return render_template('room.html', name=name) 

@server.route('/api/room/<name>', methods=['GET', 'POST']) 
def room(name):
    path_to_timer_json = server.config['DB_PATH']+'/{}.json'.format(name) 

    if request.method == 'GET':
        try:
            f = open(path_to_timer_json, 'r')
            json_from_db = json.load(f)
            f.close()
            return json_from_db
        except FileNotFoundError:
            return jsonify('There is no json at {}'.format(path_to_timer_json))

    elif request.method == 'POST':
        json_from_post = request.get_json()
        try:
            f = open(path_to_timer_json, 'r') 
            json_from_db = json.load(f)
            f.close()
            if json_from_db['password'] == helpers.hash_password(json_from_post['password']):
                timer_obj = helpers.Timer(
                    json_from_post['duration'],
                    json_from_post['is_playing'],
                    json_from_post['start_time'],
                    json_from_post['password']
                )
                json_to_db = timer_obj.json_repr()
                f = open(path_to_timer_json, 'w')
                json.dump(json_to_db, f)
                f.close()
                del(timer_obj)
                return redirect(url_for('room', name=name))
            else:
                f.close()
                return jsonify('Unable to edit timer at {}, admin password incorrect'.format(
                            url_for('room', name=name)))
        except FileNotFoundError:
            f = open(path_to_timer_json, 'w')
            timer_obj = helpers.Timer(
                json_from_post['duration'],
                json_from_post['is_playing'],
                json_from_post['start_time'],
                json_from_post['password']
            )
            json_to_db = timer_obj.json_repr()
            json.dump(json_to_db, f)
            f.close()
            return redirect(url_for('room', name=name))
    else:
        return redirect(url_for('index'))