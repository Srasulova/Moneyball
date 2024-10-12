import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "./page";
import User from "../apiClient";
import { useRouter } from "next/navigation";

// Mock the User.register method
jest.mock("../apiClient", () => ({
    register: jest.fn(),
}));

// Mock the Next.js router
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

describe("Signup", () => {
    const mockPush = jest.fn(); // Mock function for router.push
    const router = { push: mockPush };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(router);
        render(<Signup />);
    });

    it("renders the signup form correctly", () => {
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getAllByLabelText(/Password/i).length).toBe(2);
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
    });

    it("handles input changes correctly", () => {
        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });

        // Access the Password inputs with type assertions
        const passwordInput = screen.getAllByLabelText(/Password/i)[0] as HTMLInputElement;
        const confirmPasswordInput = screen.getAllByLabelText(/Password/i)[1] as HTMLInputElement;

        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

        const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
        const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;

        expect(nameInput.value).toBe("John Doe");
        expect(emailInput.value).toBe("john@example.com");
        expect(passwordInput.value).toBe("password123");
        expect(confirmPasswordInput.value).toBe("password123");
    });

    it("handles successful signup", async () => {
        (User.register as jest.Mock).mockResolvedValueOnce({ token: "test-token" });

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });

        // Access the Password inputs with type assertions
        const passwordInput = screen.getAllByLabelText(/Password/i)[0] as HTMLInputElement;
        const confirmPasswordInput = screen.getAllByLabelText(/Password/i)[1] as HTMLInputElement;

        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /Register/i }));

        expect(User.register).toHaveBeenCalledWith("John Doe", "john@example.com", "password123");

        // Wait for success message to be displayed
        expect(await screen.findByText("Registration successful! Redirecting to home page...")).toBeInTheDocument();

        // Wait for router.push to be called
        await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/")); // Check for redirect
        expect(localStorage.getItem("token")).toBe("test-token"); // Ensure token is stored
    });

    it("handles signup errors", async () => {
        const errorMessage = "Duplicate email";
        (User.register as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });

        // Access the Password inputs with type assertions
        const passwordInput = screen.getAllByLabelText(/Password/i)[0] as HTMLInputElement;
        const confirmPasswordInput = screen.getAllByLabelText(/Password/i)[1] as HTMLInputElement;

        fireEvent.change(passwordInput, { target: { value: "password123" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
        fireEvent.click(screen.getByRole("button", { name: /Register/i }));

        expect(await screen.findByText("This email is already registered")).toBeInTheDocument(); // Check for specific error message
    });

    it("matches the snapshot", () => {
        const { asFragment } = render(<Signup />);
        expect(asFragment()).toMatchSnapshot();
    });
});
