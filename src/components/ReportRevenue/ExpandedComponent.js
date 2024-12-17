import React from "react";
import moment from "moment";
import DataTable from "react-data-table-component";
import NoRecords from "../../util/noData";
import formatCurrency from "../../util/formatCurrency";
const ExpandedComponent = (props) => {
  const { data } = props;
  const columns = [
    {
      name: "STT",
      selector: (row, index) => <b>{index + 1}</b>,
      reorder: true,
    },
    {
      name: "Số lô",
      selector: (row) => `${row?.lotNumber}`,
      sortable: true,
      reorder: true,
    },
    {
      name: "Số lượng",
      selector: (row) => row?.quantity,
      sortable: true,
    },
    {
      name: "Ngày nhập",
      selector: (row) => row?.date ? moment(row?.date).format("DD-MM-YYYY") : '--/--/----',
      sortable: true,
      minWidth: "180px",
    },
    {
      name: "Giá",
      selector: (row) => formatCurrency(row?.price),
      sortable: true,
    },
  ];



  const customStyles = {
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: "rgb(230, 244, 244)",
        borderBottomColor: "#FFFFFF",
        // borderRadius: '25px',
        outline: "1px solid #FFFFFF",
      },
      style: {
        minHeight: "32px",
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
        minHeight: "40px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
      },
    },
  };

  return (
    <div style={{ paddingBottom: "1rem" }}>
      <div className="row">
        <div className="card card-custom mb-4 shadow-sm">
          <header className="card-header bg-white ">
            <DataTable
              // theme="solarized"
              columns={columns}
              data={data?.data?.batches}
              noDataComponent={NoRecords()}
              customStyles={customStyles}
              defaultSortFieldId
              highlightOnHover
              pointerOnHover
            />
          </header>
        </div>
      </div>
    </div>
  );
};
export default ExpandedComponent;
