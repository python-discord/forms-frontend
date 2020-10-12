import { getForm, getForms } from "../../api/forms";

test('fetch a list of all forms', () => {
    expect(getForms()).toBeInstanceOf(Array);
});

test('fetch a specific form', () => {
    expect(getForm("ban-appeals")).resolves.toHaveProperty("title", "Ban Appeals")
});

export default null;
