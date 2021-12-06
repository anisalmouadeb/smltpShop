import axios from 'axios';
import {
    ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS, PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    ADMIN_PRODUCTS_REQUEST,ADMIN_PRODUCTS_SUCCESS,ADMIN_PRODUCTS_FAIL,
    NEW_PRODUCT_REQUEST,NEW_PRODUCT_SUCCESS,NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,DELETE_PRODUCT_SUCCESS,DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,UPDATE_PRODUCT_SUCCESS,UPDATE_PRODUCT_FAIL,
    NEW_REVIEW_REQUEST,NEW_REVIEW_SUCCESS,NEW_REVIEW_FAIL,
    GET_REVIEWS_REQUEST,GET_REVIEWS_SUCCESS,GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,DELETE_REVIEW_SUCCESS,DELETE_REVIEW_FAIL,
    GET_PROMO_REQUEST,GET_PROMO_SUCCESS,GET_PROMO_FAIL,
    PRODUCT_DETAILS_FAIL, ALL_PRODUCTS_FAIL, CLEAR_ERRORS
} from "../constants/productConstants"

export const getProducts = (currentPage= 1 , keyword = '', price, category, rating = 0) => async (dispatch) => {

    try {
        dispatch({ type: ALL_PRODUCTS_REQUEST })
        //ajouter proxy dans package.json
        let link =`/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`
        if (category)
        {
         link =`/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}&category=${category}`
        }
        const { data } = await axios.get(link)
        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response.data.message,

        })

    }

}
// new review
export const newReview = (reviewData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_REVIEW_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/review`, reviewData, config)

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}


export const getProductDeatails = (id) => async (dispatch) => {

    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        //ajouter proxy dans package.json
        const { data } = await axios.get( `/api/v1/product/${id}` )
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        })

    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message,

        })

    }

}


//get products admin 
export const getPromoProducts = () => async (dispatch) => {

    try {
        dispatch({ type: GET_REVIEWS_REQUEST })
        //ajouter proxy dans package.json
        const { data } = await axios.get( "/api/v1/admin/promoProducts" )
        dispatch({
            type: GET_PROMO_SUCCESS,
            payload: data.prod,
           
        })
        console.log(data.prod)
    } catch (error) {
        dispatch({
            type: GET_PROMO_FAIL,
            payload: error.response.data.message,

        })

    }

}

//get products admin 
export const getAdminProducts = () => async (dispatch) => {

    try {
        dispatch({ type: ADMIN_PRODUCTS_REQUEST })
        //ajouter proxy dans package.json
        const { data } = await axios.get( "/api/v1//admin/products" )
        dispatch({
            type: ADMIN_PRODUCTS_SUCCESS,
            payload: data.products
        })

    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCTS_FAIL,
            payload: error.response.data.message,

        })

    }

}

export const newProduct = (productData)=> async (dispatch) => {

    try {
        dispatch({ type: NEW_PRODUCT_REQUEST })
        //ajouter proxy dans package.json

        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }
        const { data } = await axios.post( "/api/v1/admin/product/new",productData,config )
        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message,

        })

    }

}



export const deleteProduct = (id)=> async (dispatch) => {

    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST })
        //ajouter proxy dans package.json

        
        const { data } = await axios.delete( `/api/v1/admin/product/${id}` )
        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message,

        })

    }

}


export const updateProduct = (productData,id)=> async (dispatch) => {

    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST })
        //ajouter proxy dans package.json

        const config = {
            headers: {
                'content-type': 'application/json'
            }
        }

        const { data } = await axios.put( `/api/v1/admin/product/${id}`,productData,config )
        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message,

        })

    }

}


// Get product reviews
export const getProductReviews = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_REVIEWS_REQUEST })

        const { data } = await axios.get(`/api/v1/reviews?id=${id}`)

        dispatch({
            type: GET_REVIEWS_SUCCESS,
            payload: data.reviews
        })

    } catch (error) {

        dispatch({
            type: GET_REVIEWS_FAIL,
            payload: error.response.data.message
        })
    }
}


// Delete product review
export const deleteReview = (id, productId) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_REVIEW_REQUEST })

        const { data } = await axios.delete(`/api/v1/reviews?id=${id}&productId=${productId}`)

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success
        })

    } catch (error) {

        console.log(error.response);

        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}


export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,

    })
}
