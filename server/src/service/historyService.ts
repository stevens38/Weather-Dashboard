import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
// TODO: Define a City class with name and id properties
class City {
  name: string; id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const data=fs.readFile('db/db.json','utf8');                                                        //might need changed 
    return await data; 
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    return await fs.writeFile('db/db.json',JSON.stringify(cities, null, '\t'));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const data=await this.read();
    const cities=JSON.parse(data);
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const data=await this.read();   //gets the list of cities
    const cities=JSON.parse(data);   //parses the list of cities
    const id=String(cities.length+1);  //creates an id for the new city
    cities.push(new City(city,id));    //adds the new city to the list of cities
    await this.write(cities);           //writes the updated list of cities to the searchHistory.json file
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const data=await this.read();   //gets the list of cities
    const cities=JSON.parse(data);   //parses the list of cities
    const newCities=cities.filter((city: City) => city.id !== id);   //filters out the city with the matching id
    await this.write(newCities);   //writes the updated list of cities to the searchHistory.json file
  }
}

export default new HistoryService();
