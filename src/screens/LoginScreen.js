import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../Redux/Actions/UserActions";
import Message from "../components/LoadingError/Error";
import Loading from "../components/LoadingError/Loading";
import Toast from "../components/LoadingError/Toast";
import "../Styles/login.css";
import { singleConfiguration } from "../Redux/Actions/ConfigurationAction";
const Login = () => {
  window.scrollTo(0, 0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userInfo) {
      history.push("/");
    }
  }, [userInfo, history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
   const iconEye = document.getElementById('loginPassword');
   const input = document.getElementById('password');

   const togglePasswordVisibility = () => {
     setShowPassword((prevShowPassword) => !prevShowPassword);
   };

   if (iconEye) {
     iconEye.addEventListener('click', togglePasswordVisibility);
   }

   return () => {
     if (iconEye) {
       iconEye.removeEventListener('click', togglePasswordVisibility);
     }
   };
 }, []);

//  useEffect(() => {
//    dispatch(singleConfiguration());
//  }, []);

 const configurationSingle = useSelector((state) => state?.configurationSingle);

 const {
   loading: loadingconfigurationSingle,
   error: errorconfigurationSingle,
   success: successconfigurationSingle,
   configurationSingle: dataconfigurationSingle,
 } = configurationSingle;

 useEffect(() => {
   const prevTitle = window.document.title
   window.document.title = 'Admin đăng nhập'

   return () => {
     window.document.title = prevTitle
   }
 }, [])

 if(loadingconfigurationSingle) return <></>

  return (
    <>
      <Toast />
      <svg className="login__blob" viewBox="0 0 566 840" xmlns="http://www.w3.org/2000/svg">
         <mask id="mask0" mask-type="alpha">
            <path d="M342.407 73.6315C388.53 56.4007 394.378 17.3643 391.538 
            0H566V840H0C14.5385 834.991 100.266 804.436 77.2046 707.263C49.6393 
            591.11 115.306 518.927 176.468 488.873C363.385 397.026 156.98 302.824 
            167.945 179.32C173.46 117.209 284.755 95.1699 342.407 73.6315Z"/>
         </mask>
      
         <g mask="url(#mask0)">
            <path d="M342.407 73.6315C388.53 56.4007 394.378 17.3643 391.538 
            0H566V840H0C14.5385 834.991 100.266 804.436 77.2046 707.263C49.6393 
            591.11 115.306 518.927 176.468 488.873C363.385 397.026 156.98 302.824 
            167.945 179.32C173.46 117.209 284.755 95.1699 342.407 73.6315Z"/>

            <image className="login__img" href={ dataconfigurationSingle?.backgroundLogin ? dataconfigurationSingle?.backgroundLogin : 'images/materials-management.jpg' }/>
         </g>
      </svg> 
          
      <div className="login container grid" id="loginAccessRegister">
         <div className="login__access">
            <h1 className="login__title">Đăng nhập</h1>
            {error && <Message style={{ justifyContent: 'flex-start' }} variant="alert-danger">{error}</Message>}
            {loading && <Loading />}
            <div className="login__area">
               <form onSubmit={handleSubmit} className="login__form">
                  <div className="login__content grid">
                     <div className="login__box">
                        <input onChange={(e) => setEmail(e.target.value)} name="email" type="email" id="email" required placeholder=" " className="login__input" />
                        <label htmlFor="email" className="login__label">Nhập email</label>
            
                        <i className="ri-mail-fill login__icon"></i>
                     </div>
         
                     <div className="login__box">
                        <input onChange={(e) => setPassword(e.target.value)} name="password" type={showPassword ? 'text' : 'password'} id="password" required placeholder=" " className="login__input" />
                        <label htmlFor="password" className="login__label">Nhập mật khẩu</label>
            
                        <i
                           className={`login__icon login__password ${showPassword ? 'ri-eye-fill' : 'ri-eye-off-fill'}`}
                           id="loginPassword"
                        ></i>
                     </div>
                  </div>
         
                  {/* <a href="#" className="login__forgot">Forgot your password?</a> */}
         
                  <button type="submit" className="login__button">Đăng nhập</button>
               </form>
            </div>
         </div>
      </div>
    </>
  );
};

export default Login;
