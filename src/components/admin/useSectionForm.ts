import { useEffect, useRef } from "react";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";

/**
 * Form helper for the admin editor.
 *
 * - Propagates changes immediately; preview and autosave debounce independently.
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

  useEffect(() => {
    const subscription = form.watch((values) => {
      const raw = (values ?? form.getValues()) as T;
      const output = transformRef.current ? transformRef.current(raw) : raw;
      onChangeRef.current(output);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  useEffect(() => {
    form.reset(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision]);

  return form;
}
