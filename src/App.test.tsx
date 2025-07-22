import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders API Supervision Dashboard", () => {
  render(<App />);
  const titleElement = screen.getByText(/Dashboard API Monitoring/i);
  expect(titleElement).toBeInTheDocument();
});