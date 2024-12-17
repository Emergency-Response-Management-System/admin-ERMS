import React, { useState, useEffect, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Toast from "./../LoadingError/Toast";
import { toast } from "react-toastify";
import Message from "../LoadingError/Error";
import Loading from "../LoadingError/Loading";
import renderToast from "../../util/Toast";
import formatCurrency from "./../../util/formatCurrency";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";

//! Modal
import MyVerticallyCenteredModalUnit from "./Modal/ModalUnit";
import MyVerticallyCenteredModalAPI from "./Modal/ModalActivePharma";
import MyVerticallyCenteredModalManufacturer from "./Modal/ModalManufacturer";
import MyVerticallyCenteredModalCountry from "./Modal/ModalCountry";
//! Action
import {
  singleProduct,
  updateProduct,
} from "../../Redux/Actions/ProductActions";
import { listCategory } from "./../../Redux/Actions/CategoryAction";
import { listCategoryDrug } from "../../Redux/Actions/CategoryDrugAction";
import { listUnit } from "./../../Redux/Actions/UnitAction";
import { listCountry } from "./../../Redux/Actions/CountryOfOriginAction";
import { listAPI } from "./../../Redux/Actions/ActivePharmaAction";
import { listManufacturer } from "./../../Redux/Actions/ManufacturerAction";
//! Constant
import { PRODUCT_SINGLE_RESET, PRODUCT_UPDATE_RESET } from "../../Redux/Constants/ProductConstants";
import {
  UNIT_CREATE_RESET,
  UNIT_DELETE_RESET,
} from "../../Redux/Constants/UnitConstants";
import {
  MANUFACTURER_CREATE_RESET,
  MANUFACTURER_DELETE_RESET,
} from "../../Redux/Constants/ManufacturerConstants";
import {
  COUNTRY_CREATE_RESET,
  COUNTRY_DELETE_RESET,
} from "../../Redux/Constants/CountryOfOriginConstants";
import {
  API_CREATE_RESET,
  API_DELETE_RESET,
} from "../../Redux/Constants/ActivePharmaConstants";
import { backendUrlFile } from "../../util/fileUploader";

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};

