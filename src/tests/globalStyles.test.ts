import globalStyles from "../globalStyles";

test("global styles emotion css compiles", () => {
    expect(globalStyles.styles).not.toBeUndefined();
})
