import axios from 'axios';
import Cookies from 'js-cookie';
import { create } from 'zustand';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('authToken');
      Cookies.remove('userId');
    }
    return Promise.reject(error);
  },
);

const useStore = create((set) => ({
  message: '',
  token: null,
  userId: null,
  productsCount: null,
  categories: [],
  departments: [],
  products: [],
  categoryType: [],
  filterOptions: [],
  sellerFilterValues: [],
  stockFilterValues: [],
  fetchedUser: {},
  cart: [],
  wishlist: [],

  registerUser: async (formData) => {
    set({ message: '' });

    try {
      const registerUserResponse = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (registerUserResponse?.data?.status === 200) {
        return { success: true, message: registerUserResponse?.data?.message };
      }
    } catch (error) {
      return { success: false, error: 'failed to register! ', error };
    }
  },

  loginUser: async (data) => {
    try {
      const loginUserResponse = await api.post('/auth/login', data);
      if (loginUserResponse?.data?.status === 200) {
        return { success: true, message: loginUserResponse?.data?.message };
      }
    } catch (error) {
      return { success: false, error: 'failed to login! ', error };
    }
  },

  logoutUser: async () => {
    try {
      const logoutResponse = await api.post('/auth/logout');
      if (logoutResponse?.data?.status === 200) {
        return { success: true, message: logoutResponse?.data?.message };
      }
    } catch (error) {
      return { success: false, error: 'Failed to log out', error };
    }
  },

  fetchUserProfile: async () => {
    try {
      const fetchUserProfileResponse = await api.get(`/users`);
      if (fetchUserProfileResponse?.data?.status === 200) {
        const userData = fetchUserProfileResponse?.data?.userResult;
        set({ fetchedUser: userData });
        return { success: true };
      }
    } catch (error) {
      return { error: 'Failed to fetch profile data', error };
    }
  },

  updateUserProfile: async (payload) => {
    try {
      const updateUserProfileResponse = await api.put('/users', payload);
      if (updateUserProfileResponse?.data?.status === 200) {
        return {
          success: true,
          message: updateUserProfileResponse?.data?.message,
        };
      }
    } catch (error) {
      return { error: 'Failed to update profile', error };
    }
  },

  fetchProducts: async (categoryId = null, payload = {}) => {
    let url = '/products';
    if (categoryId) {
      url += `/${categoryId}`;
    }

    try {
      const fetchProductsResponse = await api.post(url, payload);
      if (fetchProductsResponse?.data?.status === 200) {
        set({
          products: fetchProductsResponse?.data?.products,
          productsCount: fetchProductsResponse?.data?.count,
        });
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  },

  getCategoryTypeById: async (categoryId) => {
    try {
      const getCategoryTypeByIdResponse = await api.get(
        `category-type/${categoryId}`,
      );
      if (getCategoryTypeByIdResponse?.data?.status === 200) {
        set({
          categoryType: getCategoryTypeByIdResponse?.data?.categoryType,
        });
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  },

  fetchCategories: async () => {
    try {
      const fetchCategoriesResponse = await api.get('/categories');
      if (fetchCategoriesResponse?.data?.status === 200) {
        set({
          categories: fetchCategoriesResponse?.data?.categories,
        });
      }
    } catch (error) {
      console.error('Failed to fetch categories!', error);
    }
  },

  fetchFilterOptions: async (categoryId) => {
    let url = '/filter-options';
    if (categoryId) {
      url += `/${categoryId}`;
    }

    try {
      const fetchFilterOptionsResponse = await api.get(url);
      if (fetchFilterOptionsResponse?.data?.status === 200) {
        set({
          filterOptions: fetchFilterOptionsResponse?.data?.data,
          sellerFilterValues: fetchFilterOptionsResponse?.data?.sellerArray,
          stockFilterValues:
            fetchFilterOptionsResponse?.data?.stockFilterValues,
        });
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  },

  addToCart: async (productId) => {
    try {
      const addToCartResponse = await axios.post('/api/cart/add', {
        productId: productId,
      });
      if (addToCartResponse?.data?.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  },

  getCartByUserId: async () => {
    try {
      const getCartByUserIdResponse = await api.get('/cart');
      if (getCartByUserIdResponse?.data?.status === 200) {
        set({
          cart: getCartByUserIdResponse?.data?.cart,
        });
      }
    } catch (error) {
      console.error('Failed to fetch cart data!', error);
    }
  },

  increaseProductQuantity: async (productId) => {
    try {
      const increaseProductQuantityResponse = await axios.put(
        '/api/cart/update-quantity/increase',
        {
          productId: productId,
        },
      );
      if (increaseProductQuantityResponse?.data?.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  },

  decreaseProductQuantity: async (productId) => {
    try {
      const decreaseProductQuantityResponse = await axios.put(
        '/api/cart/update-quantity/decrease',
        {
          productId: productId,
        },
      );
      if (decreaseProductQuantityResponse?.data?.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  },

  addToWishlist: async (productId) => {
    try {
      const addToWishlistResponse = await axios.post('/api/wishlist/add', {
        productId: productId,
      });
      if (addToWishlistResponse?.data?.status === 200) {
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  },

  getWishlistByUserId: async () => {
    try {
      const getWishlistByUserIdResponse = await api.get('/wishlist');
      if (getWishlistByUserIdResponse?.data?.status === 200) {
        set({
          wishlist: getWishlistByUserIdResponse?.data?.wishlist,
        });
      }
    } catch (error) {
      console.error('Failed to fetch wishlist data!', error);
    }
  },

  loginWithGoogle: () => {
    window.location.href = '/api/auth/google';
  },

  loginWithGithub: () => {
    window.location.href = '/api/auth/github';
  },

  loginWithFacebook: () => {
    window.location.href = '/api/auth/facebook';
  },
}));

export default useStore;
