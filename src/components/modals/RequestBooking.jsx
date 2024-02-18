import { Fragment, useContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost, apiGet } from "../../helpers/NetworkHelper";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../helpers/AuthContext";
import { toast } from "react-toastify";

function RequestBooking({ pets, show, setShow, selectedBookingSlot, refresh }) {
  const navigate = useNavigate();

  const { loggedInUser } = useContext(AuthContext);
  const [waiting, setWaiting] = useState(false);

  const [selectedPet, setSelectedPet] = useState(null);

  const book = () => {
    if (!waiting) {
      if (selectedPet) {
        setWaiting(true);
        apiPost("bookings/request", {
          bookingSlotId: selectedBookingSlot._id,
          petId: selectedPet._id,
        }).then((response) => {
          setWaiting(false);
          setSelectedPet(null);
          if (response.status === 200) {
            setShow(false);
            if (refresh) refresh();
          }
          if (response.status >= 400)
            toast.error(response.data.error, {
              theme: "dark",
              position: "top-center",
              autoClose: 1000,
              pauseOnFocusLoss: false,
            });
        });
      } else {
        toast("No pet selected", {
          theme: "dark",
          position: "top-center",
          autoClose: 1000,
          pauseOnFocusLoss: false,
        });
      }
    }
  };

  const handleClose = () => setShow(false);

  const goToPetForm = () => {
    navigate("/pets/new-pet");
  };

  const petsList = () => {
    const petList = [];
    for (let i = 0; i < pets.length; i++) {
      let pet = pets[i];
      petList.push(
        <div key={pet._id} className="w-md-50 w-100 p-1">
          <div
            onClick={() => {
              setSelectedPet(selectedPet?._id === pet._id ? null : pet);
            }}
            className={
              "bg-secondary rounded-3 d-flex flex-row align-items-center hoverable clickable border " +
              (selectedPet?._id === pet._id
                ? "border-mids-mutts"
                : "border-fore")
            }
          >
            <div className="fs-5 text-center flex-fill p-3">{pet.name}</div>
          </div>
        </div>
      );
    }

    return (
      <Fragment>
        {pets.length > 0 ? (
          <div className="d-flex">{petList}</div>
        ) : (
          <div className="text-center">
            <div className="mb-3">To make a booking you need to add a pet</div>
            <button
              onClick={goToPetForm}
              className="btn btn-outline-mids-mutts mx-auto"
            >
              Add Pet
            </button>
          </div>
        )}
      </Fragment>
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="display-7">Pick a Pet</Modal.Title>
      </Modal.Header>
      <Modal.Body>{petsList()}</Modal.Body>
      <Modal.Footer>
        {pets.length > 0 && (
          <Button variant="mids-mutts" className="btn-block" onClick={book}>
            {waiting ? (
              <ClipLoader color="white" />
            ) : (
              <span>Request Booking</span>
            )}
          </Button>
        )}
        <Button
          variant="secondary"
          className="btn-block"
          onClick={() => {
            setSelectedPet(null);
            handleClose();
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RequestBooking;
