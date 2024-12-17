import DataTable from "react-data-table-component";
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import CustomLoader from "../../util/LoadingTable";
import ExpandedComponent from "./ExpandedComponent";
import NoRecords from "../../util/noData";

const DrugCancelTable = (props) => {
  const { drugcancels, dessert, expanded, loading } = props;
  const history = useHistory();
  const CustomMaterialMenu = (props) => {
    let { row } = props;
    return (
      <div className="dropdown">
        <Link to="#" data-bs-toggle="dropdown" className="btn btn-light">
          <i className="fas fa-ellipsis-h"></i>
        </Link>
        <div className="dropdown-menu active-menu">
          <button
            className="dropdown-item"
            onClick={(e) => {
              e.stopPropagation();
              let id = row._id;
              history.push(`/drugstore/${id}`);
            }}
          >
            <i className="fas fa-pencil"></i>
            <span style={{ marginLeft: "15px" }}>Chỉnh sửa</span>
          </button>
        </div>
      </div>
    );
  };

  const columns = [
    {
      name: "STT",
      selector: (row, index) => <b>{index + 1}</b>,
      reorder: true,
      width: "60px",
    },
    {
      name: "Tên sản phẩm",
      selector: (row) => row?.productInfo?.name,
      sortable: true,
      reorder: true,
      minWidth: "150px",
      grow: 3,
    },
    {
      name: "Nhóm sản phẩm",
      selector: (row) => row?.productInfo?.category,
      sortable: true,
      reorder: true,
      grow: 3,
    },
    {
      name: "Nhóm sản phẩm",
      selector: (row) => row?.productInfo?.categoryDrug,
      sortable: true,
      reorder: true,
      grow: 3,
    },
    {
      name: "Số lượng",
      selector: (row) =>
        row?.stock?.reduce((sum, item) => {
          return sum + item.count;
        }, 0),
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Đơn vị tính",
      selector: (row) => row?.productInfo?.unit,
      sortable: true,
      reorder: true,
      minWidth: "140px",
      grow: 2,
    },
    // {
    //     name: "Hành động",
    //     cell: row => <CustomMaterialMenu size="small" row={row} />,
    //     allowOverflow: true,
    //     button: true,
    //     width: '100px',
    // },
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
  const isExpanded = (row) => row.defaultExpanded;

  useEffect(() => {
    drugcancels?.map((item) => (item.defaultExpanded = expanded)); // eslint-disable-next-line
  }, [expanded]);

  const handleRowClicked = (row) => {
    history.push(`/drugstore/${row._id}`);
  };

  return (
    <>
      <DataTable
        // theme="solarized"
        columns={columns}
        data={drugcancels}
        noDataComponent={NoRecords()}
        customStyles={customStyles}
        defaultSortFieldId
        pagination
        onRowClicked={handleRowClicked}
        paginationComponentOptions={paginationComponentOptions}
        progressPending={loading}
        expandableRows
        expandableRowExpanded={isExpanded}
        expandableRowsComponent={(data) => (
          <ExpandedComponent data={data} dessert={dessert} />
        )}
        progressComponent={<CustomLoader />}
        highlightOnHover
        pointerOnHover
      />
    </>
  );
};
export default DrugCancelTable;
