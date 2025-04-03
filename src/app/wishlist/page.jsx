'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import useStore from '../store';

const Wishlist = () => {
  const {
    cart,
    getCartByUserId,
    addToCart,
    wishlist,
    getWishlistByUserId,
    addToWishlist,
  } = useStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      const fetchData = async () => {
        await getCartByUserId();
        await getWishlistByUserId();
        setLoading(false);
      };
      fetchData();
    }
  }, []);

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    await getCartByUserId();
  };

  const handleAddToWishlist = async (productId) => {
    await addToWishlist(productId);
    await getWishlistByUserId();
  };

  return (
    <div className="mx-auto p-4 bg-gray-100 text-black">
      <div className="bg-white m-5 p-5">
        <h2 className="text-2xl font-bold mb-4 text-center sm:text-left pb-4 border-b border-gray-300">
          Wishlist
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : wishlist.length > 0 ? (
          <ul className="space-y-4">
            {wishlist.map((product) => {
              const isInCart = cart.some(
                (item) => item.product_id === product.product_id,
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
                    ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {product.in_stock ? 'In stock' : 'Out of stock'}
                    </p>
                    <p className="text-gray-600 pt-2">{product.seller}</p>
                    <p className="text-gray-600 pt-2 flex flex-col sm:flex-row sm:items-center">
                      <span className="mb-2 sm:mb-0">
                        <button
                          className="rounded-4xl px-4 py-1 mx-2 mt-3 bg-amber-300 hover:cursor-pointer"
                          onClick={() => handleAddToCart(product.product_id)}
                        >
                          {isInCart ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                      </span>
                      <span className="sm:mb-0">
                        <button
                          className="text-xs text-blue-600 hover:cursor-pointer mt-4 mr-2"
                          onClick={() =>
                            handleAddToWishlist(product.product_id)
                          }
                        >
                          Delete
                        </button>
                        <span className="hidden sm:inline"> | </span>
                      </span>
                      <span>
                        <button
                          className="text-xs text-blue-600 hover:cursor-pointer mt-4 ml-2"
                          onClick={() =>
                            router.push(`/products/${product.category_id}`)
                          }
                        >
                          See more like this
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
            Your wishlist is empty.
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
