import 'react-native-gesture-handler'; // Must be first — enables gesture support
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent wraps <App /> with the Expo environment context.
registerRootComponent(App);
