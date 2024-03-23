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
import { toast } from "react-toastify";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import BookingCard from "../../components/BookingCard";
import parse from "html-react-parser";
import TinyMCEEditor from "../../components/editor/TinyMCEEditor";
import _ApproveUsers from "./manage_business/_ApproveUsers";
import _Services from "./manage_business/_Services";
import _BookingRequests from "./manage_business/_BookingRequests";

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
  const [status, setStatus] = useState(null);

  const [editingPaymentInstructions, setEditingPaymentInstructions] =
    useState(false);
  const [savingPaymentInstructions, setSavingPaymentInstructions] =
    useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState("<p></p>");

  const defaultTab = approvals?.length > 0 ? "clients" : "bookings";

  const getBusiness = useCallback(() => {
    setLoaded(false);
    apiGet("manage-business").then((response) => {
      setLoaded(true);
      if (response.status === 200) {
        if (response.data) {
          setBusiness(response.data.business);
          setPaymentInstructions(response.data.business?.paymentInstructions);
          setApprovals(
            response.data.business?.businessUsers?.filter((bu) => !bu.confirmed)
          );
          setStatus(response.data.status);
          setBookingRequests(response.data.bookingRequests);
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

  const savePaymentInstructions = () => {
    const content = paymentInstructions;
    if (content !== business.paymentInstructions) {
      setSavingPaymentInstructions(true);
      apiPost("manage-business/payment-instructions", {
        paymentInstructions: content,
      }).then((response) => {
        setSavingPaymentInstructions(false);
        if (response.status === 200) {
          setBusiness({
            ...business,
            paymentInstructions: content,
          });
          setPaymentInstructions(response.data.paymentInstructions);
        } else {
          // Failed
        }
        setEditingPaymentInstructions(false);
      });
    }
  };

  const paymentInstructionsTab = (
    <Fragment>
      <div className="d-flex flex-column gap-3 align-items-start">
        {editingPaymentInstructions ? (
          <div className="w-100 d-flex flex-column gap-3 ">
            <TinyMCEEditor
              initialValue={business?.paymentInstructions}
              value={paymentInstructions}
              setValue={setPaymentInstructions}
              id="paymentInstructionsEditor"
            />
            <div className="d-flex gap-3">
              <Button
                variant="success"
                disabled={savingPaymentInstructions}
                onClick={savePaymentInstructions}
              >
                Save Instructions
              </Button>
              <Button
                variant="outline-light"
                onClick={() => setEditingPaymentInstructions(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-100 d-flex flex-column gap-3 align-items-start">
            {paymentInstructions ? (
              parse(paymentInstructions)
            ) : (
              <div className="text-center w-100">
                {
                  "To make payments quicker and easier for your clients, you can add payment instructions which will show for them whenever they click "
                }
                <Button variant="success" className="btn-sm">
                  Pay
                </Button>
                {" on a booking on this site"}
              </div>
            )}

            <Button
              variant="success"
              className={`${!paymentInstructions && "align-self-center"}`}
              onClick={() =>
                setEditingPaymentInstructions(!editingPaymentInstructions)
              }
            >
              {paymentInstructions ? "Edit" : "Add"}
              {" Payment Instructions"}
            </Button>
          </div>
        )}
      </div>
    </Fragment>
  );

  const clientTab = (
    <Fragment>{approvals?.length > 0 && <_ApproveUsers />}</Fragment>
  );

  const bookingRequestsTab = (
    <_BookingRequests
      bookingRequests={bookingRequests}
      setBookingRequests={setBookingRequests}
    />
  );

  const servicesTab = <_Services business={business} state={state} />;

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
    <Tabs defaultActiveKey={defaultTab} className="mt-3">
      {approvals?.length > 0 && (
        <Tab eventKey="clients" title={clientsTabTitle}>
          <div className="border-start border-end border-bottom border-1 rounded-bottom-3 p-3 bg-fore">
            {clientTab}
          </div>
        </Tab>
      )}
      <Tab eventKey="bookings" title={bookingRequestsTabTitle}>
        <div className="border-start border-end border-bottom border-1 rounded-bottom-3 p-3 bg-fore">
          {bookingRequestsTab}
        </div>
      </Tab>
      <Tab eventKey="services" title="Services">
        <div className="border-start border-end border-bottom border-1 rounded-bottom-3 p-3 bg-fore">
          {servicesTab}
        </div>
      </Tab>
      <Tab eventKey="paymentInstructions" title="Payment Instructions">
        <div className="border-start border-end border-bottom border-1 rounded-bottom-3 p-3 bg-fore">
          {paymentInstructionsTab}
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
        <Accordion.Body>{bookingRequestsTab}</Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="services">
        <Accordion.Header>Services</Accordion.Header>
        <Accordion.Body>{servicesTab}</Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="paymentInstructions">
        <Accordion.Header>Payment Instructions</Accordion.Header>
        <Accordion.Body>{paymentInstructionsTab}</Accordion.Body>
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
        ) : status === "PENDING" ? (
          <div>
            <h3 className="text-center">Your business is pending approval</h3>
            <div className="d-flex justify-content-center m-3">
              <Link
                to={{ pathname: "/new-business" }}
                state={state}
                className="btn btn-success"
              >
                Edit business details
              </Link>
            </div>
          </div>
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
