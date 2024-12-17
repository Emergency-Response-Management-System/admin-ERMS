/* eslint-disable no-nested-ternary */
import moment from "moment";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import renderToast from "../../util/Toast";
import { useDispatch, useSelector } from "react-redux";
import { getReportRevenue } from "../../Redux/Actions/ImportStockAction";
import { Bar, Column, Line, Pie } from "@ant-design/charts";
import DataTable from "react-data-table-component";
import formatCurrency from "../../util/formatCurrency";
import NoRecords from "../../util/noData";
import Select from "react-select";
import ExpandedComponent from "./ExpandedComponent";
import './index.css'

const ReportRevenueChart = () => {
  const previousClickRefresh = useRef(moment());
  const [timeUpdated, setTimeUpdated] = useState({
    updatedAt: moment().format("HH:mm:ss DD/MM/YYYY"),
    range: 0,
  });

  const chartContainerDomRef = useRef(null);
  const filterWrapperDomRef = useRef(null);

  const [timeType, setTimeType] = useState("year");
  const [keyword, setKeyword] = useState("all");
  // presentView (xem với filter thuộc mốc thời gian hiện tại (hôm nay, tuần này, tháng này))
  const [presentView, setPresentView] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [description, setDescription] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentFilter, setCurrenFilter] = useState({
    createdAtFrom: moment().startOf("year").valueOf(),
    createdAtTo: moment().valueOf(),
  });

  useEffect(() => {
    let temDescription = "";
    switch (timeType) {
      case "day":
        temDescription = "vs. yesterday";
        break;
      case "week":
        temDescription = "vs. last week";
        break;
      case "month":
        temDescription = "vs. last month";
        break;
      case "year":
        temDescription = "vs. last year";
        break;
      default:
        break;
    }
    setDescription(temDescription);
  }, [timeType]);

  const getMessageUpdated = () => {
    const startOfTime = moment(currentFilter?.createdAtFrom);
    const endOfTime = moment();
    const diff = moment.duration(endOfTime.diff(startOfTime)).asDays();

    const result = Math.ceil(diff);
    setTimeUpdated({
      updatedAt: endOfTime.toISOString(),
      range: result > 1 ? result : 0,
    });
  };

  useEffect(() => {
    setKeyword('');
  }, [])

  useEffect(() => {
    getMessageUpdated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilter, refreshData]);

  useLayoutEffect(() => {
    if (
      !filterWrapperDomRef.current ||
      !chartContainerDomRef.current ||
      window.innerWidth > 768
    ) {
      return;
    }

    let prevScrollPos = window.pageYOffset;
    let count = 0;

    const parentDiv = filterWrapperDomRef.current.parentNode;
    const toolBarNode = document.querySelector(
      "div.innos-ui-tool-header.innos-ui-toolbar",
    );

    const handleScroll = () => {
      if (!parentDiv) {
        return;
      }

      const headerHeight = 42;
      const currentScrollPos = window.pageYOffset;
      const paddingTop =
        filterWrapperDomRef.current.offsetHeight + toolBarNode.offsetHeight;

      if (currentScrollPos > paddingTop) {
        count = 1;
        chartContainerDomRef.current.style.paddingTop = `${paddingTop}px`;

        Object.assign(parentDiv.style, {
          position: "fixed",
          transition: "top .3s",
          zIndex: 99,
          width: "100%",
        });

        if (
          prevScrollPos > currentScrollPos ||
          currentScrollPos < headerHeight
        ) {
          parentDiv.style.top = "0";
        } else {
          parentDiv.style.top = `-${paddingTop}px`;
        }
      } else if (!count || currentScrollPos === 0) {
        parentDiv.removeAttribute("style");
        chartContainerDomRef.current.removeAttribute("style");
      }

      prevScrollPos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const [data, setData] = useState({
    keySearch: "",
    from: "",
    to: "",
  });

  const [toggleSearch, setToggleSearch] = useState(false);

  const [isStop, setIsStop] = useState(false);

  const [valueOption, setValueOption] = useState({
    value: 'All',
    label: 'Tất cả',
  })

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  const handleSearchDate = (e) => {
    e.preventDefault();
    if (!toggleSearch) {
      if (!data.from || !data.to) {
        if (!isStop) {
          renderToast("Ngày không hợp lệ", "error", setIsStop, isStop);
        }
        return;
      }
      dispatch(
        getReportRevenue(keySearch, data.from, data.to),
      )
    } else {
      setData({
        keySearch: "",
        from: "",
        to: "",
      });
      dispatch(
        getReportRevenue('', '', ''),
      )
    }
    setToggleSearch(!toggleSearch);
  }


  const { from, to, keySearch } = data



  const dataGetReportRevenue = useSelector((state) => state.getReportRevenue);



  useEffect(() => {
    dispatch(
      getReportRevenue(keySearch, data.from, data.to),
    );
    // eslint-disable-next-line
  }, [dispatch]);

  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (dataGetReportRevenue?.getReportRevenue) {
      // Hợp nhất các mục có cùng tên, số lô và ngày nhập
      const mergedData = dataGetReportRevenue?.getReportRevenue.reduce((acc, item) => {
        const key = `${item.name}_${item.lotNumber}_${item.inStockDate}`; // Tạo khóa duy nhất bao gồm name, lotNumber, và inStockDate
        if (!acc[key]) {
          acc[key] = {
            name: item.name,
            quantity: item.qty,
            date: new Date(item.inStockDate).toLocaleDateString(),
            price: item.price, // Khởi tạo giá
            lotNumber: item.lotNumber, // Lưu số lô để so sánh
          };
        } else {
          acc[key].quantity += item.qty; // Cộng dồn số lượng
          acc[key].price += item.price; // Cộng dồn giá
        }
        return acc;
      }, {});

      const sumData = Object.values(mergedData); // Chuyển object thành array
      setChartData([...sumData]);

      // Organize the data
      const organizedData = [...sumData].reduce((result, item) => {
        const { name, quantity, price, lotNumber, date } = item;
        console.log('item', item)
        // Find if the product already exists
        let product = result.find((prod) => prod.name === name);

        if (!product) {
          // If not found, add a new product
          product = {
            name: name,
            totalQuantity: 0,
            totalPrice: 0,
            batches: [],
          };
          result.push(product);
        }

        // Update total quantity and price
        product.totalQuantity += quantity || 0;
        product.totalPrice += price || 0;

        // Add the batch to the product
        product.batches.push({
          lotNumber: lotNumber,
          date: new Date(date).toLocaleDateString(),
          quantity: quantity,
          price: price,
        });

        return result;
      }, []);
      setTableData([...organizedData]);
      // Log the organized data
      console.log(organizedData);
    }
  }, [dataGetReportRevenue?.getReportRevenue]);


  // Cấu hình bảng
  const columns = [
    {
      name: "Tên sản phẩm",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Số lượng",
      selector: (row) => row.totalQuantity,
      sortable: true,
    },
    {
      name: "Tổng giá",
      selector: (row) => formatCurrency(row?.totalPrice),
      sortable: true,
    },
  ];

  // Cấu hình biểu đồ cột (Column Chart)
  const columnConfig = {
    data: chartData,
    xField: "date",
    yField: "price", // Hiển thị doanh thu (price)
    seriesField: "name",
    colorField: "name",
    tooltip: {
      fields: ['name', 'quantity', 'price'], // Thêm trường price vào tooltip
      formatter: (data) => ({
        name: data.name,
        value: `Số lượng: ${data.quantity}, Doanh thu: ${data.price}`,
      }),
    },
  };

  // Cấu hình biểu đồ đường (Line Chart)
  const lineConfig = {
    data: chartData,
    xField: "date",
    yField: "price", // Hiển thị doanh thu (price)
    seriesField: "name",
    tooltip: {
      fields: ['name', 'quantity', 'price'], // Thêm trường price vào tooltip
      formatter: (data) => ({
        name: data.name,
        value: `Số lượng: ${data.quantity}, Doanh thu: ${data.price}`,
      }),
    },
  };

  // Cấu hình biểu đồ tròn (Pie Chart)
  const pieConfig = {
    data: chartData,
    angleField: "price", // Hiển thị doanh thu (price)
    colorField: "name",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    tooltip: {
      fields: ['name', 'price'], // Thêm trường price vào tooltip
      formatter: (data) => ({
        name: data.name,
        value: `Doanh thu: ${data.price}`,
      }),
    },
  };

  // Cấu hình biểu đồ thanh (Bar Chart)
  const barConfig = {
    data: chartData,
    xField: "price", // Hiển thị doanh thu (price)
    yField: "name",
    seriesField: "name",
    isStack: true,
    tooltip: {
      fields: ['name', 'quantity', 'price'], // Thêm trường price vào tooltip
      formatter: (data) => ({
        name: data.name,
        value: `Số lượng: ${data.quantity}, Doanh thu: ${data.price}`,
      }),
    },
  };

  const customStyles = {
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: "rgb(230, 244, 244)",
        borderBottomColor: "#FFFFFF",
        // borderRadius: '25px',
        outline: "1px solid #FFFFFF",
      },
    },
    header: {
      style: {
        minHeight: "56px",
      },
    },
    headRow: {
      style: {
        fontSize: "16px",
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderTopColor: "grey",
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: "grey",
        },
      },
    },
    cells: {
      style: {
        fontSize: "16px",
        "&:not(:last-of-type)": {
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          borderRightColor: "grey",
        },
      },
    },
  };

  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
  };


  const categoriesOption = [
    {
      value: 'All',
      label: 'Tất cả',
    },
    {
      value: 'column',
      label: 'Biểu đồ cột ',
    },
    {
      value: 'line',
      label: 'Biểu đồ đường',
    },
    {
      value: 'pie',
      label: 'Biểu đồ tròn',
    },
    {
      value: 'bar',
      label: 'Biểu đồ tiếp tuyến',
    }
  ];

  useEffect(() => {
    tableData?.map((item) => (item.defaultExpanded = expanded)); // eslint-disable-next-line
  }, [expanded]);
  const isExpanded = (row) => row.defaultExpanded;
  return (
    <>
      <section className="content-main chart-event" ref={chartContainerDomRef}>
        <div className="content-header">
          <h2 className="content-title">Thống kê doanh thu nhập hàng</h2>
        </div>
        <div className="card card-custom mb-4 shadow-sm">
          <header className="card-header bg-aliceblue ">
            <div className="gx-3 py-3" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center' }}>
              <div style={{ display: "flex" }}>
                <span className="label-date">Biểu đồ: </span>
                <div style={{ width: 230 }} >
                  <Select
                    options={categoriesOption}
                    value={valueOption}
                    onChange={(selectedOptions) => {
                      setValueOption(selectedOptions);
                    }}
                    placeholder="Chọn biểu đồ"
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
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
                <div>
                  <button
                    className="btn btn-success"
                    style={{ width: "max-content" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setExpanded((prev) => !prev);
                    }}
                  >
                    {!expanded ? "Mở rộng" : "Thu gọn"}
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div style={{ background: "#FFF" }}>
            <DataTable
              columns={columns}
              customStyles={customStyles}
              noDataComponent={NoRecords()}
              data={tableData}
              pagination
              defaultSortFieldId
              highlightOnHover
              paginationComponentOptions
              expandableRows
              expandableRowExpanded={isExpanded}
              expandableRowsComponent={(data) => (
                <ExpandedComponent
                  data={data}
                />
              )}
              pointerOnHover
            />
          </div>

          <div style={{ background: "#FFF" }}>
            <div className="p-2">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "40px 0px",
                  color: "cornflowerblue",
                  fontFamily: "system-ui",
                }}
              >
                <h3>Biểu đồ doanh thu nhập kho</h3>
              </div>
              <div className="grid-container">
                {/* Biểu đồ Column */}
                {["All", "column"].includes(valueOption?.value) && (
                  <div className="grid-item">
                    <Column {...columnConfig} />
                  </div>
                )}

                {/* Biểu đồ Line */}
                {["All", "line"].includes(valueOption?.value) && (
                  <div className="grid-item">
                    <Line {...lineConfig} />
                  </div>
                )}

                {/* Biểu đồ Pie */}
                {["All", "pie"].includes(valueOption?.value) && (
                  <div className="grid-item">
                    <Pie {...pieConfig} />
                  </div>
                )}

                {/* Biểu đồ Bar */}
                {["All", "bar"].includes(valueOption?.value) && (
                  <div className="grid-item">
                    <Bar {...barConfig} />
                  </div>
                )}
              </div>
            </div>
          </div>






        </div>
      </section>
    </>
  );
};

export default ReportRevenueChart;
