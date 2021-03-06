import React, { Component } from 'react';
import RestaurantsItems from './RestaurantsItems';

class Restaurants extends Component {
  constructor(props){
    super(props);
    this.state = {
      coordinates: {},
      nearbyRestaurantArray:[]
    }
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          coordinates: position.coords,
        }, function() {
          this.getRestaurantList(position.coords.latitude, position.coords.longitude)
        }) 
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }
  getRestaurantList(lat, long) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('user-key', '57800fe3a17bc04ca2e40cfb5cf036fc');
    let options = {
      method: 'GET',
      headers: headers
    };
    let url = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${long}&sort=real_distance`
    window.fetch(url, options)
    .then(response => response.json())
    .then(data => {
      this.setState({nearbyRestaurantArray: data.restaurants}, function () {
        console.log(this.state);
      })
    })
  }
  render() {
    // crea una variable vacía que se llena con un restaurantItem por cada restaurant
    let nearRestaurants;
    let randomImageNames = ["cuisine", "dishes", "food", "delicious", "restaurant", "gourmet", "foodies", "meat","bread", "fruit", "pizza", "burguer", "juice", "coke", "salad", "snack", "drink", "coffee", "cheese", "tea"];
    let randomImage;

    // Si el estado de nearbyRestaurantArray existe, retorna un item por cada restaurante
    if( this.state.nearbyRestaurantArray){
      nearRestaurants = this.state.nearbyRestaurantArray.map(listOfRestaurants => {
        randomImage = randomImageNames[Math.floor(Math.random() * (20 - 0) + 0)]
        return(
          // entrega a cada item la propiedad de su restaurante, para que lo renderice en su componente
          <RestaurantsItems image={`https://source.unsplash.com/500x300/?${randomImage}`} key={listOfRestaurants.restaurant.R.res_id} restaurants={listOfRestaurants.restaurant} />
        )
      })
    }
    // renderiza la variable que creamos
    return (
      <div id="restaurantsRender">
        {nearRestaurants}
      </div>
    );
  }
}

export default Restaurants;
