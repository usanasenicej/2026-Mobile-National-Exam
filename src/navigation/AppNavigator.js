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
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: '800',
            fontSize: 19,
            letterSpacing: 0.3,
          },
          drawerType: 'slide',
          overlayColor: 'rgba(0,0,0,0.5)',
          swipeEdgeWidth: 60,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigation.toggleDrawer()}
              accessibilityLabel="Open navigation drawer"
              accessibilityRole="button"
            >
              <Ionicons name="menu" size={24} color={COLORS.white} />
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
