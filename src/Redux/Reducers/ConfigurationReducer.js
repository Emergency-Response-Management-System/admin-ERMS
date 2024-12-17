import { CONFIGURATION_SINGLE_FAIL, CONFIGURATION_SINGLE_REQUEST, CONFIGURATION_SINGLE_RESET, CONFIGURATION_SINGLE_SUCCESS, CONFIGURATION_UPDATE_FAIL, CONFIGURATION_UPDATE_REQUEST, CONFIGURATION_UPDATE_RESET, CONFIGURATION_UPDATE_SUCCESS } from "../Constants/ConfigurationConstants";

export const configurationUpdateReducer = (state = { configurationUpdate: {} }, action) => {
  switch (action.type) {
    case CONFIGURATION_UPDATE_REQUEST:
      return { loading: true };
    case CONFIGURATION_UPDATE_SUCCESS:
      return { loading: false, success: true, configurationUpdate: action.payload };
    case CONFIGURATION_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case CONFIGURATION_UPDATE_RESET:
      return { configurationUpdate: {} };
    default:
      return state;
  }
};

export const configurationsSingleReducer = (state = { configurationSingle: {} }, action) => {
  switch (action.type) {
    case CONFIGURATION_SINGLE_REQUEST:
      return { loading: true };
    case CONFIGURATION_SINGLE_SUCCESS:
      return { loading: false, success: true, configurationSingle: action.payload };
    case CONFIGURATION_SINGLE_FAIL:
      return { loading: false, error: action.payload };
    case CONFIGURATION_SINGLE_RESET:
      return { configurationSingle: {} };
    default:
      return state;
  }
};


