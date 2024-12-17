import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Message from "../LoadingError/Error";
import debounce from "lodash.debounce";
import ExportStock from "./ExportStock";
import { listExportStock } from "../../Redux/Actions/ExportStockAction";
import Toast from "../LoadingError/Toast";
import { toast } from "react-toastify";
import renderToast from "../../util/Toast";
import { SetEXPNotification } from "../../Redux/Actions/NotificationAction";
const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const MainExportStock = (props) => {
  const { pageNumber } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const [isStop, setIsStop] = useState(false);
  const [keyword, setSearch] = useState();
  const [toggleSearch, setToggleSearch] = useState(false);
  const [data, setData] = useState({
    phieuxuat: "",
    from: "",
    to: "",
  });
  const { phieuxuat, from, to } = data;

  const exportedStockList = useSelector((state) => state.exportStockList);
  const { loading, error, stockExported } = exportedStockList;

  const updateStatus = useSelector((state) => state.exportStockStatus);
  const { loading: loadingStatus, error: errorStatus, success } = updateStatus;

  const cancelExport = useSelector((state) => state.exportStockCancel);
  const { error: errorCancel } = cancelExport;

  const callApiKeywordSearch = (keyword, pageNumber, phieuxuat, from, to) => {
    dispatch(listExportStock(keyword, pageNumber, phieuxuat, from, to));
  };
  const debounceDropDown = useRef(
    debounce(
      (keyword, pageNumber, phieuxuat, from, to) =>
        callApiKeywordSearch(keyword, pageNumber, phieuxuat, from, to),
      300,
    ),
  ).current;

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
    debounceDropDown(
      e.target.value,
      pageNumber,
      data.phieuxuat,
      data.from,
      data.to,
    );
  };

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(SetEXPNotification([]));
    history.push("/export-stock/add");
  };

  const handleChange = (e) => {
    e.preventDefault();
    const selectPX = document.querySelector("#PX-select");
    const selectedOptionPX = selectPX.options[selectPX.selectedIndex];
    selectPX.style.color = selectedOptionPX.id;

    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleSearchDate = (e) => {
    e.preventDefault();
    if (!toggleSearch) {
      if (!data.from || !data.to) {
        if (!isStop) {
          renderToast("Chưa chọn ngày", "error", setIsStop, isStop);
        }
        return;
      }
      dispatch(
        listExportStock(
          keyword,
          pageNumber,
          data.phieuxuat,
          data.from,
          data.to,
        ),
      );
    } else {
      setData({
        phieuxuat: "",
        from: "",
        to: "",
      });
      dispatch(listExportStock(keyword, pageNumber));
    }
    setToggleSearch(!toggleSearch);
  };

  useEffect(() => {
    if (success) {
      toast.success(`Cập nhật thành công`, ToastObjects);
    }
    dispatch(listExportStock(keyword, pageNumber)); // eslint-disable-next-line
  }, [dispatch, pageNumber, success]);

  useEffect(() => {
    dispatch(
      listExportStock(keyword, pageNumber, data.phieuxuat, data.from, data.to),
    );
    // eslint-disable-next-line
  }, [dispatch, phieuxuat]);

  return (
    <>
      <Toast />
      {error || errorStatus || errorCancel ? (
        <Message variant="alert-danger">
          {error || errorStatus || errorCancel}
        </Message>
      ) : (
        ""
      )}
      <section className="content-main">
        <div className="content-header">
          <h3 className="content-title">Danh sách phiếu xuất</h3>
          <div>
            <button onClick={handleAdd} className="btn btn-primary">
              Tạo mới
            </button>
          </div>
        </div>

        <div className="card card-custom mb-4 shadow-sm">
          <header className="card-header bg-aliceblue ">
            <div className="gx-3 py-3"  style={{display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center'}}>
              <div style={{display: "flex", justifyContent: 'flex-start', alignItems: 'center', gap: 10}}>
                <div style={{ width: 300 }}>
                  <input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="form-control"
                    value={keyword}
                    onChange={handleSubmitSearch}
                  />
                </div>
                <div style={{ width: 200 }}>
                  <select
                    defaultValue=""
                    name="phieuxuat"
                    className="p-2 form-select"
                    id="PX-select"
                    style={{ fontWeight: "500" }}
                    onChange={handleChange}
                  >
                    <option
                      id="black"
                      className="text-dark"
                      style={{ fontWeight: "500" }}
                      value=""
                    >
                      Tất cả phiếu xuất
                    </option>
                    <option
                      id="#28a745"
                      className="text-success"
                      style={{ fontWeight: "500" }}
                      value="XNB"
                    >
                      Phiếu xuất nội bộ
                    </option>
                    <option id="#dc3545" className="text-danger" value="XH">
                      Phiếu xuất huỷ
                    </option>
                  </select>
                </div>
              </div>
              <div style={{display: "flex", justifyContent: 'flex-end', alignItems: 'center', gap: 10}}>
                <div style={{ width: 230 }}>
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
                <div style={{ width: 230 }}>
                  <div className="d-flex">
                    <span className="label-date">Đến: </span>
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
                <div>
                  {toggleSearch ? (
                    <button className="btn btn-danger" onClick={handleSearchDate}>
                      Hủy
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={handleSearchDate}
                    >
                      Tìm kiếm
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div>
            {stockExported ? (
              <ExportStock
                exportStock={stockExported}
                loading={loading}
                loadingStatus={loadingStatus}
              />
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MainExportStock;
