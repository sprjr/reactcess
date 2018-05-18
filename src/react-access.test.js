import React from 'react';
import {render} from 'react-testing-library';
import 'jest-dom/extend-expect';
import { RequireForAccess, ReactAccessProvider, ReactAccessConsumer } from './index';

test('renders children when authorizeAccess is true', () => {
  const {getByTestId} = render(<ReactAccessProvider validator={() => true}>
    <RequireForAccess>
      <div data-testid="expected">Expected Content</div>
    </RequireForAccess>
  </ReactAccessProvider>);

  expect(getByTestId('expected')).toHaveTextContent('Expected Content');
});

test('renders invalidAccessComponent when validator is false', () => {
  const invalidAccessComponent = <div data-testid="invalid">Invalid Access</div>;
  const {getByTestId, queryByText} = render(<ReactAccessProvider validator={() => false}>
    <RequireForAccess invalidAccessComponent={invalidAccessComponent}>
      <div data-testid="secret">Secret Content</div>
    </RequireForAccess>
  </ReactAccessProvider>);

  expect(getByTestId('invalid')).toHaveTextContent('Invalid Access');
  expect(queryByText('Secret Content')).toBeNull();
});

test('defaultProps#validator behaves as expected', () => {
  const { validator } = ReactAccessProvider.defaultProps;

  // no requiredPermissions found
  expect(validator(['user', 'super-user'], ['admin'])).toBe(false);

  // one requiredPermission found
  expect(validator(['user', 'super-user'], ['user'])).toBe(true);

  // all requiredPermissions not found
  expect(validator(['user', 'super-user'], ['user', 'super-user', 'admin'], true)).toBe(false);

  // all requiredPermissions found
  expect(validator(['user', 'super-user', 'admin'], ['user', 'super-user', 'admin'], true)).toBe(true);
});
