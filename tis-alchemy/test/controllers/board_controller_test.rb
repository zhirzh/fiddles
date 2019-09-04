require 'test_helper'

class BoardControllerTest < ActionController::TestCase
  test "should get winners" do
    get :winners
    assert_response :success
  end

  test "should get pokers" do
    get :pokers
    assert_response :success
  end

  test "should get cheaters" do
    get :cheaters
    assert_response :success
  end

  test "should get losers" do
    get :losers
    assert_response :success
  end

end
