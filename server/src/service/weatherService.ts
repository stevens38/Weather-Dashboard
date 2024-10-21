import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  country: string;
  date: string;
  description: string;
  temp: number;
  humidity: number;
  wind: number;
  uvIndex: number;
  icon: string;
  constructor(city: string, country: string, date: string, description: string, temp: number, humidity: number, wind: number, uvIndex: number, icon: string) {
    this.city = city;
    this.country = country;
    this.date = date;
    this.description = description;
    this.temp = temp;
    this.humidity = humidity;
    this.wind = wind;
    this.uvIndex = uvIndex;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties 
  baseURL?: string;
  apiKey?: string;
  cityName?: string;
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData() {
    try {
      console.log(this.buildGeocodeQuery());
      const response = await fetch(this.buildGeocodeQuery());
      const locationData = await response.json();
      console.log(locationData);
      return locationData;
    } catch (error) {
      console.log('Error', error);
      return '';
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) { throw new Error('city not found'); }
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const apiKey = process.env.API_KEY;
    const query = `https://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&appid=${apiKey}`;
    return query;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates
    const apiKey = process.env.API_KEY;
    const query = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`;
    return query;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    // const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData();
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    console.log(query);
    try {
      const response = await fetch(query);
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed to fetch weather data');
    }
    catch (error) {
      console.log(error);
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { name, sys: { country }, dt, weather: [{ description, icon }], main: { temp, humidity }, wind: { speed }, uvIndex } = response.current;
    const date = new Date(dt * 1000).toLocaleDateString();
    return new Weather(name, country, date, description, temp, humidity, speed, uvIndex, icon);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = [];
    for (let i = 1; i < 6; i++) {
      const { dt, weather: [{ description, icon }], temp: { max }, humidity, wind_speed } = weatherData[i];
      const date = new Date(dt * 1000).toLocaleDateString();
      const forecast = new Weather(currentWeather.city, currentWeather.country, date, description, max, humidity, wind_speed, 0, icon);
      forecastArray.push(forecast);
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
