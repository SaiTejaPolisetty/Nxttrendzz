import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item

  incrementCartItemQuantity = id => {
    const {cartList} = this.state
    const indexOfProduct = cartList.findIndex(item => item.id === id)
    cartList[indexOfProduct].quantity += 1
    this.setState({cartList})
    /* const incrementQuantity = cartList.filter(item => item.id === id) */
    /* incrementQuantity[0].quantity = incrementQuantity[0].quantity + 1 */
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const indexOfProduct = cartList.findIndex(item => item.id === id)
    if (cartList[indexOfProduct].quantity === 1) {
      const modifiedCartList = cartList.filter(item => item.id !== id)
      this.setState({cartList: modifiedCartList})
    } else {
      cartList[indexOfProduct].quantity -= 1
      this.setState({cartList})
    }
  }

  addCartItem = product => {
    const {cartList} = this.state
    const sameProduct = cartList.filter(item => product.title === item.title)

    if (sameProduct.length === 0) {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    } else {
      sameProduct[0].quantity = product.quantity + sameProduct[0].quantity
      this.setState(prevState => ({
        cartList: [
          ...prevState.cartList.filter(item => item.title !== product.title),
          sameProduct[0],
        ],
      }))
    }

    //   TODO: Update the code here to implement addCartItem
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const modifiedCartList = cartList.filter(item => item.id !== id)
    this.setState({cartList: modifiedCartList})
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  render() {
    const {cartList} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeAllCartItems: this.removeAllCartItems,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
