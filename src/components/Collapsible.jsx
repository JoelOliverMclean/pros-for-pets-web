import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";
import { Fragment, useState } from "react";

function Collapsible({ title, initiallyExpanded, children }) {
  const [show, setShow] = useState(initiallyExpanded === true);

  return (
    <Fragment>
      <div className="d-flex flex-wrap align-items-center pb-3">
        <h2 className="me-2 my-0">{title}</h2>
        <Button
          variant="secondary"
          className="border-0"
          onClick={() => setShow(!show)}
        >
          <i
            className={show ? "fa-solid fa-angle-up" : "fa-solid fa-angle-down"}
          ></i>
        </Button>
      </div>
      <Collapse in={show}>{children}</Collapse>
    </Fragment>
  );
}

export default Collapsible;
