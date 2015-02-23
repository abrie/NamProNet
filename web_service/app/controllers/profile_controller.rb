class ProfileController < ApplicationController
  def load
      user = User.find_by email: params[:email] 
      profile = Profile.find_or_initialize_by(
        user_id: user.id,
        first_name: "undefined",
        last_name: "undefined",
        region: "undefined",
        town: "undefined",
        specialty: "undefined",
        dob: Date.yesterday,
        skills: "none")
      profile.save

      render :json => {"profile" => profile}
  end

  def update
    params.require(:profile).permit!
    user = User.find_by email: params[:email] 
    profile = Profile.find_by( user_id: user.id )
    result = profile.update(params[:profile])
    render :json => {"result" => result}
  end
end
