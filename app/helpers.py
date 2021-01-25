#!/usr/bin/env python3
'''Miscelaneous helper functions and home of the Timer class'''
import datetime
import hashlib
import time
from typing import Union

def hash_password(password) -> Union[str,None]:
    '''applies md5 hash to the password string and returns a str representation of the resulting
    hex if type(password) == str, otherwise it returns None'''
    return hashlib.md5(password.encode()).hexdigest() if password else None

def right_now() -> int:
    '''returns a current (at time of call) unix timestamp''' 
    return int(time.time())

class Timer:
    '''For creating Timer objects which are very easily represented as JSON objects. Actual update
    / user representation of time passage is the responsibility of the client, not this object.
    
    args
    ----
    duration : int - duration in seconds

    is_playing : bool - whether to start the timer as soon as it's created or not

    start_time : int -  unix timestamp, will get set to current time if left as None

    password : str - self-explantory, this will get an md5 hash applied to it in the
               constructor so if you need to preserve/persist this data don't rely on
               this object to do it'
    '''

    def __init__(self, duration : int, is_playing : bool,
                start_time : Union[int, None] = None,
                password : Union[str, None] = None):

        if start_time:
            self.start_time = start_time
        else:
            self.start_time = right_now()

        self.password = hash_password(password) 

        self.duration = duration
        self.is_playing = is_playing
        self.end_time = self.start_time + self.duration # this is largely a redundant variable
        # but it saves a bit of typing and is more clear than duration + start_time

    def start(self) -> None:
        self.is_playing = True
        self.start_time = right_now()
        self.end_time = self.start_time + self.duration

    def stop(self) -> None:
        self.is_playing = False
        self.duration = self.end_time - right_now() 
        self.start_time = None

    def time_left(self) -> Union[int,str]: 
        '''Returns the number of seconds left if the time hasn't stopped,
        otherwise returns a string indicating the timer went off (this will
        obviously change in later releases)'''
        current_time = right_now()
        return self.end_time - current_time \
            if current_time < self.end_time else "BEEP"

    def json_repr(self) -> dict:
        '''returns a dict (which maps neatly to and from JSON) of all
        member values that would be needed in order to instantiate a Timer
        object identical to itself. 

        Useful for comparison between client-side and server-side Timer Objs.'''
        json_repr = {
            "start_time" : self.start_time,
            "password" : self.password,
            "duration" : self.duration,
            "is_playing" : self.is_playing
        }
        return json_repr


