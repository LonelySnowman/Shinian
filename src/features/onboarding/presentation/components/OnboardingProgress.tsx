import { View } from 'react-native';

interface OnboardingProgressProps {
  step: number;
  total: number;
}

export function OnboardingProgress({ step, total }: OnboardingProgressProps) {
  return (
    <View className="flex-row gap-2 px-4 pt-4">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`h-1 flex-1 rounded-full ${
            index < step ? 'bg-sena-primary' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        />
      ))}
    </View>
  );
}
