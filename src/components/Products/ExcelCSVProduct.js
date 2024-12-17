import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { read, utils, writeFile } from "xlsx";
import { allProduct, importProduct } from "../../Redux/Actions/ProductActions";
import { PRODUCT_IMPORT_RESET } from "../../Redux/Constants/ProductConstants";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import Toast from "../LoadingError/Toast";
import { toast } from "react-toastify";
import DataTableProduct from "./DataTable";
import { listCategory } from "../../Redux/Actions/CategoryAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const ExcelCSVProductComponent = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState(null);
  const importProducts = useSelector((state) => state.productImport);
  const { loading, error, success } = importProducts;
  const productAll = useSelector((state) => state.productAll);
  const { productall } = productAll;
  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const history = useHistory();

  const categoryRef = useRef(null)

  useEffect(() => {
    if(categories){
      categoryRef.current = new Map(categories?.map((item) => [item.name, item]))
    }
  }, [categories])

  useEffect(() => {
    if (success) {
      toast.success("Nhập thành công", ToastObjects);
      dispatch({ type: PRODUCT_IMPORT_RESET });
      setData(null);
      dispatch(allProduct());
    } else if (!data) {
      dispatch(allProduct());
    }
  }, [success, dispatch, data]);

  useEffect(() => {
    dispatch(listCategory());
  }, [])



  const handleImport = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        const rowErrors = [];
        const dataNew = [];
        let rowIndex = 2;
        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          const cloneData = JSON.parse(JSON.stringify(rows));
          for (const item of cloneData) {


            const name = item?.['Tên sản phẩm']
                    ? item?.['Tên sản phẩm'].replace(/\s+/g, ' ').trim()
                    : ''
            const category = item?.['Nhóm hàng']
            ? item?.['Nhóm hàng'].replace(/\s+/g, ' ').trim()
            : ''

            const d = {
              name,
              errors: [],
            };
            if (!name) {
              d.errors.push("Tên không được để trống");
            }

            const isDuplicate = dataNew.some((item) => item?.['Tên sản phẩm'] === d?.name);
            if (isDuplicate) {
              d.errors.push("Tên sản phẩm bị trùng");
            }
            const isDuplicateName = productall.some(
              (item) => item?.name === d?.name,
            );
            if (isDuplicateName) {
              d.errors.push("Tên sản phẩm đã tồn tại");
            }

            if (!category) {
              d.errors.push("Nhóm hàng không được để trống");
            }

            if (!categoryRef.current.get(category)) {
              d.errors.push("Nhóm hàng không hợp lệ");
            }

            if (!item?.['Hạn sử dụng']) {
              d.errors.push("Hạn sử dụng không được để trống");
            }

            if (isNaN(item?.['Hạn sử dụng'])) {
              d.errors.push("Hạn sử dụng phải là số");
            }

            if (!item?.['Nhà sản xuất']) {
              d.errors.push("Tên nhà sản xuất không được để trống");
            }
            if (!item?.['Nước sản xuất']) {
              d.errors.push("Tên nước sản xuất không được để trống");
            }
           
            if (!item?.['Giá']) {
              d.errors.push("Giá không được để trống");
            }
            if (isNaN(item?.['Giá'])) {
              d.errors.push("Giá phải là số");
            }
           
            if (!d.errors.length) {
              dataNew.push({
                name ,
                brandName: item?.['Tên gọi khác'],
                category: categoryRef.current.get(category)?._id,
                categoryName: categoryRef.current.get(category)?.name,
                unit: item?.['Đơn vị tính'],
                price: item?.['Giá'],
                expDrug: item?.['Hạn sử dụng'],
                packing: item?.['Quy cách đóng gói'],
                ingredient: item?.['Thành phần'] ? `<p>${item?.['Thành phần']}</ p>` : null,
                manufacturer: item?.['Nhà sản xuất'],
                countryOfOrigin: item?.['Nước sản xuất'],
                description: item?.['Mô tả'] ? `<p>${item?.['Mô tả']}</ p>` : null,
                instruction: item?.['Hướng dẫn sử dụng']? `<p>${item?.['Hướng dẫn sử dụng']}</ p>` : null,
              });
            } else {
              rowErrors.push({
                name: `Sản phẩm tại dòng ${rowIndex}`,
                errors: d.errors,
              });
            }
            rowIndex++;
          }
          if (rowErrors.length > 0) {
            setErrors(rowErrors);
          } else {
            setErrors([])
            setData(dataNew);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const handleSave = (e) => {
    e.preventDefault();
    dispatch(importProduct(data));
  };
  const handleExport = () => {
    const headings = [
      [
        "Tên sản phẩm",
        "Tên gọi khác",
        "Nhóm hàng",
        "Đơn vị tính",
        "Giá",
        "Hạn sử dụng",
        "Quy cách đóng gói",
        "Thành phần",
        "Nhà sản xuất",
        "Nước sản xuất",
        "Mô tả",
        "Hướng dẫn sử dụng"
      ],
    ];

    const cloneData = JSON.parse(JSON.stringify(productall));
    const dataExport = cloneData.map((item) => {

      delete item?._id;

      return {
        name: item?.name,
        brandName: item?.brandName,
        category: item?.category?.name,
        unit: item?.unit,
        price: item?.price,
        expDrug: item?.expDrug,
        packing: item?.packing,
        ingredient: item?.ingredient?.replace(/<\/?[^>]+(>|$)/g, ""),
        manufacturer: item?.manufacturer,
        countryOfOrigin: item?.countryOfOrigin,
        description: item?.description?.replace(/<\/?[^>]+(>|$)/g, ""),
        instruction: item?.instruction?.replace(/<\/?[^>]+(>|$)/g, "")
      }
    });
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, dataExport, { origin: "A2", skipHeader: true });
    utils.book_append_sheet(wb, ws, "Report");
    writeFile(wb, "Report.xlsx");
  };

  return (
    <>
      <Toast />
      <section className="content-main">
        <div className="content-header">
        <div
              className="content-title d-flex"
              onClick={(e) => {
                e.preventDefault();
                history.push("/products");
              }}
            >
              <h4 className="arrow-breadcrum">
                <i className="fas fa-arrow-left"></i>
              </h4>
            </div>
          <div className="d-flex">
            <label
              className="form-label"
              style={{
                marginRight: "10px",
                paddingTop: "5px",
                fontWeight: "bold",
              }}
            >
              Nhập
            </label>
            <input
              type="file"
              name="file"
              className="form-control"
              id="inputGroupFile"
              required
              onChange={handleImport}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            {data && (
              <button
                onClick={(e) => handleSave(e)}
                className="btn btn-primary float-right"
                style={{
                  marginLeft: "10px",
                  paddingTop: "5px",
                  fontWeight: "bold",
                }}
              >
                Lưu
              </button>
            )}
            <a style={{
              fontSize: 12,
              marginLeft: 15
            }} href="/sample-import.xlsx" download className="download-link">
              Download Sample PDF
            </a>

          </div>
          <div>
            <button
              onClick={handleExport}
              classsName="btn btn-primary float-right"
            >
              Xuất <i className="fa fa-download"></i>
            </button>
          </div>
        </div>

        <div className="card card-custom mb-4 shadow-sm">
          <header className="card-header bg-white ">
            <div className="row gx-3 py-3">
              {loading ? <Loading /> : error ? <Message>{error}</Message> : ""}
              {errors?.length ? (
                <DataTableProduct errors={errors} unShowSetting={true} />
              ) : data?.length ? (
                <DataTableProduct isImport products={data} unShowSetting={true} />
              ) : (
                <DataTableProduct products={productall} unShowSetting={true} />
              )}
            </div>
          </header>
        </div>
      </section>
    </>
  );
};

export default ExcelCSVProductComponent;
