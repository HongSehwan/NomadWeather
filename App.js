import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import { 
  View, 
  Text, 
  Dimensions, 
  ActivityIndicator,
  StyleSheet, 
  ScrollView 
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "03c866fa421c316a6574d9adf16dd504"
const icons = {
  "Clouds": "Cloudy"
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [date, setDate] = useState(null);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
        { latitude, longitude }, 
        { useGoogleMaps: false }
      );
      setCity(location[0].city);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
      )
      const json = await response.json();
      setDays(json.daily)

      const today = new Date();
      const date = today.getFullYear() + "/" + parseInt(today.getMonth()+1) + "/" + today.getDate();
      setDate(date)
    };

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <>
    {ok === true ? (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <Text style={styles.date}>{date}</Text>
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
        <View style={styles.day}>
          <ActivityIndicator 
            color="white" 
            size="large" 
            style={{marginTop: 10}}
            />
        </View> 
        ) : (
          days.map((day, index) =>
          <View key={index} style={styles.day}>
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              marginTop: 50,
              justifyContent: "space-between" 
              }}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Fontisto name="cloudy" size={68} color="white" />
            </View>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
          )
        )}
      </ScrollView>
    </View>
    ) : ( 
      <View style={styles.container}>
        <Text style={styles.date}>Why...!</Text>
      </View>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "tomato"
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    marginTop: 60,
    fontSize: 68,
    fontWeight: "500",
    color: "white"
  },
  weather: {
    
  },
  day: {
    width: SCREEN_WIDTH,
  },
  temp: {
    marginTop: 45,
    fontSize: 100,
    color: "white",
    marginLeft: 20,
  },
  description: {
    marginTop: -30,
    fontSize: 30,
    color: "white",
    marginLeft: 20,
  },
  tinyText: {
    fontSize: 20,
    color: "white",
    marginLeft: 20,
  },
  date: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
    color: "white"
  }
})