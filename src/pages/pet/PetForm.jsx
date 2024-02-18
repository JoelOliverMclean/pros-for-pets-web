import React, { useEffect, useState, useContext, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { apiGet, apiPost, getCsrfToken } from "../../helpers/NetworkHelper";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  useParams,
} from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";
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

  const [pet, setPet] = useState({});
  const [values, setValues] = useState(null);
  const [loaded, setLoaded] = useState(slug ? false : true);

  const getPet = useCallback(() => {
    setLoaded(false);
    apiGet(`pets/${slug}`).then((response) => {
      if (response.status === 200) {
        setPet(response.data);
        setValues({
          ...response.data,
          dob: moment(response.data.dob).format("yyyy-MM-DD"),
        });
      } else navigate("/");
    });
  }, []);

  const onImageCropped = (image) => {
    setCroppedImage(image);
  };

  const upload = async (data) => {
    if (slug) data["id"] = pet.id;
    apiPost("pets", data).then((response) => {
      if (response.status === 200) {
        setError(null);
        navigate({
          pathname: "/pets",
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
    if (slug) getPet();
  }, [getPet]);

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
        {slug ? <span>Editing {pet.name}</span> : <span>New Pet</span>}
      </div>
      <div className="col-lg-8 col-12">
        {!slug || values ? (
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
                      name="name"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Breed</label>
                    <ErrorMessage
                      className="small text-danger ml-2"
                      name="breed"
                      component="span"
                    />
                    <Field
                      className="form-control bg-fore text-light border-0"
                      id="inputCreatePost"
                      name="breed"
                    />
                  </div>
                </div>
                <div className="col-lg-6 col-12">
                  <div className="form-group mb-3">
                    <label>Date of Birth</label>
                    <ErrorMessage
                      className="small text-danger ml-2"
                      name="dob"
                      component="span"
                    />
                    <Field
                      className="form-control bg-fore text-light border-0"
                      id="inputCreatePost"
                      type="date"
                      name="dob"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Colour</label>
                    <ErrorMessage
                      className="small text-danger ml-2"
                      name="colour"
                      component="span"
                    />
                    <Field
                      className="form-control bg-fore text-light border-0"
                      id="inputCreatePost"
                      name="colour"
                    />
                  </div>
                </div>
                {/* <div className='form-group col-lg-6 col-12'>
                <label>Pet Picture</label>
                <ErrorMessage className='small text-danger ml-2'  name='username' component="span" />
                { croppedImage && 
                  <div className='d-flex mb-3'>
                    <img onClick={() => setShowCrop(true)} src={croppedImage} alt='Pet' className='img-fluid w-50 mx-auto' />
                  </div>
                }
                <input type="file" name="image" className="form-control bg-fore text-light border-0" id="image" accept="image/*" onChange={(event) => {
                  setImage(event.currentTarget);
                }} />
              </div> */}
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
                Save Pet
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
