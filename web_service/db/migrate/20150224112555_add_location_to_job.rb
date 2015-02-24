class AddLocationToJob < ActiveRecord::Migration
  def change
    add_column :jobs, :region, :string
    add_column :jobs, :town, :string
  end
end
