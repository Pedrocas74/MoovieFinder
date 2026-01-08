import { useNavigate } from "react-router-dom";
import ErrorPlaceholder from "../components/feedback/ErrorPlaceholder";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
    <ErrorPlaceholder
      type="not-found"
      title="404 — Page not found"
      message="The page you’re looking for doesn’t exist or may have been moved."
      actionLabel="Go home"
      onAction={() => navigate("/")}
      secondaryLabel="Go back"
      onSecondaryAction={() => navigate(-1)}
      
    />
    </div>
  );
}
