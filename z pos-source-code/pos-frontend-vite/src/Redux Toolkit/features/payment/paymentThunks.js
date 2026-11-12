import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../utils/api";

export const initiatePaymentThunk = createAsyncThunk(
  "payment/initiatePayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/payments/initiate", paymentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      if (response.data && response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyPaymentThunk = createAsyncThunk(
  "payment/verifyPayment",
  async (verificationData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/payments/verify", verificationData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Backward compatibility alias
export const createPaymentLinkThunk = initiatePaymentThunk;
export const proceedPaymentThunk = verifyPaymentThunk;
