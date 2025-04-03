'use client';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Filter from '../../components/Filter';
import Loader from '../../components/Loader';
import PaginationComponent from '../../components/PaginationComponent';
import useStore from '../store';

export default function Products() {
  const { categoryId } = useParams();
  const {
    products,
    fetchProducts,
    productsCount,
    addToCart,
    cart,
    getCartByUserId,
    addToWishlist,
    wishlist,
    getWishlistByUserId,
    increaseProductQuantity,
    decreaseProductQuantity,
  } = useStore();
  const [filterFields, setFilterFields] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [payload, setPayload] = useState({
    page: currentPage,
    limit: pageSize,
    filters: filterFields,
  });

  const isLoading = false;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    getCartByUserId();
  }, [getCartByUserId]);

  useEffect(() => {
    getWishlistByUserId();
  }, [getWishlistByUserId]);

  // ** pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setPayload((prevPayload) => ({
      ...prevPayload,
      page: page,
    }));
    fetchProducts(categoryId, { ...payload, page: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setPayload((prevPayload) => ({
      ...prevPayload,
      limit: size,
    }));
    fetchProducts(categoryId, { ...payload, limit: size });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterFieldsChange = (data) => {
    setFilterFields(data);
    setCurrentPage(1);
    setPayload((prevPayload) => ({
      ...prevPayload,
      page: 1,
      filters: data,
    }));
    fetchProducts(categoryId, { ...payload, page: 1, filters: data });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex p-4 bg-white text-black">
      <div className="hidden lg:block w-full lg:w-1/4">
        <Filter handleFilterFieldsChange={handleFilterFieldsChange} />
      </div>
      <div>
        {products.length === 0 ? (
          <div className="w-3xl">No products found.</div>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold m-5 text-center sm:text-left">
                All Products
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {products.map((product) => {
                  const isInCart = cart.some(
                    (item) => item.product_id === product.product_id,
                  );
                  const isInWishlist = wishlist.some(
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
                          className={`bg-gray-200 w-fit px-4 rounded-4xl mt-2 mx-auto sm:mx-0 text-center text-sm ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {product.in_stock ? 'In stock' : 'Out of stock'}
                        </p>
                        <p className="text-gray-600 pt-2">{product.seller}</p>
                        <button
                          onClick={() => handleAddToCart(product.product_id)}
                          className={`rounded-4xl px-4 py-1 mt-3 bg-amber-300 hover:cursor-pointer`}
                        >
                          {isInCart ? 'Added to Cart' : 'Add to Cart'}
                        </button>
                        <br />
                        <button
                          onClick={() =>
                            handleAddToWishlist(product.product_id)
                          }
                          className={`px-2 text-md mt-3 text-blue-800 hover:cursor-pointer`}
                        >
                          {isInWishlist
                            ? 'Added to Wishlist'
                            : 'Add to Wishlist'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <PaginationComponent
              totalDataCount={productsCount}
              pageSize={pageSize}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
      <div className="hidden lg:block w-full lg:w-1/7 border-l border-gray-300">
        <div className="text-center">
          <p className="text-sm">Subtotal</p>
          <p className="font-bold text-red-700"> &#8377;{totalPrice}</p>
          <Link
            href="/cart"
            className="border px-6 py-1 w-fit rounded-3xl text-sm"
          >
            Go to cart
          </Link>
        </div>
        <ul className=" border-b border-gray-300">
          {cart.map((product) => {
            return (
              <div
                key={product.product_id}
                className="flex flex-col items-center p-4"
              >
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-25 h-auto object-cover"
                />
                <div className="flex flex-col mt-4 sm:mt-0 text-center">
                  <p className="text-xl mt-2 text-center">
                    &#8377;{product.price}
                  </p>
                  <p className="text-gray-600 pt-2 flex flex-col items-center justify-center text-center md:flex-row sm:justify-start sm:items-center space-x-3">
                    {/* Quantity Selector */}
                    <span className="inline-flex items-center space-x-3 rounded-4xl border-4 border-amber-300 px-2 py-1">
                      {product.quantity > 1 ? (
                        <button
                          className="text-lg font-bold text-black px-2 hover:cursor-pointer"
                          onClick={() =>
                            handleDecreaseQuantity(product.product_id)
                          }
                        >
                          −
                        </button>
                      ) : (
                        <>
                          <button
                            className="text-lg font-bold text-black px-2 hover:cursor-pointer"
                            onClick={() => handleAddToCart(product.product_id)}
                          >
                            {' '}
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </>
                      )}
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
                  </p>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
