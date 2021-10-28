#!/bin/bash

git pull
./arduino-cli compile --fqbn per1234:sam:arduino_due_x_dbg flashbot && ./arduino-cli upload --port /dev/ttyACM0 --fqbn per1234:sam:arduino_due_x_dbg flashbot

if [ "$1" == "debug" ]
then
 minicom -D /dev/ttyACM0 -b 9600
fi
