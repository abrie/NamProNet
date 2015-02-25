class AddCertificationToProfile < ActiveRecord::Migration
  def change
    add_column :profiles, :certified, :boolean
  end
end
