import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';

import { DEFAULT_CATEGORY_ID } from '@/src/core/domain/entities/Category';
import {
  ANNIVERSARY_COLORS,
  anniversaryFormSchema,
  REMINDER_OFFSET_OPTIONS,
  type AnniversaryFormValues,
} from '@/src/features/anniversary/presentation/schemas/anniversaryFormSchema';
import { useCategories } from '@/src/features/category';
import { Button } from '@/src/shared/ui/Button';
import { DatePickerField } from '@/src/shared/ui/DatePickerField';
import { TextField } from '@/src/shared/ui/TextField';

interface AnniversaryFormProps {
  defaultValues?: Partial<AnniversaryFormValues>;
  submitLabel: string;
  onSubmit: (values: AnniversaryFormValues) => Promise<void>;
}

const defaultFormValues: AnniversaryFormValues = {
  title: '',
  date: new Date(),
  isLunar: false,
  repeatType: 'yearly',
  categoryId: DEFAULT_CATEGORY_ID,
  icon: 'heart',
  color: ANNIVERSARY_COLORS[0],
  notes: '',
  reminderEnabled: true,
  reminderOffsetDays: 0,
};

export function AnniversaryForm({ defaultValues, submitLabel, onSubmit }: AnniversaryFormProps) {
  const { items: categories } = useCategories();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<AnniversaryFormValues>({
    resolver: zodResolver(anniversaryFormSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

  const selectedColor = watch('color');
  const selectedCategoryId = watch('categoryId');
  const reminderEnabled = watch('reminderEnabled');
  const reminderOffsetDays = watch('reminderOffsetDays');

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950" contentContainerClassName="p-4 pb-10">
      <Text className="mb-2 text-sm font-medium text-slate-600">标题</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField placeholder="例如：在一起" onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
      />
      {errors.title ? <Text className="mt-1 text-sm text-red-500">{errors.title.message}</Text> : null}

      <Text className="mb-2 mt-5 text-sm font-medium text-slate-600">日期</Text>
      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <DatePickerField value={value} onChange={onChange} />
        )}
      />

      <View className="mt-5 flex-row items-center justify-between rounded-2xl bg-white dark:bg-slate-900 px-4 py-3">
        <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">农历日期</Text>
        <Controller
          control={control}
          name="isLunar"
          render={({ field: { onChange, value } }) => (
            <Switch value={value} onValueChange={onChange} trackColor={{ true: '#6366F1' }} />
          )}
        />
      </View>

      <Text className="mb-2 mt-5 text-sm font-medium text-slate-600">重复</Text>
      <View className="flex-row flex-wrap gap-2">
        {[
          { value: 'yearly', label: '每年' },
          { value: 'monthly', label: '每月' },
          { value: 'weekly', label: '每周' },
          { value: 'none', label: '不重复' },
        ].map((option) => (
          <Controller
            key={option.value}
            control={control}
            name="repeatType"
            render={({ field: { onChange, value } }) => (
              <Pressable
                onPress={() => onChange(option.value)}
                className={`rounded-full px-4 py-2 ${
                  value === option.value ? 'bg-sena-primary' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                }`}>
                <Text className={value === option.value ? 'text-white' : 'text-slate-700 dark:text-slate-200'}>
                  {option.label}
                </Text>
              </Pressable>
            )}
          />
        ))}
      </View>

      <View className="mt-5 rounded-2xl bg-white dark:bg-slate-900 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">开启提醒</Text>
            <Text className="mt-1 text-xs text-slate-400">将在纪念日到来时发送本地通知</Text>
          </View>
          <Controller
            control={control}
            name="reminderEnabled"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} trackColor={{ true: '#6366F1' }} />
            )}
          />
        </View>

        {reminderEnabled ? (
          <View className="mt-4 flex-row flex-wrap gap-2">
            {REMINDER_OFFSET_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setValue('reminderOffsetDays', option.value)}
                className={`rounded-full px-4 py-2 ${
                  reminderOffsetDays === option.value
                    ? 'bg-sena-primary'
                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}>
                <Text
                  className={
                    reminderOffsetDays === option.value
                      ? 'text-white'
                      : 'text-slate-700 dark:text-slate-200'
                  }>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      <Text className="mb-2 mt-5 text-sm font-medium text-slate-600">分类</Text>
      <View className="flex-row flex-wrap gap-2">
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => setValue('categoryId', category.id)}
            className={`rounded-full px-4 py-2 ${
              selectedCategoryId === category.id
                ? 'bg-sena-primary'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
            }`}>
            <Text
              className={
                selectedCategoryId === category.id ? 'text-white' : 'text-slate-700 dark:text-slate-200'
              }>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="mb-2 mt-5 text-sm font-medium text-slate-600">颜色</Text>
      <View className="flex-row flex-wrap gap-3">
        {ANNIVERSARY_COLORS.map((color) => (
          <Pressable
            key={color}
            onPress={() => setValue('color', color)}
            className={`h-10 w-10 rounded-full ${selectedColor === color ? 'border-2 border-slate-900 dark:border-white' : ''}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </View>

      <Text className="mb-2 mt-5 text-sm font-medium text-slate-600">备注</Text>
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-[100px]"
            placeholder="写点什么..."
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <View className="mt-8">
        <Button
          label={isSubmitting ? '保存中...' : submitLabel}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ScrollView>
  );
}
