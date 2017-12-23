import json
from pprint import pprint

'''
Parses result.json into:
{
	'latin': [
		{ 'city': 'New York', 'attractions': 100, 'score': 4.5},
		{ 'city': 'Houston', 'attractions': 32, 'score': 1.1},
		...
	],
	'asianfusion': [
		{ 'city': 'New York', 'attractions': 100, 'score': 4.5},
		{ 'city': 'Houston', 'attractions': 32, 'score': 1.1},
		...
	],
	...
}

Parses us_cities.json into:
{
	'New York': {'lat': 40.7127837, 'lon': -74.0059413},
	'Los Angeles': {'lat': 34.0522342, 'lon': -118.2436849,
	...
}
'''

def create_cities_by_category(infile, outfile):
	lists = json.load(open(infile, 'r'))
	categories = json.load(open('config_category.json', 'r'))
	city_names = json.load(open('config_city.json', 'r'))

	cities_by_category = {}	

	for i in range(len(lists)):
		category_name = categories[i]
		cities_list = lists[i]
		cities_by_category[category_name] = []
		
		for c in range(int(len(cities_list)/2)):
			city = city_names[c].replace(" ", "_")
			count = cities_list[c*2]
			score = round(cities_list[c*2 + 1], 2)
			if count != 0:
				cities_by_category[category_name].append({'city':city, 'count':count, 'score':score})
			

	with open(outfile, 'w') as outfile:
		json.dump(cities_by_category, outfile, indent=4)


def create_coordinates_by_city(infile, outfile):
	lists = json.load(open(infile, 'r'))

	coordinates_by_city = {}
	for city_object in lists:
		city_name = city_object['city'].replace(" ", "_")
		coordinates_by_city[city_name] = {'lon':city_object['lon'], 'lat':city_object['lat']}

	with open(outfile, 'w') as outfile:
		json.dump(coordinates_by_city, outfile, indent=4)


create_cities_by_category('result.json', 'cities_by_category.json')
create_coordinates_by_city('us_cities.json', 'city_coordinates.json')


