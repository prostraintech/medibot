export DBUS_FATAL_WARNINGS=0
sudo rmmod v4l2loopback
sudo modprobe v4l2loopback devices=1 video_nr=11 card_label="front_cam" exclusive_caps=1
#pactl unload-module alsa_card.platform-snd_aloop.0
#sudo modprobe -r snd-aloop
#if lsmod  | grep snd_aloop &> /dev/null ; then
 #echo "loaded"
#else
 sudo modprobe snd_aloop
 pactl load-module module-pipe-source source_name=frontmic file=/tmp/frontmic format=s16le rate=16000 channels=1
#fi

ffmpeg -i rtsp://admin:MedibotV4@192.168.1.50/Streaming/Channels/101 -map 0:0 -f mpegts -pix_fmt yuv420p -tune zerolatency -preset ultrafast /dev/video11 -map 0:1 -f s16le -ar 16000 -ac 1 - > /tmp/frontmic
