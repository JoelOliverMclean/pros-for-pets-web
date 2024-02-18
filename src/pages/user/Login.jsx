import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";
import { apiPost, getCsrfToken } from "../../helpers/NetworkHelper";
import * as Yup from "yup";

function Login() {
  const { setLoggedInUser } = useContext(AuthContext);

  const location = useLocation();

  const state = location?.state?.redirect
    ? {
        redirect: location.state.redirect,
      }
    : null;

  const [showPasswordType, setShowPasswordType] = useState("password");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("is required"),
    password: Yup.string().required("is required"),
  });

  const login = (data) => {
    apiPost("auth/login", {
      username: data.username.trim(),
      password: data.password.trim(),
    }).then((response) => {
      if (response.status !== 200) {
        setError(response.data.error);
        setLoggedInUser(null);
      } else {
        setError(null);
        setLoggedInUser(response.data);
        if (location?.state?.redirect) {
          navigate(location?.state?.redirect);
        } else {
          navigate("/");
        }
      }
    });
  };

  const toggleShowPassword = () => {
    if (showPasswordType === "password") setShowPasswordType("text");
    else setShowPasswordType("password");
  };

  useEffect(() => {
    getCsrfToken();
  }, []);

  return (
    <div className="row flex flex-column align-items-center">
      <div className="col-lg-4 col-md-6 col-sm-10 col-12">
        {location?.state?.registered && (
          <div className="text-center mb-3 text-success lead">
            Succesfully registered, please login
          </div>
        )}
        <Formik
          initialValues={initialValues}
          onSubmit={login}
          validationSchema={validationSchema}
        >
          <Form className="loginContainer">
            <div className="form-group mb-3">
              <label>Username: </label>&nbsp;
              <ErrorMessage
                className="small text-danger ml-2"
                name="username"
                component="span"
              />
              <Field
                className="form-control bg-fore text-light border-0"
                id="username"
                name="username"
              />
            </div>
            <div className="form-group">
              <label>Password: </label>&nbsp;
              <ErrorMessage
                className="small text-danger ml-2"
                name="password"
                component="span"
              />
              <div className="input-group mb-3">
                <Field
                  type={showPasswordType}
                  id="password"
                  name="password"
                  className="form-control bg-fore text-light border-0"
                />
                <div className="input-group-append">
                  <button
                    onClick={toggleShowPassword}
                    className="btn btn-fore border-0"
                    type="button"
                  >
                    <i className="fa-regular fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
            {error && <div className="text-danger">{error}</div>}
            <div className="">
              <button
                className="btn btn-mids-mutts form-control mt-2"
                type="submit"
              >
                Login
              </button>
            </div>
          </Form>
        </Formik>
      </div>
      {!location?.state?.registered && (
        <div className="col-12 d-flex flex-column align-items-center">
          {/* <a href='/forgotPassword' onClick={() => navigate("/forgotPassword")} className='small text-light mt-3'>Forgot Password?</a> */}
          <Link
            to={{ pathname: "/registration" }}
            state={state}
            className="small text-light mt-3"
          >
            Need an account?
          </Link>
        </div>
      )}
    </div>
  );
}

export default Login;
