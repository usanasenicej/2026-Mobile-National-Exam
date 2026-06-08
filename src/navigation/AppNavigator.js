import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import SearchScreen from '../screens/SearchScreen';
import DrawerContent from '../components/DrawerContent';
import { COLORS } from '../constants/colors';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: COLORS.primaryDark,
            elevation: 4,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          },
          headerTintColor: COLORS.accent,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 20,
            letterSpacing: 0.5,
          },
          drawerType: 'slide',
          overlayColor: 'rgba(15, 23, 42, 0.6)',
          swipeEdgeWidth: 60,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.toggleDrawer()}
              accessibilityLabel="Open navigation drawer"
              accessibilityRole="button"
            >
              <Ionicons name="menu" size={24} color={COLORS.accent} />
            </TouchableOpacity>
          ),
        })}
      >
        <Drawer.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: 'LexiSearch' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default AppNavigator;
