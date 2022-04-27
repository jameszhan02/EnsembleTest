import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Alert,
  Image,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {searchMovie} from './services/OMDBService';
import SwitchWithIcons from 'react-native-switch-with-icons';
import darkIcon from './assest/moon-outline.png';
import lightIcon from './assest/sunny-outline.png';

const App = () => {
  // init ez animation
  LayoutAnimation.easeInEaseOut();
  const [switchValue, setSwitchValue] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [currentMovieList, setCurrentMovieList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTotal, setSearchTotal] = useState(0);
  const flatListRef = useRef();

  const loadNextPage = async () => {
    if((currentPage*10)>searchTotal || (currentPage*10)==searchTotal ){
      //there is no next page
      alert("You are in the last page");
    }else{
      let moviesRes = await searchMovie(searchInput, currentPage + 1);
      setCurrentPage(currentPage + 1);
      setCurrentMovieList(moviesRes['Search']);
      flatListRef.current.scrollToOffset({ index: 0, animated: true });
    }
  };

  const loadPrevPage = async () => {
    if(currentPage == 1){
      alert("You are in the first page");
    }else{
      let moviesRes = await searchMovie(searchInput, currentPage - 1);
      setCurrentPage(currentPage - 1);
      setCurrentMovieList(moviesRes['Search']);
      flatListRef.current.scrollToOffset({ index: 0, animated: true });
    }
  };

  const renderItem = ({item}) => (
    <View
      style={
        switchValue
          ? {...styles.darkMovieCard, ...styles.shadowBox}
          : {...styles.movieCard, ...styles.shadowBox}
      }>
      <Image style={styles.cardPoster} source={{uri: item.Poster}} />
      {/* bottom part of card box */}
      <View style={{marginTop: 20, marginBottom: 20}}>
        <View
          style={{
            flexDirection: 'row',
            ...styles.container
          }}>
          <Text style={switchValue ? styles.darkTitle : styles.lightTitle}>
            {item.Title}
          </Text>
          <TouchableOpacity
            style={switchValue ? styles.darkBtn : styles.lightBtn}
            onPress={() => {
              console.log('movie click!');
              alert(`Should Play ${item.Title}, Enjoy!`);
            }}>
            <Text style={{color: 'white'}}>Watch Now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={switchValue ? styles.darkYear : styles.lightYear}>{item.Year}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={
        switchValue ? styles.darkBackgroundStyle : styles.lightBackgroundStyle
      }>
      <StatusBar barStyle={switchValue ? 'light-content' : 'dark-content'} />
      <View
        style={
          switchValue
            ? {flex: 1, backgroundColor: '#212329'}
            : {flex: 1, backgroundColor: '#f4f4f4'}
        }>
        {/* search top bar with switch theme btn */}
        <View style={switchValue ? styles.darkHeader : styles.lightHeader}>
          <View style={styles.headerStyle}>
            <TextInput
              style={
                switchValue
                  ? {...styles.searchInput, ...styles.darkSearchInput}
                  : styles.searchInput
              }
              clearButtonMode="while-editing"
              placeholder="Type key word to find your Movie!"
              returnKeyType="search"
              value={searchInput}
              onChangeText={text => {
                setSearchInput(text);
              }}
              onSubmitEditing={async () => {
                // console.log("on submit", searchInput);
                let moviesRes = await searchMovie(searchInput, 1);
                if (moviesRes) {
                  setCurrentPage(1);
                  console.log(moviesRes['Search'].length);
                  setSearchTotal(moviesRes['totalResults']);
                  setCurrentMovieList(moviesRes['Search']);
                } else {
                  alert('Search fail, try a better key word maybe.');
                }
              }}
            />
            <SwitchWithIcons
              style={{
                marginBottom: 'auto',
                marginTop: 'auto',
                marginLeft: 'auto',
              }}
              value={switchValue}
              icon={{true: darkIcon, false: lightIcon}}
              onValueChange={value => {
                setSwitchValue(value);
              }}
              animationDuration={200}
            />
          </View>
        </View>
        <FlatList ref={flatListRef} data={currentMovieList} renderItem={renderItem} />

        {/* bottom page bar: if there no result list hide the page bar from user */}
        {searchTotal != 0 ? (
          <View
            style={
              switchValue
                ? {backgroundColor: '#18191a', width: '100%'}
                : {width: '100%'}
            }>
            <View style={styles.pageBar}>
              <TouchableOpacity 
                style={styles.vCenter}
                onPress={()=>{
                  loadPrevPage();
                }}
              >
                <Icon
                  name="ios-play-skip-back-outline"
                  size={30}
                  color={switchValue ? 'white' : 'tomato'}
                />
              </TouchableOpacity>
              <View
                style={{
                  height: 50,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={switchValue ? {color: 'white'} : {}}>{`${
                  10 * currentPage
                } / ${searchTotal}`}</Text>
              </View>
              <TouchableOpacity 
                style={styles.vCenter}
                onPress={()=>{
                  loadNextPage();
                }}
              >
                <Icon
                  name="ios-play-skip-forward-outline"
                  size={30}
                  color={switchValue ? 'white' : 'tomato'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  darkYear: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
    width: '65%',
  },
  lightYear: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
    width: '65%',
  },
  container:{
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  darkTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    width: '65%',
  },
  lightTitle: {
    fontSize: 18,
    fontWeight: '500',
    width: '65%',
  },
  lightBtn: {
    height: 40,
    marginLeft: 'auto',
    backgroundColor: 'tomato',
    padding: 10,
    borderRadius: 10,
  },
  darkBtn: {
    height: 40,
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  lightHeader: {
    width: '100%',
    backgroundColor: 'white',
  },
  darkHeader: {
    width: '100%',
    backgroundColor: '#18191a',
  },
  cardPoster: {
    height: 480,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  darkMovieCard: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 35,
    borderRadius: 15,
    backgroundColor: '#181818',
  },
  movieCard: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 35,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  vCenter: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  pageBar: {
    height: 50,
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: 'row',
  },
  darkSearchInput: {
    backgroundColor: '#212329',
    color: '#fff',
  },
  searchInput: {
    height: 40,
    width: 250,
    marginTop: 'auto',
    marginBottom: 'auto',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#212329',
    padding: 10,
  },
  headerStyle: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 50,
  },
  lightBackgroundStyle: {
    flex: 1,
    backgroundColor: 'white',
  },
  darkBackgroundStyle: {
    flex: 1,
    backgroundColor: '#18191a',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
