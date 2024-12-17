import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chartImportExport } from "../../../Redux/Actions/InventoryAction";
import { Column } from "@ant-design/charts";
import Loading from "../../LoadingError/Loading";
import Message from "../../LoadingError/Error";
import NoRecords from "../../../util/noData";

const ReportEvent = React.memo(({ keyword, from, to, isToday, typeTime }) => {
  const dispatch = useDispatch();
  const tagInventoryStock = useSelector((state) => state.chartImportExport);
  const { loading, error, dataChart } = tagInventoryStock;

  useEffect(() => {
    if (keyword !== "all") {
      dispatch(chartImportExport(keyword, from, to, typeTime));
    }
  }, [dispatch, keyword, from, to, isToday, typeTime]);

  return loading ? (
    <div style={{ marginTop: 10, marginLeft: 50 }}>
      {loading ? <Loading /> : error ? <Message>{error}</Message> : ""}
    </div>
  ) : (
    <>
      {dataChart ? (
        <div className="groupItem">
          {Object.entries(dataChart)?.map(([key, value], index) => {
            const hasData = value?.some((d) => d.value > 0);
            return (
              <>
                {hasData ? (
                  <div
                    className={`${key === "day" && value?.length / 3 >= 28 ? "card-wrapper-long" : ""}`}
                  >
                    <div className="card-wrapper">
                      <div className="title-chart">
                        <span>{`Dữ liệu nhập xuất theo ${key === "quarter" ? "quý" : key === "month" ? "tháng" : "ngày"}`}</span>
                      </div>
                      <div className="statistic" key={index}>
                        <div className="chart-overview">
                          <Column
                            data={value}
                            isGroup
                            xField="time"
                            yField="value"
                            seriesField="name"
                            color={["#5789FD", "#FFC917", "#F6534F"]}
                            xAxis={{
                              label: {
                                rotate: -95,
                                offsetX: -10,
                                offsetY: 10,
                              },
                            }}
                            label={{
                              position: "top",
                              offsetY: 10,
                            }}
                            legend={{
                              position: "top",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card-wrapper">
                    <div className="title-chart">
                      <span>{`Dữ liệu nhập xuất theo ${key === "quarter" ? "quý" : key === "month" ? "tháng" : "ngày"}`}</span>
                    </div>
                    <div className="statistic" key={index}>
                      <div className="chart-overview">
                        <div className="info">No data to show</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          {NoRecords("vui lòng chọn thông tin để thống kê")}
        </div>
      )}
    </>
  );
});

export default ReportEvent;
