/* eslint-disable no-nested-ternary */
import moment from "moment";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReportEvent from "../Reports/ReportImportExport";
import FilterReport from "../Reports/FilterReport/FilterReport";

const DashboardChart = () => {
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

  const [isToday, setIsToday] = useState(false);

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

  const handleChangeFilter = (filterTongQuan) => {
    const { selectedProduct, createdAtFrom, createdAtTo, typeTime, isToday } =
      filterTongQuan;
    setKeyword(selectedProduct?.value);
    setTimeType(typeTime.type);
    setPresentView(typeTime.presentView);
    setCurrenFilter({ createdAtFrom, createdAtTo });
    setIsToday(isToday);
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

  // const handleRefresh = () => {
  //   if (presentView) {
  //     const newTimeClickRefresh = moment()
  //     const timer = newTimeClickRefresh.diff(
  //       previousClickRefresh.current,
  //       "seconds"
  //     )
  //     if (timer < 5) {
  //       messageToast.error({
  //         message: `You just updated data ${timer} seconds ago`
  //       })
  //     } else {
  //       previousClickRefresh.current = newTimeClickRefresh
  //       setRefreshData(!refreshData)
  //     }
  //   }
  // }

  useEffect(() => {
    const prevTitle = window.document.title;
    window.document.title = "Equipment Dashboard";

    return () => {
      window.document.title = prevTitle;
    };
  }, []);


  return (
    <>
      <section className="content-main chart-event" ref={chartContainerDomRef}>
        <div className="content-header">
          <h2 className="content-title">Thống kê nhập xuất</h2>
        </div>

        <div className="card card-custom mb-4 shadow-sm">
          <header className="card-header bg-aliceblue ">
            <FilterReport
              handleChangeFilter={handleChangeFilter}
              refreshData={refreshData}
            />
          </header>

          <div className="card-body">
            <ReportEvent
              keyword={keyword}
              from={currentFilter?.createdAtFrom}
              to={currentFilter?.createdAtTo}
              refresh={refreshData}
              isToday={isToday}
              typeTime={timeType}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardChart;
