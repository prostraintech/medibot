ffmpeg -i rtsp://admin:MedibotV4@192.168.1.50/Streaming/Channels/101 -map 0:0 -f v4l2 -pix_fmt yuv420p /dev/video11 -map 0:1 -f s16le -ar 16000 -ac 1 - > /tmp/frontmic
