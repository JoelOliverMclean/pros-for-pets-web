import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { AuthContext } from "./helpers/AuthContext";
import { apiGet } from "./helpers/NetworkHelper";
import CookieConsent, {
  resetCookieConsentValue,
  getCookieConsentValue,
} from "react-cookie-consent";
import Cookies from "js-cookie";
import Modal from "react-bootstrap/Modal";

import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import AppRoutes from "./components/AppRoutes";

import useBreakpoint from "use-breakpoint";
import UIUtils from "./helpers/UIUtils";

function App() {
  const [showCookie, setShowCookie] = useState(
    getCookieConsentValue("acceptPros4PetsCookies") === undefined
  );

  const handleCloseCookie = () => setShowCookie(false);

  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key === "s") {
      event.preventDefault();
    }
  });

  const { breakpoint, maxWidth, minWidth } = useBreakpoint(UIUtils.BREAKPOINTS);

  const [loggedInUser, setLoggedInUser] = useState(null);
  const [checkingUser, setCheckingUser] = useState(loggedInUser === null);

  useEffect(() => {
    const validateToken = async () => {
      setCheckingUser(true);
      apiGet("auth/validate").then((response) => {
        setCheckingUser(false);
        if (response.status === 200) setLoggedInUser(response.data);
        else {
          setLoggedInUser(null);
          Cookies.remove("loggedIn");
        }
      });
    };
    if (Cookies.get("loggedIn")) validateToken();
    else setCheckingUser(false);
  }, []);

  return (
    <div className="App p-0">
      {!checkingUser && (
        <AuthContext.Provider
          value={{ loggedInUser, setLoggedInUser, breakpoint }}
        >
          <Router>
            <Navigation />
            <div className="container pageContainer">
              <AppRoutes />
            </div>
            <Footer />
          </Router>
          <ToastContainer />
        </AuthContext.Provider>
      )}

      <Modal
        dialogClassName="modal-dialog modal-dialog-centered"
        show={showCookie}
        onHide={handleCloseCookie}
        backdrop="static"
        contentClassName="bg-background text-light montserrat"
      >
        <Modal.Body>
          <CookieConsent
            disableStyles={true}
            expires={999}
            cookieName="acceptPros4PetsCookies"
            buttonClasses="btn btn-success"
            buttonWrapperClasses="text-center"
            containerClasses="align-items-center p-2"
            contentClasses="flex-fill text-center pb-3"
            onAccept={handleCloseCookie}
            overlay
          >
            This website uses cookies to enhance the user experience
          </CookieConsent>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
