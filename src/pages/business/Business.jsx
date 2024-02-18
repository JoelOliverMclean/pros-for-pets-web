import { Fragment, useCallback, useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { apiGet, apiPost } from "../../helpers/NetworkHelper";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../helpers/AuthContext";
import moment from "moment";
import RequestBooking from "../../components/modals/RequestBooking";
import { toast } from "react-toastify";

function Business() {
  const { loggedInUser } = useContext(AuthContext);
  const { slug } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const [userPets, setUserPets] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [applyText, setApplyText] = useState("Sign up");
  const [selectedBookingSlot, setSelectedBookingSlot] = useState(null);
  const [showBookingRequest, setShowBookingRequest] = useState(false);

  const [bookingSlots, setBookingSlots] = useState([]);
  const [service, setService] = useState("null");

  const choosePetDialog = (slot) => {
    setSelectedBookingSlot(slot);
    if (userPets.length !== 1) {
      setShowBookingRequest(true);
    } else {
      requestBooking(userPets[0]._id, slot);
    }
  };

  const requestBooking = useCallback(
    (petId, bookingSlot) => {
      let params = {
        slotId: bookingSlot.id,
        petId,
      };
      apiPost("/bookings/request", params).then((response) => {
        if (response.status === 200) {
          toast.success(`Request sent to ${business.name}!`, {
            theme: "dark",
            position: "top-center",
            autoClose: 1000,
            pauseOnFocusLoss: false,
            onClose: () => {
              navigate(0);
            },
          });
        } else {
          toast.error(`Something went wrong, contact business owner!`, {
            theme: "dark",
            position: "top-center",
            autoClose: 1000,
            pauseOnFocusLoss: false,
          });
        }
      });
    },
    [business, selectedBookingSlot, navigate]
  );

  const getBusiness = useCallback(() => {
    setLoading(true);
    apiGet("businesses/for-slug", { slug }).then((response) => {
      setLoading(false);
      if (response.status === 200) {
        setBusiness(response.data.business);
        setApplyText(`Sign up with ${response.data.business.name}`);
      } else {
        navigate("/");
      }
    });
  }, [navigate, slug]);

  const apply = () => {
    setApplyText("Applying...");
    apiPost(`business-user/apply/${business._id}`).then((response) => {
      if (response.status === 200) {
        navigate(0);
      } else {
        setApplyText(`Sign up with ${business.name}`);
      }
    });
  };

  const isClient = () =>
    business?.businessUsers?.some(
      (bu) => bu.user.username === loggedInUser.username
    ) ?? false;

  const isClientConfirmed = () =>
    business?.businessUsers?.some(
      (bu) => bu.user.username === loggedInUser.username && bu.confirmed
    ) ?? false;

  const headerElement = () => {
    return (
      <div>
        <h1>{business.name}</h1>
        <div className="d-flex flex-wrap">
          {business.phone && (
            <div>
              <button
                className="btn btn-link-mids-mutts text-start d-flex"
                href={`tel:${business.phone}`}
              >
                <span>
                  <i className="fa-solid fa-phone"></i>
                </span>
                &nbsp;&nbsp;
                <span className="underlined-hover">{business.phone}</span>
              </button>
            </div>
          )}
          {business.website && (
            <div>
              <a
                type="button"
                className="btn btn-link-mids-mutts text-start d-flex"
                href={business.website}
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  <i className="fa-solid fa-globe"></i>
                </span>
                &nbsp;&nbsp;
                <span className="underlined-hover">Website</span>
              </a>
            </div>
          )}
          {business.email && (
            <div>
              <a
                type="button"
                className="btn btn-link-mids-mutts text-start d-flex"
                href={`mailto:${business.email}`}
              >
                <span>
                  <i className="fa-solid fa-envelope"></i>
                </span>
                &nbsp;&nbsp;
                <span className="underlined-hover">{business.email}</span>
              </a>
            </div>
          )}
        </div>
        {business.address && (
          <div className="d-flex">
            <a
              type="button"
              className="btn btn-link-mids-mutts text-start d-flex"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                business.address
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <span>
                <i className="fa-solid fa-building"></i>
              </span>
              &nbsp;&nbsp;
              <span className="underlined-hover">{business.address}</span>
            </a>
          </div>
        )}
        {loggedInUser ? (
          <div>
            {isClient() && !isClientConfirmed() ? (
              <div className="d-flex p-2">
                <button className="btn btn-success disabled" onClick={apply}>
                  Pending approval...
                </button>
              </div>
            ) : (
              !isClient() && (
                <div className="d-flex p-2">
                  <button className="btn btn-success" onClick={apply}>
                    {applyText}
                  </button>
                </div>
              )
            )}
          </div>
        ) : (
          !loggedInUser && (
            <div className="p-2">
              <Link
                className="btn btn-outline-success"
                to={{ pathname: "/login" }}
                state={{
                  from: { title: business.name },
                  redirect: `/businesses/${business.slug}`,
                }}
              >
                Login or Register to use this business
              </Link>
            </div>
          )
        )}
      </div>
    );
  };

  const servicesElement = () => {
    return (
      <div>
        <h2 className="pe-3">Services</h2>
        {business.services ? (
          <div className="row py-2 row-cols-lg-4 row-cols-sm-2">
            {business.services.map((service) => (
              <div key={service._id}>
                <Card>
                  <Card.Header className="lead">{service.name}</Card.Header>
                  <Card.Body>{service.description}</Card.Body>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-subtle display-8">
            <p className="text-center">No services</p>
          </div>
        )}
      </div>
    );
  };

  const serviceOptions = (
    <div className="d-flex">
      <span
        className="text-subtle py-2 pe-2"
        style={{ fontSize: 0.9 + "rem" }}
        id="basic-addon1"
      >
        Service:
      </span>
      <select
        id="service-select"
        className="form-select form-select-sm bg-fore border-0 text-light"
        value={service}
        onChange={(event) => {
          setService(event.currentTarget.value);
        }}
      >
        <option key={"serviceOptions_option_null"} value={"null"}>
          All
        </option>
        {business?.services.map((service) => (
          <option
            key={"serviceOptions_option_" + service.slug}
            value={service.slug}
          >
            {service.name}
          </option>
        ))}
      </select>
    </div>
  );

  const upcomingSlotsElement = (
    <div>
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <h2>Upcoming Slots</h2>
        {serviceOptions}
      </div>

      {loadingSlots ? (
        <div className="d-flex pt-2">
          <ClipLoader className="mx-auto" color="#0082b4" />
        </div>
      ) : bookingSlots?.length === 0 ? (
        <div className="lead text-subtle text-center">No results</div>
      ) : (
        <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 mt-2">
          {bookingSlots?.map((bookingSlot) => (
            <div className="col my-2" key={bookingSlot._id}>
              <Card className="h-100">
                <Card.Header className="lead">
                  {bookingSlot.service.name}
                </Card.Header>
                <Card.Body className="d-flex flex-column gap-2">
                  <div>
                    <i className="fa-solid fa-calendar-days"></i>
                    {"  "}
                    {moment(bookingSlot.start_time).format("ddd Do MMM")}
                  </div>
                  <div>
                    <i className="fa-solid fa-clock"></i>
                    {"  "}
                    {moment(bookingSlot.start_time).format("h:mm a")} -{" "}
                    {moment(bookingSlot.end_time).format("h:mm a")}
                  </div>
                  <div className="text-center lead">
                    <div className="d-inline-flex rounded-3 border border-2 px-2 py-1 bg-secondary">
                      {bookingSlot.spaces_left} space
                      {bookingSlot.spaces_left > 1 && "s"} left
                    </div>
                  </div>
                  {bookingSlot.info?.length > 0 && (
                    <div>
                      <b>Information:</b>
                      <div className="px-2">{bookingSlot.info}</div>
                    </div>
                  )}
                  {bookingSlot.location?.length > 0 && (
                    <Fragment>
                      <div>
                        <a
                          className="remove-underline"
                          href={
                            bookingSlot.locationLink ??
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              bookingSlot.location
                            )}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i
                            className="fa-solid fa-location-dot"
                            title="location"
                          ></i>
                          {"  "}
                          <span className="underlined-hover">
                            {bookingSlot.location}
                          </span>
                        </a>
                      </div>
                    </Fragment>
                  )}
                </Card.Body>
                <Card.Footer className="p-2">
                  <button
                    className="btn btn-success form-control"
                    onClick={() => choosePetDialog(bookingSlot)}
                  >
                    Request Booking
                  </button>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      )}

      {bookingSlots?.length === 1 && (
        <div className="d-sm-flex">
          <div className="d-flex d-sm-inline-flex ms-auto mt-2">
            <button className="btn btn-mids-mutts flex-fill">View More</button>
          </div>
        </div>
      )}
    </div>
  );

  const getUpcomingBookings = useCallback(() => {
    setLoadingSlots(true);
    apiGet("businesses/slots", { slug, serviceSlug: service?.slug }).then(
      (response) => {
        setLoadingSlots(false);
        if (response.status === 200) {
          setBookingSlots(response.data.bookingSlots);
        }
      }
    );
  }, [service, slug]);

  useEffect(() => {
    getBusiness();
  }, [getBusiness]);

  useEffect(() => {
    getUpcomingBookings();
  }, [getUpcomingBookings]);

  const getPets = useCallback(() => {
    apiGet("pets", {
      username: loggedInUser?.username,
    }).then((response) => {
      if (response.status === 200) {
        setUserPets(response.data);
      } else setUserPets([]);
    });
  }, [setUserPets, loggedInUser]);

  useEffect(() => {
    getPets();
  }, [getPets]);

  return (
    <Container>
      {location?.state?.from?.title && (
        <div className="mb-2">
          <button className="btn btn-sm btn-link" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left pe-2"></i>
            {location?.state?.from?.title}
          </button>
        </div>
      )}
      {!business && !loading && (
        <div className="text-center text-subtle display-8 pt-2">
          Cannot find this Business
        </div>
      )}
      {loading ? (
        <div className="d-flex pt-2">
          <ClipLoader className="mx-auto" color="#0082b4" />
        </div>
      ) : business ? (
        <Fragment>
          {headerElement()}
          {loggedInUser && isClientConfirmed() && (
            <div>
              <hr />
              {upcomingSlotsElement}
            </div>
          )}
          <hr />
          {servicesElement()}
        </Fragment>
      ) : (
        <div></div>
      )}
      <RequestBooking
        pets={userPets}
        show={showBookingRequest}
        setShow={setShowBookingRequest}
        selectedBookingSlot={selectedBookingSlot}
        refresh={getUpcomingBookings}
      />
    </Container>
  );
}

export default Business;
