import { useContext, useState, useCallback, useEffect, Fragment } from "react";
import {
  useLocation,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import { apiGet } from "../../../helpers/NetworkHelper";
import { AuthContext } from "../../../helpers/AuthContext";
import { paginator, perPageOptions } from "../../../helpers/Pagination";
import { ClipLoader } from "react-spinners";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import { toast } from "react-toastify";
import moment from "moment";

function BookingSlots() {
  const { loggedInUser } = useContext(AuthContext);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();

  const savedResultsPerPage = sessionStorage.getItem("resultsPerPage");
  const initialResultsPerPage =
    !savedResultsPerPage || isNaN(savedResultsPerPage)
      ? 16
      : parseInt(savedResultsPerPage);

  const [tense, setTense] = useState(
    sessionStorage.getItem("tense") ?? "future"
  );
  const [service, setService] = useState(searchParams.get("service") ?? "null");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(initialResultsPerPage);
  const [page, setPage] = useState(0);
  const [results, setResults] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [bookingSlots, setBookingSlots] = useState([]);

  const bookingSlotsElement = bookingSlots.map((bookingSlot) => {
    return (
      <div className="col my-2" key={bookingSlot._id}>
        <Card className="h-100">
          <Card.Header className="lead">{bookingSlot.service.name}</Card.Header>
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
              {bookingSlot.slots - bookingSlot.spaces_left} /{" "}
              {bookingSlot.slots} Bookings
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
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      bookingSlot.location
                    )}`}
                    target="_blank"
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
            <button className="btn btn-outline-mids-mutts form-control">
              Manage
            </button>
          </Card.Footer>
        </Card>
      </div>
    );
  });

  const tenseOptions = () => {
    const tenses = ["past", "future", "both"];
    const tenseOptions = [];
    for (let i = 0; i < tenses.length; i++) {
      const iTense = tenses[i];
      const css =
        iTense === tense
          ? "btn-secondary"
          : "btn-outline-secondary text-subtle";
      tenseOptions.push(
        <button
          key={"tenseOptions_button_" + i}
          onClick={() => {
            if (iTense !== tense) {
              sessionStorage.setItem("tense", iTense);
              setTense(iTense);
            }
          }}
          className={"btn " + css}
        >
          {iTense}
        </button>
      );
      if (i !== tenses.length - 1) {
        tenseOptions.push(
          <span key={"tenseOptions_span_" + i} className="text-subtle px-1">
            |
          </span>
        );
      }
    }
    return <Fragment>{tenseOptions}</Fragment>;
  };

  const getBookingSlots = useCallback(() => {
    setLoading(true);
    const params = {
      page,
      pageSize,
      tense,
    };
    if (service !== "null") {
      params.service = service;
    }
    apiGet("manage-booking-slots", params).then((response) => {
      setLoading(false);
      if (response.status === 200) {
        setBookingSlots(response.data.bookingSlots);
        setPageCount(response.data.pages);
        setResults(response.data.results);
        setServices(response.data.services);
      } else {
        toast.error(`Error fetching businesses!`, {
          theme: "dark",
          position: "bottom-center",
          autoClose: 2000,
          pauseOnFocusLoss: false,
          toastId: "fetch-booking-slots-error",
        });
      }
    });
  }, [page, pageSize, tense, service, navigate]);

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
        {services.map((service) => (
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

  useEffect(() => {
    getBookingSlots();
  }, [getBookingSlots]);

  return (
    <div className="container">
      {location?.state?.from?.title && (
        <div className="mb-2">
          <button className="btn btn-sm btn-link" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left pe-2"></i>
            {location?.state?.from?.title}
          </button>
        </div>
      )}
      <div className="d-flex align-items-center">
        <h1>Manage Booking Slots</h1>
        <Link
          to={{ pathname: "new" }}
          className="btn btn-outline-mids-mutts ms-auto"
        >
          Add New&nbsp;&nbsp;<i className="fa-solid fa-plus"></i>
        </Link>
      </div>
      <div className="d-sm-flex flex-wrap justify-content-start">
        <div className="p-2">{serviceOptions}</div>
        <div className="p-2">
          <div className="text-subtle">When: {tenseOptions()}</div>
        </div>
      </div>
      {results > 0 && pageCount > 1 && (
        <div className="pt-3 px-3">
          <div className="text-subtle">
            Showing {page * pageSize + 1}-
            {page * pageSize + bookingSlots.length} of {results} businesses
            found.
          </div>
        </div>
      )}
      <div className="border-top border-mids-mutts border-bottom py-3 my-3">
        {bookingSlots.length === 0 && !loading && (
          <div className="text-center text-subtle display-8 pt-2">
            No Results
          </div>
        )}
        {loading ? (
          <div className="d-flex pt-2">
            <ClipLoader className="mx-auto" color="#0082b4" />
          </div>
        ) : (
          <Row className="row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1">
            {bookingSlotsElement}
          </Row>
        )}
      </div>
      <div className="d-flex justify-content-center">
        {bookingSlots.length > 0 && paginator(page, pageCount, setPage)}
      </div>
      <div className="d-flex flex-wrap justify-content-start">
        <div className="py-3">
          <div className="text-subtle">
            Results per page: {perPageOptions(3, 8, 16, pageSize, setPageSize)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingSlots;
