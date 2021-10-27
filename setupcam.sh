export DBUS_FATAL_WARNINGS=0
sudo rmmod v4l2loopback
sudo modprobe v4l2loopback devices=1 video_nr=11 card_label="front_cam" exclusive_caps=1
#pactl unload-module alsa_card.platform-snd_aloop.0
#sudo modprobe -r snd-aloop
sudo modprobe snd_aloop
pactl load-module module-pipe-source source_name=frontmic file=/tmp/frontmic format=s16le rate=16000 channels=1
