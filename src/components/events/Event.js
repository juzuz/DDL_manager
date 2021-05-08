// @flow

import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import type { EventType } from '../../screens/TodayScreen';

export default class Event extends Component {

  props: {
    event: EventType,
  };

  render() {
    const { event } = this.props;
    const {
      ddl,
      task,
      id,
      importanceScore,
      startTime,
      tag,
      type,
      complete
    } = event;
    return (
      <>
      {!ddl.isSame(moment(),'day') && complete?
      <View style={styles.containerComplete}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{ddl.format()}</Text>
          <Text style={[styles.text, styles.title]}>{task}</Text>
          <Text style={styles.text}>{tag}</Text>
        </View>
      </View>
      :
      <View style={styles.containerInComplete}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{ddl.format()}</Text>
          <Text style={[styles.text, styles.title]}>{task}</Text>
          <Text style={styles.text}>{tag}</Text>
        </View>
      </View>
      }
    </>
    );
  }

}

const styles = StyleSheet.create({
  containerComplete: {
    opacity:0.6,
    borderBottomWidth:1,
    borderBottomColor:'#FFFFFF',
    flex: 1,
    flexDirection: 'row',
    padding: 15,
  },
  containerInComplete: {
    borderBottomWidth:1,
    borderBottomColor:'#FFFFFF',
    flex: 1,
    flexDirection: 'row',
    padding: 15,
  },
 
  textContainer: {
    flex: 1,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});