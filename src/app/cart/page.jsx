'use client'

import React, { useEffect, useState } from "react";
import useAuthStore from "../store";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { cart, getCartByUserId, addToCart } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCartByUserId().then(() => setLoading(false));
  }, [getCartByUserId]);

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    await getCartByUserId();
  };

  return (
    <div className="mx-auto p-4 bg-gray-100 text-black">
      <div className="bg-white m-5 p-5">
      <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Shopping Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cart.length > 0 ? (
        <ul className="space-y-4">
          {cart.map((product) => (
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
                <p className="text-gray-600 pt-2">Qty: {product.quantity} <span > | <button className="text-xs text-blue-600 hover:cursor-pointer"  onClick={() => handleAddToCart(product.product_id)} >Delete</button> | </span> <span > <button className="text-xs text-blue-600 hover:cursor-pointer"  onClick={() => router.push(`/products/${product.category_id}`)} >See more like this</button> | </span> </p>
                </div>
            </div>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
      </div>
    </div>
  );
};

export default CartPage;
