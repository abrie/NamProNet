class ProfileController < ApplicationController
  def show
      render :json => {"status" => params[:user]}
  end
end
