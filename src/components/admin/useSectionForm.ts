import { useEffect, useRef } from "react";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";

/**
 * Form helper for the admin editor.
 *
 * - Propagates changes to the parent (debounced) while the user types.
 * - Resets the form only on EXTERNAL content changes (signaled by `revision`),
 *   so typing never fights the parent state.
 * - Optional `transform` converts form values (e.g. comma-separated strings)
 *   into the content model shape (arrays/numbers) before they leave the form.
 */
export function useSectionForm<T extends FieldValues>(
  content: T,
  revision: number,
  onChange: (data: T) => void,
  transform?: (values: T) => T
): UseFormReturn<T> {
  const form = useForm<T>({ defaultValues: content });

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const transformRef = useRef(transform);
  transformRef.current = transform;

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const raw = (values ?? form.getValues()) as T;
        const output = transformRef.current ? transformRef.current(raw) : raw;
        onChangeRef.current(output);
      }, 250);
    });
    return () => {
      subscription.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form]);

  useEffect(() => {
    form.reset(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision]);

  return form;
}
