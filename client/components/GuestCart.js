import React from "react";
import Navbar from "./Navbar";
import { connect } from "react-redux";
import { getCart, removeFromCart, setQuantity, checkOut } from "../store/cart";
import { Link } from "react-router-dom";

class GuestCart extends React.Component {

  constructor() {
    super();
    this.state = {
      //{anna: {quantity: 3. id: 1}, anna: {quantity: 3. id: 1}}
      cart: {},
      quantity: '',
    };
    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    let cart = window.localStorage.getItem("cart");
    let parsedCart = JSON.parse(cart);

    //to keep track of quantity
    const hashifyCartArray = (cartArray) => {
      let cartHashTable = {};
      cartArray.forEach((item) => {
        if (!cartHashTable[item.name]) {
          cartHashTable[item.name] = {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
          }
        } else {
          cartHashTable[item.name].quantity = cartHashTable[item.name].quantity + 1
        }
      });
      return cartHashTable
    };

    const hashedCart = hashifyCartArray(parsedCart);
    this.setState({
      cart: hashedCart,
    });
  
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value,})
  }

  // handleSubmit(event) {
  //   event.preventDefault();
  //     for (let obj in this.state.cart) {
  //       let plantObj = obj;
  //       // window.localStorage.setItem('cart', )
  //       plantObj.quantity = this.state.quantity;
  //     }
  //   };
  // }

  render() {
    let cartInLocalStorage = window.localStorage.getItem("cart");
    if (cartInLocalStorage === "[]") {
      return (
        <div>
          <Navbar />
          <h3>Your cart is empty!</h3>
        </div>
      );
    }

    //arrayify the cart hash table to render using map method
    const arrayify = cartHashTable => {
      let array = []
      for (let item in cartHashTable) {
        array.push(cartHashTable[item])
      }
      return array;
    }
    let arrayifiedCart = arrayify(this.state.cart)
    console.log("arraified in render", arrayifiedCart)
    const formatToCurrency = (amount) => {
      return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    };
  

    const editQuantity = (array) => {
      for (let i = 0; i < array.length; i++) {
        let plantObj = array[i]
        let quantity = plantObj.quantity
        return quantity 
      }
    }

    console.log('this.state.cart!!!!!!!!!!!!!', this.state.cart)
    console.log('what is my state?', this.state)
    return (
      <div>
        <Navbar />
        <h4>Hello</h4>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {arrayifiedCart.map((plant) => {
              return (
                <tr key={plant.id}>
                  <td>{plant.name}</td>
                  <td>{`${formatToCurrency(plant.price / 100)}`}</td>
                  <td> 
                    {plant.quantity}
                    <div>
                      <form name={plant.id} onSubmit={console.log('hi')}>
                        <input type="text" 
                        name="quantity" 
                        onChange={this.handleChange} 
                        style={{ width:"20px" }}/>
                        <button type="submit"> Update </button>
                      </form>
                    </div>
                  </td>
                  <td name="total">{`${formatToCurrency(plant.price / 100)}`}</td>
                  <td>
                    <button
                      type="submit"
                      onClick={() => {
                        this.props.removeFromCart(plant, this.props.auth.id);
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
            {/* <tr>
              <td>
                <strong>Total: </strong>
              </td>
              <td></td>
              <td></td>
              <td>
                <strong>
                  {cart.plants
                    .reduce((accum, plant) => {
                      return accum + plant.price / 100;
                    }, 0)
                    .toFixed(2)}
                </strong>
              </td>
            </tr> */}
          </tbody>
        </table>
        <Link to={"/checkout"}>
          <button
            type="submit"
            onClick={() => {
              this.props.checkOut(cart.id);
            }}
          >
            Checkout
          </button>
        </Link>
      </div>
    );
  };
}



const mapDispatch = (dispatch, { history }) => {
  return {
    getCart: (userId) => dispatch(getCart(userId)),
    removeFromCart: (plant, userId) => dispatch(removeFromCart(plant, userId)),
    setQuantity: (plantId, userId, quantity) =>
      dispatch(setQuantity(plantId, userId, quantity)),
    checkOut: (cartId) => dispatch(checkOut(cartId, history)),
  };
};

export default connect(null, mapDispatch)(GuestCart);
