'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import useAuthStore from '../app/store';

export default function Filter({ handleFilterFieldsChange }) {
  const { categoryId } = useParams();
  const {
    filterOptions,
    fetchFilterOptions,
    stockFilterValues,
    sellerFilterValues,
  } = useAuthStore();

  const [selectedFilters, setSelectedFilters] = useState({
    seller: [],
    in_stock: null,
  });

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchFilterOptions(categoryId);
      hasFetched.current = true;
    }
  }, [categoryId, fetchFilterOptions]);

  const handleSellerChange = (seller) => {
    setSelectedFilters((prevFilters) => {
      const updatedSellers = prevFilters.seller.includes(seller)
        ? prevFilters.seller.filter((s) => s !== seller)
        : [...prevFilters.seller, seller];

      return { ...prevFilters, seller: updatedSellers };
    });
  };

  const handleStockChange = (stock) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      in_stock: stock === 'In stock' ? 1 : 0,
    }));
  };

  const applyFilter = () => {
    handleFilterFieldsChange(selectedFilters);
  };

  return (
    <div className="left-0 top-0 bg-white p-2 overflow-y-auto border-r border-gray-300">
      <ul className="space-y-2 pr-10">
        {filterOptions?.map((filter, index) => (
          <li key={index} className="transition duration-300 cursor-pointer">
            <label className="cursor-pointer font-semibold text-md">
              {filter.label}
            </label>

            {/* Seller Filter */}
            {filter.label === 'Seller' && sellerFilterValues?.length > 0 && (
              <ul className="mt-2 space-y-1 text-gray-700">
                {sellerFilterValues.map((seller, idx) => (
                  <li key={idx} className="px-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      id={`seller-${idx}`}
                      className="cursor-pointer"
                      checked={selectedFilters.seller.includes(seller.seller)}
                      onChange={() => handleSellerChange(seller.seller)}
                    />
                    <label
                      htmlFor={`seller-${idx}`}
                      className="cursor-pointer pl-2"
                    >
                      {seller.seller}
                    </label>
                  </li>
                ))}
              </ul>
            )}

            {/* Availability-Stock Filter */}
            {filter.label === 'Availability' &&
              stockFilterValues?.length > 0 && (
                <ul className="mt-2 space-y-1 text-gray-700">
                  {stockFilterValues.map((stock, idx) => (
                    <li key={idx} className="px-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        id={`stock-${idx}`}
                        name="stock"
                        className="cursor-pointer"
                        checked={
                          selectedFilters.in_stock ===
                          (stock.stock === 'In stock' ? 1 : 0)
                        }
                        onChange={() => handleStockChange(stock.stock)}
                      />
                      <label
                        htmlFor={`stock-${idx}`}
                        className="cursor-pointer pl-2"
                      >
                        {stock.stock}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>

      <button
        onClick={applyFilter}
        className="mt-6 w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 hover:cursor-pointer transition"
      >
        Apply Filter
      </button>
    </div>
  );
}
