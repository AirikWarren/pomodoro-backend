#!/usr/bin/env python3
import datetime
import hashlib
import time

def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest() if password else None

def right_now():
    return int(time.time())

'''def print_time_left(func : function):
    def print_time(timer : Timer):
        time_left = timer.start_time + timer.duration - timer.start_time
'''

class Timer:
    def __init__(self, duration : int, is_playing : bool, start_time=None, password=None):

        if start_time:
            self.start_time = start_time
        else:
            self.start_time = right_now()

        self.password = hash_password(password) 

        self.duration = duration
        self.is_playing = is_playing
        self.end_time = self.start_time + self.duration

    def start(self):
        self.is_playing = True
        self.start_time = right_now()
        self.end_time = self.start_time + self.duration

    def stop(self):
        print('Timer stopped with {} on the clock'.format(self.time_left()))
        self.duration = self.end_time - right_now() 
        self.is_playing = False
        self.start_time = None

    def time_left(self): 
        current_time = right_now()
        return self.end_time - current_time \
            if current_time < self.end_time else "BEEP"

if __name__ == '__main__':
    t = Timer(23, True, password='reallybadpassword')
    t.start()
    end_time = t.end_time - 12
    
    while right_now() < end_time:
        time.sleep(1)
        print(t.time_left())
        pass

    t.stop()

    # while program is running
    # check for any commands / client side actions
    # check the server for any updates 
    # update the client accordingly 
    # do any client side actions
