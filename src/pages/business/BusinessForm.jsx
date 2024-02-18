import React, { useContext, useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AuthContext } from "../../helpers/AuthContext";
import { getCsrfToken, apiGet, apiPost } from "../../helpers/NetworkHelper";
import { ClipLoader } from "react-spinners";

function BusinessForm() {
  const { loggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(null);

  const [business, setBusiness] = useState(null);
  const [values, setValues] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const getBusiness = useCallback(() => {
    setLoaded(false);
    apiGet("manage-business").then((response) => {
      setLoaded(true);
      if (response.status === 200) {
        setBusiness(response.data);
        setValues({
          ...response.data,
        });
      } else {
        navigate("/");
      }
    });
  }, []);

  const upload = async (data) => {
    if (business) data["id"] = business._id;
    apiPost("manage-business", data).then((response) => {
      if (response.status === 200) {
        setError(null);
        navigate({
          pathname: "/manage-business",
        });
      } else {
        setError(response.data.error);
      }
    });
  };

  useEffect(() => {
    getCsrfToken();
    getBusiness();
  }, [getBusiness]);

  return (
    <React.Fragment>
      <div className="row flex flex-column align-items-center gap-3">
        {location?.state?.from?.title && (
          <div className="col-lg-8 col-12">
            <button
              className="btn btn-sm btn-link"
              onClick={() => navigate(-1)}
            >
              <i className="fa-solid fa-arrow-left pe-2"></i>
              {location?.state?.from?.title}
            </button>
          </div>
        )}
        {business && (
          <div className="col-lg-8 col-12 display-8">
            Editing {business.name}
          </div>
        )}
        <div className="col-lg-8 col-12">
          {loaded ? (
            <Formik initialValues={values ?? {}} onSubmit={upload}>
              <Form className="loginContainer" encType="multipart/form-data">
                <div className="row">
                  <div className="col-lg-6 col-12">
                    <div className="form-group mb-3">
                      <label>Name</label>
                      <ErrorMessage
                        className="small text-danger ml-2"
                        name="name"
                        component="span"
                      />
                      <Field
                        className="form-control bg-fore text-light border-0"
                        id="inputCreatePost"
                        placeholder="Your business' name"
                        name="name"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>
                        Phone{" "}
                        <span className="text-subtle small">(optional)</span>
                      </label>
                      <ErrorMessage
                        className="small text-danger ml-2"
                        name="phone"
                        component="span"
                      />
                      <Field
                        className="form-control bg-fore text-light border-0"
                        id="inputCreatePost"
                        placeholder="e.g. 01234567890"
                        name="phone"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="form-group mb-3">
                      <label>
                        Email{" "}
                        <span className="text-subtle small">(optional)</span>
                      </label>
                      <ErrorMessage
                        className="small text-danger ml-2"
                        name="email"
                        component="span"
                      />
                      <Field
                        className="form-control bg-fore text-light border-0"
                        id="inputCreatePost"
                        placeholder="e.g. info@business.com"
                        name="email"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>
                        Website{" "}
                        <span className="text-subtle small">(optional)</span>
                      </label>
                      <ErrorMessage
                        className="small text-danger ml-2"
                        name="website"
                        component="span"
                      />
                      <Field
                        className="form-control bg-fore text-light border-0"
                        id="inputCreatePost"
                        placeholder="e.g. www.business.com"
                        name="website"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>
                    Address{" "}
                    <span className="text-subtle small">(optional)</span>
                  </label>
                  <ErrorMessage
                    className="small text-danger ml-2"
                    name="address"
                    component="span"
                  />
                  <Field
                    className="form-control bg-fore text-light border-0"
                    id="inputCreatePost"
                    placeholder="e.g. 1 Business Road, Businessville, AB12 3CD"
                    name="address"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <ErrorMessage
                    className="small text-danger ml-2"
                    name="description"
                    component="span"
                  />
                  <Field
                    className="form-control bg-fore text-light border-0"
                    id="inputCreatePost"
                    name="description"
                  />
                </div>
                {error && <p className="small text-danger">{error}</p>}
                <button
                  className="btn btn-mids-mutts form-control mt-4"
                  type="submit"
                >
                  {business ? "Save Business" : "Create Business"}
                </button>
              </Form>
            </Formik>
          ) : (
            <div className="d-flex pt-2">
              <ClipLoader className="mx-auto" color="#0082b4" />
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default BusinessForm;
