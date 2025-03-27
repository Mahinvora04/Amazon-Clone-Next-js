"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useAuthStore from "../store";
import Filter from "../../components/Filter";
import PaginationComponent from "../../components/PaginationComponent";

export default function Products() {
  const { categoryId } = useParams(); 
  const { isLoading,products, fetchProducts ,productsCount ,addToCart, cart,getCartByUserId} = useAuthStore(); 
  const [filterFields, setFilterFields] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialPayload, setInitialPayload] = useState({
    page: currentPage,
    limit: pageSize,
    filters: filterFields,
  });

  useEffect(() => {
    fetchProducts(categoryId);
  }, [categoryId, fetchProducts]);

  useEffect(() => {
    getCartByUserId();
  }, [getCartByUserId]);

   // ** pagination
   const handlePageChange = (page) => {
    setCurrentPage(page);
    setInitialPayload((prevPayload) => ({
      ...prevPayload,
      page: page,
    }));
    fetchProducts(categoryId,{ ...initialPayload, page: page });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    setInitialPayload((prevPayload) => ({
      ...prevPayload,
      limit: size,
    }));
    fetchProducts(categoryId,{ ...initialPayload, limit: size });
  };

  const handleFilterFieldsChange = (data) => {
    setFilterFields(data);
    setCurrentPage(1);
    setInitialPayload((prevPayload) => ({
      ...prevPayload,
      page: 1,
      filters: data,
    }));
    fetchProducts(categoryId,{ ...initialPayload, page: 1, filters: data });
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
    await getCartByUserId();
  };

  return (
    <div className="flex p-4 bg-white text-black">
      <div className="hidden lg:block w-full lg:w-1/4">
        <Filter
        handleFilterFieldsChange={handleFilterFieldsChange}
        />
      </div>      
      <div>
        {isLoading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold m-5 text-center sm:text-left">All Products</h1> 
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {products.map((product) => {
                  const isInCart = cart.some(
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
                      <p className="bg-gray-200 w-fit px-4 rounded-4xl mt-2 mx-auto sm:mx-0 text-center text-sm">{product.in_stock ? "In stock" : "Out of stock"}</p>
                      <p className="text-gray-600 pt-2">{product.seller}</p>
                      <button 
                      onClick={() => handleAddToCart(product.product_id)}
                      className={`rounded-4xl px-4 py-1 mt-3 bg-amber-300 hover:cursor-pointer`}
                      >
                      {isInCart ? "Added to Cart" : "Add to Cart"}
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
    </div>
  );
}
