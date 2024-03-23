import Card from "react-bootstrap/Card";
import { apiPost } from "../../../helpers/NetworkHelper";

export default function ({ approvals, setApprovals }) {
  const approveUser = (bu, approved) => {
    apiPost(`/manage-business/review-user/${bu._id}`, { approved }).then(
      (response) => {
        if (response.status === 200) {
          let newApprovals = [...approvals];
          newApprovals.splice(newApprovals.indexOf(bu));
          setApprovals([...newApprovals]);
        }
      }
    );
  };

  return (
    <div className="standard-grid">
      {approvals?.map((bu) => (
        <div className="col" key={bu._id}>
          <Card>
            <Card.Body className="lead">
              {bu.user.firstname} {bu.user.lastname}
              <br />
              <span className="small text-subtle">@{bu.user.username}</span>
            </Card.Body>
            <Card.Footer className="p-2">
              <div className="d-flex gap-2">
                <button
                  className="form-control btn btn-success"
                  onClick={() => approveUser(bu, true)}
                >
                  Approve
                </button>
                <button
                  className="form-control btn btn-outline-danger"
                  onClick={() => approveUser(bu, false)}
                >
                  Deny
                </button>
              </div>
            </Card.Footer>
          </Card>
        </div>
      ))}
    </div>
  );
}
