class GameController < ApplicationController
  before_action(:authenticate_player!)
  def load_game
  end

  def load_player
    @current_player=current_player
  end

  def score
    if(
      (request.headers['Authentic-XHR'].blank?) or
      (params[:a].blank?()) or
      (params[:c].blank?()) or
      (params[:b].blank?()) or
      (current_player.elements_found[params[:b].to_i-1] == '1')
    )
      $cheat_logger.warn("---#{request.url}---#{request.remote_ip}---#{current_player.email}")
      render 'bad egg',layout: false
      return
    end
    k=params[:b].to_i
    current_player.elements_found[k-1] = '1'
    current_player.update_attributes({
      score:          current_player.score+5,
      elements_found: current_player.elements_found,
    })
    render text: ''
  end

  def load_data
    if(
      (request.headers['Authentic-XHR'].blank?) or
      (params[:q].blank?) or
      (not ['bases','images','image0','names'].include?(params[:q]))
    )
      $cheat_logger.info("---#{request.url}---#{request.remote_ip}---#{current_player.email}")
      render 'bad egg',layout: false
      return
    end
    path=Rails.root.join('app', 'assets','json',"#{params[:q]}.json")
    json_string=File.readlines(path)[0]
    respond_to do |format|
      format.html {render 'bad egg',layout: false }
      format.json {render json: JSON.parse(json_string)}
    end
  end
end
