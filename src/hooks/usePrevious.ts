import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    // The ref is updated after each render so this returns the prior value.
    // eslint-disable-next-line react-hooks/refs
    return ref.current;
}