import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Newsletter } from "../Newsletter";
import { api } from "@/lib/api";

// Mock the API module
jest.mock("@/lib/api", () => ({
  api: {
    newsletter: {
      subscribe: jest.fn(),
    },
  },
}));

const mockSubscribe = api.newsletter.subscribe as jest.MockedFunction<typeof api.newsletter.subscribe>;

describe("Newsletter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the newsletter heading", () => {
      render(<Newsletter />);
      expect(screen.getByText("JOIN THE MOVEMENT")).toBeInTheDocument();
    });

    it("renders the email input field", () => {
      render(<Newsletter />);
      expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    });

    it("renders the subscribe button", () => {
      render(<Newsletter />);
      expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
    });

    it("renders brand messaging", () => {
      render(<Newsletter />);
      expect(screen.getByText(/exclusive drops/i)).toBeInTheDocument();
    });
  });

  describe("Email Validation", () => {
    it("shows error when submitting empty email", async () => {
      render(<Newsletter />);
      
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
      });
    });

    it("shows error for invalid email format", async () => {
      render(<Newsletter />);
      
      const emailInput = screen.getByPlaceholderText("Enter your email");
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
      });
    });

    it("clears validation error when user starts typing", async () => {
      render(<Newsletter />);
      
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Email is required")).toBeInTheDocument();
      });
      
      const emailInput = screen.getByPlaceholderText("Enter your email");
      fireEvent.change(emailInput, { target: { value: "t" } });
      
      expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
    });
  });

  describe("Submission States", () => {
    it("shows success message after successful subscription", async () => {
      mockSubscribe.mockResolvedValueOnce({ data: undefined });
      
      render(<Newsletter />);
      
      const emailInput = screen.getByPlaceholderText("Enter your email");
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/welcome to the family/i)).toBeInTheDocument();
      });
    });

    it("shows already subscribed message when email exists", async () => {
      mockSubscribe.mockRejectedValueOnce(new Error("Email already subscribed"));
      
      render(<Newsletter />);
      
      const emailInput = screen.getByPlaceholderText("Enter your email");
      fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
      
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/already part of the movement/i)).toBeInTheDocument();
      });
    });

    it("shows error message on API failure", async () => {
      mockSubscribe.mockRejectedValueOnce(new Error("Server error"));
      
      render(<Newsletter />);
      
      const emailInput = screen.getByPlaceholderText("Enter your email");
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText("Server error")).toBeInTheDocument();
      });
    });

    it("clears email input after successful subscription", async () => {
      mockSubscribe.mockResolvedValueOnce({ data: undefined });
      
      render(<Newsletter />);
      
      const emailInput = screen.getByPlaceholderText("Enter your email") as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/welcome to the family/i)).toBeInTheDocument();
      });
    });

    it("disables input and button during loading", async () => {
      // Create a promise that we can control
      let resolvePromise: (value: { data: undefined }) => void;
      const pendingPromise = new Promise<{ data: undefined }>((resolve) => {
        resolvePromise = resolve;
      });
      mockSubscribe.mockReturnValueOnce(pendingPromise);
      
      render(<Newsletter />);
      
      const emailInput = screen.getByPlaceholderText("Enter your email");
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      fireEvent.click(submitButton);
      
      // Check that button shows loading state
      await waitFor(() => {
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
      });
      
      // Resolve the promise to clean up
      resolvePromise!({ data: undefined });
    });
  });

  describe("Variants", () => {
    it("renders with footer variant by default", () => {
      const { container } = render(<Newsletter />);
      expect(container.firstChild).toHaveClass("w-full");
    });

    it("renders with popup variant styling", () => {
      const { container } = render(<Newsletter variant="popup" />);
      expect(container.firstChild).toHaveClass("max-w-md");
    });

    it("renders with inline variant styling", () => {
      const { container } = render(<Newsletter variant="inline" />);
      expect(container.firstChild).toHaveClass("max-w-lg");
    });
  });
});
