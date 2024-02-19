import { Fragment } from "react";
import Card from "react-bootstrap/Card";
import moment from "moment";

function BookingCard({ booking, mine, reviewRequest }) {
  return (
    <Card className="h-100">
      <Card.Header>
        {booking.confirmed ? (
          <div className="lead">{booking.bookingSlot.service.name}</div>
        ) : (
          <div className="lead d-flex align-items-end">
            <span className="small">{booking.businessUserPet.pet.name}</span>
            <span className="small ps-1">
              {`(${booking.businessUserPet.pet.owner.firstname} ${booking.businessUserPet.pet.owner.lastname})`}
            </span>
          </div>
        )}
      </Card.Header>
      <Card.Body className="d-flex flex-column gap-2">
        {!booking.confirmed && (
          <div className="lead">{booking.bookingSlot.service.name}</div>
        )}
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
                  booking.bookingSlot.locationLink ??
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
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
      {mine === false && (
        <Card.Footer className="p-2 d-flex gap-2">
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
                Reject
              </button>
            </Fragment>
          )}
        </Card.Footer>
      )}
    </Card>
  );
}

export default BookingCard;
