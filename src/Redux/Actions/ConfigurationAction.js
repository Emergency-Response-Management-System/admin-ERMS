import axios from "axios";
import { logout } from "./UserActions";
import { CONFIGURATION_SINGLE_FAIL, CONFIGURATION_SINGLE_REQUEST, CONFIGURATION_SINGLE_RESET, CONFIGURATION_SINGLE_SUCCESS, CONFIGURATION_UPDATE_FAIL, CONFIGURATION_UPDATE_REQUEST, CONFIGURATION_UPDATE_RESET, CONFIGURATION_UPDATE_SUCCESS } from "../Constants/ConfigurationConstants";

//ADMIN UPDATE CATEGORY
export const updateConfiguration =
  ({ nameWeb, logo, avatarDefault, backgroundLogin, colorDefault, quantityWarning, quantityDate }) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: CONFIGURATION_UPDATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/configuration/default`,
        {
          nameWeb,
          logo,
          avatarDefault, 
          backgroundLogin, 
          colorDefault, 
          quantityWarning, 
          quantityDate
        },
        config,
      );
      dispatch({ type: CONFIGURATION_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      if (message === "Not authorized, token failed") {
        dispatch(logout());
      }
      dispatch({
        type: CONFIGURATION_UPDATE_FAIL,
        payload: message,
      });
      setTimeout(() => {
        dispatch({ type: CONFIGURATION_UPDATE_RESET });
      }, 3000);
    }
  };

export const singleConfiguration = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CONFIGURATION_SINGLE_REQUEST });
    // userInfo -> userLogin -> getState(){globalState}
    // const {
    //   userLogin: { userInfo },
    // } = getState();

    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${userInfo.token}`,
    //   },
    // };

    const { data } = await axios.get(`/api/configuration/`, {});
    dispatch({ type: CONFIGURATION_SINGLE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch(logout());
    }
    dispatch({
      type: CONFIGURATION_SINGLE_FAIL,
      payload: message,
    });
    setTimeout(() => {
      dispatch({ type: CONFIGURATION_SINGLE_RESET });
    }, 3000);
  }
};