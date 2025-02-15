import {
  HISTORY_INVENTORY_STOCK_FAIL,
  HISTORY_INVENTORY_STOCK_REQUEST,
  HISTORY_INVENTORY_STOCK_RESET,
  HISTORY_INVENTORY_STOCK_SUCCESS,
  IMPORT_STOCK_CANCEL_FAIL,
  IMPORT_STOCK_CANCEL_REQUEST,
  IMPORT_STOCK_CANCEL_RESET,
  IMPORT_STOCK_CANCEL_SUCCESS,
  IMPORT_STOCK_CREATE_FAIL,
  IMPORT_STOCK_CREATE_REQUEST,
  IMPORT_STOCK_CREATE_RESET,
  IMPORT_STOCK_CREATE_SUCCESS,
  IMPORT_STOCK_DETAILS_FAIL,
  IMPORT_STOCK_DETAILS_REQUEST,
  IMPORT_STOCK_DETAILS_SUCCESS,
  IMPORT_STOCK_LIST_FAIL,
  IMPORT_STOCK_LIST_REQUEST,
  IMPORT_STOCK_LIST_SUCCESS,
  IMPORT_STOCK_STATUS_FAIL,
  IMPORT_STOCK_STATUS_REQUEST,
  IMPORT_STOCK_STATUS_RESET,
  IMPORT_STOCK_STATUS_SUCCESS,
  IMPORT_STOCK_UPDATE_FAIL,
  IMPORT_STOCK_UPDATE_REQUEST,
  IMPORT_STOCK_UPDATE_RESET,
  IMPORT_STOCK_UPDATE_SUCCESS,
  REPORT_IMPORT_STOCK_FAIL,
  REPORT_IMPORT_STOCK_REQUEST,
  REPORT_IMPORT_STOCK_RESET,
  REPORT_IMPORT_STOCK_SUCCESS,
  REPORT_REVENUE_FAIL,
  REPORT_REVENUE_REQUEST,
  REPORT_REVENUE_RESET,
  REPORT_REVENUE_SUCCESS,
} from "./../Constants/ImportStockConstant";
// IMPORT_STOCK LIST
export const importStockListReducer = (
  state = { stockImported: [] },
  action,
) => {
  switch (action.type) {
    case IMPORT_STOCK_LIST_REQUEST:
      return { loading: true, stockImported: [] };
    case IMPORT_STOCK_LIST_SUCCESS:
      return {
        loading: false,
        totalPage: action.payload.totalPage,
        currentPage: action.payload.currentPage,
        stockImported: action.payload,
      };
    case IMPORT_STOCK_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//IMPORT_STOCK DETAIL
export const importStockDetailReducer = (state = {}, action) => {
  switch (action.type) {
    case IMPORT_STOCK_DETAILS_REQUEST:
      return { ...state, loading: true };
    case IMPORT_STOCK_DETAILS_SUCCESS:
      return { loading: false, success: true, importStockItem: action.payload };
    case IMPORT_STOCK_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
// CREATE IMPORT_STOCK
export const importStockCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case IMPORT_STOCK_CREATE_REQUEST:
      return { loading: true };
    case IMPORT_STOCK_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        importStockCreated: action.payload,
      };
    case IMPORT_STOCK_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case IMPORT_STOCK_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

// STATUS IMPORT_STOCK
export const importStockStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case IMPORT_STOCK_STATUS_REQUEST:
      return { loading: true };
    case IMPORT_STOCK_STATUS_SUCCESS:
      return {
        loading: false,
        success: true,
        importStockStatus: action.payload,
      };
    case IMPORT_STOCK_STATUS_FAIL:
      return { loading: false, error: action.payload };
    case IMPORT_STOCK_STATUS_RESET:
      return {};
    default:
      return state;
  }
};

// UPDATE IMPORT STOCK
export const importStockUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case IMPORT_STOCK_UPDATE_REQUEST:
      return { loading: true };
    case IMPORT_STOCK_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        importStockUpdated: action.payload,
      };
    case IMPORT_STOCK_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case IMPORT_STOCK_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

// CANCEL IMPORT_STOCK
export const importStockCancelReducer = (state = {}, action) => {
  switch (action.type) {
    case IMPORT_STOCK_CANCEL_REQUEST:
      return { loading: true };
    case IMPORT_STOCK_CANCEL_SUCCESS:
      return {
        loading: false,
        success: true,
        importStockCancel: action.payload,
      };
    case IMPORT_STOCK_CANCEL_FAIL:
      return { loading: false, error: action.payload };
    case IMPORT_STOCK_CANCEL_RESET:
      return {};
    default:
      return state;
  }
};


export const reportImportStockReducer = (state = { reportImportStock: [] }, action) => {
  switch (action.type) {
    case REPORT_IMPORT_STOCK_REQUEST:
      return { loading: true };
    case REPORT_IMPORT_STOCK_SUCCESS:
      return {
        loading: false,
        success: true,
        reportImportStock: action.payload,
      };
    case REPORT_IMPORT_STOCK_FAIL:
      return { loading: false, error: action.payload };
    case REPORT_IMPORT_STOCK_RESET:
      return {};
    default:
      return state;
  }
};


export const historyInventoryReducer = (state = { historyInventory: [] }, action) => {
  switch (action.type) {
    case HISTORY_INVENTORY_STOCK_REQUEST:
      return { loading: true };
    case HISTORY_INVENTORY_STOCK_SUCCESS:
      return {
        loading: false,
        success: true,
        historyInventory: action.payload,
      };
    case HISTORY_INVENTORY_STOCK_FAIL:
      return { loading: false, error: action.payload };
    case HISTORY_INVENTORY_STOCK_RESET:
      return {};
    default:
      return state;
  }
};

export const getReportRevenueReducer = (state = { getReportRevenue: [] }, action) => {
  switch (action.type) {
    case REPORT_REVENUE_REQUEST:
      return { loading: true };
    case REPORT_REVENUE_SUCCESS:
      return {
        loading: false,
        success: true,
        getReportRevenue: action.payload,
      };
    case REPORT_REVENUE_FAIL:
      return { loading: false, error: action.payload };
    case REPORT_REVENUE_RESET:
      return [];
    default:
      return state;
  }
};