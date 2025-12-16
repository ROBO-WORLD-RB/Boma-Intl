import "@testing-library/jest-dom";

// Mock ResizeObserver (required for Framer Motion)
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver (required for viewport animations)
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock framer-motion to avoid animation complexity in tests
jest.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }, ref) => (
        <div ref={ref} {...filterMotionProps(props)}>
          {children}
        </div>
      )),
      h1: React.forwardRef(({ children, ...props }, ref) => (
        <h1 ref={ref} {...filterMotionProps(props)}>
          {children}
        </h1>
      )),
      section: React.forwardRef(({ children, ...props }, ref) => (
        <section ref={ref} {...filterMotionProps(props)}>
          {children}
        </section>
      )),
      span: React.forwardRef(({ children, ...props }, ref) => (
        <span ref={ref} {...filterMotionProps(props)}>
          {children}
        </span>
      )),
      img: React.forwardRef((props, ref) => (
        <img ref={ref} {...filterMotionProps(props)} />
      )),
      a: React.forwardRef(({ children, ...props }, ref) => (
        <a ref={ref} {...filterMotionProps(props)}>
          {children}
        </a>
      )),
      button: React.forwardRef(({ children, ...props }, ref) => (
        <button ref={ref} {...filterMotionProps(props)}>
          {children}
        </button>
      )),
      svg: React.forwardRef(({ children, ...props }, ref) => (
        <svg ref={ref} {...filterMotionProps(props)}>
          {children}
        </svg>
      )),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
    useAnimation: () => ({
      start: jest.fn(),
      set: jest.fn(),
    }),
    useInView: () => true,
    useScroll: () => ({ scrollY: { get: () => 0 } }),
    useTransform: () => 0,
  };
});

// Helper to filter out framer-motion specific props
function filterMotionProps(props) {
  const {
    initial,
    animate,
    exit,
    variants,
    whileHover,
    whileTap,
    whileInView,
    viewport,
    transition,
    layout,
    layoutId,
    ...rest
  } = props;
  return rest;
}

// Mock next/image
jest.mock("next/image", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => {
      const { src, alt, fill, priority, ...rest } = props;
      // eslint-disable-next-line @next/next/no-img-element
      return <img ref={ref} src={src} alt={alt} {...rest} />;
    }),
  };
});
