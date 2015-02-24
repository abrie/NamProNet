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
    job = Job.new
    job.summary = params[:job][:summary] 
    job.save

    render :json => {"job":job}
  end
end
