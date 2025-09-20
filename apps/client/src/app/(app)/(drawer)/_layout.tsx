import { Drawer } from 'expo-router/drawer';
import { ThemeColor } from '@/src/theme/theme-color';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import ThemedText from '@/src/components/common/ThemedText';

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
      drawerContent={(props) => (
        <View style={{ flex: 1, backgroundColor: ThemeColor.background }}>
          <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
          <View style={{ 
            padding: 20, 
            alignItems: 'center'
          }}>
            <ThemedText variant='secondary' size='sm'>
              Version 1.0.0
            </ThemedText>
          </View>
        </View>
      )}
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
