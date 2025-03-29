import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchBookByIdQuery } from '../../redux/features/books/booksApi';
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';
import { getImgUrl } from '../../utils/getImgUrl';

const SingleBook = () => {
    const { id } = useParams();
    const { data: book, isLoading, error } = useFetchBookByIdQuery(id);
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error loading book details</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Side - Image */}
                <div className="md:w-1/2">
                    <div className="border rounded-lg overflow-hidden h-[calc(100vh-200px)]">
                        <img
                            src={getImgUrl(book?.coverImage)}
                            alt={book?.title}
                            className="w-full h-full object-contain p-4 hover:scale-105 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="md:w-1/2">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-semibold text-gray-800">
                            {book?.title}
                        </h1>
                        
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-gray-900">
                                ${book?.newPrice}
                            </span>
                            <span className="text-xl text-gray-500 line-through">
                                ${book?.oldPrice}
                            </span>
                            <span className="bg-primary px-3 py-1 rounded-full text-sm">
                                {Math.round(((book?.oldPrice - book?.newPrice) / book?.oldPrice) * 100)}% OFF
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Description:</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {book?.description}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Category:</h3>
                            <p className="text-gray-600 capitalize">{book?.category}</p>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => handleAddToCart(book)}
                                className="btn-primary flex items-center gap-2"
                            >
                                <FiShoppingCart className="size-5" />
                                <span>Add to Cart</span>
                            </button>
                        </div>

                        {book?.trending && (
                            <div className="mt-4">
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                                    Trending
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleBook;