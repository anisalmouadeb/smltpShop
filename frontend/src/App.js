import {BrowserRouter as  Router , Route} from "react-router-dom"
import Header from './components/layouts/Header'
import Footer from './components/layouts/Footer'
import Home from './components/Home'
import ProductDetails from "./components/product/ProductDetails"
import './App.css';
import {loadUser} from './actions/userActions'
import store from './store'

import {useEffect , useState} from 'react'
import { useSelector } from "react-redux"
import Promo from "./components/product/Promo"
import axios from 'axios'
//auth imports
import Login  from "./components/user/Login"
import Register from "./components/user/Register"
import  Profile from "./components/user/Profile"
import  UpdateProfile from "./components/user/UpdateProfile"
import  UpdatePassword from "./components/user/UpdatePassword"
import  ForgotPassword from "./components/user/ForgotPassword"
import  NewPassword from "./components/user/NewPassword"
//cart imports
import  Cart from "./components/cart/Cart"
import  Shipping from "./components/cart/Shipping"
import  ConfirmOrder from "./components/cart/ConfirmOrder"
//order imports
import ListOrders from "./components/order/ListOrders"
import OrderDetail from "./components/order/OrderDetail"
import Payment from "./components/cart/Payment"
import Success from "./components/cart/Success"

// admin imports
import Dashboard from "./components/admin/Dashboard"
import ProductsList from "./components/admin/ProductsList"
import NewProduct from "./components/admin/NewProduct"
import UpdateProduct from "./components/admin/UpdateProduct"
import OrdersList from "./components/admin/OrdersList"
import ProcessOrder from "./components/admin/ProcessOrder"
import UsersList from "./components/admin/UsersList"
import UpdateUser from "./components/admin/UpdateUser"
import ProductReviews from "./components/admin/ProductReviews"


import ProtectedRoute   from "./components/route/ProtectedRoute"

// Payment
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {
    store.dispatch(loadUser());
    async function getStripApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi');

      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey();

  },[])
  const {user ,loading}= useSelector(state => state.auth)

  return (
    <Router>
    <div className="App">
  <Header/>
  <div className="container container-fluid">
    
  <Route path="/" component={Home} exact/>
  <Route path="/cart" component={Cart} exact/>
  <Route path="/login" component={Login} exact/>
  <Route path="/register" component={Register} exact/>
  <Route path="/password/forgot" component={ForgotPassword} exact/>
  <Route path="/password/reset/:token" component={NewPassword} exact/>
  <ProtectedRoute path="/me" component={Profile} exact/>
  <ProtectedRoute path="/shipping" component={Shipping} exact/>
  <ProtectedRoute path="/confirm" component={ConfirmOrder} exact/>
  <ProtectedRoute path="/me/update" component={UpdateProfile} exact/>
  <ProtectedRoute path="/password/update" component={UpdatePassword} exact/>
  <ProtectedRoute path="/orders/me" component={ListOrders} exact/>
  <ProtectedRoute path="/order/:id" component={OrderDetail} exact/>
  <ProtectedRoute path="/success" component={Success} exact/>


  {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
          }


  <Route path="/search/:keyword" component={Home} />
  <Route path="/product/:id" component={ProductDetails } exact/>
  <Route path="/promo" component={Promo} exact/>

 
  </div>
  <ProtectedRoute path="/dashboard" isAdmin={true} component={Dashboard} exact/>
  <ProtectedRoute path="/admin/products" isAdmin={true} component={ProductsList} exact/>
  <ProtectedRoute path="/admin/product" isAdmin={true} component={NewProduct} exact/>
  <ProtectedRoute path="/admin/product/:id" isAdmin={true} component={UpdateProduct} exact/>
  <ProtectedRoute path="/admin/orders" isAdmin={true} component={OrdersList} exact/>
  <ProtectedRoute path="/admin/order/:id" isAdmin={true} component={ProcessOrder} exact/>
  <ProtectedRoute path="/admin/users" isAdmin={true} component={UsersList} exact/>
  <ProtectedRoute path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact/>
  <ProtectedRoute path="/admin/reviews" isAdmin={true} component={ProductReviews} exact/>


  
 


    </div>
    </Router>
  );
}

export default App;
