import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import apis from './rss-apis';

class App extends Component {
  constructor (props) {
    super (props)
    this.state = {news : {}, loading : true}
  }    
    
  componentDidMount () {
    fetch(apis.yahooNews)
      .then(response => response.text())
      .then(responseData => rssParser.parse(responseData))
      .then(rss => this.setState({news: rss.items, loading: false}))
      .catch(err => console.error(err)); 
  }

  renderItem = ({ item }) => { 

    const geUrlByParams = (str, param) => {
      return str
        .split('><')
        .find(elem=> elem.includes(param))
        .split('"')
        .find(item => item.includes('http'));
    }
    const handleClick = () => {
      Linking.canOpenURL(`https://news.yahoo.com/${item.id}`).then(supported => {
        if (supported) {
          Linking.openURL(`https://news.yahoo.com/${item.id}`);
        } else {
          console.log(`Don't know how to open URI: https://news.yahoo.com/${item.id}`);
        }
      });
  };
    const urlImg = {uri: geUrlByParams(item.description, 'img')};
    return (
      <TouchableOpacity onPress={handleClick}> 
        <View style={styles.item}>
          <Image source={urlImg} style={styles.img}/>
          <Text style={styles.title}>
            {item.title}
          </Text>      
        </View>
      </TouchableOpacity>
  )};  

  render() {    
    const { news, loading } = this.state;
    if (!loading) {
      return <View style={{alignItems: 'center'}}>
          <Text style={styles.header}>Yahoo! news</Text>
            <FlatList
              styles={styles.container}
              data={news}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            {this.state.error &&
              <Text>
                Error message: {this.state.error}
              </Text>
            }
        </View>
    } else {
            return <ActivityIndicator style={styles.loader}/>
        }
    
  }
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 30,
    fontSize: 24,
    color: '#3366ff',    
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  item: {    
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'    
  },
  title: {
    fontWeight: 'bold',
    fontSize: 17,
    maxWidth: 200,
    height: 80,
  },
  img: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  loader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

export default App;

