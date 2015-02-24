class CreateJobs < ActiveRecord::Migration
  def change
    create_table :jobs do |t|
      t.references :user, index: true
      t.string :summary

      t.timestamps null: false
    end
    add_foreign_key :jobs, :users
  end
end
