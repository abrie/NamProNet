ActiveAdmin.register Profile do

  permit_params :first_name, :last_name, :town, :region, :specialty, :certified, :dob, :skills

end
