import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import moment from 'moment';

interface TimerProps {
  interval: number;
  style: any;
}

const Timer: React.FC<TimerProps> = ({ interval, style }) => {
  const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
  const duration = moment.duration(interval);
  const centiseconds = Math.floor(duration.milliseconds() / 10);
  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())},</Text>
      <Text style={style}>{pad(centiseconds)}</Text>
    </View>
  );
};

interface RoundButtonProps {
    title: string;
    color: string;
    background: string;
    onPress: () => void;
    disabled?: boolean;
}

const RoundButton: React.FC<RoundButtonProps> = ({ title, color, background, onPress, disabled }) => {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()}
      style={[styles.button, { backgroundColor: background }]}
      activeOpacity={disabled ? 1.0 : 0.7}>
      <View style={styles.buttonBorder}>
        <Text style={[styles.buttonTitle, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

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
      <Timer style={[lapStyle, styles.lapTimer]} interval={interval} />
    </View>
  );
};

interface LapsTableProps {
  laps: number[];
  timer: number;
}

const LapsTable: React.FC<LapsTableProps> = ({ laps, timer }) => {
  const finishedLaps = laps.slice(1);
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  if (finishedLaps.length >= 2) {
    finishedLaps.forEach((lap) => {
      if (lap < min) min = lap;
      if (lap > max) max = lap;
    });
  }
  return (
    <ScrollView style={styles.scrollView}>
      {laps.map((lap, index) => (
        <Lap
          number={laps.length - index}
          key={laps.length - index}
          interval={index === 0 ? timer + lap : lap}
          fastest={lap === min}
          slowest={lap === max}
        />
      ))}
    </ScrollView>
  );
};

interface ButtonsRowProps {
  children: React.ReactNode;
}

const ButtonsRow: React.FC<ButtonsRowProps> = ({ children }) => {
  return <View style={styles.buttonsRow}>{children}</View>;
};

export default class App extends Component<{}, { start: number; now: number; laps: number[] }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      start: 0,
      now: 0,
      laps: [],
    };
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  timer?: NodeJS.Timeout;

  start = () => {
    const now = new Date().getTime();
    this.setState({
      start: now,
      now,
      laps: [0],
    });
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() });
    }, 100);
  };

  lap = () => {
    const timestamp = new Date().getTime();
    const { laps, now, start } = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
      laps: [0, firstLap + now - start, ...other],
      start: timestamp,
      now: timestamp,
    });
  };

  stop = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    const { laps, now, start } = this.state;
    const [firstLap, ...other] = laps;
    this.setState({
      laps: [firstLap + now - start, ...other],
      start: 0,
      now: 0,
    });
  };
  reset = () => {
    this.setState({
      laps: [],
      start: 0,
      now: 0,
    });
  };
  resume = () => {
    const now = new Date().getTime();
    this.setState({
      start: now,
      now,
    });
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime() });
    }, 100);
  };
  render() {
    const { now, start, laps } = this.state;
    const timer = now - start;
    return (
      <View style={styles.container}>
        <Timer interval={laps.reduce((total, curr) => total + curr, 0) + timer} style={styles.timer} />
        {laps.length === 0 && (
          <ButtonsRow>
            <RoundButton title='Lap' color='#8B8B90' background='#151515' disabled  onPress={() => {}}/>
            <RoundButton title='Start' color='#50D167' background='#1B361F' onPress={this.start} />
          </ButtonsRow>
        )}
        {start > 0 && (
          <ButtonsRow>
            <RoundButton title='Lap' color='#FFFFFF' background='#3D3D3D' onPress={this.lap} />
            <RoundButton title='Stop' color='#E33935' background='#3C1715' onPress={this.stop} />
          </ButtonsRow>
        )}
        {laps.length > 0 && start === 0 && (
          <ButtonsRow>
            <RoundButton title='Reset' color='#FFFFFF' background='#3D3D3D' onPress={this.reset} />
            <RoundButton title='Start' color='#50D167' background='#1B361F' onPress={this.resume} />
          </ButtonsRow>
        )}
        <LapsTable laps={laps} timer={timer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop: 130,
    paddingHorizontal: 20,
  },
  timer: {
    color: '#FFFFFF',
    fontSize: 76,
    fontWeight: '100',
    width: 110,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: 80,
    marginBottom: 30,
  },
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
  scrollView: {
    alignSelf: 'stretch',
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
