import React, {useEffect, Fragment } from 'react'
import '../../App.css';
import {Route,Link} from 'react-router-dom'
import Search from './Search'
import {useDispatch, useSelector} from 'react-redux'
import {useAlert}from 'react-alert'
import {logout} from '../../actions/userActions'
import {getPromoProducts} from "../../actions/productActions"


const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { user, loading } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)
    const {products, error}= useSelector(state => state.promo)

    useEffect(() => {
        if (error) {
            return alert.error(error)

        }
        dispatch(getPromoProducts())


    }, [dispatch, alert, error])
    
    

    const logoutHandler = () => {
        dispatch(logout());
        alert.success('Logged out successfully.')
    }

    return (
        <Fragment>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to={"/"}>
                       
                        </Link>
                    </div>
                </div>
          
                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Route render={({ history }) => <Search history={history} />} />
                </div>
                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    {console.log(products.length)}
                    {products.length >0 ? ( <Link to={"/promo"} style={{textDecoration: 'none'}}>
                    <span id="promo" className="ml-4" style={{color: 'white'}}>Promo</span>
                  
                </Link>):(<span></span>)}
               
                <Link to={"/cart"} style={{textDecoration: 'none'}}>
                    <span id="cart" className="ml-4">Cart</span>
                    <span className="ml-1" id="cart_count">{cartItems.length}</span>
                </Link>
                {user ? (
                    <div className="ml-4 dropdown d-inline">
                        <Link to ="#!"className="btn dropdown-toggle text-white mr-4"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        >
                             <figure className="avatar avatar-nav">
                                    <img
                                        src={user.avatar && user.avatar[0].url}
                                        alt={user && user.name}
                                        className="rounded-circle"
                                    />
                                </figure>
                    
                                <span>{user && user.name}</span>
                        </Link>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {user && user.role === 'admin' && (
                                <Link className="dropdown-item " to ="/dashboard"> Dashboard</Link>
                            )}
                              <Link className="dropdown-item " to ="/orders/me"> Orders</Link>
                             <Link className="dropdown-item " to ="/me"> Profile</Link>
                            <Link className="dropdown-item text-danger" to ="/" onClick={logoutHandler}> Logout</Link>
                        </div>
                        
                    </div>
                ): !loading && <Link to='/login'className="btn ml-4" id="login_btn">Login </Link>}
                    
                  
                </div>
            </nav>


        </Fragment>

    )

}
export default Header;


