import requests
import time
import logging


class WeatherService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "http://api.openweathermap.org/data/2.5/weather"
        self.units = "imperial"

    def fetch_weather(self, location):
        """
        Fetch detailed weather information from OpenWeatherMap API
        """
        try:
            params = {
                'q': location,
                'appid': self.api_key,
                'units': self.units
            }
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()

            data = response.json()
            return {
                "temperature": {
                    "current": data['main']['temp'],
                    "feels_like": data['main']['feels_like'],
                    "high": data['main']['temp_max'],
                    "low": data['main']['temp_min']
                },
                "weather": {
                    "description": data['weather'][0]['description'],
                    "main": data['weather'][0]['main'],
                    "icon": data['weather'][0]['icon']
                },
                "humidity": data['main']['humidity'],
                "wind": {
                    "speed": data['wind']['speed'],
                    "direction": data['wind'].get('deg'),
                    "gust": data['wind'].get('gust')
                },
                "clouds": data['clouds']['all'],
                "visibility": data.get('visibility', 0),
                "pressure": data['main']['pressure'],
                "sun": {
                    "sunrise": data['sys']['sunrise'],
                    "sunset": data['sys']['sunset']
                },
                "timezone": data['timezone'],
                "coordinates": {
                    "lat": data['coord']['lat'],
                    "lon": data['coord']['lon']
                }
            }
        except requests.exceptions.RequestException as e:
            logging.error(f"Weather API request error: {e}")
            return None
        except Exception as e:
            logging.error(f"Unexpected error fetching weather data: {e}")
            return None

    def format_weather_info(self, weather_data, location):
        """
        Format detailed weather information for display
        """
        if not weather_data:
            return f"Weather information for {location} is unavailable."
        
        temp = weather_data['temperature']
        weather = weather_data['weather']
        wind = weather_data['wind']
        sun = weather_data['sun']

        return (
            f"Current weather in {location}:\n"
            f"- Temperature: {temp['current']}°F (feels like: {temp['feels_like']}°F)\n"
            f"- High: {temp['high']}°F, Low: {temp['low']}°F\n"
            f"- Conditions: {weather['description'].capitalize()} ({weather['main']})\n"
            f"- Humidity: {weather_data['humidity']}%\n"
            f"- Wind: {wind['speed']} mph"
            f"{' from ' + str(wind['direction']) + '°' if wind['direction'] else ''}\n"
            f"- Cloud cover: {weather_data['clouds']}%\n"
            f"- Visibility: {weather_data['visibility'] / 1000:.1f} miles\n"
            f"- Pressure: {weather_data['pressure']} hPa\n"
            f"- Sunrise: {time.strftime('%I:%M %p', time.localtime(sun['sunrise']))}\n"
            f"- Sunset: {time.strftime('%I:%M %p', time.localtime(sun['sunset']))}"
        )

    def get_weather_along_route(self, locations):
        """
        Get weather information for multiple locations along a route
        """
        weather_details = []
        for loc in locations:
            weather = self.fetch_weather(loc)
            if weather:
                formatted = self.format_weather_info(weather, loc)
                weather_details.append(formatted)
        return "\n\n".join(weather_details)


# Example usage
if __name__ == '__main__':
    import os
    from dotenv import load_dotenv

    load_dotenv()
    weather_api_key = os.getenv('WEATHER_API_KEY')

    if weather_api_key:
        service = WeatherService(weather_api_key)
        info = service.get_weather_along_route(["Parker", "Idaho Springs", "Silverthorne", "Vail"])
        print(info)
    else:
        print("Weather API key not found.")
