import { HStack, Text, VStack } from '@expo/ui/swift-ui';
import {
  font,
  foregroundStyle,
  frame,
  padding,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { WidgetSnapshotProps } from '@/src/core/domain/ports/WidgetPort';
import { getVisibleWidgetItems } from '@/src/features/widget/domain/buildWidgetSnapshot';

const PRIMARY = '#6366F1';
const MUTED = '#64748B';

function SenaWidgetView(props: WidgetSnapshotProps, environment: WidgetEnvironment) {
  'widget';

  const items = getVisibleWidgetItems(props, environment.widgetFamily);
  const isSmall = environment.widgetFamily === 'systemSmall';

  if (items.length === 0) {
    return (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle(PRIMARY)]}>
          时念
        </Text>
        <Text modifiers={[font({ size: 13 }), foregroundStyle(MUTED)]}>暂无即将到来的纪念日</Text>
      </VStack>
    );
  }

  if (isSmall) {
    const item = items[0];
    return (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ weight: 'bold', size: 14 }), foregroundStyle(PRIMARY)]}>
          时念
        </Text>
        <Text modifiers={[font({ weight: 'bold', size: 18 }), foregroundStyle(item.color)]}>
          {item.title}
        </Text>
        <HStack>
          <Text modifiers={[font({ weight: 'bold', size: 28 }), foregroundStyle(item.color)]}>
            {item.primaryLabel}
          </Text>
          {item.primaryLabel !== '今天' ? (
            <Text modifiers={[font({ size: 14 }), foregroundStyle(MUTED)]}>天</Text>
          ) : null}
        </HStack>
        <Text modifiers={[font({ size: 12 }), foregroundStyle(MUTED)]}>{item.secondaryLabel}</Text>
      </VStack>
    );
  }

  return (
    <VStack modifiers={[padding({ all: 12 })]}>
      <Text modifiers={[font({ weight: 'bold', size: 16 }), foregroundStyle(PRIMARY)]}>
        时念 · 即将到来
      </Text>
      {items.map((item, index) => (
        <HStack
          key={`${item.id}-${index}`}
          modifiers={[frame({ maxWidth: Infinity }), padding({ vertical: 4 })]}>
          <VStack modifiers={[frame({ maxWidth: Infinity })]}>
            <Text modifiers={[font({ weight: 'semibold', size: 14 }), foregroundStyle(item.color)]}>
              {item.title}
            </Text>
            <Text modifiers={[font({ size: 12 }), foregroundStyle(MUTED)]}>
              {item.secondaryLabel}
            </Text>
          </VStack>
          <Text modifiers={[font({ weight: 'bold', size: 20 }), foregroundStyle(item.color)]}>
            {item.primaryLabel}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}

const SenaWidget = createWidget('SenaWidget', SenaWidgetView);

export default SenaWidget;
