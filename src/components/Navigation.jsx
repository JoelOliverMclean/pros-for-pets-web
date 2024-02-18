import $ from "jquery";
import React from "react";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { createSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { apiPost, getCsrfToken } from "../helpers/NetworkHelper";
import { toast } from "react-toastify";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import logo from "../assets/img/logo192.png";

function Navigation() {
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const logout = () => {
    collapse();
    apiPost("auth/logout").then((response) => {
      if (response.status === 200) {
        setLoggedInUser(null);
        navigate("/");
        toast(`Logged out`, {
          theme: "dark",
          position: "bottom-center",
          autoClose: 2000,
          pauseOnFocusLoss: false,
        });
      }
    });
  };

  const collapse = () => {
    $(".navbar-collapse").removeClass("show");
  };

  const navbarGoTo = (dest, searchParams) => {
    collapse();
    navigate({
      pathname: dest,
      search: searchParams,
    });
  };

  useEffect(() => {
    getCsrfToken();
  }, []);

  return (
    <Navbar expand="lg" bg="fore" className="sticky-top">
      <Container className="px-3">
        <Navbar.Brand>
          <div className="clickable" onClick={() => navbarGoTo("/")}>
            <div className="d-flex align-items-center nav-item">
              <img
                height="50"
                className="d-inline-block"
                src={logo}
                alt="Logo"
              />
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <div
                    className="nav-link"
                    onClick={() => navbarGoTo("/")}
                  ></div>
                </li>
              </ul>
            </div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav className="">
            {loggedInUser ? (
              <React.Fragment>
                <NavDropdown
                  title={`@${loggedInUser.username}`}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item onClick={() => navbarGoTo("/dashboard")}>
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navbarGoTo("/pets")}>
                    Pets
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => navbarGoTo("/manage-business")}
                  >
                    Business
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Nav.Link onClick={() => navbarGoTo("/login")}>Login</Nav.Link>
                <Nav.Link onClick={() => navbarGoTo("/registration")}>
                  Register
                </Nav.Link>
              </React.Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    // <nav className="navbar navbar-expand-lg navbar-dark bg-fore sticky-top px-3">
    //   <div className="navbar-brand">
    //     <div className="clickable" onClick={() => navbarGoTo("/")}>
    //       <div className="d-flex align-items-center nav-item">
    //         <img height="50" className='d-inline-block' src={logo} alt='Logo' />
    //         <ul className="navbar-nav mr-auto">
    //           <li className="nav-item">
    //             <div className='nav-link' onClick={() => navbarGoTo("/")}></div>
    //           </li>
    //         </ul>
    //       </div>
    //     </div>
    //   </div>
    //   <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    //     <span className="navbar-toggler-icon"></span>
    //   </button>
    //     <div className="collapse navbar-collapse" id="navbarText" >
    //     <ul className="navbar-nav ml-auto">
    //       { loggedInUser ?
    //       <React.Fragment>
    //       <li className="nav-item">
    //         <button className="nav-link" onClick={() => navbarGoTo("/shop/items")}>Shop</button>
    //       </li>
    //       <li className="nav-item dropdown">
    //         <a className='nav-link dropdown-toggle' href="#" role="button" data-bs-toggle="dropdown">@{loggedInUser.username}</a>
    //         <ul className="dropdown-menu">
    //           <li><a href="#" className="dropdown-item">Profile</a></li>
    //         </ul>
    //       </li>
    //       <li className="nav-item">
    //         <button className='nav-link' onClick={logout}>Logout</button>
    //       </li>
    //       </React.Fragment>
    //       :
    //       <React.Fragment>
    //       <li className="nav-item">
    //         <button className='nav-link' onClick={() => navbarGoTo("/login")}>Login</button>
    //       </li>
    //       <li className="nav-item">
    //         <button className='nav-link' onClick={() => navbarGoTo("/registration")}>Register</button>
    //       </li>
    //       </React.Fragment>
    //       }
    //     </ul>
    //   </div>
    // </nav>
  );
}

export default Navigation;
