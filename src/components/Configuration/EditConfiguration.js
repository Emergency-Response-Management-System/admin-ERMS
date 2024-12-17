import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCategory,
} from "../../Redux/Actions/CategoryAction";
import Loading from "../LoadingError/Loading";
import Message from "../LoadingError/Error";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrlFile } from "../../util/fileUploader";
import { singleConfiguration, updateConfiguration } from "../../Redux/Actions/ConfigurationAction";
const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const EditConfiguration = (props) => {
  
  const dispatch = useDispatch();
  const [fileLogo, setImgLogo] = useState(null);
  const [fileAvatar, setImgAvatar] = useState(null);
  const [fileLogin, setImgLogin] = useState(null);
  
  const [data, setData] = useState({
    nameWeb: "", 
    logo: "",
    avatarDefault: "",
    backgroundLogin: "",
    colorDefault: "",
    quantityWarning: 30,
    quantityDate: 30
  });


  useEffect(() => {
    dispatch(singleConfiguration());
  }, []);
  
  const configurationUpdate = useSelector((state) => state?.configurationUpdate);
  const {
    loading: loadingconfigurationUpdate,
    error: errorconfigurationUpdate,
    success: successconfigurationUpdate,
    configurationUpdate: categoryconfigurationUpdate,
  } = configurationUpdate;

  const configurationSingle = useSelector((state) => state?.configurationSingle);

  const {
    loading: loadingconfigurationSingle,
    error: errorconfigurationSingle,
    success: successconfigurationSingle,
    configurationSingle: dataconfigurationSingle,
  } = configurationSingle;

  const handleChange = (e) => {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
 
  const hanldeEdit = async (e) => {
    e.preventDefault();
    if (!nameWeb) {
      toast.error("Tên không được bỏ trống", ToastObjects);
      return;
    }
    if (fileLogo) {
      const formData = new FormData();
      formData.append("image", fileLogo);
      const { data: dataUp } = await axios.post(
        `/api/configuration/single`,
        formData,
      );
      data.logo = `${backendUrlFile.image}/${dataUp.filename}`;
    }
    if (fileAvatar) {
      const formData = new FormData();
      formData.append("image", fileAvatar);
      const { data: dataUp } = await axios.post(
        `/api/configuration/single`,
        formData,
      );
      data.avatarDefault = `${backendUrlFile.image}/${dataUp.filename}`;
    }
    if (fileLogin) {
      const formData = new FormData();
      formData.append("image", fileLogin);
      const { data: dataUp } = await axios.post(
        `/api/configuration/single`,
        formData,
      );
      data.backgroundLogin = `${backendUrlFile.image}/${dataUp.filename}`;
    }
    dispatch(updateConfiguration({ ...data }));
    
  };

  useEffect(() => {
    if (configurationSingle) {
      setData({
       nameWeb: dataconfigurationSingle?.nameWeb,
       logo: dataconfigurationSingle?.logo,
       avatarDefault: dataconfigurationSingle?.avatarDefault,
       backgroundLogin: dataconfigurationSingle?.backgroundLogin,
       colorDefault: dataconfigurationSingle?.colorDefault,
       quantityWarning: dataconfigurationSingle?.quantityWarning,
       quantityDate: dataconfigurationSingle?.quantityDate
      });
    } else {
      setData({
        nameWeb: "",
        logo: "",
        avatarDefault: "",
        backgroundLogin: "",
        colorDefault: "",
        quantityWarning: 30,
        quantityDate: 30
      });
    }

    if (successconfigurationUpdate) {
      props.parentCallbackUpdate(categoryconfigurationUpdate);
      dispatch(singleConfiguration())
    }
  }, [successconfigurationUpdate, dataconfigurationSingle, props]);

  const { logo, nameWeb, avatarDefault, quantityWarning, quantityDate, backgroundLogin, colorDefault  } = data;
  return (
    <div className="col-md-12 col-lg-8">
      {loadingconfigurationUpdate || loadingconfigurationSingle ? (
        <Loading />
      ) : errorconfigurationSingle || errorconfigurationUpdate ? (
        <Message>{errorconfigurationSingle || errorconfigurationUpdate}</Message>
      ) : (
        ""
      )}
      <form>
        <div style={{
          maxWidth: 400
        }} className="mb-4">
          <label htmlFor="website_name" className="form-label">
            Tên trang web
          </label>
          <input
            type="text"
            placeholder="Nhập tên trang web"
            className="form-control"
            id="website_name"
            required
            value={nameWeb}
            name="nameWeb"
            onChange={handleChange}
          />
        </div>
      
        <div style={{
          maxWidth: 400
        }} className="mb-4">
          <label className="form-label">Logo</label>
          <input
            id="uploadFile"
            required={logo ? false : true}
            onChange={(e) => {
              setData((prev) => ({ ...prev, logo: null }));
              if (
                e.target.files[0].type !== "image/jpeg" &&
                e.target.files[0].type !== "image/jpeg"
              ) {
                toast.error("File không đúng định dạng.", ToastObjects);
                return;
              }
              setImgLogo(e.target.files[0]);
            }}
            className="form-control"
            type="file"
          />
          {(logo || fileLogo) && (
            <div style={{
              position: 'relative',
              maxWidth: 250,
              maxHeight: 250
            }}>
              <img
                src={logo ? logo : URL.createObjectURL(fileLogo)}
                alt="Product"
                className="mt-3"
                style={{ width: "250px", marginTop: "5px", height: 250 }}
              />
              <span
                className="delete-button"
                style={{
                  top: -26,
                  right: 0
       
                }}      
                onClick={(e) => {
                  setImgLogo(null);
                  setData((prev) => ({ ...prev, logo: null }));
                  document.getElementById("uploadFile").value = "";
                }}
              >
                &times;
              </span>
            </div>
          )}
        </div>

        <div style={{
          maxWidth: 400
        }} className="mb-4">
          <label className="form-label">Avatar mặc định</label>
          <input
            id="uploadFileAvatar"
            required={avatarDefault ? false : true}
            onChange={(e) => {
              setData((prev) => ({ ...prev, avatarDefault: null }));
              if (
                e.target.files[0].type !== "image/jpeg" &&
                e.target.files[0].type !== "image/jpeg"
              ) {
                toast.error("File không đúng định dạng.", ToastObjects);
                return;
              }
              setImgAvatar(e.target.files[0]);
            }}
            className="form-control"
            type="file"
          />
          {(avatarDefault || fileAvatar) && (
            <div style={{
              position: 'relative',
              maxWidth: 250,
              maxHeight: 250
            }}>
              <img
                src={avatarDefault ? avatarDefault : URL.createObjectURL(fileAvatar)}
                alt="Product"
                className="mt-3"
                style={{ width: "250px", marginTop: "5px", height: 250 }}
              />
              <span
                className="delete-button"
                style={{
                  top: -26,
                  right: 0
       
                }}      
                onClick={(e) => {
                  setImgAvatar(null);
                  setData((prev) => ({ ...prev, avatarDefault: null }));
                  document.getElementById("uploadFileAvatar").value = "";
                }}
              >
                &times;
              </span>
            </div>
          )}
        </div>

        <div style={{
          maxWidth: 400
        }} className="mb-4">
          <label className="form-label">Hình nền đăng nhập</label>
          <input
            id="uploadFilebackgroundLogin"
            required={backgroundLogin ? false : true}
            onChange={(e) => {
              setData((prev) => ({ ...prev, backgroundLogin: null }));
              if (
                e.target.files[0].type !== "image/jpeg" &&
                e.target.files[0].type !== "image/jpeg"
              ) {
                toast.error("File không đúng định dạng.", ToastObjects);
                return;
              }
              setImgLogin(e.target.files[0]);
            }}
            className="form-control"
            type="file"
          />
          {(backgroundLogin || fileLogin) && (
            <div style={{
              position: 'relative',
              maxWidth: 250,
              maxHeight: 250
            }}>
              <img
                src={backgroundLogin ? backgroundLogin : URL.createObjectURL(fileLogin)}
                alt="Product"
                className="mt-3"
                style={{ width: "250px", marginTop: "5px", height: 250 }}
              />
              <span
                className="delete-button"
                style={{
                  top: -26,
                  right: 0
       
                }}      
                onClick={(e) => {
                  setImgLogin(null);
                  setData((prev) => ({ ...prev, backgroundLogin: null }));
                  document.getElementById("uploadFilebackgroundLogin").value = "";
                }}
              >
                &times;
              </span>
            </div>
          )}
        </div>

        <div style={{
          maxWidth: 200
        }} className="mb-4">
          <label htmlFor="colorDefault" className="form-label">
           Màu chủ đạo:
          </label>
          <input
            type="color"
            placeholder="Chọn màu"
            className="form-control"
            id="colorDefault"
            required
            value={colorDefault}
            name="colorDefault"
            onChange={handleChange}
          />
        </div>
        <div style={{
          maxWidth: 400
        }} className="mb-4">
          <label htmlFor="quantityWarning" className="form-label">
            Mức cảnh báo hết hàng:
          </label>
          <input
            type="number"
            min={0}
            placeholder="Nhập ngày"
            className="form-control"
            id="quantityWarning"
            required
            value={quantityWarning}
            name="quantityWarning"
            onChange={handleChange}
          />
        </div>

        <div style={{
          maxWidth: 400
        }}className="mb-4">
          <label htmlFor="quantityDate" className="form-label">
            Mức cảnh báo hàng sắp hết hạn (ngày):
          </label>
          <input
            type="number"
            min={0}
            placeholder="Nhập ngày"
            className="form-control"
            id="quantityDate"
            required
            value={quantityDate}
            name="quantityDate"
            onChange={handleChange}
          />
        </div>


        <div  style={{
          maxWidth: 200
         }} className="d-grid ">
            <button
              type="submit"
              className="btn btn-warning py-2"
              onClick={hanldeEdit}
            >
              <h5>Cập nhật</h5>
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditConfiguration;
