// import moment from 'moment/moment';
import DataTable from "react-data-table-component";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomLoader from "../../util/LoadingTable";
import NoRecords from "../../util/noData";
import moment from "moment";
import formatCurrency from "../../util/formatCurrency";

const DataTableImport = (props) => {
  const { products, loading, errors } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);

  const columns = [
    {
      name: "Mã hóa đơn",
      selector: (row) => row?.importCode,
      sortable: true,
      reorder: true,
      cell: (row) => (
        <a
          // href={`/import-stock/${row?._id}`}
          className="link-code"
          onClick={() => {
            history.push(`/import-stock/${row?._id}`)
          }}
        >
          {row?.importCode}
        </a>
      ),
    },
    {
      name: "Ngày nhập",
      selector: (row) => moment(row?.importedAt).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Người nhập",
      selector: (row) => row?.user?.name,
      sortable: true,
      reorder: true,
    },
    {
      name: "Trạng thái",
      selector: (rows) =>
        rows?.status === true ? (
          <span className="badge bg-success text-white">Đã hoàn tất</span>
        ) : (
          <span className="badge bg-danger text-white">Chưa duyệt</span>
        ),
      sortable: true,
      reorder: true,
      sortFunction: (exportStock) => {
        return [exportStock].map((a, b) => {
          const fieldA = a?.status;
          const fieldB = b?.status;
          let comparison = 0;

          if (fieldA === fieldB) {
            comparison = 0;
          } else if (fieldA === true) {
            comparison = 1;
          } else {
            comparison = -1;
          }

          return comparison;
        });
      },
      grow: 1,
    },
    {
      name: "Thành tiền",
      selector: (row) => formatCurrency(row?.totalPrice + row?.totalVAT - row?.totalDiscount),
      sortable: true,
      reorder: true,
    },
  ];
  const columsErrors = [
    {
      name: "Thứ tự",
      selector: (row, index) => <p>{row?.name}</p>,
      sortable: true,
      reorder: true,
      minWidth: "180px",
    },
    {
      name: "Lỗi",
      selector: (row) => (
        <div style={{ color: "red" }}>
          {row?.errors.map((error) => (
            <p>{error}</p>
          ))}
        </div>
      ),
    },
  ];
  const paginationComponentOptions = {
    selectAllRowsItem: true,
    selectAllRowsItemText: "ALL",
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

  return (
    <>
        <div className="card card-custom mb-4 shadow-sm">
          <header className="card-header bg-aliceblue ">
            <div className="row gx-3 py-3">
              <div className="col-lg-12 col-md-12 me-auto ">
                <h5>Đơn nhập gần đây</h5>
              </div>  
            </div>
          </header>

          <div>
          <DataTable
            // theme="solarized"
            columns={products ? columns : columsErrors}
            data={products || errors}
            noDataComponent={NoRecords()}
            customStyles={customStyles}
            defaultSortFieldId
            pagination
            // onRowClicked={handleRowClicked}
            // conditionalRowStyles={dessert ? conditionalRowStyles : ''}
            paginationComponentOptions={paginationComponentOptions}
            progressPending={loading}
            progressComponent={<CustomLoader />}
            highlightOnHover
            pointerOnHover
          />
          </div>
        </div>
     
    </>
  );
};
export default DataTableImport;
