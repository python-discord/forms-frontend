/** @jsx jsx */
import { jsx } from "@emotion/react";
import { renderWithProviders } from "../utils";
import AuthorizationSplash from "../../components/AuthorizationSplash";
import { finishAuthorizing } from "../../slices/authorization";
import { act } from "@testing-library/react";

test("authorization splash is hidden when not authorizing", () => {
    const { container } = renderWithProviders(<AuthorizationSplash />);
    const splash = container.firstElementChild;

    expect(splash).not.toBe(null);

    if (splash) {
        const style = window.getComputedStyle(splash);
        expect(style.opacity).toBe("0");
    }
});

test("authorization splash is visible when authorizing state is set", () => {
    const { container } = renderWithProviders(<AuthorizationSplash />, {
        preloadedState: {
            authorization: {
                authorizing: true
            }
        }
    });
    const splash = container.firstElementChild;

    expect(splash).not.toBe(null);

    if (splash) {
        const style = window.getComputedStyle(splash);
        expect(style.opacity).toBe("1");
    }
});

test("test state transitions when authorization completes", () => {
    const { store, container } = renderWithProviders(<AuthorizationSplash />, {
        preloadedState: {
            authorization: {
                authorizing: true
            }
        }
    });

    const splash = container.firstElementChild;

    expect(splash).not.toBe(null);

    if (splash) {
        let style = window.getComputedStyle(splash);
        expect(style.opacity).toBe("1");

        act(() => {
            store.dispatch(finishAuthorizing());
        });

        style = window.getComputedStyle(splash);
        expect(style.opacity).toBe("0");
    }
});
