daemonize true
workers 4
threads 1, 6
app_dir = File.expand_path("../..", __FILE__)
rails_env = ENV['RAILS_ENV'] || "production"
environment rails_env
bind "unix://#{app_dir}/tmp/sockets/puma.sock"
stdout_redirect "#{app_dir}/log/puma.access.log", "#{app_dir}/log/puma.error.log", true
pidfile "#{app_dir}/tmp/pids/puma.pid"
state_path "#{app_dir}/tmp/pids/puma.state"
activate_control_app
on_worker_boot do
  require "active_record"
  ActiveRecord::Base.connection.disconnect! rescue ActiveRecord::ConnectionNotEstablished
  ActiveRecord::Base.establish_connection(YAML.load_file("#{app_dir}/config/database.yml")[rails_env])
end
