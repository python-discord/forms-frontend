import { getForm, getForms } from "../../api/forms";

test('fetch a specific form', () => {
    expect(getForm("ban-appeals")).resolves.toHaveProperty("name", "Ban Appeals")
});

export default null;
