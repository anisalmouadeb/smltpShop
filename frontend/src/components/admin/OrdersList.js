import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import axios from 'axios';
import MetaData from '../layouts/MetaData'
import Loader from '../layouts/Loader'
import SideBar from './SideBar'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrders, deleteOrder, clearErrors } from '../../actions/orderActions'
import {getUserDetails} from '../../actions/userActions'
import { DELETE_ORDER_RESET } from '../../constants/orderConstants'
import {ExportCSV} from '../../export/ExportCSV'
import { captureRejectionSymbol } from 'events'

const OrdersList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector(state => state.allOrders);
    const { isDeleted } = useSelector(state => state.order)


    useEffect(() => {
        dispatch(getAllOrders());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success("orders deleted successfully")
            history.push('/admin/orders')
            dispatch({ type: DELETE_ORDER_RESET })
        }


    }, [dispatch, alert, error, isDeleted, history])

    const deleteOrderHandler = (id) => {

        dispatch(deleteOrder(id))

    }

    const viewers =[]


    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'No of Items',
                    field: 'numofItems',
                    sort: 'asc'
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }
      

        orders.forEach(async (order) => {
            if(order.orderStatus ==="Processing")
            {
                const isPaid = order.paymentInfo && order.paymentInfo.status === 'succeeded' ? true : false
              
                const  data2  = await axios.get( `/api/v1/admin/user/${order.user}`)
            

                viewers.push( {
                    user : data2.data.user.name,
                    address : order.shippingInfo.address,
                    city : order.shippingInfo.address,
                    country : order.shippingInfo.country,
                    phone : order.shippingInfo.phoneNo,
                    postalCode : order.shippingInfo.postalCode,  
                    payment : isPaid ? "paid" : "not paid"
                }
                    
                    )

                    console.log(viewers)
                
            }
        })

        orders.forEach(order => {
            data.rows.push({
                id: order._id,
                numofItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                actions: <Fragment>
                    <Link to={`/admin/order/${order._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-eye"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2"
                        onClick={() => deleteOrderHandler(order._id)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })

        return data;
    }


    const fileName = 'TechnicalAdda'


    






    return (
        <Fragment>
            <MetaData title={'All Orders'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <SideBar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Orders</h1>

                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setOrders()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}


                        <div>

                            <ExportCSV csvData={viewers} fileName={fileName} />

                        </div>
                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default OrdersList