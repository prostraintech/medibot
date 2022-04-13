export DBUS_FATAL_WARNINGS=0
sudo rmmod v4l2loopback
sudo modprobe v4l2loopback devices=1 video_nr=11 card_label="front_cam" exclusive_caps=1
#sudo modprobe -r snd-aloop
#sudo modprobe snd-aloop

#pactl load-module module-pipe-source source_name=frontmic file=/tmp/frontmic format=s16le rate=16000 channels=1

ffmpeg -threads 1 -i rtsp://admin:MedibotV4@192.168.1.50/Streaming/Channels/101 \
-map 0:0 -f v4l2 -pix_fmt yuv420p -r 15 -b:v 1024 -tune zerolatency /dev/video11
#-map 0:1 -f s16le -ar 16000 -ac 1 - > /tmp/frontmic
