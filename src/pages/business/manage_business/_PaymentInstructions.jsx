import { Fragment, useState } from "react";
import Button from "react-bootstrap/Button";
import TinyMCEEditor from "../../../components/editor/TinyMCEEditor";
import { apiPost } from "../../../helpers/NetworkHelper";
import parse from "html-react-parser";

export default function ({
  business,
  paymentInstructions,
  setPaymentInstructions,
}) {
  const [editingPaymentInstructions, setEditingPaymentInstructions] =
    useState(false);
  const [savingPaymentInstructions, setSavingPaymentInstructions] =
    useState(false);

  const savePaymentInstructions = () => {
    const content = paymentInstructions;
    if (content !== business.paymentInstructions) {
      setSavingPaymentInstructions(true);
      apiPost("manage-business/payment-instructions", {
        paymentInstructions: content,
      }).then((response) => {
        setSavingPaymentInstructions(false);
        if (response.status === 200) {
          setPaymentInstructions(response.data.paymentInstructions);
        } else {
          // Failed
        }
        setEditingPaymentInstructions(false);
      });
    }
  };

  return (
    <Fragment>
      <div className="d-flex flex-column gap-3 align-items-start">
        {editingPaymentInstructions ? (
          <div className="w-100 d-flex flex-column gap-3 ">
            <TinyMCEEditor
              initialValue={business?.paymentInstructions}
              value={paymentInstructions}
              setValue={setPaymentInstructions}
              id="paymentInstructionsEditor"
            />
            <div className="d-flex gap-3">
              <Button
                variant="success"
                disabled={savingPaymentInstructions}
                onClick={savePaymentInstructions}
              >
                Save Instructions
              </Button>
              <Button
                variant="outline-light"
                onClick={() => setEditingPaymentInstructions(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-100 d-flex flex-column gap-3 align-items-start">
            {paymentInstructions ? (
              parse(paymentInstructions)
            ) : (
              <div className="text-center w-100">
                {
                  "To make payments quicker and easier for your clients, you can add payment instructions which will show for them whenever they click "
                }
                <Button variant="success" className="btn-sm">
                  Pay
                </Button>
                {" on a booking on this site"}
              </div>
            )}

            <Button
              variant="success"
              className={`${!paymentInstructions && "align-self-center"}`}
              onClick={() =>
                setEditingPaymentInstructions(!editingPaymentInstructions)
              }
            >
              {paymentInstructions ? "Edit" : "Add"}
              {" Payment Instructions"}
            </Button>
          </div>
        )}
      </div>
    </Fragment>
  );
}
