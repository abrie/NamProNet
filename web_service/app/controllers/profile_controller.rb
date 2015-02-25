class ProfileController < ApplicationController
  def search
    params.permit!
    criteria = {}
    criteria[:region] = params[:criteria][:region] if not params[:criteria][:region].eql? "all" 
    criteria[:town] = params[:criteria][:town] if not params[:criteria][:town].eql? "all" 
    criteria[:specialty] = params[:criteria][:specialty] if not params[:criteria][:specialty].eql? "all" 
    results = Profile.where(criteria)

    render :json => {"results" => results}
  end

  def load
    user = User.find_by email: params[:email] 
    profile = Profile.find_by(user_id: user.id)

    if profile.nil? then
      profile = Profile.new(
        user_id: user.id,
        first_name: "unspecified",
        last_name: "unspecified",
        region: "unspecified",
        town: "unspecified",
        specialty: "unspecified",
        certified: false,
        dob: Date.yesterday,
        skills: "unspecified")
        profile.save
    end

    render :json => {
      "email" => params[:email],
      "profile" => profile
    }
  end

  def update
    params.require(:profile).permit!
    user = User.find_by email: params[:email] 
    profile = Profile.find_by( user_id: user.id )
    profile.update(params[:profile])

    render :json => {
      "email" => params[:email],
      "profile" => profile
    } 

  end
end
