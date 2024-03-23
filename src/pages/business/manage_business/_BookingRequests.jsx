import { useCallback } from "react";
import { apiPost } from "../../../helpers/NetworkHelper";
import { toast } from "react-toastify";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BookingCard from "../../../components/BookingCard";

export default function ({ bookingRequests, setBookingRequests }) {
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

  return (
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
}
