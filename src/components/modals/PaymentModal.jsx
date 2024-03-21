import { Fragment, useContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet } from "../../helpers/NetworkHelper";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../helpers/AuthContext";
import { toast } from "react-toastify";
import parse from "html-react-parser";

function PaymentModal({
  bookingToPay,
  setBookingToPay,
  show,
  setShow,
  onPaid,
}) {
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const [paying, setPaying] = useState(false);

  const markPaid = async (bookingId) => {
    setPaying(true);
    apiPost(`bookings/pay/${bookingId}`).then((response) => {
      handleClose();
      if (response.status === 200) {
        toast.success(response.data.message, {
          theme: "dark",
          position: "top-center",
          autoClose: 1000,
          pauseOnFocusLoss: false,
          onClose: () => {
            navigate(0);
          },
        });
        setPaying(false);
      } else {
        toast.error(response.data.error, {
          theme: "dark",
          position: "top-center",
          autoClose: 1000,
          pauseOnFocusLoss: false,
          onClose: () => {
            navigate(0);
          },
        });
        setPaying(false);
      }
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="display-7">Pay for Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {bookingToPay && parse(bookingToPay.business.paymentInstructions)}
        </div>
        <div>
          Amount outstanding: <b>£{(bookingToPay?.cost / 100).toFixed(2)}</b>
          <br />
          Press confirm when the above is completed.
        </div>
      </Modal.Body>
      <Modal.Footer className="d-flex">
        <div className="d-flex ms-auto gap-2">
          <Button
            variant="success"
            className=""
            onClick={() => {
              if (!paying) markPaid(bookingToPay._id ?? bookingToPay.id);
            }}
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            className=""
            onClick={() => {
              setBookingToPay(null);
              handleClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default PaymentModal;
