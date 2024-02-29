import { useLocation, useNavigate } from "react-router";
import { Button } from "react-bootstrap";

export default function Page({
  title,
  titleButtonContent,
  titleButtonOnClick,
  children,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="container">
      {location?.state?.from?.title && (
        <div className="mb-2">
          <button className="btn btn-sm btn-link" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left pe-2"></i>
            {location?.state?.from?.title}
          </button>
        </div>
      )}
      {(title || titleButtonContent) && (
        <div className="d-flex flex-column flex-md-row align-items-md-center flex-wrap gap-1 mb-2">
          {title && <div className="h1">{title}</div>}
          {titleButtonContent && (
            <Button
              onClick={titleButtonOnClick}
              className="btn btn-outline-mids-mutts flex-fill flex-md-grow-0 ms-md-auto"
            >
              {titleButtonContent}
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
