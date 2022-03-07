import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPlants, deleteAPlant } from '../store/allPlants';
import { addToCart, getCart } from '../store/cart';

import CreatePlant from './CreatePlant';
import Navbar from './Navbar';

export class AllPlants extends React.Component {
  componentDidMount() {
    this.props.getPlants();
    this.props.getCart(parseInt(this.props.auth.id));
  }
  render() {
    const plants = this.props.plants;
    if (!plants || plants.length === 0) {
      return <h3> Loading your plants...</h3>;
    }
    return (
      <div>
        <Navbar />
        <div></div>
        {window.localStorage.getItem('isAdmin') === true.toString() ? 
        (<div id="createPlantView">
          <h2>Add a new plant</h2>
          <CreatePlant />
        </div>) : null }
        <ul id="allPlantsView">
          {this.props.plants.map((plantObj) => (
            <div className="PlantInfo" key={plantObj.id}>
              <h3>
                <Link to={`/plant-friends/${plantObj.id}`}>
                  {' '}
                  Plant Friend Name: {plantObj.name}
                </Link>
              </h3>
              <div />

              <img className="plant-image" src={plantObj.imageLink} />
              <div className="plant-attributes">
                <div>Species: {plantObj.species}</div>
                <div />
                <div>
                  About Your Plant Friend: <br /> {plantObj.description}
                </div>
                <div />
                <div>Care: {plantObj.careInstructions}</div>
              </div>
              <br />
              <div className="price">
                Price: $
                {String(plantObj.price / 100).length === 2
                  ? plantObj.price / 100 + '.00'
                  : plantObj.price / 100}
              </div>
              <button
                type="submit"
                onClick={() => {
                  this.props.addToCart(plantObj, parseInt(this.props.auth.id));
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </ul>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    plants: state.plants,
    auth: state.auth,
    cart: state.cart,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getPlants: () => dispatch(fetchPlants()),
    deleteAPlant: (id) => dispatch(deleteAPlant(id, history)),
    addToCart: (plant, userId) => dispatch(addToCart(plant, userId)),
    getCart: (userId) => dispatch(getCart(userId)),
  };
};

export default connect(mapState, mapDispatch)(AllPlants);
