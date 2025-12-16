import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewCard from '../ReviewCard';
import ReviewForm from '../ReviewForm';
import ReviewSection from '../ReviewSection';
import { Review } from '@/types';

// Mock review data
const mockReview: Review = {
  id: 'review-1',
  productId: 'product-1',
  userId: 'user-1',
  userName: 'John Doe',
  rating: 4,
  title: 'Great product!',
  content: 'This hoodie is amazing. The quality is top-notch and fits perfectly.',
  verified: true,
  createdAt: '2025-01-15T10:30:00Z',
};

const mockReviews: Review[] = [
  mockReview,
  {
    id: 'review-2',
    productId: 'product-1',
    userId: 'user-2',
    userName: 'Jane Smith',
    rating: 5,
    title: 'Love it!',
    content: 'Best streetwear purchase I have made. Highly recommend!',
    verified: false,
    createdAt: '2025-01-10T14:20:00Z',
  },
  {
    id: 'review-3',
    productId: 'product-1',
    userId: 'user-3',
    userName: 'Mike Johnson',
    rating: 3,
    title: 'Decent',
    content: 'Good quality but sizing runs a bit small.',
    verified: true,
    createdAt: '2025-01-20T09:15:00Z',
  },
];

describe('ReviewCard', () => {
  it('renders review content', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(mockReview.content)).toBeInTheDocument();
  });


  it('renders review title', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(mockReview.title)).toBeInTheDocument();
  });

  it('renders author name', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(mockReview.userName)).toBeInTheDocument();
  });

  it('renders verified badge for verified purchases', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText('Verified Purchase')).toBeInTheDocument();
  });

  it('does not render verified badge for unverified reviews', () => {
    const unverifiedReview = { ...mockReview, verified: false };
    render(<ReviewCard review={unverifiedReview} />);
    expect(screen.queryByText('Verified Purchase')).not.toBeInTheDocument();
  });

  it('renders formatted date', () => {
    render(<ReviewCard review={mockReview} />);
    // Date should be formatted as "January 15, 2025"
    expect(screen.getByText('January 15, 2025')).toBeInTheDocument();
  });
});

describe('ReviewForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders rating selection', () => {
    render(<ReviewForm productId="product-1" onSubmit={mockOnSubmit} />);
    expect(screen.getByText('Your Rating')).toBeInTheDocument();
  });

  it('renders title input', () => {
    render(<ReviewForm productId="product-1" onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/review title/i)).toBeInTheDocument();
  });

  it('renders content textarea', () => {
    render(<ReviewForm productId="product-1" onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/your review/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ReviewForm productId="product-1" onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /submit review/i })).toBeInTheDocument();
  });

  it('submit button is disabled when rating is 0', () => {
    render(<ReviewForm productId="product-1" onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByRole('button', { name: /submit review/i });
    expect(submitButton).toBeDisabled();
  });


  it('submit button is disabled when content is too short', () => {
    render(<ReviewForm productId="product-1" onSubmit={mockOnSubmit} />);
    
    // Select a rating by clicking the 4th star (role="radio")
    const starButtons = screen.getAllByRole('radio');
    fireEvent.click(starButtons[3]); // 4 stars
    
    // Enter short content
    const textarea = screen.getByLabelText(/your review/i);
    fireEvent.change(textarea, { target: { value: 'Short' } });
    
    const submitButton = screen.getByRole('button', { name: /submit review/i });
    expect(submitButton).toBeDisabled();
  });

  it('shows character count', () => {
    render(<ReviewForm productId="product-1" onSubmit={mockOnSubmit} />);
    expect(screen.getByText('0/1000 characters')).toBeInTheDocument();
  });

  it('updates character count as user types', () => {
    render(<ReviewForm productId="product-1" onSubmit={mockOnSubmit} />);
    
    const textarea = screen.getByLabelText(/your review/i);
    fireEvent.change(textarea, { target: { value: 'Hello World' } });
    
    expect(screen.getByText('11/1000 characters')).toBeInTheDocument();
  });
});

describe('ReviewSection', () => {
  const mockOnSubmitReview = jest.fn();

  beforeEach(() => {
    mockOnSubmitReview.mockClear();
  });

  it('renders customer reviews heading', () => {
    render(
      <ReviewSection
        productId="product-1"
        reviews={mockReviews}
        averageRating={4.0}
        reviewCount={3}
      />
    );
    expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
  });

  it('renders average rating display', () => {
    render(
      <ReviewSection
        productId="product-1"
        reviews={mockReviews}
        averageRating={4.0}
        reviewCount={3}
      />
    );
    // Rating and review count are combined in a single span
    expect(screen.getByText(/4\.0.*3 reviews/)).toBeInTheDocument();
  });


  it('renders all reviews', () => {
    render(
      <ReviewSection
        productId="product-1"
        reviews={mockReviews}
        averageRating={4.0}
        reviewCount={3}
      />
    );
    
    expect(screen.getByText('Great product!')).toBeInTheDocument();
    expect(screen.getByText('Love it!')).toBeInTheDocument();
    expect(screen.getByText('Decent')).toBeInTheDocument();
  });

  it('renders sort dropdown', () => {
    render(
      <ReviewSection
        productId="product-1"
        reviews={mockReviews}
        averageRating={4.0}
        reviewCount={3}
      />
    );
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Newest First')).toBeInTheDocument();
  });

  it('shows empty state when no reviews', () => {
    render(
      <ReviewSection
        productId="product-1"
        reviews={[]}
        averageRating={0}
        reviewCount={0}
      />
    );
    
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });

  it('shows write review button when canReview is true', () => {
    render(
      <ReviewSection
        productId="product-1"
        reviews={mockReviews}
        averageRating={4.0}
        reviewCount={3}
        canReview={true}
        onSubmitReview={mockOnSubmitReview}
      />
    );
    
    expect(screen.getByRole('button', { name: /write a review/i })).toBeInTheDocument();
  });

  it('does not show write review button when canReview is false', () => {
    render(
      <ReviewSection
        productId="product-1"
        reviews={mockReviews}
        averageRating={4.0}
        reviewCount={3}
        canReview={false}
      />
    );
    
    expect(screen.queryByRole('button', { name: /write a review/i })).not.toBeInTheDocument();
  });

  it('shows review form when write review button is clicked', () => {
    render(
      <ReviewSection
        productId="product-1"
        reviews={mockReviews}
        averageRating={4.0}
        reviewCount={3}
        canReview={true}
        onSubmitReview={mockOnSubmitReview}
      />
    );
    
    const writeReviewButton = screen.getByRole('button', { name: /write a review/i });
    fireEvent.click(writeReviewButton);
    
    expect(screen.getByText('Write a Review')).toBeInTheDocument();
  });

  it('sorts reviews by newest first by default', () => {
    render(
      <ReviewSection
        productId="product-1"
        reviews={mockReviews}
        averageRating={4.0}
        reviewCount={3}
      />
    );
    
    // Get all review cards and check order
    const reviewCards = screen.getAllByRole('article');
    // Newest (Jan 20) should be first
    expect(reviewCards[0]).toHaveTextContent('Decent');
  });
});
