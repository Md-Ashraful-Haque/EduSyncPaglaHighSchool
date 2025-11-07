// VisibilityWrapper.jsx
import { useAppContext } from 'ContextAPI/AppContext';

export default function VisibilityWrapper({ children, visibility = [] }) {

  const { vars } = useAppContext();

  const isVisible =
    // ["Head Teacher", "Admin"].includes(vars.userRole) ||
    ["Head Teacher", "Admin"].includes(vars.userRole) ||
    visibility.includes("All") ||
    visibility.includes(vars.userRole);

  return isVisible ? children : null;
}
