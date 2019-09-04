Rails.application.configure do
  $cheat_logger = Logger.new("#{Rails.root}/log/cheat.log")
end