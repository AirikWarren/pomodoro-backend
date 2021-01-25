import unittest
from app import server
import app.routes as routes 
from app.routes import room_timers
import requests

class ApiRoutesCase(unittest.TestCase):
    def setUp(self):
        self.server = server 
        self.root_endpoint = 'http://localhost:5000/'

    def test_room_test(self):
        ep = self.root_endpoint
        def form_room_url(room_name : str) -> requests.Response:
            return requests.get('{}{}{}'.format(ep, 'room/', room_name))
        
        # assuring that the server is actually started and the test_room is up
        r = form_room_url('test_room')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.headers['content-type'], 'application/json')
        print(type(r.content))


if __name__ == '__main__':
    unittest.main(verbosity=2)
