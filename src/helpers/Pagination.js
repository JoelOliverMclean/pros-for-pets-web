import React from "react";

const perPageOptions = (count, increment, start, perPage, setPerPage) => {
  const updatePerPage = (num) => {
    sessionStorage.setItem("resultsPerPage", num);
    setPerPage(num);
  };

  const pageOptions = [];
  for (let i = 0; i < count; i++) {
    const option = start + increment * i;
    const css = option === perPage ? "btn-secondary" : "btn-outline-subtle";
    pageOptions.push(
      <button
        key={"pageOptions_button_" + i}
        onClick={() => {
          if (option !== perPage) {
            updatePerPage(option);
          }
        }}
        className={"btn " + css}
      >
        {option}
      </button>
    );
    if (i !== count - 1) {
      pageOptions.push(
        <span key={"pageOptions_span_" + i} className="px-1">
          |
        </span>
      );
    }
  }
  return <React.Fragment>{pageOptions}</React.Fragment>;
};

const paginator = (page, pageCount, setPage) => {
  const firstPageNum = Math.max(0, page - 2);
  const lastPageNum = Math.min(pageCount, page + 2);
  const pagesBeyond = pageCount > lastPageNum;
  const pagesBefore = 0 < firstPageNum;
  const lastPage = page === pageCount - 1;
  const firstPage = page === 0;
  const pageNums = [];
  for (let i = firstPageNum; i < lastPageNum - firstPageNum; i++) {
    const sizeClass = i === page ? "btn-secondary" : "btn-outline-secondary";
    pageNums.push(
      <button
        key={"paginator_button_" + i}
        onClick={() => setPage(i)}
        className={sizeClass + " btn mx-1"}
      >
        {i + 1}
      </button>
    );
  }

  return (
    <React.Fragment>
      {pagesBefore && (
        <button
          onClick={() => setPage(pageCount)}
          className="btn btn-outline-secondary btn-sm"
        >
          |&lt;
        </button>
      )}
      {!firstPage && (
        <button
          onClick={() => setPage(page - 1)}
          className="btn btn-outline-secondary btn-sm"
        >
          &lt;
        </button>
      )}
      {pageNums}
      {!lastPage && (
        <button
          onClick={() => setPage(page + 1)}
          className="btn btn-outline-secondary btn-sm"
        >
          &gt;
        </button>
      )}
      {pagesBeyond && (
        <button
          onClick={() => setPage(0)}
          className="btn btn-outline-secondary btn-sm"
        >
          &gt;|
        </button>
      )}
    </React.Fragment>
  );
};

export { perPageOptions, paginator };
