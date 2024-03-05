import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { FONTS } from './constants/fonts'
import React, { useState, useCallback, useEffect, useRef } from 'react' // Add useState here
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { COLORS } from './constants'
import {
  Login,
  Signup,
  Welcome,
  Home,
  User,
  Vip,
  Shop,
  Leaderboard,
  Setting,
  Spin,
  ChatScreen,
  FriendsList,
  EditProfile,
  FriendHome,
} from './screens'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { LogBox } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ShopContext } from './screens/ShopContext'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

LogBox.ignoreLogs([
  'Warning: Failed prop type: Invalid prop `source` supplied to `Image`, expected one of type [number].',
])
LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.'])
LogBox.ignoreLogs(['ViewPropTypes has been removed from React Native.'])
LogBox.ignoreLogs(['componentWillReceiveProps has been renamed, and is not recommended for use.'])
LogBox.ignoreLogs([
  "The method or property expo-font.unloadAsync is not available on android, are you sure you've linked all the native dependencies properly?",
])
LogBox.ignoreLogs(['`flexWrap: `wrap`` is not supported with the `VirtualizedList` components'])
LogBox.ignoreLogs(['Found screens with the same name nested inside one another.'])

export default function App() {
  const [selectedItem, setSelectedItem] = useState(null)
  const [fontsLoaded] = useFonts(FONTS)
  const Stack = createNativeStackNavigator()
  const Tab = createBottomTabNavigator()

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  useEffect(() => {
    onLayoutRootView()
  }, [onLayoutRootView])

  if (!fontsLoaded) {
    return null
  }

  function CustomTabBar({ state, descriptors, navigation }) {
    return (
      <View style={styles.menuContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name

          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          // Thay đổi icon và màu sắc tùy thuộc vào route
          let iconName
          let iconColor

          if (route.name === 'Home') {
            iconName = 'home'
            iconColor = isFocused ? 'blue' : COLORS.black
            bt = isFocused ? 'blue' : 'white'
          } else if (route.name === 'User') {
            iconName = 'user'
            iconColor = isFocused ? 'blue' : COLORS.black
          } else if (route.name === 'Shop') {
            iconName = 'shoppingcart'
            iconColor = isFocused ? 'blue' : COLORS.black
          } else if (route.name === 'Leaderboard') {
            iconName = 'barschart'
            iconColor = isFocused ? 'blue' : COLORS.black
            shiba = isFocused ? 'height : 100' : COLORS.black
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ alignItems: 'center', width: '25%', height: '100%' }}
            >
              <View style={{ height: '100%', alignItems: 'center' }}>
                <AntDesign name={iconName} size={34} color={iconColor} />
                <Text style={styles.menuText}>{label}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const HomeTab = () => {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="User" component={User} />
        <Tab.Screen name="Shop" component={Shop} />
        <Tab.Screen name="Leaderboard" component={Leaderboard} />
      </Tab.Navigator>
    )
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <ShopContext.Provider value={{ selectedItem, setSelectedItem }}>
              <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
                <Stack.Screen name="Home" component={HomeTab} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Setting" component={Setting} />
                <Stack.Screen name="Spin" component={Spin} />
                <Stack.Screen name="FriendsList" component={FriendsList} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="FriendHome" component={FriendHome} />
              </Stack.Navigator>
            </ShopContext.Provider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  )
}

const styles = StyleSheet.create({
  menuContainer: {
    width: '100%',
    height: 80,
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.white,
    borderTopRightRadius: 19,
    borderTopLeftRadius: 19,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 0,
  },

  menuText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 3,
  },
  menuText1: {
    fontSize: 12,
    color: COLORS.gray,
  },
  buttonContainer: {
    width: 75,
    height: 85,
    borderRadius: '100%',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 375 * 0.4,
    bottom: 20,
  },
  indicator: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'blue',
    top: 0,
  },
})
