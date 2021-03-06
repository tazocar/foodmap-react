import React, { Component } from 'react';
import RestaurantsItems from './RestaurantsItems';
import './Search.css'

class Search extends Component {
  state = {
    inputSearch: '',
    searchedRestaurantArray: [], 
    coordinates: {},
  }
  handleChange = (e) => {
    this.setState({inputSearch: e.target.value});
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          coordinates: position.coords,
        }, function() {
        }) 
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }
  handleSubmit = (e) => {
    e.preventDefault()
    // console.log(Restaurants.state)
    const inputSearch = this.state.inputSearch;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('user-key', '57800fe3a17bc04ca2e40cfb5cf036fc');
    let options = {
      method: 'GET',
      headers: headers
    };
    // Fetch según las coordenadas guardadas en el state
    let url = `https://developers.zomato.com/api/v2.1/search?q=${inputSearch}&lat=${this.state.coordinates.latitude}&lon=${this.state.coordinates.longitude}&sort=real_distance`
    window.fetch(url, options)
    .then(response => response.json())
    .then(data => {
      this.setState({searchedRestaurantArray: data.restaurants}, function () {
        console.log(this.state.searchedRestaurantArray);
      })
    })
  }
  render() {
    // crea una variable vacía que se llena con un restaurantItem por cada restaurant
    let searchedRestaurants;
    let randomImageNames = ["cuisine", "dishes", "food", "delicious", "restaurant", "gourmet", "foodies", "meat","bread", "fruit", "pizza", "burguer", "juice", "coke", "salad", "snack", "drink", "coffee", "cheese", "tea"];
    // Si el estado de nearbyRestaurantArray existe, retorna un item por cada restaurante
    if( this.state.searchedRestaurantArray){
      searchedRestaurants = this.state.searchedRestaurantArray.map(listOfRestaurants => {
        let randomImage = randomImageNames[Math.floor(Math.random() * (20 - 0) + 0)]
        return(
          // entrega a cada item la propiedad de su restaurante, para que lo renderice en su componente
          <RestaurantsItems image={`https://source.unsplash.com/500x300/?${randomImage}`} key={listOfRestaurants.restaurant.R.res_id} restaurants={listOfRestaurants.restaurant} />
        )
      })
    }
    return(
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <form onSubmit = {this.handleSubmit}>
              <div className="input-append">
                <div className="row">
                  <div className="col-xs-12 col-sm-8 col-md-10 col-lg-10 no-padding-right">
                    <input onChange={this.handleChange} type="text" className="search-input" placeholder="¿Qué andas buscando?" />
                  </div>
                  <div className="col-xs-12 col-sm-4 col-md-2 col-lg-2 no-padding-left">
                    <button className="search-btn">Buscar</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="row">
          {searchedRestaurants}
        </div>
      </div>
    )
  }
}

export default Search