import { Fragment, useContext } from "react";
import Card from "react-bootstrap/Card";
import moment from "moment";
import { AuthContext } from "../helpers/AuthContext";

function BookingCard({
  booking,
  mine,
  reviewRequest,
  showBusiness,
  manageBookingSlot,
  pressedPay,
}) {
  const { loggedInUser } = useContext(AuthContext);
  return (
    <Card className="h-100">
      <Card.Header>
        <div className="lead">{booking.bookingSlot.service.name}</div>
      </Card.Header>
      <Card.Body className="d-flex flex-column gap-2">
        {mine && (
          <div className="mt-0">
            with <b>{booking?.business?.name}</b>
          </div>
        )}
        {!mine && (
          <div>
            <i className="fa-solid fa-user"></i>
            {"  "}
            {booking.businessUserPet.pet.owner.firstname}
          </div>
        )}
        <div>
          <i className="fa-solid fa-paw"></i>
          {"  "}
          {booking.businessUserPet.pet.name}
        </div>
        <div>
          <i className="fa-solid fa-calendar-days"></i>
          {"  "}
          {moment(booking.start_time).format("ddd Do MMM")}
        </div>
        <div>
          <i className="fa-solid fa-clock"></i>
          {"  "}
          {moment(booking.start_time).format("h:mm a")} -{" "}
          {moment(booking.end_time).format("h:mm a")}
        </div>
        {booking.bookingSlot.info?.length > 0 && booking.mine && (
          <div>
            <b>Information:</b>
            <div className="px-2">{booking.bookingSlot.info}</div>
          </div>
        )}
        {booking.bookingSlot.location?.length > 0 && (
          <Fragment>
            <div>
              <a
                className="remove-underline"
                href={
                  booking.bookingSlot.locationLink?.length > 0
                    ? booking.bookingSlot.locationLink
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        booking.bookingSlot.location
                      )}`
                }
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa-solid fa-location-dot" title="location"></i>
                {"  "}
                <span className="underlined-hover">
                  {booking.bookingSlot.location}
                </span>
              </a>
            </div>
          </Fragment>
        )}
      </Card.Body>
      <Card.Footer className="p-2 d-flex gap-2">
        {mine ? (
          <Fragment>
            {booking.status === "CONFIRMED" && (
              <button
                className={`btn ${
                  booking.payment === "OUTSTANDING"
                    ? "btn-success"
                    : booking.payment === "PENDING"
                    ? "btn-secondary disabled"
                    : "btn-success disabled"
                } flex-fill`}
                onClick={() => pressedPay(booking)}
              >
                {booking.payment === "OUTSTANDING"
                  ? `Pay £${(booking.cost / 100).toFixed(2)}`
                  : "Paid"}
              </button>
            )}
            {moment(booking.start_time) > moment() && (
              <button className="btn btn-outline-danger flex-fill">
                Cancel
              </button>
            )}
          </Fragment>
        ) : (
          <Fragment>
            {booking.confirmed ? (
              <button className="btn btn-outline-mids-mutts flex-fill">
                Manage
              </button>
            ) : (
              <Fragment>
                <button
                  className="btn btn-success flex-fill"
                  onClick={() => reviewRequest(booking, true)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-outline-danger flex-fill"
                  onClick={() => reviewRequest(booking, false)}
                >
                  Deny
                </button>
              </Fragment>
            )}
          </Fragment>
        )}
      </Card.Footer>
    </Card>
  );
}

export default BookingCard;
