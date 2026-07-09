import { TextInput as RNTextInput, type TextInputProps } from 'react-native';

export function TextField(props: TextInputProps) {
  return (
    <RNTextInput
      placeholderTextColor="#94A3B8"
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-base text-slate-900 dark:text-slate-100"
      {...props}
    />
  );
}
