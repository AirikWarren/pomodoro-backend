import unittest
import requests
import json
import os
import shutil


from app import server
from app.helpers import Timer


def send_get_to_room_url(root_endpoint: str, room_name: str) -> requests.Response:
    '''sends GET to <root_endpoint>/room/<name>, returns the Response object'''
    return requests.get('{}{}{}'.format(root_endpoint, 'room/', room_name))


def send_post_to_room_url(root_endpoint: str,
                          room_name: str,
                          json_repr: dict) -> requests.Response:
    '''sends POST to <root_endpoint>/room/<name>, returns the Response object'''
    return requests.post('{}{}{}'.format(root_endpoint, 'room/', room_name),
                         json=json_repr)


class ApiRoutesCase(unittest.TestCase):
    def setUp(self):
        self.server = server
        self.root_endpoint = 'http://localhost:5000/api/'
        assert int(server.testing) == 1

        self.db_path = server.config['DB_PATH']

        try:
            os.mkdir(server.config['DB_PATH'])
        except FileExistsError:
            pass

        t = Timer(
            duration=300,
            is_playing=False,
        )

        t_json = open(self.db_path+'/test_room.json', 'w')
        json.dump(t.json_repr(), t_json)
        t_json.close()

    def tearDown(self):
        shutil.rmtree(self.db_path)

    def test1_receiving_Json_from_existing_room(self):
        '''makes sure that the test_room is up and that JSON can be retrieved from it'''
        ep = self.root_endpoint
        db_path = self.db_path
        f = open(db_path+'/test_room.json')
        test_json = json.load(f)
        f.close()

        t = Timer(
            duration=test_json['duration'],
            is_playing=test_json['is_playing'],
            start_time=test_json['start_time'],
            password=test_json['password']
        )

        r = send_get_to_room_url(ep, 'test_room')
        self.assertEqual(r.status_code, 200,
                         'Expected status code 200, got {} instead'.format(
                             r.status_code
                         ))
        self.assertEqual(r.headers['content-type'], 'application/json',
                         'Expected "application/json" in header, got {} instead'.format(
            r.headers['content-type']
        ))

        timer_args = r.json()
        timer_from_json = Timer(
            timer_args['duration'],
            timer_args['is_playing'],
            t.start_time,
        )
        self.assertEqual(timer_from_json.json_repr(), t.json_repr())

    def test2_creating_new_room(self):
        '''Ensures that new rooms can be created via POST request'''
        from app.helpers import hash_password
        ep = self.root_endpoint
        pw = 'password123'
        hashed_password = hash_password(pw)

        r = send_get_to_room_url(ep, 'new_room')
        self.assertEqual(type(r.json()), type(''),
                         'room already exists at this location, did you remember to kill the server?')

        t = Timer(
            duration=400,
            is_playing=False,
            start_time=0,
            password=pw
        )

        self.assertEqual(t.password, hashed_password,
                         "Timer object isn't hashing passwords properly")

        j = t.json_repr()
        j['password'] = pw
        r = send_post_to_room_url(ep,
                                  'new_room',
                                  j)

        self.assertEqual(r.status_code, 200,
                         'expected status code 200, got {} instead'.format(
                             r.status_code
                         ))
        self.assertEqual(r.headers['content-type'], 'application/json',
                         'Expected "application/json" in header, got {} instead'.format(
            r.headers['content-type']
        ))

        r_dict = r.json()

        self.assertEqual(r_dict["password"], t.password,
                         "Expected response JSON Password to be \n {}".format(t.password) +
                         "\n Was \n {} \n instead".format(r_dict["password"]))

    def test3_protecting_against_trolls(self):
        '''tests if passwords are successful in keeping bad POST requests from modifying things'''
        ep = self.root_endpoint

        r = send_get_to_room_url(ep, 'new_room')

        self.assertEqual(r.status_code, 200,
                         'expected status code 200, got {} instead'.format(
                             r.status_code
                         ))

        t = Timer(
            duration=400,
            is_playing=False,
            start_time=0,
            password='password123'
        )

        r = send_post_to_room_url(ep, 'new_room', t.json_repr())

        self.assertEqual(r.status_code, 200,
                         'expected status code 200, got {} instead'.format(
                             r.status_code
                         ))
        self.assertEqual(r.headers['content-type'], 'application/json',
                         'Expected "application/json" in header, got {} instead'.format(
            r.headers['content-type']
        ))

        t = Timer(
            duration=100,
            is_playing=False,
            password='wrong_password'
        )

        r = send_post_to_room_url(ep, 'new_room', t.json_repr())

        self.assertEqual(r.status_code, 200,
                         'expected status code 200, got {} instead'.format(
                             r.status_code
                         ))

        self.assertIsInstance(
            r.json(), str, 'Allowing POSTs with bad password fields to edit the timer')

        r = send_get_to_room_url(ep, 'new_room')

        self.assertEqual(r.status_code, 200,
                         'expected status code 200, got {} instead'.format(
                             r.status_code
                         ))

        r = send_post_to_room_url(ep, 'new_room', r.json())

        self.assertIsInstance(r.json(
        ), str, 'Not hashing the password server-side, can edit a timer just by doing a GET and submitting the same JSON back')

    def test4_updating_server_timer_with_client_info(self):
        pass


if __name__ == '__main__':
    unittest.main(verbosity=2)
