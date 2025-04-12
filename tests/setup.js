
// This file is run before tests to set up the test environment
console.log('Setting up test environment...');

// Mock local storage for tests
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
}

// Suppress console.error during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('ReactDOM.render is no longer supported') || 
     args[0].includes('Warning:'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Mock fetch if needed
if (typeof fetch === 'undefined') {
  global.fetch = jest.fn(() => 
    Promise.resolve({
      json: () => Promise.resolve({}),
      ok: true,
    })
  );
}
