import {
  useSearchParams,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import Page from "../../../components/Page";
import { Fragment, useCallback, useEffect, useState } from "react";
import { apiGet } from "../../../helpers/NetworkHelper";
import moment from "moment";

function ManageBookingSlot() {
  const [searchParams] = useSearchParams();
  const slot = searchParams.get("slot");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState(null);

  const getBookingSlot = useCallback(() => {
    setLoading(true);
    apiGet(`manage-booking-slots/${slot}`).then((response) => {
      setLoading(false);
      if (response.status === 200) {
        setBookingSlot(response.data.bookingSlot);
      } else {
        // Unable to load, try again
        setBookingSlot(null);
      }
    });
  }, []);

  const editInfo = () => {
    navigate(
      {
        pathname: "/manage-business/booking-slots/edit",
        search: `?${createSearchParams({ slot })}`,
      },
      { state: { from: { title: "Manage Booking Slot" } } }
    );
  };

  useEffect(() => {
    getBookingSlot();
  }, [getBookingSlot]);

  return (
    <Page
      title={bookingSlot?.service?.name}
      titleButtonContent="Edit"
      titleButtonOnClick={editInfo}
    >
      <Fragment>
        <div className="lead">
          {moment(bookingSlot?.start_time).format("ddd Do MMM @ hh:mm a")}
        </div>
      </Fragment>
    </Page>
  );
}

export default ManageBookingSlot;
