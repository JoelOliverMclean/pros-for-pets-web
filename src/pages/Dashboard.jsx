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
import BookingSlotCard from "../components/BookingSlotCard";
import UIUtils from "../helpers/UIUtils";

function Dashboard() {
  const { loggedInUser, breakpoint } = useContext(AuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadingPros, setLoadingPros] = useState(true);
  const [loadingUpcomingBookings, setLoadingUpcomingBookings] = useState(true);
  const [loadingOutstandingPayments, setLoadingOutstandingPayments] =
    useState(true);

  const [businessUsers, setBusinessUsers] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [outstandingPayments, setOutstandingPayments] = useState([]);

  const getSectionColClass = (list) => {
    if (list?.length < 3) {
      return "col-xl-6";
    } else {
      return "";
    }
  };

  const getRowClasses = (length) =>
    `${
      length > 3 ? "row-cols-xl-4" : "row-cols-xl-2"
    } row-cols-lg-3 row-cols-md-2 row-cols-1 pt-2`;

  const getMaxDisplayCount = () => {
    return UIUtils.isAtLeast("xl", breakpoint)
      ? 4
      : UIUtils.isAtLeast("lg", breakpoint)
      ? 3
      : 2;
  };

  const headerSection = (
    <div>
      <p className="lead text-subtle mb-0">
        {loggedInUser?.firstname} {loggedInUser?.lastname}
      </p>
      <h1>My Dashboard</h1>
    </div>
  );

  const getOutstandingPayments = useCallback(() => {
    setLoadingOutstandingPayments(true);
    apiGet("bookings", {
      tense: "BOTH",
      pageSize: 4,
      page: 0,
      payment: "OUTSTANDING",
    }).then((response) => {
      if (response.status === 200) {
        setOutstandingPayments([...response.data.bookings]);
      } else {
      }
      setLoadingOutstandingPayments(false);
    });
  }, []);

  useEffect(() => {
    getOutstandingPayments();
  }, [getOutstandingPayments]);

  console.log(breakpoint);

  const gridSection = (isLoading, list, bodyContent, noResultsText) =>
    isLoading ? (
      <div className="d-flex pt-2">
        <ClipLoader className="mx-auto" color="#0082b4" />
      </div>
    ) : list.length > 0 ? (
      <Row className={getRowClasses(list?.length)}>{bodyContent}</Row>
    ) : (
      <div className="lead text-subtle text-center p-2">{noResultsText}</div>
    );

  const outstandingPaymentsSection = (
    <Col className={`col-12 ${getSectionColClass(outstandingPayments)} p-2`}>
      <Card className="h-100">
        <Card.Body>
          <div>
            <h2>Outstanding Payments</h2>
          </div>
          {gridSection(
            loadingOutstandingPayments,
            outstandingPayments,
            outstandingPayments
              .slice(0, getMaxDisplayCount())
              .map((booking) => (
                <div key={booking._id} className="col">
                  <BookingCard booking={booking} mine={true} />
                </div>
              )),
            "No outstanding payments."
          )}
        </Card.Body>
        <Card.Footer className="p-2 d-flex">
          <Button variant="outline-mids-mutts" className="ms-auto">
            View More
          </Button>
        </Card.Footer>
      </Card>
    </Col>
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

  useEffect(() => {
    getPros();
  }, [getPros]);

  const prosSection = (
    <Col className="col-12 col-xl-6 p-2">
      <Card className="h-100">
        <Card.Body>
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
          {gridSection(
            loadingPros,
            businessUsers,
            businessUsers.slice(0, getMaxDisplayCount()).map((businessUser) => (
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
            )),
            "You don't have any professionals yet."
          )}
        </Card.Body>
        <Card.Footer className="p-2 d-flex">
          {!loadingPros && businessUsers?.length === 0 ? (
            <Link
              to={{ pathname: "/businesses" }}
              state={{ from: { title: "Dashboard" } }}
              className="btn btn-mids-mutts ms-auto"
            >
              Find one
            </Link>
          ) : (
            <Link
              to={{ pathname: "/businesses" }}
              state={{ from: { title: "Dashboard" } }}
              className="btn btn-outline-mids-mutts ms-auto"
            >
              View All
            </Link>
          )}
        </Card.Footer>
      </Card>
    </Col>
  );

  const getUpcomingBookings = useCallback(() => {
    setLoadingUpcomingBookings(true);
    apiGet("bookings/asSlots", {
      tense: "FUTURE",
      pageSize: 4,
      page: 0,
    }).then((response) => {
      setLoadingUpcomingBookings(false);
      if (response.status === 200) {
        setUpcomingBookings([...response.data.bookingSlots]);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  useEffect(() => {
    getUpcomingBookings();
  }, [getUpcomingBookings]);

  const upcomingBookingsSection = (
    <Col className={`col-12 ${getSectionColClass(upcomingBookings)} p-2`}>
      <Card className="h-100">
        <Card.Body>
          <div>
            <h2>Upcoming Bookings</h2>
          </div>
          {gridSection(
            loadingUpcomingBookings,
            upcomingBookings,
            upcomingBookings
              .slice(0, getMaxDisplayCount())
              .map((bookingSlot) => (
                <BookingSlotCard bookingSlot={bookingSlot} />
              )),
            "No upcoming bookings."
          )}
        </Card.Body>
        <Card.Footer className="p-2 d-flex">
          <Button variant="outline-mids-mutts" className="ms-auto">
            View More
          </Button>
        </Card.Footer>
      </Card>
    </Col>
  );

  return (
    <Container>
      {headerSection}
      <Row className="row-gap-2">
        {outstandingPayments?.length > 0 && outstandingPaymentsSection}
        {upcomingBookingsSection}
        {prosSection}
      </Row>
    </Container>
  );
}

export default Dashboard;
