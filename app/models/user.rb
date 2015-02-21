class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def after_database_authentication
      profile = Profile.find_by_user_id(self.id)
      if profile.nil? then
          Profile.create
      end

  end
end
