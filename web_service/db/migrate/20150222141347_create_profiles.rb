class CreateProfiles < ActiveRecord::Migration
  def change
    create_table :profiles do |t|
      t.references :user, index: true
      t.date :dob
      t.string :region
      t.string :town
      t.string :specialty
      t.text :skills

      t.timestamps null: false
    end
    add_foreign_key :profiles, :users
  end
end
