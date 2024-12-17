import {
  DRUG_CANCEL_LIST_FAIL,
  DRUG_CANCEL_LIST_REQUEST,
  DRUG_CANCEL_LIST_RESET,
  DRUG_CANCEL_LIST_SUCCESS,
} from "../Constants/DrugCancelConstants";

export const DrugCancelListReducer = (state = { drugcancels: [] }, action) => {
  switch (action.type) {
    case DRUG_CANCEL_LIST_REQUEST:
      return { loading: true, drugcancels: [] };
    case DRUG_CANCEL_LIST_SUCCESS:
      return { loading: false, drugcancels: action.payload };
    case DRUG_CANCEL_LIST_FAIL:
      return { loading: false, error: action.payload };
    case DRUG_CANCEL_LIST_RESET:
      return { drugcancels: [] };
    default:
      return state;
  }
};
