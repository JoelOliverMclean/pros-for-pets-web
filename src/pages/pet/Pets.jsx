import React, { useContext, useEffect, useState } from "react";
import { apiGet } from "../../helpers/NetworkHelper";
import {
  useNavigate,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { AuthContext } from "../../helpers/AuthContext";
import { ClipLoader } from "react-spinners";
import moment from "moment";

function Pets() {
  const { loggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [pets, setPets] = useState([]);
  const [petsLoading, setPetsLoading] = useState(true);

  const getAge = (pet) => {
    const now = moment();
    const dob = moment(pet.dob);
    const years = now.diff(dob, "years");
    const months = now.diff(dob, "months");
    const weeks = now.diff(dob, "weeks");
    const happyBirthday =
      now.date() === dob.date() && now.month() === dob.month();
    let age = "";
    if (years > 0 && months % 12 === 0) age = `${years}y`;
    else if (years > 0) age = `${years}y ${months - 12 * years}m`;
    else if (months > 1) age = `${months}m`;
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

  const state = {
    from: {
      title: "Pets",
    },
  };

  const goToPet = (slug) => {
    navigate(
      {
        pathname: `/pets/${slug}`,
      },
      {
        state,
      }
    );
  };

  const petsList = pets.map((pet) => (
    <div key={pet.id}>
      <Card>
        <Card.Header className="h3">{pet.name}</Card.Header>
        <Card.Body>
          <p className="d-flex">
            <span className="text-subtle">Breed:</span>
            <span className="ms-auto">{pet.breed}</span>
          </p>
          <p className="d-flex">
            <span className="text-subtle">Colour:</span>
            <span className="ms-auto">{pet.colour}</span>
          </p>
          <p className="d-flex">
            <span className="text-subtle">Age:</span>
            <span className="ms-auto">{getAge(pet)}</span>
          </p>
        </Card.Body>
        <Card.Footer className="d-flex">
          <Button
            variant="outline-mids-mutts"
            className="form-control"
            onClick={() => goToPet(pet.slug)}
          >
            Manage
          </Button>
        </Card.Footer>
      </Card>
    </div>
  ));

  useEffect(() => {
    const getPets = async (owner) => {
      setPetsLoading(true);
      apiGet("pets", {
        username: loggedInUser.username,
      }).then((response) => {
        setPetsLoading(false);
        if (response.status === 200) setPets(response.data);
        else setPets([]);
      });
    };
    if (!loggedInUser) navigate("/");
    else getPets();
  }, [navigate]);

  const addPet = () => {
    navigate("/pets/new-pet");
  };

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
      <Container>
        <Row className="row-cols-2 mb-3">
          <div className="display-5">My Pets</div>
          <div className="d-flex align-items-center justify-content-end">
            <Link
              to={{
                pathname: "/pets/new-pet",
              }}
              state={{
                from: { title: "Pets" },
              }}
              type="button"
              className="btn btn-mids-mutts text-light"
            >
              Add New&nbsp;&nbsp;<i className="fa-solid fa-plus"></i>
            </Link>
          </div>
        </Row>
      </Container>
      <Container>
        {pets ? (
          <Row className="row-cols-lg-3 row-cols-md-2">{petsList}</Row>
        ) : (
          <div className="text-center text-subtle display-8">
            <p className="text-center">No pets</p>
            <Link
              to={{
                pathname: "/pets/new-pet",
              }}
              state={{
                from: { title: "Pets" },
              }}
              type="button"
              className="btn btn-mids-mutts text-light"
            >
              Add first pet
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Pets;
