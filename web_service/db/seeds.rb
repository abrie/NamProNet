# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
#
require 'random_data'
regions = ["Erongo", "Hardap", "ǁKaras", "Kavango East", "Kavango West", "Khomas", "Kunene", "Ohangwena", "Omaheke", "Omusati", "Oshikoto", "Kunene", "otjozondjupa"]
towns = ["Omuthiya", "Outapi", "Gobabis", "oshakati", "Windhoek", "Walvis Bay," "Rundu", "Mariental", "Ketmanshop", "opuwo", "Katima Mulilo", "Nkurenkuru"]
specialties =[ "Science", "Firefighter", "Judge", "Military_officer", "Police_officer", "Social_work", "Accountant", "Agriculturist", "Architect", "Economist", "Engineer", "Insurance_agent", "Interpreter", "Lawyer", "Advocate", "Solicitor", "Librarian", "Statistician", "Surveyor", "Urban_planner", "Chiropractors", "Dentist", "Midwife", "Nurse", "Optometrist", "Pathologist", "Pharmacist", "Physical_therapist", "Physician", "Psychologist", "Speech-language_pathologist", "Surgeon", "Veterinarian", "Professor", "Teacher", "Air_Traffic_Controller", "Aircraft", "Sea", "Astronomer", "Biologist", "Chemist", "Geologist", "Meteorologist", "Oceanographer", "Physicist", "Programmer", "Web_developer", "Designer", "Graphic", "Web"]

500.times do
  firstname = Random.firstname
  lastname = Random.lastname
  dob = Random.date
  Profile.create(
    first_name: firstname,
    last_name: lastname,
    dob: dob,
    specialty: specialties.sample,
    region: regions.sample,
    town: towns.sample, 
    certified: rand(100) > 75 ? true : false,
    skills: Random.alphanumeric) 
end
