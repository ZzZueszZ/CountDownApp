import React from 'react';
import { View, Text } from 'react-native';
import moment from 'moment';

interface TimerProps {
  interval: number;
  style1: any;
  style2:any;

}

const Timer: React.FC<TimerProps> = ({ interval, style1,style2 }) => {
  const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
  const duration = moment.duration(interval);
  const centiseconds = Math.floor(duration.milliseconds() / 10);
  return (
    <View style={style1}>
    <Text style={style2}>{pad(duration.minutes())}:</Text>
    <Text style={style2}>{pad(duration.seconds())},</Text>
    <Text style={style2}>{pad(centiseconds)}</Text>
  </View>
  );
};

export default Timer;
