
import { useEffect, RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent) => void;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  exceptRefs: RefObject<HTMLElement>[] = []
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      const target = event.target as Node;

      // Check if the click was inside the referenced element
      const isInside = el && el.contains(target);
      
      // Check if the click was inside any of the exception elements
      const isInExceptRefs = exceptRefs.some(
        exceptRef => exceptRef.current && exceptRef.current.contains(target)
      );

      // If the click was not inside the referenced element or any exception elements,
      // call the handler
      if (!isInside && !isInExceptRefs) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, exceptRefs]);
}
