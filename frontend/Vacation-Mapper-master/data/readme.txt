The grabyelp.py file takes credentials from config_secret.json to get access to yelp APIs.
I did not put my credentials public, so in order to run grabyelp.py, you need to generate your own config_secret.json file based on the config_secret_template.json file.

The cities I grab include the 50 most popular cities in America according to Wikipedia. Cities are configured in config_city.json.

The categories I grab include restaurants and activities.
Restaurants include Asian Fusion, Latin, Southern, Italian, Greek and Mediterranean. (6 in total)
Activities include Scuba diving, Rafting, Surfing, Skydiving, Hiking and Beaches. (6 in total)

The results are stored in result.json. It is a list of 12 sublists. Each sublist stands for a subcategory (like Latin or Rafting). Within each sublist, there are 100 numbers, the first being the number of businesses in that category in the first city, the second being the average rating of those businesses, the third being the number of businesses in the second city and so on.

The max number of results for each category in each city is set to 1000.