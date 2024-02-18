import React, { useCallback, useState, useContext, useEffect } from "react";
import { apiGet } from "../../helpers/NetworkHelper";
import { toast } from "react-toastify";
import {
  useNavigate,
  useSearchParams,
  useLocation,
  Link,
  createSearchParams,
} from "react-router-dom";
import { paginator, perPageOptions } from "../../helpers/Pagination";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../helpers/AuthContext";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Form, Formik } from "formik";

function BusinessSearch() {
  const { loggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const savedResultsPerPage = sessionStorage.getItem("resultsPerPage");
  const initialResultsPerPage =
    !savedResultsPerPage || isNaN(savedResultsPerPage)
      ? 16
      : parseInt(savedResultsPerPage);

  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(initialResultsPerPage);
  const [page, setPage] = useState(0);
  const [results, setResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerms") ?? ""
  );
  const [pageCount, setPageCount] = useState(0);
  const [businesses, setBusinesses] = useState([]);

  const getBusinessesCallback = useCallback(() => {
    getBusinesses();
  }, [page, pageSize, navigate]);

  const getBusinesses = () => {
    setLoading(true);
    const params = {
      page,
      pageSize,
      searchTerm,
    };
    apiGet("businesses", params).then((response) => {
      setLoading(false);
      if (response.status === 200) {
        setBusinesses(response.data.businesses);
        setPageCount(response.data.pages);
        setResults(response.data.results);
      } else {
        toast.error(`Error fetching businesses!`, {
          theme: "dark",
          position: "bottom-center",
          autoClose: 2000,
          pauseOnFocusLoss: false,
          toastId: "fetch-businesses-error",
        });
      }
    });
  };

  useEffect(() => {
    getBusinessesCallback();
  }, [getBusinessesCallback]);

  const businessesElement = businesses.map((business) => {
    return (
      <div className="col" key={business.id}>
        <Card>
          <Card.Header className="lead">{business.name}</Card.Header>
          <Card.Body>{business.description}</Card.Body>
          <Card.Footer className="p-2">
            <Link
              to={{
                pathname: `/businesses/${business.slug}`,
              }}
              state={{ from: { title: "Business Search" } }}
              className="btn btn-mids-mutts form-control"
            >
              View
            </Link>
          </Card.Footer>
        </Card>
      </div>
    );
  });

  return (
    <Container>
      {location?.state?.from?.title && (
        <div className="mb-2">
          <button className="btn btn-sm btn-link" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left pe-2"></i>
            {location?.state?.from?.title}
          </button>
        </div>
      )}
      <h1>Pet Professionals</h1>
      <Row className="row-cols-lg-2 mt-3">
        <div className="col">
          <Formik initialValues={{}} onSubmit={getBusinesses}>
            <Form>
              <div className="input-group">
                <input
                  value={searchTerm}
                  onInput={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  className="form-control bg-fore border-mids-mutts"
                  placeholder="Search for a professional"
                />
                <button type="submit" className="btn btn-outline-mids-mutts">
                  Search&nbsp;&nbsp;
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </Row>
      {results > 0 && pageCount > 1 && (
        <div className="pt-3 px-3">
          <div className="text-subtle">
            Showing {page * pageSize + 1}-{page * pageSize + businesses.length}{" "}
            of {results} businesses found.
          </div>
        </div>
      )}
      <div className="border-top border-mids-mutts border-bottom py-3 my-3">
        {businesses.length === 0 && !loading && (
          <div className="text-center text-subtle display-8 pt-2">
            No Results
          </div>
        )}
        {loading ? (
          <div className="d-flex pt-2">
            <ClipLoader className="mx-auto" color="#0082b4" />
          </div>
        ) : (
          <Row className="row-cols-lg-4 row-cols-sm-2">{businessesElement}</Row>
        )}
      </div>
      <div className="d-flex justify-content-center">
        {businesses.length > 0 && paginator(page, pageCount, setPage)}
      </div>
      <div className="d-flex flex-wrap justify-content-start">
        <div className="py-3">
          <div className="text-subtle">
            Results per page: {perPageOptions(3, 8, 16, pageSize, setPageSize)}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default BusinessSearch;
