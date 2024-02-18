import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { apiGet } from "../../helpers/NetworkHelper";
import { ClipLoader } from "react-spinners";
import Card from "react-bootstrap/Card";
import moment from "moment";

function Pet() {
  const { slug } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const [pet, setPet] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPet = () => {
    setLoading(true);
    apiGet(`/pets/${slug}`).then((response) => {
      setLoading(false);
      if (response.status === 200) {
        setPet(response.data.pet);
        setUpcomingBookings(response.data.upcomingBookings);
      } else {
        navigate(-1);
      }
    });
  };

  const getAge = (pet) => {
    const now = moment();
    const dob = moment(pet.dob);
    const years = now.diff(dob, "years");
    const months = now.diff(dob, "months");
    const weeks = now.diff(dob, "weeks");
    const happyBirthday =
      now.date() === dob.date() && now.month() === dob.month();
    let age = "";
    if (years > 0 && months % 12 === 0) age = `${years} year`;
    else if (years > 0) age = `${years} year ${months - 12 * years} months`;
    else if (months > 1) age = `${months} months`;
    else age = `${weeks} weeks`;
    return (
      <span>
        {age}{" "}
        {happyBirthday && (
          <i className="fa-solid fa-cake-candles text-mids-mutts"></i>
        )}
      </span>
    );
  };

  const getPetCallback = useCallback(() => {
    getPet();
  }, []);

  useEffect(() => {
    getPetCallback();
  }, [getPetCallback]);

  const headerElement = () => (
    <div>
      <div className="d-flex flex-wrap-reverse align-items-center">
        <h1 className="pe-3">{pet.name}</h1>
        <Link
          to={{
            pathname: `edit`,
          }}
          state={{ from: { title: pet.name } }}
          className="btn btn-outline-mids-mutts ms-auto"
          title="Edit Pet"
        >
          Edit Pet&nbsp;&nbsp;
          <i aria-hidden="true" className="fa-solid fa-pen-to-square"></i>
        </Link>
      </div>
      <div className="d-flex flex-wrap justify-content-start">
        <div className="p-2">
          <i className="fa-solid fa-paw" title="Breed"></i>
          <span className="sr-only">Breed:</span>&nbsp;&nbsp;
          {pet.breed}
        </div>
        <div className="p-2">
          <i className="fa-solid fa-palette" title="Colour"></i>
          <span className="sr-only">Colour:</span>&nbsp;&nbsp;
          {pet.colour}
        </div>
        <div className="p-2">
          <i className="fa-solid fa-calendar" title="Age"></i>
          <span className="sr-only">Age:</span>&nbsp;&nbsp;
          {getAge(pet)}
        </div>
      </div>
      <div>
        <div className="p-2">
          <i className="fa-solid fa-pencil" title="Description"></i>
          <span className="sr-only">Description:</span>&nbsp;&nbsp;
          {pet.description}
        </div>
      </div>
    </div>
  );

  const outstandingPayments = () => (
    <div>
      <h3 className="mb-3">Outstanding Payments</h3>
    </div>
  );

  const prosElement = () => (
    <div>
      <h3 className="mb-3">Professionals</h3>
      <div className="row row-cols-md-4 row-cols-lg-3 row-cols-sm-2">
        {pet.businessUserPets.map((bup) => (
          <div key={bup._id}>
            <Card>
              <Card.Body className="lead">
                {bup.businessUser.business.name}
              </Card.Body>
              <Card.Footer className="p-2">
                <Link
                  to={{
                    pathname: `/businesses/${bup.businessUser.business.slug}`,
                  }}
                  state={{
                    from: { title: `${pet.name}` },
                  }}
                  className="btn btn-outline-mids-mutts form-control"
                >
                  Go to pro
                </Link>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );

  const bookingsElement = () => (
    <div>
      <div className="d-flex align-items-center">
        <h3 className="pe-3 mb-3">Upcoming Bookings</h3>
        <Link type="button" className="btn btn-outline-mids-mutts ms-auto">
          View All
        </Link>
      </div>

      {upcomingBookings.length > 0 ? (
        <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2">
          {upcomingBookings.map((booking) => (
            <div>
              <Card>Booking</Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="lead text-subtle">No upcoming bookings</p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {location?.state?.from?.title && (
        <div className="col-lg-8 col-12 pb-3">
          <button className="btn btn-sm btn-link" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left pe-2"></i>
            {location?.state?.from?.title}
          </button>
        </div>
      )}
      {pet ? (
        <div>
          <div>{headerElement()}</div>
          {pet.businessUserPets.some((bup) => bup.bookings.length > 0) && (
            <div>
              <hr />
              <div>{outstandingPayments()}</div>
            </div>
          )}
          <hr />
          <div>{bookingsElement()}</div>
          <hr />
          <div>{prosElement()}</div>
        </div>
      ) : (
        <div>
          <div className="d-flex pt-2">
            <ClipLoader className="mx-auto" color="#0082b4" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Pet;
