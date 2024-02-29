import { Fragment, useContext, useState, useEffect, useCallback } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useNavigate, Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../helpers/AuthContext";
import { apiGet } from "../helpers/NetworkHelper";
import { ClipLoader } from "react-spinners";
import BookingCard from "../components/BookingCard";
import moment from "moment";

function Dashboard() {
  const { loggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadingPros, setLoadingPros] = useState(true);
  const [loadingUpcomingBookings, setLoadingUpcomingBookings] = useState(true);

  const [businessUsers, setBusinessUsers] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);

  const headerSection = (
    <div>
      <p className="lead text-subtle mb-0">
        {loggedInUser?.firstname} {loggedInUser?.lastname}
      </p>
      <h1>My Dashboard</h1>
    </div>
  );

  const getOutstandingCost = (bookings) => {
    return (
      parseFloat(
        bookings
          .filter(
            (booking) =>
              booking.status === "CONFIRMED" &&
              booking.payment === "OUTSTANDING"
          )
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue.cost,
            0
          )
      ) / 100.0
    );
  };

  const bookingSlotsElement = upcomingBookings.map((bookingSlot) => {
    return (
      <div className="col my-2" key={bookingSlot._id}>
        <Card className="h-100">
          <Card.Header className="lead">{bookingSlot.service.name}</Card.Header>
          <Card.Body className="d-flex flex-column gap-2">
            <div className="mt-0">
              with <b>{bookingSlot?.business?.name}</b>
            </div>
            <div>
              <div>
                <i className="fa-solid fa-paw"></i>
                {"  "}
                Pets:
              </div>
              <ul className="mb-0">
                {bookingSlot.bookings.map((booking) => (
                  <li key={booking._id}>{booking.businessUserPet.pet.name}</li>
                ))}
              </ul>
            </div>
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
          <Card.Footer className="p-2 d-flex">
            {bookingSlot.bookings.every(
              (booking) => booking.status === "CONFIRMED"
            ) ? (
              bookingSlot.bookings.every(
                (booking) => booking.payment === "CONFIRMED"
              ) ? (
                <Button className="btn-success disabled flex-fill">PAID</Button>
              ) : (
                <Button className="btn-success flex-fill">
                  Pay: £{getOutstandingCost(bookingSlot.bookings).toFixed(2)}
                </Button>
              )
            ) : (
              <Button className="btn-secondary disabled flex-fill">
                AWAITING CONFIRMATION
              </Button>
            )}
          </Card.Footer>
        </Card>
      </div>
    );
  });

  const upcomingBookingsSection = (
    <Fragment>
      <hr />
      <div>
        <h2>Upcoming Bookings</h2>
      </div>
      {loadingUpcomingBookings ? (
        <div className="d-flex pt-2">
          <ClipLoader className="mx-auto" color="#0082b4" />
        </div>
      ) : upcomingBookings.length > 0 ? (
        <Row className="row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 pt-2">
          {bookingSlotsElement}
        </Row>
      ) : (
        <div className="lead text-subtle text-center">
          No upcoming bookings.
        </div>
      )}
    </Fragment>
  );

  const prosSection = (
    <Fragment>
      <hr />
      <div className="d-flex align-items-center">
        <h2>Professionals</h2>
        {!loading && businessUsers.length > 0 && (
          <Link
            to={{ pathname: "/businesses" }}
            state={{ from: { title: "Dashboard" } }}
            className="btn btn-outline-mids-mutts ms-auto"
          >
            Find More
          </Link>
        )}
      </div>
      {loadingPros ? (
        <div className="d-flex pt-2">
          <ClipLoader className="mx-auto" color="#0082b4" />
        </div>
      ) : businessUsers.length > 0 ? (
        <Row className="row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 pt-2">
          {businessUsers.map((businessUser) => (
            <Col key={businessUser.id}>
              <Card>
                <Card.Header className="lead">
                  {businessUser.business.name}
                </Card.Header>
                <Card.Footer className="p-2 d-flex gap-2">
                  <Link
                    to={{
                      pathname: `/businesses/${businessUser.business.slug}`,
                    }}
                    state={{
                      from: {
                        title: "Dashboard",
                      },
                    }}
                    className="btn btn-mids-mutts flex-fill"
                  >
                    Go To
                  </Link>
                  {/* <Link
                    to={{
                      pathname: `/bookings?business=${businessUser.business.slug}`,
                    }}
                    state={{
                      from: {
                        title: "Dashboard",
                      },
                    }}
                    className="btn btn-mids-mutts flex-fill"
                  >
                    Bookings
                  </Link> */}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center">
          <p className="text-subtle lead">
            You don't have any professionals yet
          </p>
          <Link
            to={{ pathname: "/businesses" }}
            state={{ from: { title: "Dashboard" } }}
            className="btn btn-mids-mutts"
          >
            Find one
          </Link>
        </div>
      )}
    </Fragment>
  );

  const getPros = useCallback(() => {
    setLoadingPros(true);
    apiGet("business-user").then((response) => {
      setLoadingPros(false);
      if (response.status === 200) {
        setBusinessUsers(response.data.pros);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  const getUpcomingBookings = useCallback(() => {
    setLoadingUpcomingBookings(true);
    apiGet("bookings/asSlots", {
      tense: "BOTH",
      pageSize: 4,
      page: 0,
    }).then((response) => {
      setLoadingUpcomingBookings(false);
      if (response.status === 200) {
        setUpcomingBookings(response.data.bookingSlots);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  useEffect(() => {
    getPros();
  }, []);

  useEffect(() => {
    getUpcomingBookings();
  }, [getUpcomingBookings]);

  return (
    <Container>
      {headerSection}
      {upcomingBookingsSection}
      {prosSection}
    </Container>
  );
}

export default Dashboard;
