import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColor } from '@/src/theme/theme-color';
import ThemedText from './ThemedText';

interface ThemeHeaderBackButtonProps {
  onPress: () => void;
  title?: string;
}

const ThemeHeaderBackButton: React.FC<ThemeHeaderBackButtonProps> = ({
  onPress,
  title,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Ionicons 
          name={'arrow-back'} 
          size={20} 
          color={ThemeColor.text.secondary} 
        />
        { title && (
          <ThemedText 
            variant="primary" 
            size="md" 
            style={styles.title}
          >
            {title}
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: ThemeColor.paddingHorizontal,
    paddingVertical: 8,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    marginLeft: 4,
  },
});

export default ThemeHeaderBackButton;
