'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import useAuthStore from '../store';

const Cart = () => {
  const {
    cart,
    getCartByUserId,
    addToCart,
    wishlist,
    getWishlistByUserId,
    addToWishlist,
    decreaseProductQuantity,
    increaseProductQuantity,
  } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCartByUserId().then(() => setLoading(false));
  }, [getCartByUserId]);

  useEffect(() => {
    getWishlistByUserId().then(() => setLoading(false));
  }, [getWishlistByUserId]);

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    await getCartByUserId();
  };

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId);
    await getWishlistByUserId();
  };

  const handleDecreaseQuantity = async (productId) => {
    await decreaseProductQuantity(productId);
    await getCartByUserId();
  };

  const handleIncreaseQuantity = async (productId) => {
    await increaseProductQuantity(productId);
    await getCartByUserId();
  };

  const totalPrice = cart.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0,
  );

  return (
    <div className="p-4 bg-gray-100 text-black flex flex-col lg:flex-row">
    {/* Left Section - Cart Items */}
    <div className="bg-white m-5 p-5 flex-1">
      <h2 className="text-2xl font-bold mb-4 text-center sm:text-left pb-4 border-b border-gray-300">
        Shopping Cart
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : cart.length > 0 ? (
        <ul className="space-y-4 border-b border-gray-300">
          {cart.map((product) => {
            const isInWishlist = wishlist.some(
              (item) => item.product_id === product.product_id
            );
            return (
              <div
                key={product.product_id}
                className="flex flex-col sm:flex-row items-center p-4"
              >
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-60 h-auto object-cover bg-gray-100 p-5"
                />
                <div className="flex-1 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
                  <h2 className="text-2xl">{product.product_name}</h2>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-3xl mt-2">&#8377;{product.price}</p>
                  <p
                    className={`w-fit mt-2 mx-auto sm:mx-0 text-center text-sm 
                  ${product.in_stock ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.in_stock ? "In stock" : "Out of stock"}
                  </p>
                  <p className="text-gray-600 pt-2">{product.seller}</p>
                  <p className="text-gray-600 pt-2 flex flex-col items-center justify-center text-center md:flex-row sm:justify-start sm:items-center space-x-3">
                    {/* Quantity Selector */}
                    <span className="inline-flex items-center space-x-3 rounded-4xl border-4 border-amber-300 px-2 py-1">
                      <button
                        className="text-lg font-bold text-black px-2 hover:cursor-pointer"
                        onClick={() =>
                          handleDecreaseQuantity(product.product_id)
                        }
                      >
                        −
                      </button>
  
                      <span className="text-sm font-medium text-gray-700">
                        {product.quantity}
                      </span>
  
                      <button
                        className="text-lg font-bold text-black px-2 hover:cursor-pointer"
                        onClick={() =>
                          handleIncreaseQuantity(product.product_id)
                        }
                      >
                        +
                      </button>
                    </span>
  
                    {/* Delete Button */}
                    <span className="inline-flex items-center">
                      <button
                        className="text-xs text-blue-600 hover:cursor-pointer"
                        onClick={() => handleAddToCart(product.product_id)}
                      >
                        Delete
                      </button>
                    </span>
                    <span className="hidden md:inline"> | </span>
  
                    {/* See More Like This */}
                    <span className="inline-flex items-center">
                      <button
                        className="text-xs text-blue-600 hover:cursor-pointer"
                        onClick={() =>
                          router.push(`/products/${product.category_id}`)
                        }
                      >
                        See more like this
                      </button>
                    </span>
                    <span className="hidden md:inline"> | </span>
  
                    {/* Save for Later */}
                    <span className="inline-flex items-center">
                      <button
                        className="text-xs text-blue-600 hover:cursor-pointer"
                        onClick={() => handleAddToWishlist(product.product_id)}
                      >
                        {isInWishlist
                          ? "Remove from Wishlist"
                          : "Save for later"}
                      </button>
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 text-center sm:text-left">
          Your cart is empty.
        </p>
      )}
      <div >
        <p className=" text-2xl pt-1 text-end">
          Subtotal ( {cart.length} items ):{" "}
          <span className="font-bold">&#8377;{totalPrice.toFixed(2)}</span>{" "}
        </p>
      </div>
    </div>
  
    {/* Right Section - Checkout */}
    <div className="bg-white p-5 my-5 sm:w-full w-fit lg:w-1/3">
      <p className="text-2xl pt-1 text-center">
        Subtotal ( {cart.length} items ):{" "}
        <span className="font-bold">&#8377;{totalPrice.toFixed(2)}</span>{" "}
      </p>
      <button className="rounded-4xl w-full px-4 py-1 mt-3 bg-amber-300 hover:cursor-pointer">
        Proceed to Buy
      </button>
    </div>
  </div>
  
  );
};

export default Cart;
