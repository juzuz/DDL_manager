
import 'react-native-gesture-handler';
import React, { useState } from 'react';

import type {Node} from 'react';
import moment from 'moment'
import Providers from './src/navigation/Providers';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';





const App: () => Node = () => {


  return (
    <Providers/>
  );
};

export default App;

