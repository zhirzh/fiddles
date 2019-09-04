class PlayerRegistrationsController < Devise::RegistrationsController
  def create()
    super()
    if resource.save
      resource.update_attribute(:elements_found, ([1]*4 + [0]*550).join())
    end
  end
end