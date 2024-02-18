import { Fragment, useContext, useState, useEffect, useCallback } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../helpers/AuthContext";
import { apiGet } from "../helpers/NetworkHelper";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import BookingCard from "../components/BookingCard";

function Dashboard() {
  const { loggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

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
          {upcomingBookings.map((booking) => (
            <div key={booking.id}>
              <BookingCard booking={booking} mine={true} />
            </div>
          ))}
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

  const getDashboard = useCallback(() => {
    setLoading(true);
    setLoadingPros(true);
    setLoadingUpcomingBookings(true);
    apiGet("user/dashboard").then((response) => {
      console.log(response.data);
      setLoading(false);
      setLoadingPros(false);
      setLoadingUpcomingBookings(false);
      if (response.status === 200) {
        setBusinessUsers(response.data.pros);
        setUpcomingBookings(response.data.upcomingBookings);
      } else {
        navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  return (
    <Container>
      {headerSection}
      {upcomingBookingsSection}
      {prosSection}
    </Container>
  );
}

export default Dashboard;
