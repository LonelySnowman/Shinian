import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Platform, Pressable, Text, View } from 'react-native';
import { useState } from 'react';

import { TextField } from '@/src/shared/ui/TextField';

interface DatePickerFieldProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  const [visible, setVisible] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setVisible(false);
    }
    if (date) {
      onChange(date);
    }
  };

  return (
    <View>
      <Pressable onPress={() => setVisible(true)}>
        <TextField editable={false} pointerEvents="none" value={value.toLocaleDateString('zh-CN')} />
      </Pressable>
      {visible ? (
        Platform.OS === 'ios' ? (
          <View className="mt-2 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
            <View className="flex-row justify-end px-3 py-2">
              <Pressable onPress={() => setVisible(false)}>
                <Text className="text-sena-primary font-semibold">完成</Text>
              </Pressable>
            </View>
            <DateTimePicker value={value} mode="date" display="inline" onChange={handleChange} />
          </View>
        ) : (
          <DateTimePicker value={value} mode="date" display="default" onChange={handleChange} />
        )
      ) : null}
    </View>
  );
}
