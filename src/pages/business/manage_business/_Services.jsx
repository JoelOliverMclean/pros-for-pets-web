import { Fragment } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

export default function ({ business, state }) {
  return (
    <Fragment>
      <div className="d-flex align-items-center mb-3">
        {business?.services && business?.services.length > 0 && (
          <Link
            to={{ pathname: "/manage-business/new-service" }}
            state={state}
            className="btn btn-outline-mids-mutts ms-auto"
          >
            Add New&nbsp;&nbsp;<i className="fa-solid fa-plus"></i>
          </Link>
        )}
      </div>
      {business?.services?.length > 0 ? (
        <div className="standard-grid">
          {business.services.map((service) => (
            <div className="col" key={service._id}>
              <Card>
                <Card.Header className="lead">{service.name}</Card.Header>
                <Card.Body>{service.description}</Card.Body>
                <Card.Footer className="p-2">
                  <Link
                    to={{
                      pathname: `/manage-business/edit-service/${service.slug}`,
                    }}
                    state={state}
                    className="form-control btn btn-outline-mids-mutts"
                  >
                    Edit
                  </Link>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-subtle display-8">
          <p className="text-center">No services</p>
          <Link
            to={{ pathname: "/manage-business/new-service" }}
            state={state}
            className="btn btn-mids-mutts ms-auto"
          >
            Create first service
          </Link>
        </div>
      )}
    </Fragment>
  );
}
