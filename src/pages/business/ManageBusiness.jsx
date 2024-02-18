import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  Fragment,
} from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { apiGet, apiPost } from "../../helpers/NetworkHelper";
import { AuthContext } from "../../helpers/AuthContext";
import { ClipLoader } from "react-spinners";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import BookingCard from "../../components/BookingCard";

function ManageBusiness() {
  const { loggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  if (!loggedInUser) {
    navigate("/");
  }

  const state = { from: { title: "Manage Business" } };

  const [business, setBusiness] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const getBusiness = useCallback(() => {
    setLoaded(false);
    apiGet("manage-business").then((response) => {
      setLoaded(true);
      if (response.status === 200) {
        if (response.data) {
          setBusiness(response.data.business);
          setApprovals(
            response.data.business.businessUsers.filter((bu) => !bu.confirmed)
          );
          setBookingRequests(response.data.bookingRequests);
          console.log(response.data);
        }
      } else {
        navigate("/");
      }
    });
  }, [setBusiness, navigate]);

  useEffect(() => {
    getBusiness();
  }, [getBusiness]);

  const headerElement = () => {
    return (
      <div>
        <div className="d-flex flex-wrap align-items-center">
          <h1>Manage {business.name}</h1>
        </div>
        <div>
          {business.phone && (
            <div className="p-2">
              <span>
                <i className="fa-solid fa-phone" title="Phone Number"></i>
              </span>
              &nbsp;&nbsp;
              <span>{business.phone}</span>
            </div>
          )}
          {business.website && (
            <div className="p-2">
              <span>
                <i className="fa-solid fa-globe" title="Website"></i>
              </span>
              &nbsp;&nbsp;
              <span>{business.website}</span>
            </div>
          )}
          {business.email && (
            <div className="p-2">
              <span>
                <i className="fa-solid fa-envelope" title="Email"></i>
              </span>
              &nbsp;&nbsp;
              <span>{business.email}</span>
            </div>
          )}
        </div>
        {business.address && (
          <div className="p-2">
            <span>
              <i className="fa-solid fa-building" title="Address"></i>
            </span>
            &nbsp;&nbsp;
            <span>{business.address}</span>
          </div>
        )}
        <div className="d-flex gap-3 flex-wrap mt-2">
          <Link
            to={{ pathname: "edit" }}
            state={{ from: { title: "Manage Business" } }}
            className="btn btn-outline-mids-mutts"
          >
            Edit Info
          </Link>
          <Link
            to={{ pathname: "clients" }}
            state={{ from: { title: "Manage Business" }, business }}
            className="btn btn-outline-mids-mutts"
          >
            Manage Clients
          </Link>
          <Link
            to={{ pathname: "booking-slots" }}
            state={{ from: { title: "Manage Business" }, business }}
            className="btn btn-outline-mids-mutts"
          >
            Manage Booking Slots
          </Link>
        </div>
      </div>
    );
  };

  const approve = (bu, approved) => {
    apiPost(`/manage-business/review-user/${bu._id}`, { approved }).then(
      (response) => {
        if (response.status === 200) {
          let newApprovals = [...approvals];
          newApprovals.splice(newApprovals.indexOf(bu));
          setApprovals([...newApprovals]);
        }
      }
    );
  };

  const approveUsersElement = (
    <div className="standard-grid">
      {approvals.map((bu) => (
        <div className="col" key={bu._id}>
          <Card>
            <Card.Body className="lead">
              {bu.user.firstname} {bu.user.lastname}
              <br />
              <span className="small text-subtle">@{bu.user.username}</span>
            </Card.Body>
            <Card.Footer className="p-2">
              <div className="d-flex gap-2">
                <button
                  className="form-control btn btn-success"
                  onClick={() => approve(bu, true)}
                >
                  Approve
                </button>
                <button
                  className="form-control btn btn-outline-danger"
                  onClick={() => approve(bu, false)}
                >
                  Deny
                </button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      ))}
    </div>
  );

  const servicesElement = (
    <Fragment>
      <div className="d-flex align-items-center mb-3">
        {business?.services && business?.services.length > 0 && (
          <Link
            to={{ pathname: "/manage-business/new-service" }}
            state={state}
            className="btn btn-outline-mids-mutts ms-auto"
          >
            Add New&nbsp;&nbsp;<i className="fa-solid fa-plus"></i>
          </Link>
        )}
      </div>
      {business?.services?.length > 0 ? (
        <div className="standard-grid">
          {business.services.map((service) => (
            <div className="col" key={service._id}>
              <Card>
                <Card.Header className="lead">{service.name}</Card.Header>
                <Card.Body>{service.description}</Card.Body>
                <Card.Footer className="p-2">
                  <Link
                    to={{
                      pathname: `/manage-business/edit-service/${service.slug}`,
                    }}
                    state={state}
                    className="form-control btn btn-outline-mids-mutts"
                  >
                    Edit
                  </Link>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-subtle display-8">
          <p className="text-center">No services</p>
          <Link
            to={{ pathname: "/manage-business/new-service" }}
            state={state}
            className="btn btn-mids-mutts ms-auto"
          >
            Create first service
          </Link>
        </div>
      )}
    </Fragment>
  );

  const bookingRequestTab = (
    <Row className="standard-grid">
      {bookingRequests.length > 0 &&
        bookingRequests.map((br) => (
          <Col>
            <BookingCard booking={br} mine={false} />
          </Col>
        ))}
    </Row>
  );

  const clientTab = (
    <Fragment>
      {approvals?.length > 0 && <Fragment>{approveUsersElement}</Fragment>}
    </Fragment>
  );

  const servicesTab = <Fragment>{servicesElement}</Fragment>;

  const clientsTabTitle = (
    <div className="d-flex">
      Applications
      {approvals?.length > 0 && (
        <span className="ms-2 px-2 bg-danger text-light rounded-circle">
          {approvals.length}
        </span>
      )}
    </div>
  );

  const bookingRequestsTabTitle = (
    <div className="d-flex">
      Booking Requests
      {bookingRequests?.length > 0 && (
        <span className="ms-2 px-2 bg-danger text-light rounded-circle">
          {bookingRequests.length}
        </span>
      )}
    </div>
  );

  const tabbedElement = (
    <Tabs
      defaultActiveKey={approvals?.length > 0 ? "clients" : "bookings"}
      className="mt-3"
    >
      {approvals?.length > 0 && (
        <Tab eventKey="clients" title={clientsTabTitle}>
          <div className="border-start border-end border-bottom border-1 rounded-bottom-3 p-3 bg-fore">
            {clientTab}
          </div>
        </Tab>
      )}
      <Tab eventKey="bookings" title={bookingRequestsTabTitle}>
        <div className="border-start border-end border-bottom border-1 rounded-bottom-3 p-3 bg-fore">
          {bookingRequestTab}
        </div>
      </Tab>
      <Tab eventKey="services" title="Services">
        <div className="border-start border-end border-bottom border-1 rounded-bottom-3 p-3 bg-fore">
          {servicesTab}
        </div>
      </Tab>
    </Tabs>
  );

  const accordionElement = (
    <Accordion className="mt-3">
      {approvals?.length > 0 && (
        <Accordion.Item eventKey="clients">
          <Accordion.Header>{clientsTabTitle}</Accordion.Header>
          <Accordion.Body>{clientTab}</Accordion.Body>
        </Accordion.Item>
      )}
      <Accordion.Item eventKey="bookings">
        <Accordion.Header>{bookingRequestsTabTitle}</Accordion.Header>
        <Accordion.Body>{bookingRequestTab}</Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="services">
        <Accordion.Header>Services</Accordion.Header>
        <Accordion.Body>{servicesTab}</Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  return (
    <React.Fragment>
      <div>
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
        {!loaded ? (
          <div className="d-flex pt-2">
            <ClipLoader className="mx-auto" color="#0082b4" />
          </div>
        ) : business ? (
          <Fragment>
            {headerElement()}
            <div className="d-none d-md-block">{tabbedElement}</div>
            <div className="d-md-none d-block">{accordionElement}</div>
            {/* {bookingRequestsElement}
            {approvals.length > 0 && (
              <Fragment>
                <hr />
                <h2 className="mb-3">Client Applications</h2>
                {approveUsersElement()}
              </Fragment>
            )}
            <hr />
            {servicesElement()} */}
          </Fragment>
        ) : (
          <div>
            <h3 className="text-center">You don't currently have a business</h3>
            <div className="d-flex justify-content-center m-3">
              <Link
                to={{ pathname: "/new-business" }}
                state={state}
                className="btn btn-mids-mutts"
              >
                Create my business
              </Link>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default ManageBusiness;
