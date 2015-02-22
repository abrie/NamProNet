class ProfileController < ApplicationController
  def load
      user = User.find_by email: params[:email] 
      profile = Profile.find_or_initialize_by(
        user_id: user.id,
        first_name: "first",
        last_name: "last",
        region: "none",
        town: "none",
        specialty: "none",
        dob: Date.yesterday,
        skills: "none")

      render :json => {"profile" => profile}
  end
end
