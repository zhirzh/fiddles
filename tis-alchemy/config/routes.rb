Rails.application.routes.draw do
  root 'game#load_game'
  devise_for :players, controllers: { registrations: 'player_registrations' }
  get  'game/load_data'
  get  'game/load_player'
  get  'board/cheaters'
  get  'board/losers'
  get  'board/pokers'
  get  'board/winners'
  post  'game/score'
end
