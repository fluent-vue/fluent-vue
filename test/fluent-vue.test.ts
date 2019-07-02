import { bundle } from "../src/fluent-vue"

import * as messages from "./translations.ftl"

console.log(messages)

/**
 * Dummy test
 */
describe("Dummy test", () => {
  it("fluent works", () => {
    // Arange
    const errors = bundle.addMessages(messages);

    // Act
    const helloUser = bundle.getMessage('hello-user');
    const message = bundle.format(helloUser, { userName: 'John' });

    // Assert
    expect(errors.length).toEqual(0);
    expect(message).toEqual("Hello, John!")
  })
})
