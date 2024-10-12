import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./page";
import User from "../apiClient";
import { useRouter } from "next/navigation";

// Mock the User.login method
jest.mock("../apiClient", () => ({
    login: jest.fn(),
}));

// Mock the Next.js router
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

describe("Login", () => {
    const mockPush = jest.fn(); // Mock function for router.push
    const router = { push: mockPush };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(router);
        render(<Login />);
    });

    it("renders the login form correctly", () => {
        // Check for multiple occurrences and verify at least one
        const loginText = screen.getAllByText("Login");
        expect(loginText.length).toBeGreaterThan(0); // At least one occurrence should be present
        expect(loginText[0]).toBeInTheDocument(); // Assert that the first occurrence is in the document

        expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Login/ })).toBeInTheDocument();
    });

    it("handles login successfully", async () => {
        (User.login as jest.Mock).mockResolvedValueOnce({ token: "test-token" });

        fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/Password/), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: /Login/ }));

        expect(User.login).toHaveBeenCalledWith("test@example.com", "password123");
        expect(await screen.findByText("Logging in...")).toBeInTheDocument(); // Ensure loading state is displayed
        expect(mockPush).toHaveBeenCalledWith("/"); // Check for redirect
        expect(localStorage.getItem("token")).toBe("test-token"); // Ensure token is stored
    });

    it("displays an error message when login fails", async () => {
        const errorMessage = "Invalid credentials";
        (User.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/Password/), { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: /Login/ }));

        expect(await screen.findByText(errorMessage)).toBeInTheDocument(); // Check for error message
    });

    it("matches the snapshot", () => {
        const { asFragment } = render(<Login />);
        expect(asFragment()).toMatchSnapshot();
    });
});
