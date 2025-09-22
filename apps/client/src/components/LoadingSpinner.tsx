import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ThemeColor } from '../theme/theme-color';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'large',
}) => {
  return (
    <View>
      <ActivityIndicator size={size} color={ThemeColor.primary} />
      
      {message  && <Text style={{ color: '#fff', marginTop: 10 }}>{message}</Text>}
    </View>
  );
}; 

export default LoadingSpinner;