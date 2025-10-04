import { Link } from "react-router";

export default function NotFound() {
  return (
    <div>
      Sorry. The requested resource is not found
      <hr />
      <Link to="/">Back to Home Page</Link>
    </div>
  );
}
