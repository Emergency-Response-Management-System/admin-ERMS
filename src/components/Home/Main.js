import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopTotal from "./TopTotal";
import LatestOrder from "./LatestOrder";
import SaleStatistics from "./SalesStatistics";
import ProductsStatistics from "./ProductsStatistics";
import OrderStatistics from "./OrderStatistics";
import { listOrder, searchListOrder } from "../../Redux/Actions/OrderActions";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";

import Toast from "../LoadingError/Toast";
import renderToast from "../../util/Toast";
import './main.css'
import { getReportProduct } from "../../Redux/Actions/ProductActions";
import formatCurrency from "../../util/formatCurrency";
import DataTableImport from "./DataTableImport";
import { getHistoryInventory, getReportImportStock } from "../../Redux/Actions/ImportStockAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { getReportExportStock } from "../../Redux/Actions/ExportStockAction";
import DataTableExport from "./DataTableExport";
import moment from "moment";

const Main = () => {
  const dispatch = useDispatch();

  const orderSearchList = useSelector((state) => state.orderSearchList);
  const {
    loading,
    error,
    orders: ordersSearch,
    success: successSearch,
  } = orderSearchList;

  const history = useHistory();

  const productList = useSelector((state) => state.productList);
  const { products } = productList;


  const productReport = useSelector((state) => state.productReport);


  const reportImportStock = useSelector((state) => state.reportImportStock);

  const reportExportStock = useSelector((state) => state.reportExportStock);

  const [isStop, setIsStop] = useState(false);
  const [toggleSearch, setToggleSearch] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [data, setData] = useState({
    from: "",
    to: "",
  });
  const [orders, setOrders] = useState([]);
  const { from, to } = data;

  const handleChange = (e) => {
    e.preventDefault();
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
    if (toggleSearch) dispatch(searchListOrder(data.from, data.to));
  };
  const handleSearchDate = (e) => {
    e.preventDefault();
    if (!toggleSearch) {
      if (!data.from || !data.to) {
        if (!isStop) {
          renderToast("Chua chọn ngày", "error", setIsStop, isStop);
        }
        return;
      }
      setData({
        from: data.from,
        to: data.to,
      });
    } else {
      //nút cancel->click
      setData({
        from: "",
        to: "",
      });

      dispatch(searchListOrder("", ""));
    }
    setToggleSearch(!toggleSearch);
    setIsSearch(!isSearch);
  };
  useEffect(() => {
    if (successSearch) setOrders(ordersSearch);
  }, [successSearch]);

  useEffect(() => {
    if (toggleSearch) dispatch(searchListOrder(data.from, data.to));
  }, [data, toggleSearch]);
  useEffect(() => {
    dispatch(searchListOrder(data.from, data.to));
  }, []);

  useEffect(() => {
    dispatch(getReportProduct());
    dispatch(getReportImportStock())
    dispatch(getReportExportStock())
  }, []);


  const summaryCardIcons = [
    <svg key={0} xmlns='http://www.w3.org/2000/svg' width='46' height='45' viewBox='0 0 46 45' fill='none'>
      <path d='M14.5625 8.00626L31.4375 17.6625' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M39.875 15C39.8743 14.3424 39.7007 13.6965 39.3716 13.1272C39.0425 12.5578 38.5695 12.0851 38 11.7562L24.875 4.25625C24.3049 3.92712 23.6583 3.75385 23 3.75385C22.3417 3.75385 21.6951 3.92712 21.125 4.25625L8 11.7562C7.43049 12.0851 6.95746 12.5578 6.62837 13.1272C6.29927 13.6965 6.12567 14.3424 6.125 15V30C6.12567 30.6576 6.29927 31.3035 6.62837 31.8728C6.95746 32.4422 7.43049 32.9149 8 33.2437L21.125 40.7437C21.6951 41.0729 22.3417 41.2462 23 41.2462C23.6583 41.2462 24.3049 41.0729 24.875 40.7437L38 33.2437C38.5695 32.9149 39.0425 32.4422 39.3716 31.8728C39.7007 31.3035 39.8743 30.6576 39.875 30V15Z' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M6.6875 13.125L23 22.5L39.3125 13.125' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M23 41.25V22.5' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>,
    <svg key={1} xmlns='http://www.w3.org/2000/svg' width='46' height='45' viewBox='0 0 46 45' fill='none'>
      <path d='M30.5 30L34.25 33.75L41.75 26.25' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M39.875 18.75V15C39.8743 14.3424 39.7007 13.6965 39.3716 13.1272C39.0425 12.5578 38.5695 12.0851 38 11.7562L24.875 4.25625C24.3049 3.92712 23.6583 3.75385 23 3.75385C22.3417 3.75385 21.6951 3.92712 21.125 4.25625L8 11.7562C7.43049 12.0851 6.95746 12.5578 6.62837 13.1272C6.29927 13.6965 6.12567 14.3424 6.125 15V30C6.12567 30.6576 6.29927 31.3035 6.62837 31.8728C6.95746 32.4422 7.43049 32.9149 8 33.2437L21.125 40.7437C21.6951 41.0729 22.3417 41.2462 23 41.2462C23.6583 41.2462 24.3049 41.0729 24.875 40.7437L28.625 38.6062' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M14.5625 8.00626L31.4375 17.6625' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M6.66875 13.125L23 22.5L39.3312 13.125' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M23 41.25V22.5' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>,
    <svg key={2} width='46' height='45' viewBox='0 0 46 45' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M4.25024 34.9998C4.25024 32.6799 4.43866 30.4004 5.58942 28.386C6.74019 26.3717 8.39661 24.6924 10.395 23.5142C12.3934 22.336 14.6647 21.6996 16.9844 21.6679C19.304 21.6362 21.5918 22.2102 23.6217 23.3333' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M17.1667 21.6667C21.7691 21.6667 25.5 17.9357 25.5 13.3333C25.5 8.73096 21.7691 5 17.1667 5C12.5643 5 8.83337 8.73096 8.83337 13.3333C8.83337 17.9357 12.5643 21.6667 17.1667 21.6667Z' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M4.37497 35.025H22.1527' stroke='white' strokeWidth='2.5' strokeLinecap='round' />
      <g clipPath='url(#clip0_12558_586)'>
        <path d='M30.2498 24.5583L37.7498 28.85' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M41.4998 27.6666C41.4995 27.3744 41.4223 27.0873 41.276 26.8343C41.1298 26.5812 40.9195 26.3711 40.6664 26.225L37.7498 24.5583L34.8331 22.8916C34.5797 22.7453 34.2923 22.6683 33.9998 22.6683C33.7072 22.6683 33.4198 22.7453 33.1664 22.8916L27.3331 26.225C27.08 26.3711 26.8697 26.5812 26.7235 26.8343C26.5772 27.0873 26.5001 27.3744 26.4998 27.6666V34.3333C26.5001 34.6256 26.5772 34.9126 26.7235 35.1657C26.8697 35.4187 27.08 35.6288 27.3331 35.775L33.1664 39.1083C33.4198 39.2546 33.7072 39.3316 33.9998 39.3316C34.2923 39.3316 34.5797 39.2546 34.8331 39.1083L40.6664 35.775C40.9195 35.6288 41.1298 35.4187 41.276 35.1657C41.4223 34.9126 41.4995 34.6256 41.4998 34.3333V27.6666Z' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M26.7498 26.8333L33.9998 31L41.2498 26.8333' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
        <path d='M33.9998 39.3333V31' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
      </g>
      <defs>
        <clipPath id='clip0_12558_586'>
          <rect width='20' height='20' fill='white' transform='translate(23.9998 21)' />
        </clipPath>
      </defs>
    </svg>
    ,
    <svg key={3} xmlns='http://www.w3.org/2000/svg' width='40' height='41' viewBox='0 0 40 41' fill='none'>
      <path d='M10.5001 16C10.8116 16.3054 11.2305 16.4764 11.6667 16.4764C12.103 16.4764 12.5219 16.3054 12.8334 16L15.5001 13.3333C15.8054 13.0218 15.9765 12.6029 15.9765 12.1667C15.9765 11.7304 15.8054 11.3116 15.5001 11L9.21674 4.71668C11.0687 3.87862 13.1321 3.62487 15.132 3.98925C17.1318 4.35362 18.9731 5.31882 20.4105 6.75621C21.8479 8.1936 22.8131 10.0349 23.1775 12.0348C23.5419 14.0346 23.2881 16.098 22.4501 17.95L33.9667 29.4667C34.6298 30.1297 35.0023 31.029 35.0023 31.9667C35.0023 32.9044 34.6298 33.8036 33.9667 34.4667C33.3037 35.1297 32.4044 35.5022 31.4667 35.5022C30.5291 35.5022 29.6298 35.1297 28.9667 34.4667L17.4501 22.95C15.5981 23.7881 13.5347 24.0418 11.5348 23.6774C9.53497 23.3131 7.69366 22.3479 6.25627 20.9105C4.81888 19.4731 3.85368 17.6318 3.48931 15.6319C3.12493 13.6321 3.37868 11.5687 4.21673 9.71668L10.4834 15.9833L10.5001 16Z' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  ]

  const summaryCardLink = [
    '/products',
    `/import-stock`,
    `/export-stock`,
    `/`

  ]

  const renderTitleQuantity = (item) => {
    if (item?.productGroup) {
      return {
        title: 'Sản phẩm / Nhóm',
        quantity: `${item?.productGroup?.products} / ${item?.productGroup?.groups}`
      }
    }
    if (item?.importStock) {
      return {
        title: 'Đã duyệt / Đơn nhập',
        quantity: `${item?.importStock?.approved} / ${item?.importStock?.total}`
      }
    }
    if (item?.exportStock) {
      return {
        title: 'Đã duyệt / Đơn xuất',
        quantity: `${item?.exportStock?.approved} / ${item?.exportStock?.total}`
      }
    }
    if (item?.totalImport) {
      return {
        title: 'Tổng tiền nhập',
        quantity: formatCurrency(item?.totalImport)
      }
    }
  }

  return (
    <>
      <Toast />

      <section className="content-main">
        {/* <div className="content-header">
          <h2 className="content-title"><span className="u-text-mark">Trang chủ</span></h2>
        </div> */}

        {/* <div className="row p-4">
          <div className="col-lg-7"></div>

          <div className="col-lg-2 col-6 col-md-3">
            <div className="d-flex">
              <span className="label-date">Từ: </span>
              <input
                id="datePicker"
                name="from"
                value={from}
                className="form-control"
                type="date"
                onChange={handleChange}
              ></input>
            </div>
          </div>
          <div className="col-lg-2 col-6 col-md-3">
            <div className="d-flex">
              <span className="label-date">Ðến: </span>
              <input
                id="datePicker"
                name="to"
                value={to}
                className="form-control"
                type="date"
                onChange={handleChange}
              ></input>
            </div>
          </div>
          <div className="col-lg-1">
            {toggleSearch ? (
              <button className="btn btn-danger" onClick={handleSearchDate}>
                Hủy
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleSearchDate}>
                Tìm
              </button>
            )}
          </div>
        </div> */}
        {loading ? (
          <Loading />
        ) : error ? (
          <Message>{error}</Message>
        ) : (
          <>
            {/* Top Total */}
            {/* <TopTotal orders={ordersSearch} products={products} /> */}



            <div className="row">
              <div className="dashboard">
                <h2>Trang chủ</h2>
                <div className='summary-cards'>
                  {productReport?.productReport?.data?.map(
                    (card, index) => (
                      <div key={index} className='summary-card'>
                        <div className='summary-card-content'>
                          <div className='summary-card-icon'>
                            <div className='icon'>
                              {summaryCardIcons[index]}
                            </div>
                          </div>
                          <div className='summary-group'
                            onClick={(e) => {
                              history.push(summaryCardLink[index])
                            }}>
                            <div className='group'>
                              <div className='summary-card-title'>{renderTitleQuantity(card)?.title}</div>
                              <div className='summary-card-value'>{renderTitleQuantity(card)?.quantity}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                {/* <div className="assets-due">
                <h3>Assets Due for Return (12)</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Assets</th>
                      <th>Holder</th>
                      <th>Due Date/Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>aaaaa</td>
                      <td>Nhi 56 (CRT)</td>
                      <td>1 Oct 2024, 12:00am <span className="overdue">Overdue</span></td>
                    </tr>
                    <tr>
                      <td>LAP02</td>
                      <td>Joseph BRIFFA (Staff)</td>
                      <td>7 Oct 2024, 12:00am <span className="overdue">Overdue</span></td>
                    </tr>
                    <tr>
                      <td>TAB02</td>
                      <td>Nhi 60 (CRT)</td>
                      <td>15 Oct 2024, 12:00am <span className="overdue">Overdue</span></td>
                    </tr>
                    <tr>
                      <td>TAB06</td>
                      <td>Nhi 60 (CRT)</td>
                      <td>17 Oct 2024, 12:00am <span className="overdue">Overdue</span></td>
                    </tr>
                    <tr>
                      <td>IPA07</td>
                      <td>Nhi 60 (CRT)</td>
                      <td>18 Oct 2024, 12:00am <span className="overdue">Overdue</span></td>
                    </tr>
                    <tr>
                      <td>Genre</td>
                      <td>Nhi Nguyen (Student)</td>
                      <td>21 Oct 2024, 12:00am <span className="overdue">Overdue</span></td>
                    </tr>
                    <tr>
                      <td>LAP55</td>
                      <td>Staff 2 (CRT)</td>
                      <td>25 Oct 2024, 12:00am <span className="overdue">Overdue</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="categories">
                <h3>Categories (7)</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Assets</th>
                      <th>Currently Allocated</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Laptop</td>
                      <td>20</td>
                      <td>50%</td>
                    </tr>
                    <tr>
                      <td>Tablet</td>
                      <td>24</td>
                      <td>50%</td>
                    </tr>
                    <tr>
                      <td>Projector</td>
                      <td>3</td>
                      <td>33%</td>
                    </tr>
                    <tr>
                      <td>Accessories</td>
                      <td>2</td>
                      <td>50%</td>
                    </tr>
                    <tr>
                      <td>Key</td>
                      <td>16</td>
                      <td>44%</td>
                    </tr>
                    <tr>
                      <td>Smartphone</td>
                      <td>7</td>
                      <td>43%</td>
                    </tr>
                    <tr>
                      <td>Test dashboard</td>
                      <td>0</td>
                      <td>0%</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
                <div className="row">
                  <div className="col-lg-6 col-md-12 mb-3">
                    <DataTableImport products={reportImportStock?.reportImportStock} loading={reportImportStock?.loading} />
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <DataTableExport products={reportExportStock?.reportExportStock} loading={reportExportStock?.loading} />
                  </div>
                </div>
              </div>
            </div>

            {/* LATEST ORDER */}
            {/* <div className="card card-custom mb-4 shadow-sm">
              <LatestOrder
                orders={ordersSearch}
                loading={loading}
                error={error}
              />
            </div> */}

            {/* LATEST ORDER */}
            {/* <div className="card card-custom mb-4 shadow-sm">
              <OrderStatistics
                orders={ordersSearch}
                loading={loading}
                error={error}
              />
            </div> */}
          </>
        )}
      </section>
      {/*<ContainerDemo/>*/}
    </>
  );
};

export default Main;
