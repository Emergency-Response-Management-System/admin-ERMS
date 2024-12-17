import {
  EXPORT_STOCK_CANCEL_FAIL,
  EXPORT_STOCK_CANCEL_REQUEST,
  EXPORT_STOCK_CANCEL_RESET,
  EXPORT_STOCK_CANCEL_SUCCESS,
  EXPORT_STOCK_CREATE_FAIL,
  EXPORT_STOCK_CREATE_REQUEST,
  EXPORT_STOCK_CREATE_RESET,
  EXPORT_STOCK_CREATE_SUCCESS,
  EXPORT_STOCK_DETAILS_FAIL,
  EXPORT_STOCK_DETAILS_REQUEST,
  EXPORT_STOCK_DETAILS_RESET,
  EXPORT_STOCK_DETAILS_SUCCESS,
  EXPORT_STOCK_LIST_FAIL,
  EXPORT_STOCK_LIST_REQUEST,
  EXPORT_STOCK_LIST_RESET,
  EXPORT_STOCK_LIST_SUCCESS,
  EXPORT_STOCK_STATUS_FAIL,
  EXPORT_STOCK_STATUS_REQUEST,
  EXPORT_STOCK_STATUS_RESET,
  EXPORT_STOCK_STATUS_SUCCESS,
  EXPORT_STOCK_UPDATE_FAIL,
  EXPORT_STOCK_UPDATE_REQUEST,
  EXPORT_STOCK_UPDATE_RESET,
  EXPORT_STOCK_UPDATE_SUCCESS,
  REPORT_EXPORT_STOCK_FAIL,
  REPORT_EXPORT_STOCK_REQUEST,
  REPORT_EXPORT_STOCK_RESET,
  REPORT_EXPORT_STOCK_SUCCESS,
} from "../Constants/ExportStockConstant";
import axios from "axios";
import { logout } from "./UserActions";

export const listExportStock =
  (keyword = "", pageNumber = " ", phieuxuat = " ", from = " ", to = " ") =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: EXPORT_STOCK_LIST_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/export-stock/?keyword=${keyword}&pageNumber=${pageNumber}&phieuxuat=${phieuxuat}&from=${from}&to=${to}`,
        config,
      );
      dispatch({ type: EXPORT_STOCK_LIST_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({ type: EXPORT_STOCK_LIST_FAIL, payload: message });
      setTimeout(() => {
        dispatch({ type: EXPORT_STOCK_LIST_RESET });
      }, 3000);
    }
  };

//ADMIN EXPORT STOCK SINGLE
export const singleExportStock = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: EXPORT_STOCK_DETAILS_REQUEST });
    // userInfo -> userLogin -> getState(){globalState}
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/export-stock/${id}`, config);
    dispatch({ type: EXPORT_STOCK_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: EXPORT_STOCK_DETAILS_FAIL,
      payload: message,
    });
    setTimeout(() => {
      dispatch({ type: EXPORT_STOCK_DETAILS_RESET });
    }, 3000);
  }
};

//ADMIN EXPORT CREATE
export const createExportStock =
  ({
    note,
    reason,
    isExportCanceled,
    user,
    exportItems,
    totalPrice,
    exportedAt,
  }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: EXPORT_STOCK_CREATE_REQUEST });
      // userInfo -> userLogin -> getState(){globalState}
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/export-stock/`,
        {
          note,
          reason,
          isExportCanceled,
          user,
          exportItems,
          totalPrice,
          exportedAt,
        },

        config,
      );
      dispatch({ type: EXPORT_STOCK_CREATE_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: EXPORT_STOCK_CREATE_FAIL,
        payload: message,
      });
      setTimeout(() => {
        dispatch({ type: EXPORT_STOCK_CREATE_RESET });
      }, 3000);
    }
  };

//ADMIN EXPORT STATUS
export const statusExportStock = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: EXPORT_STOCK_STATUS_REQUEST });
    // userInfo -> userLogin -> getState(){globalState}
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/export-stock/${id}/status`,
      {},
      config,
    );
    dispatch({ type: EXPORT_STOCK_STATUS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: EXPORT_STOCK_STATUS_FAIL,
      payload: message,
    });
    setTimeout(() => {
      dispatch({ type: EXPORT_STOCK_STATUS_RESET });
    }, 3000);
  }
};

//ADMIN UPDATE EXPORT
export const updateExportStock =
  ({
    note,
    reason,
    isExportCanceled,
    user,
    exportItems,
    totalPrice,
    exportedAt,
    exportId,
  }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: EXPORT_STOCK_UPDATE_REQUEST });
      // userInfo -> userLogin -> getState(){globalState}
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/export-stock/${exportId}`,
        {
          note,
          reason,
          isExportCanceled,
          user,
          exportItems,
          totalPrice,
          exportedAt,
        },
        config,
      );
      dispatch({ type: EXPORT_STOCK_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: EXPORT_STOCK_UPDATE_FAIL,
        payload: message,
      });
      setTimeout(() => {
        dispatch({ type: EXPORT_STOCK_UPDATE_RESET });
      }, 3000);
    }
  };

//ADMIN EXPORT CANCEL
export const cancelExportStock = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: EXPORT_STOCK_CANCEL_REQUEST });
    // userInfo -> userLogin -> getState(){globalState}
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/export-stock/${id}/cancel`,
      {},
      config,
    );
    dispatch({ type: EXPORT_STOCK_CANCEL_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: EXPORT_STOCK_CANCEL_FAIL,
      payload: message,
    });
    setTimeout(() => {
      dispatch({ type: EXPORT_STOCK_CANCEL_RESET });
    }, 3000);
  }
};


export const getReportExportStock = () => async (dispatch, getState) => {
  try {
    dispatch({ type: REPORT_EXPORT_STOCK_REQUEST });
    // userInfo -> userLogin -> getState(){globalState}
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(
      `/api/export-stock/report-export?phieuxuat=XNB`,
      config,
    );
    dispatch({ type: REPORT_EXPORT_STOCK_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: REPORT_EXPORT_STOCK_FAIL,
      payload: message,
    });
    setTimeout(() => {
      dispatch({ type: REPORT_EXPORT_STOCK_RESET });
    }, 3000);
  }
};
