import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  Fragment,
} from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { apiGet } from "../../helpers/NetworkHelper";
import { AuthContext } from "../../helpers/AuthContext";
import { ClipLoader } from "react-spinners";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";
import _ApproveUsers from "./manage_business/_ApproveUsers";
import _Services from "./manage_business/_Services";
import _BookingRequests from "./manage_business/_BookingRequests";
import _PaymentInstructions from "./manage_business/_PaymentInstructions";
import Page from "../../components/Page";

function ManageBusiness() {
  const { loggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();

  if (!loggedInUser) {
    navigate("/");
  }

  const state = { from: { title: "Manage Business" } };

  const [business, setBusiness] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState(null);
  const [paymentInstructions, setPaymentInstructions] = useState("<p></p>");

  const getBusiness = useCallback(() => {
    setLoaded(false);
    apiGet("manage-business").then((response) => {
      setLoaded(true);
      console.log(response.data);
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

  const paymentInstructionsKey = "paymentInstructions";
  const paymentInstructionsTitle = "Payment Instructions";
  const paymentInstructionsSection = (
    <_PaymentInstructions
      business={business}
      paymentInstructions={paymentInstructions}
      setPaymentInstructions={setPaymentInstructions}
    />
  );

  const clientsKey = "clientRequests";
  const clientsTitle = (
    <div className="d-flex">
      Applications
      {approvals?.length > 0 && (
        <span className="ms-2 px-2 bg-danger text-light rounded-circle">
          {approvals.length}
        </span>
      )}
    </div>
  );
  const clientSection = (
    <_ApproveUsers approvals={approvals} setApprovals={setApprovals} />
  );

  const bookingRequestsKey = "bookingRequests";
  const bookingRequestsTitle = (
    <div className="d-flex">
      Booking Requests
      {bookingRequests?.length > 0 && (
        <span className="ms-2 px-2 bg-danger text-light rounded-circle">
          {bookingRequests.length}
        </span>
      )}
    </div>
  );
  const bookingRequestsSection = (
    <_BookingRequests
      bookingRequests={bookingRequests}
      setBookingRequests={setBookingRequests}
    />
  );

  const servicesKey = "services";
  const servicesTitle = "Services";
  const servicesSection = <_Services business={business} state={state} />;

  const tab = (key, title, section) => (
    <Tab eventKey={key} title={title}>
      <div className="border-start border-end border-bottom border-1 rounded-bottom-3 p-3 bg-fore">
        {section}
      </div>
    </Tab>
  );

  const lastTabOpen = sessionStorage.getItem("manageBusinessOpenedTab");

  const tabbedElement = () => (
    <Tabs
      defaultActiveKey={
        lastTabOpen ?? (approvals?.length > 0 ? clientsKey : bookingRequestsKey)
      }
      className="mt-3"
      onSelect={(key, event) => {
        console.log(key);
        sessionStorage.setItem("manageBusinessOpenedTab", key);
      }}
    >
      {approvals?.length > 0 && tab(clientsKey, clientsTitle, clientSection)}
      {tab(bookingRequestsKey, bookingRequestsTitle, bookingRequestsSection)}
      {tab(servicesKey, servicesTitle, servicesSection)}
      {tab(
        paymentInstructionsKey,
        paymentInstructionsTitle,
        paymentInstructionsSection
      )}
    </Tabs>
  );

  const accordionItem = (key, title, section) => (
    <Accordion.Item eventKey={key}>
      <Accordion.Header>{title}</Accordion.Header>
      <Accordion.Body>{section}</Accordion.Body>
    </Accordion.Item>
  );

  const accordionElement = () => (
    <Accordion className="mt-3">
      {approvals?.length > 0 &&
        accordionItem(clientsKey, clientsTitle, clientSection)}
      {accordionItem(
        bookingRequestsKey,
        bookingRequestsTitle,
        bookingRequestsSection
      )}
      {accordionItem(servicesKey, servicesTitle, servicesSection)}
      {accordionItem(
        paymentInstructionsKey,
        paymentInstructionsTitle,
        paymentInstructionsSection
      )}
    </Accordion>
  );

  const businessPendingView = (
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
  );

  const noBusinessView = (
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
  );

  return (
    <Page>
      {!loaded ? (
        <div className="d-flex pt-2">
          <ClipLoader className="mx-auto" color="#0082b4" />
        </div>
      ) : business ? (
        <Fragment>
          {headerElement()}
          <div className="d-none d-md-block">{tabbedElement()}</div>
          <div className="d-md-none d-block">{accordionElement()}</div>
        </Fragment>
      ) : status === "PENDING" ? (
        { businessPendingView }
      ) : (
        { noBusinessView }
      )}
    </Page>
  );
}

export default ManageBusiness;
