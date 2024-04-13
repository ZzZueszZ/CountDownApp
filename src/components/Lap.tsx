import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Timer from './Timer';

interface LapProps {
  number: number;
  interval: number;
  fastest?: boolean;
  slowest?: boolean;
}

const Lap: React.FC<LapProps> = ({ number, interval, fastest, slowest }) => {
  const lapStyle = [styles.lapText, fastest && styles.fastest, slowest && styles.slowest];
  return (
    <View style={styles.lap}>
      <Text style={lapStyle}>Lap {number}</Text>
      <Timer interval={interval} style1 ={styles.timerContainer} style2={[lapStyle, styles.lapTimer]} />
    </View>
  );
};

const styles = StyleSheet.create({
  lapText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  lapTimer: {
    width: 30,
  },
  lap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#151515',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  fastest: {
    color: 'green',
  },
  slowest: {
    color: 'red',
  },
  timerContainer: {
    flexDirection: 'row',
  },
});

export default Lap;
