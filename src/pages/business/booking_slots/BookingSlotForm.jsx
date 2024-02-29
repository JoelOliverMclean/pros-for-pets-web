import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getCsrfToken, apiGet, apiPost } from "../../../helpers/NetworkHelper";
import { ClipLoader } from "react-spinners";
import moment from "moment";
import * as Yup from "yup";

const getHourDiff = (a, b) => {
  let start = moment(a);
  let end = moment(b);
  return Math.floor(moment.duration(end.diff(start)).asHours());
};

const getMinuteDiff = (a, b) => {
  let start = moment(a);
  let end = moment(b);
  return Math.floor(moment.duration(end.diff(start)).asMinutes() % 60);
};

function BookingSlotForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("slot");

  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(null);

  const [values, setValues] = useState({
    service: "",
    slots: 3,
    startdate: moment().format("YYYY-MM-DD"),
    starttime: moment().format("HH:mm"),
    hours: "",
    minutes: "",
    cost: "",
    location: "",
    locationLink: "",
    info: "",
  });
  const [loaded, setLoaded] = useState(!id);

  const [services, setServices] = useState(location?.state?.services ?? []);

  const getBookingSlot = useCallback(() => {
    setLoaded(false);
    apiGet(`manage-booking-slots/${id}`).then((response) => {
      if (response.status === 200) {
        setValues({
          service: response.data.bookingSlot.service._id,
          slots: String(response.data.bookingSlot.slots),
          cost: response.data.bookingSlot.cost,
          startdate: moment(response.data.bookingSlot.start_time).format(
            "yyyy-MM-DD"
          ),
          starttime: moment(response.data.bookingSlot.start_time).format(
            "HH:mm"
          ),
          hours: getHourDiff(
            response.data.bookingSlot.start_time,
            response.data.bookingSlot.end_time
          ),
          minutes: getMinuteDiff(
            response.data.bookingSlot.start_time,
            response.data.bookingSlot.end_time
          ),
          location: response.data.bookingSlot.location,
          locationLink: response.data.bookingSlot.locationLink,
          info: response.data.bookingSlot.info,
        });
      } else {
        // navigate("/");
      }
      setLoaded(true);
    });
  }, [id, navigate, setValues]);

  const getServices = useCallback(() => {
    apiGet(`manage-services`).then((response) => {
      if (response.status === 200) {
        setServices(response.data);
      }
    });
  }, []);

  const validationSchema = Yup.object().shape({
    service: Yup.string()
      .required("required")
      .test({
        name: "service-valid",
        skipAbsent: true,
        test(value, ctx) {
          if (!services.some((service) => service._id === value)) {
            return ctx.createError({ message: "required" });
          }
          return true;
        },
      }),
    slots: Yup.number().required("required").min(1),
    startdate: Yup.date().min(moment().startOf("day")).required("required"),
    starttime: Yup.string().required("required"),
    cost: Yup.number().min(0.01).required("required"),
    hours: Yup.number().required("required"),
    minutes: Yup.number().required("required"),
    location: Yup.string().required("required"),
    info: Yup.string(),
  });

  const upload = async (data) => {
    if (id) data["id"] = id;
    apiPost("manage-booking-slots", data).then((response) => {
      if (response.status === 200) {
        setError(null);
        navigate({
          pathname: "/manage-business/booking-slots",
        });
      } else {
        setError(response.data.error);
      }
    });
  };

  const serviceOptions = (
    <React.Fragment>
      {services.map((value, index) => {
        return (
          <option key={value._id} value={value._id}>
            {value.name}
          </option>
        );
      })}
    </React.Fragment>
  );

  useEffect(() => {
    getCsrfToken();
    if (id) getBookingSlot();
    if (services.length === 0) getServices();
  }, [getBookingSlot, getServices, id, services.length]);

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
        <div className="col-lg-8 col-12 display-8">
          {id ? "Edit" : "New"} Booking Slot
        </div>
        <div className="col-lg-8 col-12">
          {loaded && services.length > 0 ? (
            <Formik
              initialValues={values}
              onSubmit={upload}
              validationSchema={validationSchema}
            >
              <Form className="loginContainer">
                <div className="row">
                  <div className="col-lg-6 col-12">
                    <div className="form-group mb-3">
                      <label>Service</label>
                      <ErrorMessage
                        className="small text-danger ms-1"
                        name="service"
                        component="span"
                      />
                      <Field
                        defaultValue={""}
                        as="select"
                        className="form-select bg-fore text-light border-0"
                        name="service"
                      >
                        <option value={""}>Select Service</option>
                        {serviceOptions}
                      </Field>
                    </div>
                    <div className="form-group mb-3">
                      <label>Date</label>
                      <ErrorMessage
                        className="small text-danger ms-1"
                        name="startdate"
                        component="span"
                      />
                      <Field
                        type="date"
                        className="form-control bg-fore text-light border-0"
                        name="startdate"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Time</label>
                      <ErrorMessage
                        className="small text-danger ms-1"
                        name="starttime"
                        component="span"
                      />
                      <Field
                        type="time"
                        className="form-control bg-fore text-light border-0"
                        name="starttime"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="form-group mb-3">
                      <label>Spaces</label>
                      <ErrorMessage
                        className="small text-danger ms-1"
                        name="slots"
                        component="span"
                      />
                      <Field
                        className="form-control bg-fore text-light border-0"
                        id="inputCreatePost"
                        type="number"
                        step="1"
                        name="slots"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <div className="d-flex align-items-center">
                        <div>Duration</div>
                        {/* <div
                        className="ms-auto btn btn-sm btn-link"
                        onClick={() =>
                          setValues({ ...values, sameDay: false })
                        }
                      >
                        Set end date instead?
                      </div> */}
                      </div>
                      <div className="input-group">
                        <span className="input-group-text bg-secondary text-light border-0">
                          Hours
                        </span>
                        <Field
                          type="number"
                          className="form-control bg-fore text-light border-0"
                          name="hours"
                        />
                        <span className="input-group-text bg-secondary text-light border-0">
                          Minutes
                        </span>
                        <Field
                          type="number"
                          className="form-control bg-fore text-light border-0"
                          name="minutes"
                        />
                      </div>
                      <div className="d-flex justify-content-evenly mb-3">
                        <div className="w-100 px-2">
                          <ErrorMessage
                            className="small text-danger"
                            name="hours"
                            component="span"
                          />
                        </div>
                        <div className="w-100 px-2">
                          <ErrorMessage
                            className="small text-danger"
                            name="minutes"
                            component="span"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label>Cost</label>
                      <ErrorMessage
                        className="small text-danger ms-1"
                        name="cost"
                        component="span"
                      />
                      <div className="input-group mb-3">
                        <span className="input-group-text bg-secondary text-light border-0">
                          £
                        </span>
                        <Field
                          type="number"
                          className="form-control bg-fore text-light border-0"
                          name="cost"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>Location Description</label>
                  <ErrorMessage
                    className="small text-danger ms-1"
                    name="location"
                    component="span"
                  />
                  <div className="small text-subtle">
                    What you can google to find the location e.g. Pawz Let Loose
                  </div>
                  <Field
                    className="form-control bg-fore text-light border-0"
                    id="inputCreatePost"
                    name="location"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Location Link</label>
                  <ErrorMessage
                    className="small text-danger ms-1"
                    name="locationLink"
                    component="span"
                  />
                  <div className="small text-subtle">
                    Optional. If description above isn't specific enough or you
                    have a pin
                  </div>
                  <Field
                    className="form-control bg-fore text-light border-0"
                    id="inputCreatePost"
                    name="locationLink"
                  />
                </div>
                <div className="form-group">
                  <label>Information</label>
                  <ErrorMessage
                    className="small text-danger ms-1"
                    name="info"
                    component="span"
                  />
                  <Field
                    className="form-control bg-fore text-light border-0"
                    id="inputCreatePost"
                    name="info"
                  />
                </div>
                {error && <p className="small text-danger">{error}</p>}
                <button
                  className="btn btn-mids-mutts form-control mt-4"
                  type="submit"
                >
                  {id ? "Save Slot" : "Create Slot"}
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

export default BookingSlotForm;
