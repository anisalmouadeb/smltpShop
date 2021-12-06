import React, { useEffect, useState, Fragment } from 'react'
import MetaData from '../layouts/MetaData'
import { useDispatch, useSelector } from 'react-redux'
import { getPromoProducts } from "../../actions/productActions"
import Product from '../product/Product'
import Loader from '../layouts/Loader'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'


const Promo = ({ }) => {

    const alert = useAlert()
    const dispatch = useDispatch()
    const { products, error, loading } = useSelector(state => state.promo)


    useEffect(() => {
        if (error) {
            return alert.error(error)

        }
        dispatch(getPromoProducts())


    }, [dispatch, alert, error])






    return (
        <Fragment>

          
                <Fragment>
                    <MetaData title={'Buy Best Products Online'}></MetaData>
                </Fragment>
                <h1 id="products_heading"  >  Our Promotions</h1>

                {products && products.map(product=> 
                    
                    <Product key={product._id} product={product} col={3} />
                    
                    )}
        </Fragment>
           )}
export default Promo;
