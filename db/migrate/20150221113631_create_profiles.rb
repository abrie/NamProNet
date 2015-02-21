class CreateProfiles < ActiveRecord::Migration
  def change
    create_table :profiles do |t|
      t.string :first_name
      t.string :last_name
      t.references :user, index: true

      t.timestamps null: false
    end
    add_foreign_key :profiles, :users
  end
end