const EditProductMain = (props) => {
  const { productId } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const [isStop, setIsStop] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [modalShowUnit, setModalShowUnit] = useState(false);
  const [modalShowManufacturer, setModalShowManufacturer] = useState(false);
  const [modalShowCountry, setModalShowCountry] = useState(false);
  const [modalShowActivePharma, setModalShowActivePharma] = useState(false);
  const [images, setImages] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(false)
  const [flag, setFlag] = useState(false);
  const [data, setData] = useState({
    name: "",
    regisId: "",
    unit: "",
    expDrug: 0,
    packing: "",
    brandName: "",
    manufacturer: "",
    countryOfOrigin: "",
    instruction: "",
    price: "",
    prescription: true,
    description: "",
    image: [],
    allowToSell: true,
    ingredient: ""
  });
 
  const handleChange = (e) => {
    let formattedPrice = price;
    if (e.target.name === "price") {
      formattedPrice = e.target.value.replace(/\D/g, "");
    }
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
        price: formattedPrice,
      };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (images.length === 0) {
    //   return toast.error("Chưa chọn file.", ToastObjects);
    // }
    // if (product?.image.length < 1 && images.length < 1) {
    //   toast.error("Hình ảnh không được bỏ trống", ToastObjects);
    //   return;
    // }
    const imgNewFiles = images.filter((img) => img.name);
    const imgOldURL = images.filter((img) => !img.name);

    if (imgNewFiles) {
      for (const image of imgNewFiles) {
        const formData = new FormData();
        formData.append("image", image);
        const { data: dataUp } = await axios.post(
          `/api/products/single`,
          formData
        );
        imgOldURL.push(`${backendUrlFile.image}/${dataUp.filename}`);
      }
      data.image = imgOldURL;
    }

    dispatch(
      updateProduct({
        ...data,
        unit: data?.unit?.value,
        category: data?.category?.value,
        categoryDrug: data?.categoryDrug?.value,
        manufacturer: data?.manufacturer?.value,
        countryOfOrigin: data?.countryOfOrigin?.value,
        productId,
      })
    );
  };
  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;
  const categoryDrugList = useSelector((state) => state.categoryDrugList);
  const { categoriesDrug } = categoryDrugList;

  const categoriesOption = [];
  if (categories?.length > 0) {
    categories.map((item) => {
      categoriesOption.push({
        value: item._id,
        label: item.name,
      });
    });
  }

  const categoriesDrugOption = [];
  if (categoriesDrug?.length > 0) {
    categoriesDrug.map((item) => {
      categoriesDrugOption.push({
        value: item._id,
        label: item.name,
      });
    });
  }

  const productEdit = useSelector((state) => state.productSingle);
  const { loading, error, product } = productEdit;

  console.log({
    product
  })

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  //! UNIT
  const unitList = useSelector((state) => state.unitList);
  const { error: errorUnit, units } = unitList;

  const unitCreated = useSelector((state) => state.unitCreate);
  const {
    loading: loadingUnitCreate,
    error: errorUnitCreate,
    success: successUnitCreate,
  } = unitCreated;

  const unitDeleted = useSelector((state) => state.unitDelete);
  const {
    loading: loadingUnitDelete,
    error: errorUnitDelete,
    success: successUnitDelete,
  } = unitDeleted;

  const unitsOption = [];
  if (units?.length > 0) {
    units.map((item) => {
      unitsOption.push({
        value: item,
        label: item,
      });
    });
  }
  //! MANUFACTURER
  const manufacturerList = useSelector((state) => state.manufacturerList);
  const { error: errorManufacturer, manufacturers } = manufacturerList;

  const manufacturerCreated = useSelector((state) => state.manufacturerCreate);
  const {
    loading: loadingManufacturerCreate,
    error: errorManufacturerCreate,
    success: successManufacturerCreate,
  } = manufacturerCreated;

  const manufacturerDeleted = useSelector((state) => state.manufacturerDelete);
  const {
    loading: loadingManufacturerDelete,
    error: errorManufacturerDelete,
    success: successManufacturerDelete,
  } = manufacturerDeleted;

  const manufacturersOption = [];
  if (manufacturers?.length > 0) {
    manufacturers.map((item) => {
      manufacturersOption.push({
        value: item,
        label: item,
      });
    });
  }
  //! COUNTRY OF ORIGIN
  const countryList = useSelector((state) => state.countryList);
  const { error: errorCountry, countries } = countryList;

  const countryCreated = useSelector((state) => state.countryCreate);
  const {
    loading: loadingCountryCreate,
    error: errorCountryCreate,
    success: successCountryCreate,
  } = countryCreated;

  const countryDeleted = useSelector((state) => state.countryDelete);
  const {
    loading: loadingCountryDelete,
    error: errorCountryDelete,
    success: successCountryDelete,
  } = countryDeleted;

  const countriesOption = [];
  if (countries?.length > 0) {
    countries.map((item) => {
      countriesOption.push({
        value: item,
        label: item,
      });
    });
  }

  //! ACTIVE PHARMA INGREDIENT (API)
  const APIList = useSelector((state) => state.APIList);
  const { error: errorAPI, API_item } = APIList;

  const APICreated = useSelector((state) => state.APICreate);
  const {
    loading: loadingAPICreate,
    error: errorAPICreate,
    success: successAPICreate,
  } = APICreated;

  const APIDeleted = useSelector((state) => state.APIDelete);
  const {
    loading: loadingAPIDelete,
    error: errorAPIDelete,
    success: successAPIDelete,
  } = APIDeleted;

  const API_itemOption = [];
  if (API_item?.length > 0) {
    API_item.map((item) => {
      API_itemOption.push({
        value: item,
        label: item,
      });
    });
  }

  const {
    name,
    price,
    brandName,
    packing,
    expDrug,
  } = data;

  const handleUploadInput = (e) => {
    let newImages = [];
    let num = 0;
    const files = [...e.target.files];

    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return toast.error("File có kích thước quá 1MB.", ToastObjects);

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return toast.error("File không đúng định dạng.", ToastObjects);
      else {
        num += 1;
        if (num <= 5) newImages.push(file);
        else toast.error("Chỉ chọn tối đa 5 ảnh.", ToastObjects);
        return newImages;
      }
    });
    if (images.length + newImages.length <= 5)
      setImages([...images, ...newImages]);
    else toast.error("Chỉ chọn tối đa 5 ảnh.", ToastObjects);
  };
  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };
 
  const [itemProducts, setItemProducts] = useState([])

  useEffect(() => {
    dispatch(listUnit());
    dispatch(listCategory());
    dispatch(listCategoryDrug());
    dispatch(listManufacturer());
    dispatch(listCountry());
    dispatch(listAPI());
    if (successUpdate) {
      dispatch({
        type: PRODUCT_UPDATE_RESET,
      });
      dispatch(singleProduct(productId));
      toast.success("sản phẩm đã được cập nhật", ToastObjects);
    }
    if (successUnitCreate) {
      toast.success("Đơn vị tính đã được thêm", ToastObjects);
      dispatch({ type: UNIT_CREATE_RESET });
    }
    if (successUnitDelete) {
      toast.success("Đơn vị tính đã được xóa", ToastObjects);
      dispatch({ type: UNIT_DELETE_RESET });
    }
    if (successManufacturerCreate) {
      toast.success("Nhà cung cấp đã được thêm", ToastObjects);
      dispatch({ type: MANUFACTURER_CREATE_RESET });
    }
    if (successManufacturerDelete) {
      toast.success("Nhà cung cấp đã được xóa", ToastObjects);
      dispatch({ type: MANUFACTURER_DELETE_RESET });
    }
    if (successCountryCreate) {
      toast.success("Nước sản xuất đã được thêm", ToastObjects);
      dispatch({ type: COUNTRY_CREATE_RESET });
    }
    if (successCountryDelete) {
      toast.success("Nhà sản xuất đã được xóa", ToastObjects);
      dispatch({ type: COUNTRY_DELETE_RESET });
    }
    if (successAPICreate) {
      toast.success("Hoạt chất đã được thêm", ToastObjects);
      dispatch({ type: API_CREATE_RESET });
    }
    if (successAPIDelete) {
      toast.success("Hoạt chất đã được xóa", ToastObjects);
      dispatch({ type: API_DELETE_RESET });
    }
    if (product._id !== productId) {
      dispatch(singleProduct(productId));
      // setFlag(true);
    } else if (product._id === productId && !flag && !isEdited) {
      setData({
        name: product.name,
        regisId: product.regisId,
        category: {
          value: product?.category?._id,
          label: product?.category?.name,
        },
        categoryDrug: {
          value: product?.categoryDrug?._id,
          label: product?.categoryDrug?.name,
        },
        brandName: product.brandName,
        price: product.price.toString(),
        unit: {
          value: product?.unit,
          label: product?.unit,
        },
        expDrug: product.expDrug,
        packing: product.packing,
        APIs: product?.APIs,
        manufacturer: {
          value: product?.manufacturer,
          label: product?.manufacturer,
        },
        countryOfOrigin: {
          value: product?.countryOfOrigin,
          label: product?.countryOfOrigin,
        },
        instruction: product.instruction,
        description: product.description,
        ingredient: product.ingredient,
        image: product?.image,
        prescription: product.prescription,
        allowToSell: product.allowToSell,
      });

      if (itemProducts.length === 0 && !isEdited) {
        setItemProducts(JSON.parse(JSON.stringify({
          title: 'APIs'
        })));
      } else {
        setFlag(true);
      }
      setImages(data.image);
    }
    // eslint-disable-next-line
  }, [
    product,
    flag,
    itemProducts,
    dispatch,
    productId,
    isEdited,
    successUpdate,
    successUnitCreate,
    successUnitDelete,
    successManufacturerCreate,
    successManufacturerDelete,
    successCountryCreate,
    successCountryDelete,
    successAPICreate,
    successAPIDelete,
  ]);
  console.log({
    data
  })

  return (
    <>
      <Toast />
      <MyVerticallyCenteredModalUnit
        data={units}
        show={modalShowUnit}
        loading={loadingUnitCreate || loadingUnitDelete}
        onHide={() => setModalShowUnit(false)}
      />

      <MyVerticallyCenteredModalManufacturer
        data={manufacturers}
        show={modalShowManufacturer}
        loading={loadingManufacturerCreate || loadingManufacturerDelete}
        onHide={() => setModalShowManufacturer(false)}
      />

      <MyVerticallyCenteredModalCountry
        data={countries}
        show={modalShowCountry}
        loading={loadingCountryCreate || loadingCountryDelete}
        onHide={() => setModalShowCountry(false)}
      />

      <MyVerticallyCenteredModalAPI
        data={API_item}
        show={modalShowActivePharma}
        loading={loadingAPICreate || loadingAPIDelete}
        onHide={() => setModalShowActivePharma(false)}
      />
      <section className="content-main">
        <form onSubmit={handleSubmit}>
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
              <h4>Cập nhật sản phẩm</h4>
            </div>
          </div>

          <div className="mb-4">
            <div className="">
              <div className="card card-custom mb-4">
                <div className="card-body">
                  {loading ? (
                    <Loading />
                  ) : error ||
                    errorUnit ||
                    errorUnitCreate ||
                    errorUnitDelete ||
                    errorManufacturer ||
                    errorCountry ||
                    errorManufacturerCreate ||
                    errorManufacturerDelete ||
                    errorCountryCreate ||
                    errorCountryDelete ||
                    errorAPI ||
                    errorAPICreate ||
                    errorAPIDelete ? (
                    <Message>
                      {error || errorUnit || errorUnitCreate || errorUnitDelete}
                    </Message>
                  ) : (
                    ""
                  )}
                  {/* //! tên sản phẩm - tên sản phẩm - số đăng ký */}
                  <div className="mb-4 form-divided-3">
                    <div>
                      <label htmlFor="name_drug" className="form-label">
                        Tên sản phẩm
                      </label>
                      <input
                        onChange={handleChange}
                        value={name}
                        name="name"
                        type="text"
                        placeholder="Nhập tên sản phẩm"
                        className="form-control"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="brandName" className="form-label">
                        Tên gọi khác
                      </label>
                      <input
                        onChange={handleChange}
                        value={data?.brandName}
                        name="brandName"
                        type="text"
                        placeholder="Nhập tên gọi khác"
                        className="form-control"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="product_category" className="form-label">
                        Nhóm hàng
                      </label>
                      <Select
                        isSearchable
                        isClearable
                        options={categoriesOption}
                        value={data?.category}
                        onChange={(selectedOptions) =>
                          setData((prev) => ({
                            ...prev,
                            category: selectedOptions,
                          }))
                        }
                        placeholder="Chọn nhóm hàng"
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="card card-custom mb-4">
              <div className="card-body">
                {/* // ! (đơn vị tính - giá - quy cách đóng gói) - (hoạt chất -hàm lượng)*/}
                <div className="mb-4 form-divided-custom-2">
                  <div className="d-block">
                    <div className="d-flex align-items-end mb-4">
                      <div style={{ flexGrow: "1" }}>
                        <label htmlFor="unit" className="form-label">
                          Đơn vị tính
                        </label>
                        <Select
                          isSearchable
                          isClearable
                          options={unitsOption}
                          value={data?.unit}
                          onChange={(selectedOptions) =>
                            setData((prev) => ({
                              ...prev,
                              unit: selectedOptions,
                            }))
                          }
                          placeholder="Chọn đơn vị tính"
                          getOptionLabel={(option) => option.label}
                          getOptionValue={(option) => option.value}
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: "10px",
                          transform: "translateY(-3px)",
                        }}
                      >
                        <button
                          className="circle-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            setModalShowUnit(true);
                          }}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="mb-4 form-divided-2">
                      <div>
                        <label htmlFor="product_price" className="form-label">
                          Giá 
                        </label>
                        <input
                          name="price"
                          onChange={handleChange}
                          value={formatCurrency(data?.price)}
                          type="text"
                          placeholder="100.000"
                          className="form-control"
                          id="product_price"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="product_category_drug"
                          className="form-label"
                        >
                          Hạn sử dụng (tháng)
                        </label>
                        <input
                          onChange={handleChange}
                          value={data?.expDrug}
                          name="expDrug"
                          type="number"
                          placeholder="Nhập hạn sử dụng"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="product_packing" className="form-label">
                        Quy cách đóng gói
                      </label>
                      <input
                        name="packing"
                        onChange={handleChange}
                        value={data?.packing}
                        type="text"
                        placeholder="1 Hộp = 10 Vĩ ..."
                        className="form-control"
                        id="product_packing"
                        required
                      />
                    </div>
                  </div>
                  <div>
                  <div>
                    <label className="form-label">Thành phần</label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={data?.ingredient || ''}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "190px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                      }}
                      onChange={(event, editor) => {
                        const demo = editor.getData();
                        setData({ ...data, ingredient: demo });
                      }}
                    />
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="card card-custom mb-4">
              <div className="card-body">
                {/* // ! nhà sản xuất và nước sản xuất */}
                <div className="mb-4 form-divided-2">
                  <div className="d-flex align-items-end">
                    <div style={{ flexGrow: "1" }}>
                      <label htmlFor="unit" className="form-label">
                        Nhà sản xuất
                      </label>
                      <Select
                        isSearchable
                        isClearable
                        options={manufacturersOption}
                        value={data?.manufacturer}
                        onChange={(selectedOptions) =>
                          setData((prev) => ({
                            ...prev,
                            manufacturer: selectedOptions,
                          }))
                        }
                        placeholder="Chọn nhà sản xuất"
                        getOptionLabel={(option) => option?.label}
                        getOptionValue={(option) => option?.value}
                      />
                    </div>
                    <div
                      style={{
                        marginLeft: "10px",
                        transform: "translateY(-3px)",
                      }}
                    >
                      <button
                        className="circle-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalShowManufacturer(true);
                        }}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="d-flex align-items-end">
                    <div style={{ flexGrow: "1" }}>
                      <label htmlFor="unit" className="form-label">
                        Nước sản xuất
                      </label>
                      <Select
                        isSearchable
                        isClearable
                        options={countriesOption}
                        value={data?.countryOfOrigin}
                        onChange={(selectedOptions) =>
                          setData((prev) => ({
                            ...prev,
                            countryOfOrigin: selectedOptions,
                          }))
                        }
                        placeholder="Chọn nước sản xuất"
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                      />
                    </div>
                    <div
                      style={{
                        marginLeft: "10px",
                        transform: "translateY(-3px)",
                      }}
                    >
                      <button
                        className="circle-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalShowCountry(true);
                        }}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
                {/* // ! mô tả - lời chỉ dẫn */}
                <div className="mb-4 form-divided-1">
                  <div className="mt-2">
                    <label className="form-label">Mô tả</label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={data?.description || ''}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "350px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                      }}
                      onChange={(event, editor) => {
                        const demo = editor.getData();
                        setData({ ...data, description: demo });
                      }}
                    />
                  </div>
                  <div className="mt-2">
                    <label className="form-label">Hướng dẫn sử dụng</label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={data?.instruction || ''}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "350px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                      }}
                      onChange={(event, editor) => {
                        const demo = editor.getData();
                        setData({ ...data, instruction: demo });
                      }}
                    />
                  </div>
                </div>
                {/* // ! ảnh - cho phép bán */}
                <div className="mb-4 form-divided-2">
                  <div>
                    <div className="mb-3">
                      <label className="form-label">
                        Hình ảnh (tối đa 5 ảnh)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="uploadFile"
                        onChange={handleUploadInput}
                        multiple
                        accept="image/*"
                      />
                    </div>
                    <div className="row img-up">
                      {images?.map((img, index) => (
                        <div key={index} className="file_img my-1">
                          <img
                            src={img?.name ? URL.createObjectURL(img) : img}
                            alt=""
                            className="img-thumbnail rounded"
                          />

                          <span onClick={() => deleteImage(index)}>X</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary mb-4"
                    style={{ float: "right" }}
                  >
                    Lưu lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EditProductMain;
