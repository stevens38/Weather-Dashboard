import fs from "fs";
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
    const data=fs.readFileSync('searchHistory.json','utf8');
    return data;
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    fs.writeFileSync('searchHistory.json',JSON.stringify(cities));
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
    const newCities=cities.filter(city=>city.id!==id);  //filters out the city with the id to be removed
    await this.write(newCities);                        //writes the updated list of cities to the searchHistory
  }
}

export default new HistoryService();
