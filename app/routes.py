'''URL routing / view functions'''
from flask import redirect, url_for, jsonify, request 
from app import server, helpers

# This is a placeholder for the JSON representations of timers that are going to be 
# stored server-side. Should probably be in a different file tbh. 
room_timers = {
    'test_room' : helpers.Timer(400, True)
}

@server.route('/')
@server.route('/index')
def index():
    return jsonify("There was a DOC here. It's gone now.") 
 
@server.route('/room/<name>', methods=['GET', 'POST']) 
def room(name):
    if request.method == 'GET':
        try:
            return room_timers[name].json_repr()
        except KeyError:
            return jsonify('No room at this URL')

    elif request.method == 'POST':
        r = request.get_json()

        try:
            if room_timers[name].json_repr()['password'] == helpers.hash_password(r['password']):
                room_timers[name] = helpers.Timer(
                    r['duration'], r['is_playing'],start_time=r['start_time'], password=r['password'])
                return redirect(url_for('room', name=name))
            else:
                return jsonify('Unable to edit timer at {}, admin password incorrect'.format(
                               url_for('room', name=name)))
        except KeyError:
            room_timers[name] = helpers.Timer(r['duration'],
                                                   r['is_playing'],
                                                   start_time=r['start_time'],
                                                   password=r['password'])
            return redirect(url_for('room', name=name))

    else:
        return redirect(url_for('index'))

        # 