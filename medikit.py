# -*- coding: utf-8 -*-
"""
Notifications
-------------
Example showing how to add notifications to a characteristic and handle the responses.
Updated on 2019-07-03 by hbldh <henrik.blidh@gmail.com>
"""
import socketio
import logging
import asyncio
import platform
import signal
import time
import itertools
import binascii
from construct import BitStruct, BitsInteger, Flag, Bit, ConstructError
from datetime import datetime
from collections import namedtuple

from bleak import BleakClient
from bleak import _logger as logger


CHARACTERISTIC_UUID = "49535343-1e4d-4bd9-ba61-23c647249616"

PARSING_SCHEMA = {
    0: BitStruct(sync_bit=Flag, pulse_beep=Flag, probe_unplugged=Flag, has_signal=Flag, signal_strength=BitsInteger(4)),
    1: BitStruct(sync_bit=Flag, pleth=BitsInteger(7)),
    2: BitStruct(sync_bit=Flag, pr_last_bit=Bit, pulse_research=Flag, no_finger=Flag, bargraph=BitsInteger(4)),
    3: BitStruct(sync_bit=Flag, pr_bits=BitsInteger(7)),
    4: BitStruct(sync_bit=Flag, spo2=BitsInteger(7))
}

HeartRateData = namedtuple('HeartRateData', ['signal_strength', 'has_signal', 'pleth', 'bargraph', 'no_finger',
                                             'pulse_rate', 'spo2', 'timestamp'])

sio = socketio.Client(engineio_logger=False, logger=False, ssl_verify=False)
count = 0

@sio.event
def connect():
    print('connection established')

@sio.event
def my_message(data):
    print('message received with ', data)
    sio.emit('my response', {'response': 'my response'})

@sio.event
def disconnect():
    print('disconnected from server')


def starting_bit_lookup_condition(x):
    try:
        return PARSING_SCHEMA[0].parse(x.to_bytes(1, 'big')).sync_bit
    except ConstructError:
        return False

def chunks(iterable, condition):
    """Yields split chunks for iterable containing sequences based on a passed condition for a head element.

    e.g.:
    [2, 1, 3, 2, 1, 3, 2, 1, 3] split over (lambda x: x == 3) ===> [2, 1], [3, 2, 1], [3, 2, 1], [3]
    [3, 2, 1, 3, 2] split over (lambda x: x == 3) ===> [3, 2, 1], [3, 2]
    [3, 2] split over (lambda x: x == 3) ===> [3, 2]
    [2, 1] split over (lambda x: x == 3) ===> [2, 1]

    :param iterable: any iterable
    :param condition: callable with 1 argument returning boolean
    :return: generator yielding tuples of sequence parts
    """
    it1, it2 = itertools.tee(iter(iterable))
    sequence_started = False
    while True:
        sequence_ended = False
        split_index = 1 if sequence_started else 0
        try:
            while not sequence_ended:
                item = next(it2)
                condition_result = condition(item)
                if condition_result and split_index == 0:
                    sequence_started = True
                elif condition_result and split_index != 0:
                    sequence_ended = True
                    break
                split_index += 1
        except StopIteration:
            pass

        if split_index and sequence_ended:
            sequence_started = True
            # got the sequence tail, going on the next iteration anyway
        chunk = bytearray(itertools.islice(it1, split_index))
        if not chunk:
            return
        yield chunk


def notification_handler(sender, data):
    for packet in chunks(data, starting_bit_lookup_condition):
        if len(packet) != len(PARSING_SCHEMA):
            # discarding broken packet
            continue
        packet_dict = {}
        try:
            global count
            count+=1
            byte_1_data_container = PARSING_SCHEMA[0].parse(packet[0].to_bytes(1, 'big'))
            byte_3_data_container = PARSING_SCHEMA[2].parse(packet[2].to_bytes(1, 'big'))
            #packet_dict['signal_strength'] = byte_1_data_container['signal_strength']
            #packet_dict['has_signal'] = byte_1_data_container['has_signal']
            #packet_dict['bargraph'] = byte_3_data_container['bargraph']
            #packet_dict['no_finger'] = byte_3_data_container['no_finger']
            packet_dict['spo2'] = packet[4]
            #packet_dict['pleth'] = packet[1]
            packet_dict['pulse_rate'] = packet[3] | ((packet[2] & 0x40) << 1)
            #packet_dict['timestamp'] = str(datetime.now())
            if count%50 == 0 and count  > 350 and packet_dict['pulse_rate'] != 255:
                sio.emit('resp', packet_dict)
                print("{0} : {1}".format(count, packet_dict))
        except Exception as e:
            #logger.exception(e)
            #logger.debug('Error on parsing packet data: %s', e)
            continue
    

async def run(address, loop, debug=False):
    if debug:
        import sys

        # loop.set_debug(True)
        l = logging.getLogger("asyncio")
        l.setLevel(logging.INFO)
        h = logging.StreamHandler(sys.stdout)
        h.setLevel(logging.INFO)
        l.addHandler(h)
        logger.addHandler(h)

    async with BleakClient(address, loop=loop) as client:
        x = await client.is_connected()
        logger.info("Connected: {0}".format(x))
        sio.connect('https://localhost:443')
            #sio.wait()
        await client.start_notify(CHARACTERISTIC_UUID, notification_handler)
        await asyncio.sleep(3.0, loop=loop)
        await client.stop_notify(CHARACTERISTIC_UUID)
        sio.disconnect()

if __name__ == "__main__":
    import os

    os.environ["PYTHONASYNCIODEBUG"] = str(1)
    address = (
        "00:A0:50:F4:3B:17"
    )
    loop = asyncio.get_event_loop()
    try:
        loop.run_until_complete(run(address, loop, True))
    except Exception as e:
        print("device not connected")