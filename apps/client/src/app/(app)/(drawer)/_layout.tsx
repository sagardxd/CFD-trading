import { Drawer } from 'expo-router/drawer';
import { ThemeColor } from '@/src/theme/theme-color';
import { Ionicons } from '@expo/vector-icons';
import DrawerContent from '@/src/components/tabs/DrawerContent';

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
        drawerContentContainerStyle: {
          flex: 1,
        },
      }}
      drawerContent={DrawerContent}
    >
      <Drawer.Screen
        name="home" 
        options={{
          drawerLabel: 'Home',
          title: 'overview',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
        }}
        
      />
       <Drawer.Screen
        name="orders" 
        options={{
          drawerLabel: 'Orders',
          title: 'overview',
          drawerIcon: ({ color }) => (
            <Ionicons name="list-outline" size={20} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
