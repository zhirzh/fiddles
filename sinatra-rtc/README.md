# sinatra-rtc

A demo project that uses [sinatra](http://www.sinatrarb.com/) server and [PeerJS](https://github.com/peers/peerjs) to provide WebRTC application base. This project uses the packaged PeerJS-Server as the signaling server and the sinatra server as the main website server.

### Manual
Install [PeerJS-Server](https://github.com/peers/peerjs-server) - used by [PeerJS](https://github.com/peers/peerjs) as the signaling server.
Start it with `peerjs -p 9000`.
Start the sinatra app with `ruby app.rb -o 0.0.0.0 -p 3000`.

### Automated setup
Execute the script `setup.sh` from shell with `source setup.sh` or simply `. setup.sh`.
