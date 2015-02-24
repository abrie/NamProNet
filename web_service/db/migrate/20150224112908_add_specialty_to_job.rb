class AddSpecialtyToJob < ActiveRecord::Migration
  def change
    add_column :jobs, :specialty, :string
  end
end
