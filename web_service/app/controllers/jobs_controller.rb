class JobsController < ApplicationController
  def index
    jobs = []
    Job.find_each do |job|
      jobs.push({"summary" => job.summary})
    end

    render :json => {"jobs" => jobs}
  end

  def create
    params.permit!
    user = User.find_by email: params[:email] 
    job = Job.new
    job.summary = params[:job][:summary] 
    job.region = params[:job][:region]
    job.town = params[:job][:town]
    job.specialty = params[:job][:specialty]
    job.user_id = user.id
    job.save

    render :json => {"job":job}
  end
end
