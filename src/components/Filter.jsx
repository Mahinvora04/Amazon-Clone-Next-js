'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import useStore from '../app/store';

export default function Filter({ handleFilterFieldsChange }) {
  const { categoryId } = useParams();
  const {
    filterOptions,
    fetchFilterOptions,
    stockFilterValues,
    sellerFilterValues,
  } = useStore();

  const [selectedFilters, setSelectedFilters] = useState({
    seller: [],
    in_stock: null,
    price: '',
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

  const handlePriceChange = (order) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      price: order,
    }));
  };

  const applyFilter = () => {
    handleFilterFieldsChange(selectedFilters);
  };

  const clearFilters = () => {
    setSelectedFilters({
      seller: [],
      in_stock: null,
      price: '',
    });
    handleFilterFieldsChange({
      seller: [],
      in_stock: null,
      price: '',
    });
  };

  return (
    <div className="left-0 top-0 bg-white p-4 overflow-y-auto border-r border-gray-300 w-64">
      <ul className="space-y-2">
        {filterOptions?.map((filter, index) => (
          <li key={index} className="transition duration-300 cursor-pointer">
            <label className="cursor-pointer font-semibold text-md">
              {filter.label}
            </label>

            {/* Price Filter */}
            {filter.label === 'Price' && (
              <ul className="mt-2 space-y-1 text-gray-700">
                <li className="px-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    id="price-low"
                    name="price"
                    className="cursor-pointer"
                    checked={selectedFilters.price === 'low'}
                    onChange={() => handlePriceChange('low')}
                  />
                  <label htmlFor="price-low" className="cursor-pointer pl-2">
                    Low to High
                  </label>
                </li>
                <li className="px-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    id="price-high"
                    name="price"
                    className="cursor-pointer"
                    checked={selectedFilters.price === 'high'}
                    onChange={() => handlePriceChange('high')}
                  />
                  <label htmlFor="price-high" className="cursor-pointer pl-2">
                    High to Low
                  </label>
                </li>
              </ul>
            )}

            {/* Seller Filter */}
            {filter.label === 'Seller' && sellerFilterValues?.length > 0 && (
              <ul className="mt-2 space-y-1 text-gray-700">
                {sellerFilterValues.map((seller, idx) => (
                  <li key={idx} className="px-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      id={`seller-${idx}`}
                      className="cursor-pointer"
                      checked={selectedFilters.seller.includes(seller)}
                      onChange={() => handleSellerChange(seller)}
                    />
                    <label
                      htmlFor={`seller-${idx}`}
                      className="cursor-pointer pl-2"
                    >
                      {seller}
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
                          (stock === 'In stock' ? 1 : 0)
                        }
                        onChange={() => handleStockChange(stock)}
                      />
                      <label
                        htmlFor={`stock-${idx}`}
                        className="cursor-pointer pl-2"
                      >
                        {stock}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>

      {/* Buttons */}
      <div className="mt-6 space-y-2">
        <button
          onClick={applyFilter}
          className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition hover:cursor-pointer"
        >
          Apply Filter
        </button>
        <button
          onClick={clearFilters}
          className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition hover:cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
