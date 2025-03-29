import React from 'react'
import { useGetOrderByEmailQuery } from '../../redux/features/orders/orderApi';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/Auth.context';

const Orders = () => {
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, error } = useGetOrderByEmailQuery(currentUser?.email);

    if (isLoading) return <Loading />
    if (error) return <div className="text-center text-red-500 py-10">Error loading orders</div>

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
            
            {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No orders found.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="border-b pb-4 mb-4">
                                <h2 className="font-bold text-gray-800">Order ID: {order._id}</h2>
                                <p className="text-gray-600">Name: {order.name}</p>
                                <p className="text-gray-600">Email: {order.email}</p>
                                <p className="text-gray-600">Phone: {order.phone}</p>
                                <p className="text-gray-600">Total Price: ${order.totalPrice}</p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-800">Delivery Address:</h3>
                                <p className="text-gray-600">
                                    {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                                </p>

                                <h3 className="font-semibold text-gray-800 mt-4">Products:</h3>
                                <ul className="list-disc list-inside text-gray-600 pl-4">
                                    {order.productIds.map((productId, index) => (
                                        <li key={index} className="text-sm">
                                            Product ID: {productId}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4 text-sm text-gray-500">
                                    Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <span className={`px-4 py-2 rounded-full text-sm ${
                                    order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {order.status || 'Processing'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Orders