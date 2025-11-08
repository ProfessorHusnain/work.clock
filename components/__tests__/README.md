# Component Tests

This directory contains test files for React components using Jest and React Testing Library.

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### Example Test File: `timezone-selector.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComponentName } from '../component-name';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Common Testing Patterns

### 1. Rendering Components
```typescript
render(<MyComponent prop="value" />);
```

### 2. Finding Elements
```typescript
// By text
screen.getByText('Button Text');

// By placeholder
screen.getByPlaceholderText('Search...');

// By role
screen.getByRole('button');

// By test ID
screen.getByTestId('my-element');
```

### 3. User Interactions
```typescript
// Click
fireEvent.click(screen.getByRole('button'));

// Type
fireEvent.change(input, { target: { value: 'test' } });

// Keyboard
fireEvent.keyDown(element, { key: 'Enter' });
```

### 4. Async Operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### 5. Mocking
```typescript
jest.mock('@/lib/hooks/useTimezones', () => ({
  useTimezones: () => ({
    availableTimezones: mockData,
    addTimezone: jest.fn(),
  }),
}));
```

## Current Test Coverage

### TimezoneSelector Component
- ✅ Renders dialog when open
- ✅ Displays popular timezones
- ✅ Filters timezones on search
- ✅ Shows download button with tooltip
- ✅ Displays empty state for no results

## Adding New Tests

1. Create a new file: `component-name.test.tsx`
2. Import necessary testing utilities
3. Mock any external dependencies (hooks, APIs)
4. Write test cases using `describe` and `it` blocks
5. Run `npm test` to verify

## Best Practices

- **Test user behavior**, not implementation details
- **Use semantic queries** (getByRole, getByLabelText) over test IDs
- **Mock external dependencies** to isolate component logic
- **Keep tests simple** and focused on one thing
- **Use descriptive test names** that explain what's being tested

## Useful Resources

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Common Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

