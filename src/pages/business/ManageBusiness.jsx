import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  Fragment,
  useRef,
} from "react";
import {
  useNavigate,
  Link,
  useLocation,
  createSearchParams,
} from "react-router-dom";
import { apiGet, apiPost } from "../../helpers/NetworkHelper";
import { AuthContext } from "../../helpers/AuthContext";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import Card from "react-bootstrap/Card";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import BookingCard from "../../components/BookingCard";
import { Formik, Form, Field } from "formik";
import {
  // Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  ContentState,
} from "draft-js";
import DraftEditor from "../../components/editor/DraftEditor";
import tinymce, { Editor } from "@tinymce/tinymce-react";
import parse from "html-react-parser";

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

  const defaultTab = "paymentInstructions"; // approvals?.length > 0 ? "clients" : "bookings";

  const getBusiness = useCallback(() => {
    setLoaded(false);
    apiGet("manage-business").then((response) => {
      setLoaded(true);
      if (response.status === 200) {
        console.log(response.data);
        if (response.data) {
          setBusiness(response.data.business);
          setPaymentInstructions(response.data.business?.paymentInstructions);
          editorRef.current?.setContent(
            response.data.business?.paymentInstructions
          );
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

  const approveUser = (bu, approved) => {
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
      {approvals?.map((bu) => (
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
                  onClick={() => approveUser(bu, true)}
                >
                  Approve
                </button>
                <button
                  className="form-control btn btn-outline-danger"
                  onClick={() => approveUser(bu, false)}
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

  const reviewRequest = useCallback(
    (request, accepted) => {
      apiPost("manage-booking-slots/review-request", {
        booking_id: request._id,
        accepted,
      }).then((response) => {
        if (response.status === 200) {
          setBookingRequests({
            ...bookingRequests.filter((br) => br === request),
          });
          toast.success(`Request ${accepted ? "accepted" : "rejected"}`, {
            theme: "dark",
            position: "top-center",
            autoClose: 1000,
            pauseOnFocusLoss: false,
          });
        } else {
          toast.error(`Something went wrong`, {
            theme: "dark",
            position: "top-center",
            autoClose: 1000,
            pauseOnFocusLoss: false,
          });
        }
      });
    },
    [bookingRequests]
  );

  const bookingRequestTab = (
    <Row className="standard-grid">
      {bookingRequests.length > 0 &&
        bookingRequests.map((br) => (
          <Col key={br._id}>
            <BookingCard
              booking={br}
              mine={false}
              reviewRequest={reviewRequest}
            />
          </Col>
        ))}
    </Row>
  );
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const editorRef = useRef(null);

  const [dirty, setDirty] = useState(false);

  useEffect(() => setDirty(false), [paymentInstructions]);

  const savePaymentInstructions = () => {
    const content = editorRef.current.getContent();
    if (content !== business.paymentInstructions)
      setSavingPaymentInstructions(true);
    apiPost("manage-business/payment-instructions", {
      paymentInstructions: content,
    }).then((response) => {
      setSavingPaymentInstructions(false);
      if (response.status === 200) {
        console.log(response.data);
        setBusiness({
          ...business,
          paymentInstructions: content,
        });
        setPaymentInstructions(response.data.paymentInstructions);
        editorRef.current?.setContent(response.data.paymentInstructions);
      } else {
        // Failed
      }
      setEditingPaymentInstructions(false);
    });
  };

  const tinyMCEEditor = (
    <Editor
      tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={business?.paymentInstructions}
      value={paymentInstructions}
      onEditorChange={(newValue, editor) => setPaymentInstructions(newValue)}
      init={{
        selector: "#paymentInstructionsEditor",
        skin: "oxide-dark",
        content_css: "dark",
        height: 300,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "charmap",
          "anchor",
          "searchreplace",
          "table",
          "preview",
          "help",
        ],
        toolbar:
          "undo redo | " +
          "bold italic | bullist numlist | " +
          "removeformat | help",
        content_style:
          "body { font-family:Montserrat,Arial,sans-serif; font-size:14px }",
      }}
    />
  );

  const htmlDecode = (input) => {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  };

  const paymentInstructionsTab = (
    <Fragment>
      <div className="d-flex flex-column gap-3 align-items-start">
        {editingPaymentInstructions ? (
          <div className="w-100 d-flex flex-column gap-3 ">
            {/* <DraftEditor
              editorState={editorState}
              setEditorState={setEditorState}
            /> */}
            {tinyMCEEditor}
            <div className="d-flex gap-3">
              <Button variant="success" onClick={savePaymentInstructions}>
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
          {bookingRequestTab}
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
        <Accordion.Body>{bookingRequestTab}</Accordion.Body>
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
