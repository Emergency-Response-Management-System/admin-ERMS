import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

const FilterReport = (props) => {
  const { handleChangeFilter, refreshData } = props;
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [triggerHandleChange, setTriggerHandleChange] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const currentYear = new Date().getFullYear();

  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  const [filter, setFilter] = useState({
    time: "thisYear",
    year: currentYear,
  });

  const options = [];
  if (products?.length > 0) {
    products.map((p) => {
      options.push({
        value: p?._id,
        label: p.name,
        dataFoo: p.name,
        dataExpproduct: p.expDrug,
      });
    });
  }

  const handleFilter = () => {
    let createdAtFrom;
    let createdAtTo;
    const typeTime = {
      type: "day",
      presentView: true,
    };
    let isToday = false;

    if (filter.year === currentYear) {
      switch (filter?.time) {
        case "today":
          createdAtFrom = moment().startOf("day").valueOf();
          createdAtTo = moment().valueOf();
          typeTime.type = "day";
          isToday = true;
          break;
        case "thisWeek":
          createdAtFrom = moment().startOf("isoWeek").valueOf();
          createdAtTo = moment().valueOf();
          typeTime.type = "week";

          isToday = false;
          break;
        case "thisMonth":
          createdAtFrom = moment().startOf("month").valueOf();
          createdAtTo = moment().valueOf();
          typeTime.type = "month";

          isToday = false;
          break;
        case "yesterday":
          createdAtFrom = moment().add(-1, "day").startOf("day").valueOf();
          createdAtTo = moment().add(-1, "day").endOf("day").valueOf();
          typeTime.type = "day";
          typeTime.presentView = false;

          isToday = false;
          break;
        case "lastWeek":
          createdAtFrom = moment().add(-1, "week").startOf("isoWeek").valueOf();
          createdAtTo = moment().add(-1, "week").endOf("isoWeek").valueOf();
          typeTime.type = "week";
          typeTime.presentView = false;
          isToday = false;
          break;
        case "lastMonth":
          createdAtFrom = moment().add(-1, "month").startOf("month").valueOf();
          createdAtTo = moment().add(-1, "month").endOf("month").valueOf();
          typeTime.type = "month";
          typeTime.presentView = false;
          isToday = false;
          break;
        case "thisYear":
          createdAtFrom = moment().startOf("year").valueOf();
          createdAtTo = moment().valueOf();
          typeTime.type = "year";
          isToday = false;
          break;
        default:
          break;
      }

      // trường hợp đứng năm này chọn "hôm qua, tuần trước, tháng trước" => ra thời gian năm trước
      const tempYear = moment(createdAtFrom).year();
      if (tempYear !== currentYear) {
        // tránh gọi lại handleFilter khi set lại year cho filter (vì nếu gọi lại sẽ chạy phần else phía dưới => sai filter)
        setTriggerHandleChange(false);
        // set lại năm cho filter
        setFilter({ ...filter, year: tempYear });
      }
    } else {
      const filterTime = moment().set("year", filter.year);

      createdAtFrom = filterTime.startOf("year").valueOf();
      createdAtTo = filterTime.endOf("year").valueOf();
      typeTime.type = "year";
      typeTime.presentView = false;
    }

    const variables = {
      selectedProduct,
      createdAtFrom,
      createdAtTo,
      typeTime,
      isToday,
    };
    return variables;
  };

  const handleChange = (name, value) => {
    setIsFirstRender(false);
    setTriggerHandleChange(true);
    // truong hop chon lai nam trung nam nay thi xet thoi gian la hom nay
    if (name === "year" && value === currentYear && filter.year !== value) {
      setFilter((prev) => ({ ...prev, [name]: value, time: "today" }));
    } else if (name === "keyword") setSelectedProduct(value);
    else {
      setFilter((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (!isFirstRender && triggerHandleChange)
      handleChangeFilter(handleFilter());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, selectedProduct, refreshData]);
  const filterTime = [
    {
      label: "Hôm nay",
      value: "today",
    },
    {
      label: "Hôm qua",
      value: "yesterday",
    },
    {
      label: "Tuần này",
      value: "thisWeek",
    },
    {
      label: "Tuần trước",
      value: "lastWeek",
    },
    {
      label: "Tháng này",
      value: "thisMonth",
    },
    {
      label: "Tháng trước",
      value: "lastMonth",
    },
    {
      label: "Năm nay",
      value: "thisYear",
    },
  ];

  const itemToMap = [
    {
      title: "",
      component: (
        <select
          onChange={(e) => {
            handleChange("year", Number(e.target.value));
          }}
          value={filter?.year}
          className="filterYear form-control"
        >
          {Array.from(Array(11).keys(), (x) => -(x - currentYear)).map(
            (value, idx) => (
              <option value={value} key={`${idx}-${value}`}>
                {value}
              </option>
            ),
          )}
        </select>
      ),
    },
    {
      title: "",
      hidden: filter.year !== currentYear,
      component: (
        <select
          onChange={(e) => {
            handleChange("time", e.target.value);
          }}
          value={filter?.time}
          className="filterMonth form-control"
        >
          {filterTime.map(({ label, value }, idx) => (
            <option value={value} key={idx + value}>
              {label}
            </option>
          ))}
        </select>
      ),
    },
  ];

  const mapFilterTop = (list) => (
    <>
      {list &&
        list.map((value, index) => {
          const { title, component } = value;
          return !value?.hidden ? (
            <div key={index}>
              {title ? (
                <div className="title">
                  <span className="mr-2">{title}</span>
                </div>
              ) : null}
              <div className="component">{component}</div>
            </div>
          ) : null;
        })}
    </>
  );

  return (
    <div className="filter-tong-quan d-flex column gx-3 py-3">
      <div className="top col-lg-4 col-md-6" style={{ marginRight: 30 }}>
        <Select
          isSearchable
          isClearable
          options={options}
          value={selectedProduct}
          onChange={(selectedOptions) => {
            handleChange("keyword", selectedOptions);
          }}
          placeholder="Chọn sản phẩm cần thống kê"
          getOptionLabel={(option) => (
            <div data-foo={option.dataFoo}>{option.label}</div>
          )}
          getOptionValue={(option) => option.value}
          filterOption={(option, inputValue) =>
            option.data.label.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      </div>
      <div
        className="top d-flex col-lg-4 col-md-6 align-items-center"
        style={{ gap: 25 }}
      >
        {mapFilterTop(itemToMap)}
      </div>
    </div>
  );
};

export default FilterReport;
