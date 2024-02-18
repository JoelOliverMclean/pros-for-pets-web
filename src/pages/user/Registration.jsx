import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  Link,
} from "react-router-dom";
import { apiGet, apiPost, getCsrfToken } from "../../helpers/NetworkHelper";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";

function Registration() {
  const [showPasswordType, setShowPasswordType] = useState("password");
  const [error, setError] = useState(null);

  const location = useLocation();

  const state = location?.state?.redirect
    ? {
        redirect: location.state.redirect,
      }
    : null;

  const [terms, setTerms] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const navigate = useNavigate();
  const initialValues = {
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "too short (min 3)")
      .max(15, "too long (max 15)")
      .test({
        name: "contains-whitespace",
        skipAbsent: true,
        test(value, ctx) {
          if (value.trim().includes(" ")) {
            return ctx.createError({ message: "cannot contain spaces" });
          }
          return true;
        },
      })
      .required("is required"),
    firstname: Yup.string()
      .max(20, "too long (max 20)")
      .required("is required"),
    lastname: Yup.string().max(20, "too long (max 20)").required("is required"),
    password: Yup.string()
      .min(4, "too short (min 3)")
      .max(20, "too long (max 15)")
      .required("is required"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
  });

  const register = (data) => {
    // if (termsAccepted && privacyAccepted) {
    apiPost("auth/", {
      username: data.username.trim(),
      firstname: data.firstname.trim(),
      lastname: data.lastname.trim(),
      password: data.password.trim(),
    }).then((response) => {
      if (response.status !== 200) {
        setError(response.data.error);
      } else {
        setError(null);
        navigate(
          {
            pathname: "/login",
          },
          {
            state: {
              ...state,
              registered: true,
            },
          }
        );
      }
    });
    // } else {
    //   setError("Must accept Terms of Service & Privacy Policy")
    // }
  };

  const toggleShowPassword = () => {
    if (showPasswordType === "password") setShowPasswordType("text");
    else setShowPasswordType("password");
  };

  useEffect(() => {
    getCsrfToken();
    // apiGet("terms-and-privacy").then((response) => {
    //   setTerms(response.data.terms)
    //   setPrivacy(response.data.privacy)
    // })
  }, [setTerms, setPrivacy]);

  // const termsOfServiceModal = (
  //   <Modal show={showTerms} onHide={() => setShowTerms(false)} size='lg' contentClassName='bg-background text-light montserrat'>
  //     <Modal.Header closeButton closeVariant='white' className='border-mids-mutts'>
  //       <Modal.Title id="contained-modal-title-vcenter">
  //         Terms of Service
  //       </Modal.Title>
  //     </Modal.Header>
  //     <Modal.Body>
  //       <div className='p-2'>
  //         {terms}
  //       </div>
  //     </Modal.Body>
  //     <Modal.Footer className='border-mids-mutts'>
  //       <button className='btn btn-danger' onClick={() => setShowTerms(false)}>Close</button>
  //     </Modal.Footer>
  //   </Modal>
  // )

  // const privacyPolicyModal = (
  //   <Modal show={showPrivacy} onHide={() => setShowPrivacy(false)} size='lg' contentClassName='bg-background text-light montserrat'>
  //     <Modal.Header closeButton closeVariant='white' className='border-mids-mutts'>
  //       <Modal.Title id="contained-modal-title-vcenter">
  //         Privacy Policy
  //       </Modal.Title>
  //     </Modal.Header>
  //     <Modal.Body>
  //     <div className='p-2'>
  //         {privacy}
  //       </div>
  //     </Modal.Body>
  //     <Modal.Footer className='border-mids-mutts'>
  //       <button className='btn btn-danger' onClick={() => setShowPrivacy(false)}>Close</button>
  //     </Modal.Footer>
  //   </Modal>
  // )

  return (
    <div className="row flex flex-column align-items-center">
      <div className="col-xl-6 col-lg-8 col-sm-10 col-12">
        <Formik
          initialValues={initialValues}
          onSubmit={register}
          validationSchema={validationSchema}
        >
          <Form className="loginContainer">
            <div className="row">
              <div className="col-md-6 col-12">
                <div className="form-group mb-3">
                  <label>Username</label>&nbsp;
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
                <div className="form-group mb-3">
                  <label>First Name</label>&nbsp;
                  <ErrorMessage
                    className="small text-danger ml-2"
                    name="firstname"
                    component="span"
                  />
                  <Field
                    className="form-control bg-fore text-light border-0"
                    id="firstname"
                    name="firstname"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>&nbsp;
                  <ErrorMessage
                    className="small text-danger ml-2"
                    name="lastname"
                    component="span"
                  />
                  <Field
                    className="form-control bg-fore text-light border-0"
                    id="lastname"
                    name="lastname"
                  />
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="form-group">
                  <label>Password</label>&nbsp;
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
                        tabIndex={-1}
                        onClick={toggleShowPassword}
                        className="btn btn-fore border-0"
                        type="button"
                      >
                        <i className="fa-regular fa-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>&nbsp;
                  <ErrorMessage
                    className="small text-danger ml-2"
                    name="confirmPassword"
                    component="span"
                  />
                  <div className="input-group mb-3">
                    <Field
                      type={showPasswordType}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control bg-fore border-0"
                    />
                    <div className="input-group-append">
                      <button
                        tabIndex={-1}
                        onClick={toggleShowPassword}
                        className="btn btn-fore border-0"
                        type="button"
                      >
                        <i className="fa-regular fa-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
                {/* <div className='form-group'>
                  <label>Sign Up Code</label>
                  <ErrorMessage className='small text-danger ml-2' name='code' component="span" />
                  <Field className="form-control bg-fore text-light border-0" id="code" name="code" />
                </div> */}
              </div>
              {/* <div className='col-12'>
                <div className="form-check small">
                  <input className="form-check-input" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} id="acceptTerms" />
                  <label className="form-check-label" for="acceptTerms">
                    I have read and accept the <span onClick={() => setShowTerms(true)} className='text-mids-mutts underlined-hover clickable'>Terms of Service</span>
                  </label>
                </div>
              </div>
              <div className='col-12'>
                <div className="form-check small">
                  <input className="form-check-input" type="checkbox" checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} id="acceptPrivacy" />
                  <label className="form-check-label" for="acceptPrivacy">
                    I have read and accept the <span onClick={() => setShowPrivacy(true)} className='text-mids-mutts underlined-hover clickable'>Privacy Policy</span>
                  </label>
                </div>
              </div> */}
              {/* <div className='col-12'>
                <div className="form-check small">
                  <input className="form-check-input" type="checkbox" checked={termsAccepted && privacyAccepted} onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    setPrivacyAccepted(e.target.checked);
                  }} id="acceptBoth" />
                  <label className="form-check-label" for="acceptBoth">
                    I have read and accept both of the above
                  </label>
                </div>
              </div> */}
            </div>
            {error && <div className="text-danger mt-2">{error}</div>}
            <button
              className="btn btn-mids-mutts form-control mt-4 text-light"
              type="submit"
            >
              Register
            </button>
          </Form>
        </Formik>
      </div>
      <div className="col-12 d-flex flex-column align-items-center">
        <Link
          to={{ pathname: "/login" }}
          state={state}
          className="small text-light mt-3"
        >
          Already registered? Login
        </Link>
      </div>
      {/* {termsOfServiceModal}
      {privacyPolicyModal} */}
    </div>
  );
}

export default Registration;
