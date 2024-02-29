import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGet } from "../../helpers/NetworkHelper";
import { ClipLoader } from "react-spinners";
import Card from "react-bootstrap/Card";
import { paginator, perPageOptions } from "../../helpers/Pagination";

function ManageClients() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedResultsPerPage = sessionStorage.getItem("resultsPerPage");
  const initialResultsPerPage =
    !savedResultsPerPage || isNaN(savedResultsPerPage)
      ? 16
      : parseInt(savedResultsPerPage);

  const [business, setBusiness] = useState(location?.state?.business);
  const [loading, setLoading] = useState(!location?.state?.business);
  const [pageSize, setPageSize] = useState(initialResultsPerPage);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [displayedClients, setDisplayedClients] = useState([]);

  const getClients = useCallback(
    (business) => {
      setDisplayedClients(
        getApprovedClients(business).slice(
          page * pageSize,
          page * pageSize + pageSize
        )
      );
      setPageCount(Math.ceil(getApprovedClients(business).length / pageSize));
    },
    [page, pageSize]
  );

  const getBusiness = useCallback(() => {
    setLoading(true);
    apiGet("manage-business").then((response) => {
      setLoading(false);
      if (response.status === 200 && response.data) {
        setBusiness(response.data);
        getClients(response.data);
      } else {
        navigate("/");
      }
    });
  }, [setBusiness, getClients, navigate]);

  const getApprovedClients = (business) =>
    business.businessUsers.filter((bu) => bu.confirmed);

  useEffect(() => {
    if (!location?.state?.business) getBusiness();
    else getClients(location?.state?.business);
  }, [getBusiness, getClients, location?.state?.business]);

  const clientListElement = displayedClients.map((client) => (
    <div key={client._id}>
      <Card className="h-100">
        <Card.Header className="lead">
          {client.user.firstname} {client.user.lastname}
        </Card.Header>
        <Card.Body>
          <div>
            <div>Pets Managed:</div>
            <ul className="mb-0">
              {client.businessUserPets.length > 0 ? (
                client.businessUserPets.map((pet) => (
                  <li key={pet._id}>{pet.pet.name}</li>
                ))
              ) : (
                <div className="text-center text-subtle pt-2">None managed</div>
              )}
            </ul>
          </div>
        </Card.Body>
        <Card.Footer className="p-2">
          <div className="d-flex gap-2">
            <button className="form-control btn btn-mids-mutts">Manage</button>
            <button className="form-control btn btn-outline-danger">
              Banish
            </button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  ));

  return (
    <div>
      {location?.state?.from?.title && (
        <div className="col-lg-8 col-12 mb-3">
          <button className="btn btn-sm btn-link" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left pe-2"></i>
            {location?.state?.from?.title}
          </button>
        </div>
      )}
      {loading ? (
        <div className="d-flex pt-2">
          <ClipLoader className="mx-auto" color="#0082b4" />
        </div>
      ) : business ? (
        <div>
          <h1>Manage Clients</h1>
          {getApprovedClients(business).length > 0 && pageCount > 1 && (
            <div className="pt-3 px-3">
              <div className="text-subtle">
                Showing {page * pageSize + 1}-
                {page * pageSize + displayedClients.length} of{" "}
                {getApprovedClients(business).length} clients.
              </div>
            </div>
          )}
          <hr />
          <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2">
            {clientListElement}
          </div>
          <hr />
          <div className="d-flex justify-content-center">
            {getApprovedClients(business).length > 0 &&
              paginator(page, pageCount, setPage)}
          </div>
          <div className="d-flex flex-wrap justify-content-start">
            <div className="py-3">
              <div className="text-subtle">
                Results per page:{" "}
                {perPageOptions(3, 8, 16, pageSize, setPageSize)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-subtle lead text-center">Something went wrong</h1>
        </div>
      )}
    </div>
  );
}

export default ManageClients;
