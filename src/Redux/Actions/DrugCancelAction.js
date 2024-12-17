import axios from "axios";
import { logout } from "./UserActions";
import {
  DRUG_CANCEL_LIST_FAIL,
  DRUG_CANCEL_LIST_REQUEST,
  DRUG_CANCEL_LIST_RESET,
  DRUG_CANCEL_LIST_SUCCESS,
} from "../Constants/DrugCancelConstants";

export const listDrugCancel =
  (keyword = "", pageNumber = " ", sort = " ") =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: DRUG_CANCEL_LIST_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/drugcancel/all?keyword=${keyword}&pageNumber=${pageNumber}&sort=${sort}`,
        config,
      );
      // const { data } = await axios.get(`/api/products/all`, config);
      dispatch({ type: DRUG_CANCEL_LIST_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: DRUG_CANCEL_LIST_FAIL,
        payload: message,
      });
      setTimeout(() => {
        dispatch({ type: DRUG_CANCEL_LIST_RESET });
      }, 3000);
    }
  };
