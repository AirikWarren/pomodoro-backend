'''URL routing / view functions'''
import json 
from flask import redirect, url_for, jsonify, request
from app import server, helpers 



@server.route('/')
@server.route('/index')
def index():
    return jsonify(str(int(server.testing))) 
 
@server.route('/room/<name>', methods=['GET', 'POST']) 
def room(name):
    url_to_room = server.config['DB_PATH']+'/{}.json'.format(name)
    if request.method == 'GET':
        try:
            return(json.load(open(url_to_room)))
        except FileNotFoundError:
            return jsonify('There is no room at {}'.format(url_to_room))
    elif request.method == 'POST':
        r = request.get_json()
        try:
            json_file = open(url_to_room, 'r+') 
            json_timer = json.load(json_file)
            if json_timer['password'] == helpers.hash_password(r['password']):
                timer_obj = helpers.Timer(
                    r['duration'],
                    r['is_playing'],
                    start_time=r['start_time'],
                    password=r['password']
                )
                new_json = timer_obj.json_repr()
                json.dump(new_json, json_file)
                json_file.close()
                return redirect(url_for('room', name=name))
            else:
                json_file.close()
                return jsonify('Unable to edit timer at {}, admin password incorrect'.format(
                            url_for('room', name=name)))
        except FileNotFoundError:
            json_file = open(url_to_room, 'w')
            timer_obj = helpers.Timer(
                r['duration'],
                r['is_playing'],
                start_time=r['start_time'],
                password=r['password']
            )
            new_json = timer_obj.json_repr()
            json.dump(new_json, json_file)
            json_file.close()
            return redirect(url_for('room', name=name))
    else:
        return redirect(url_for('index'))