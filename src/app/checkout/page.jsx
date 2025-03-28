'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import useAuthStore from '../store';
import Link from 'next/link';

const Checkout = () => {
  const {
    cart,
    getCartByUserId,
    fetchUserProfile,
    fetchedUser
  } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const hasFetchedData = useRef(false); 

  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true; 
      const fetchData = async () => {
        await fetchUserProfile();
        await getCartByUserId();
        setLoading(false);
      };
      fetchData();
    }
  }, []);
  

  const totalPrice = cart.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0,
  );

  return (
    <div className="p-4 bg-gray-100 text-black flex flex-col lg:flex-row">
    {/* Left Section */}
    <div className="bg-white m-5 p-5 flex-1">
      <h2 className=" text-xl font-bold pb-1 text-center sm:text-left">
        Delivering to {fetchedUser.name}
      </h2>
      <p className='pb-4'>
        {fetchedUser.address}
      </p>
      <Link href="/cart" className="text-blue-600 text-xs hover:underline">Back to cart</Link>
    </div>
  
    {/* Right Section  */}
    <div className="bg-white p-5 my-5 sm:w-full w-full lg:w-1/3">
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

export default Checkout;
