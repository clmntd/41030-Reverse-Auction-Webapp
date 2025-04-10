import axios from 'axios';

// const API_BASE_URL = "http://localhost:5000/api"; 
// const API_BASE_URL = "http://192.168.0.78:5000/api"; 
const HOST = window.location.hostname;

const api = axios.create({
  baseURL: `http://${HOST}:5000/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const testApi = async () => {
  return api.get("/auth/test");
};

//User Authentication
export const registerSupplier = async (userData) => {
  return api.post("/auth/register", userData);
};

export const loginUser = async (credentials) => {
  console.log('api call');
  return api.post("/auth/login", credentials);
};

//Auction
export const getAuctions = async () => {
  return api.get("/auctions");
};

export const createAuction = async (auctionData) => {
  return api.post("/auctions", auctionData);
};

//Bid
export const placeBid = async (bidData) => {
  return api.post("/bids", bidData);
};

//Transactions
export const getTransactions = async () => {
  return api.get("/transactions");
};

export default api;
