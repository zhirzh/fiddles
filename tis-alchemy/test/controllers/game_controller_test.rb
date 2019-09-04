require 'test_helper'

class GameControllerTest < ActionController::TestCase
  test "should get load" do
    get :load
    assert_response :success
  end

  test "should get merge" do
    get :merge
    assert_response :success
  end

end
