import { fibonacci } from "./fibonacci.ts";

test("fibonacci-5-pass", () => {
  expect(fibonacci(5)).toBe(5);
});
test("fibonacci-negativeNumber-fail", () => {
  const will_throw = () => {
    fibonacci(-1);
  };
  expect(will_throw).toThrow("Cannot compute on negative numbers");
});
