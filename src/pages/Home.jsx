import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";

import logo from "../assets/img/logo512.png";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import Cookies from "js-cookie";

function Home() {
  const { loggedInUser } = useContext(AuthContext);

  const [searchTerms, setSearchTerms] = useState("");

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(Cookies.get("loggedIn"));

  const state = { from: { title: "Home" } };

  const searchBusinesses = () => {
    navigate(
      {
        pathname: "/businesses",
        search: `?${createSearchParams({ searchTerms })}`,
      },
      {
        state,
      }
    );
  };

  useEffect(() => {
    if (loggedIn) {
      navigate("/dashboard");
    }
  }, [loggedIn, navigate]);

  return (
    <div className="row">
      {!loggedIn && (
        <div>
          <div className="text-center">
            <div id="header" className="pb-3">
              <img height="200" className="d-inline-block mb-3" src={logo} />
              <div className="heading">
                Find a pro for your pet's needs, search below
              </div>
              <div>
                <div className="row">
                  <div className="col-lg-6 offset-lg-3 col-12 mt-4">
                    <Formik
                      initialValues={{ searchTerms }}
                      onSubmit={searchBusinesses}
                    >
                      <Form>
                        <div className="input-group">
                          <input
                            value={searchTerms}
                            onInput={(e) => setSearchTerms(e.target.value)}
                            type="text"
                            id="searchTerms"
                            className="form-control bg-fore border-mids-mutts"
                            placeholder="Enter Search Term"
                          />
                          <button
                            type="submit"
                            className="btn btn-outline-mids-mutts"
                          >
                            Search&nbsp;&nbsp;
                            <i className="fa-solid fa-magnifying-glass"></i>
                          </button>
                        </div>
                      </Form>
                    </Formik>
                    <div className="mt-4">
                      <Link
                        to={{ pathname: "/businesses" }}
                        state={state}
                        className="btn btn-mids-mutts"
                      >
                        Browse all businesses
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
