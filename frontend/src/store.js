import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { productResources , promoReducer  ,productDetailsReducer,newProductReducer,productReducer,reviewReducer,newReviewReducer,productReviewsReducer } from './reducers/productReducers';
import{authReducer, userReducer, forgotPasswordReducer,allUsersReducer, userDetailsReducer} from './reducers/userReducers'
import{newOrderReducer,orderDetailsReducer, myOrdersReducer ,allOrdersReducer, orderReducer}from"./reducers/orderReducers"
import { cartReducer } from './reducers/cartReducers';

const reducer = combineReducers({
   products :productResources ,
   newProduct : newProductReducer,
   productDetails : productDetailsReducer,
   auth:authReducer,
   user :userReducer,
   allUsers :allUsersReducer,
   userDetails : userDetailsReducer,
   forgotPassword :forgotPasswordReducer,
   cart :cartReducer,
   newOrder :newOrderReducer,
   product :productReducer,
   orderDetails :orderDetailsReducer,
   allOrders : allOrdersReducer,
   order : orderReducer,
   productReviews :productReviewsReducer,
   review :reviewReducer,
   newReview: newReviewReducer,
   myOrders : myOrdersReducer,
   promo : promoReducer,



})
let initialState = {
   cart :{
      cartItems :localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')): [], 
      shippingInfo : localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')): {}, 
   }
};
const middleware =[thunk]
const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))

export default store;