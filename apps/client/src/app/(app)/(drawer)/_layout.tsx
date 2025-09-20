import { Drawer } from 'expo-router/drawer';
import { ThemeColor } from '@/src/theme/theme-color';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: ThemeColor.background,
        },
        drawerActiveTintColor: ThemeColor.text.primary,
        drawerInactiveTintColor: ThemeColor.text.secondary,
        drawerLabelStyle: {
          fontFamily: 'ManropeMedium',
          fontSize: 16,
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 8,
          marginVertical: 2,
        },
        drawerActiveBackgroundColor: ThemeColor.card,
        drawerInactiveBackgroundColor: 'transparent',
        
      }}
    >
      <Drawer.Screen
        name="home" 
        options={{
          drawerLabel: 'Home',
          title: 'overview',
        }}
      />
       <Drawer.Screen
        name="orders" 
        options={{
          drawerLabel: 'Orders',
          title: 'overview',
        }}
      />
    </Drawer>
  );
}
