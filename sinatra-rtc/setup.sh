# [[ ! "$(which peerjs)" ]] && npm install -g peer

[[ "$(pidof node)" ]] && pkill -9 node
peerjs -p 9000 &> /dev/null &
printf "\n== PeerJS-Server started: pid = $(pidof node)\n\n"

[[ "$(pidof ruby)" ]] && pkill -9 node
ruby app.rb -o 0.0.0.0 -p 3000 &> "./logs/$(date).log" &
