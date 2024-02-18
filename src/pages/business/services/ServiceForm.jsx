import React, { useEffect, useState, useContext, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { apiGet, apiPost, getCsrfToken } from "../../../helpers/NetworkHelper";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import { AuthContext } from "../../../helpers/AuthContext";
// import ImageCropModal from '../components/ImageCropModal'
import moment from "moment";
import { ClipLoader } from "react-spinners";

function PetForm() {
  const { slug } = useParams();
  const { loggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const [showCrop, setShowCrop] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const [service, setService] = useState({});
  const [values, setValues] = useState(null);
  const [loaded, setLoaded] = useState(slug ? false : true);

  const getService = useCallback(() => {
    setLoaded(false);
    apiGet(`manage-services/${slug}`).then((response) => {
      if (response.status === 200) {
        setService(response.data);
        setValues({
          ...response.data,
        });
      } else navigate("/");
    });
  }, []);

  const onImageCropped = (image) => {
    setCroppedImage(image);
  };

  const upload = async (data) => {
    if (slug) data["id"] = service.id;
    apiPost("manage-services", data).then((response) => {
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

  const setImage = (input) => {
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
      setImageFile(input.files[0]);
      setShowCrop(true);
    }
  };

  useEffect(() => {
    getCsrfToken();
    if (slug) getService();
  }, [getService]);

  return (
    <div className="row flex flex-column align-items-center gap-3">
      {location?.state?.from?.title && (
        <div className="col-lg-8 col-12">
          <button className="btn btn-sm btn-link" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left pe-2"></i>
            {location?.state?.from?.title}
          </button>
        </div>
      )}
      <div className="col-lg-8 col-12 display-8">
        {slug ? <span>Editing {service.name}</span> : <span>New Service</span>}
      </div>
      <div className="col-lg-8 col-12">
        {!slug || values ? (
          <Formik initialValues={values ?? {}} onSubmit={upload}>
            <Form className="loginContainer" encType="multipart/form-data">
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
                  name="name"
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
                Save Service
              </button>
            </Form>
          </Formik>
        ) : !loaded ? (
          <div className="d-flex pt-2">
            <ClipLoader className="mx-auto" color="#0082b4" />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      {/* { selectedImage && 
        <ImageCropModal image={selectedImage} imageFile={imageFile} show={showCrop} setShow={setShowCrop} onCropped={onImageCropped} />
      } */}
    </div>
  );
}

export default PetForm;
