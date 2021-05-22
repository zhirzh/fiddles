require 'rubygems'
require 'sinatra'
require 'json'

Tilt.register(Tilt::ERBTemplate, 'html.erb')

rooms = {}

get '/' do
  erb :index
end

get '/rooms/?' do
  content_type(:json)
  return rooms.keys().to_json()
end

get '/rooms/:room/peers/?' do
  room = params[:room]
  if rooms.key?(room )
    content_type(:json)
    return rooms[room][:peers].to_json()
  else
    status 404
  end
end

post '/:room/?' do
  room = params[:room]
  peer = params[:peer]
  if rooms.key?(room)
    return '0'
  else
    rooms[room] = {
      peers: [peer]
    }
    return '1'
  end
end

get '/:room/?' do
  room = params[:room]
  peer = params[:peer]
  if rooms.key?(room)
    unless rooms[room][:peers].include?(peer)
      content_type(:json)
      rooms[room][:peers].push(peer)
      return rooms[room][:peers].slice(0..-2).to_json()
    else
      return '1'
    end
  else
    return '0'
  end
end

delete '/:room/?' do
  room = params[:room]
  peer = params[:peer]
  if rooms.key?(room)
    if rooms[room][:peers].include?(peer)
      rooms[room][:peers].delete(peer)
      if rooms[room][:peers].empty?()
        rooms.delete(room)
      end
      return '2'
    end
    return '1'
  end
  return '0'
end

not_found do
  status(404)
  send_file(File.expand_path('404.html', settings.public_folder))
end