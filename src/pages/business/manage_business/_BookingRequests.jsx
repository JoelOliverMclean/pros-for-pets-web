import { useCallback } from "react";
import { apiPost } from "../../../helpers/NetworkHelper";
import { toast } from "react-toastify";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BookingCard from "../../../components/BookingCard";
import { useNavigate } from "react-router-dom";

export default function ({ bookingRequests, setBookingRequests }) {
  const navigate = useNavigate();

  const reviewRequest = useCallback(
    (request, accepted) => {
      apiPost("manage-booking-slots/review-request", {
        booking_id: request._id,
        accepted,
      }).then((response) => {
        if (response.status === 200) {
          toast.success(`Request ${accepted ? "accepted" : "rejected"}`, {
            theme: "dark",
            position: "top-center",
            autoClose: 1000,
            pauseOnFocusLoss: false,
            onClose: () => {
              navigate(0);
            },
          });
        } else {
          toast.error(`Something went wrong`, {
            theme: "dark",
            position: "top-center",
            autoClose: 1000,
            pauseOnFocusLoss: false,
            onClose: () => {
              navigate(0);
            },
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
