import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Timer from './src/components/Timer';
import RoundButton from './src/components/RoundButton';
import LapsTable from './src/components/LapTable';
import ButtonsRow from './src/components/ButtonRow';


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
        <Timer interval={laps.reduce((total, curr) => total + curr, 0) + timer} style1={styles.timerContainer} style2={styles.timer} />
        {laps.length === 0 && (
          <ButtonsRow>
            <RoundButton title='Lap' color='#8B8B90' background='#151515' disabled onPress={() => {}} />
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
    color: 'white',
    fontSize: 76,
    fontWeight: '100',
    width: 110,
  },
  timerContainer: {
    flexDirection: 'row',
  },
});
