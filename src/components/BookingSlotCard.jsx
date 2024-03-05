import { Fragment } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";

const getOutstandingCost = (bookings) => {
  return (
    parseFloat(
      bookings
        .filter(
          (booking) =>
            booking.status === "CONFIRMED" && booking.payment === "OUTSTANDING"
        )
        .reduce(
          (accumulator, currentValue) => accumulator + currentValue.cost,
          0
        )
    ) / 100.0
  );
};

function BookingSlotCard({ bookingSlot }) {
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
                  <i className="fa-solid fa-location-dot" title="location"></i>
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
}

export default BookingSlotCard;
