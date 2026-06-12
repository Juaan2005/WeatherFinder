import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

// Kamus lengkap kode cuaca WMO
const WEATHER_CODES = {
  0: { label: 'Cerah', emoji: '☀️' },
  1: { label: 'Cerah Berawan', emoji: '🌤️' },
  2: { label: 'Berawan Sebagian', emoji: '⛅' },
  3: { label: 'Mendung', emoji: '☁️' },
  45: { label: 'Berkabut', emoji: '🌫️' },
  48: { label: 'Kabut Berembun', emoji: '🌫️' },
  51: { label: 'Gerimis Ringan', emoji: '🌦️' },
  53: { label: 'Gerimis Sedang', emoji: '🌦️' },
  55: { label: 'Gerimis Lebat', emoji: '🌦️' },
  61: { label: 'Hujan Ringan', emoji: '🌧️' },
  63: { label: 'Hujan Sedang', emoji: '🌧️' },
  65: { label: 'Hujan Lebat', emoji: '🌧️' },
  71: { label: 'Hujan Salju Ringan', emoji: '🌨️' },
  73: { label: 'Hujan Salju Sedang', emoji: '🌨️' },
  75: { label: 'Hujan Salju Lebat', emoji: '☃️' },
  80: { label: 'Hujan Lokal Ringan', emoji: '🌦️' },
  81: { label: 'Hujan Lokal Sedang', emoji: '🌧️' },
  82: { label: 'Hujan Lokal Lebat/Ekstrem', emoji: '⛈️' },
  95: { label: 'Badai Petir', emoji: '⛈️' },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { label: 'Tidak Diketahui', emoji: '❓' };
}

export default function App() {
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!searchInput.trim()) {
      setWeatherData(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const geoUrl =
          `https://geocoding-api.open-meteo.com/v1/search` +
          `?name=${encodeURIComponent(searchInput)}&count=1&language=id`;
        const geoRes = await fetch(geoUrl, { signal: controller.signal });
        const geoJson = await geoRes.json();

        if (!geoJson.results || geoJson.results.length === 0) {
          throw new Error(`Kota "${searchInput}" tidak ditemukan`);
        }

        const lokasi = geoJson.results[0];

        const cuacaUrl =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lokasi.latitude}&longitude=${lokasi.longitude}` +
          `&current_weather=true`;
        const cuacaRes = await fetch(cuacaUrl, { signal: controller.signal });
        const cuacaJson = await cuacaRes.json();

        setWeatherData({
          kota: lokasi.name,
          negara: lokasi.country,
          suhu: cuacaJson.current_weather.temperature,
          angin: cuacaJson.current_weather.windspeed,
          kode: cuacaJson.current_weather.weathercode,
          isDay: cuacaJson.current_weather.is_day,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setWeatherData(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchInput, refreshTrigger]);

  const info = weatherData ? getWeatherInfo(weatherData.kode) : null;

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // LEVEL 2: DINAMIS BACKGROUND (Tetap konsisten di variasi warna Biru)
  let dynamicContainerStyle = styles.containerDefault; // Default: Deep Premium Blue

  if (weatherData) {
    if (weatherData.isDay === 1) {
      dynamicContainerStyle = styles.containerDay;    // Siang: Ocean Sky Blue
    } else {
      dynamicContainerStyle = styles.containerNight;  // Malam: Midnight Dark Blue
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={dynamicContainerStyle} contentContainerStyle={styles.content}>
        <Text style={styles.title}>WeatherFinder</Text>
        <Text style={styles.subtitle}>Prakiraan cuaca real-time dengan desain modern</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Cari nama kota Anda di sini..."
            placeholderTextColor="rgba(255, 255, 255, 0.55)"
            value={searchInput}
            onChangeText={setSearchInput}
            autoCorrect={false}
          />
        </View>

        {/* KONDISI UI 1: Loading */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Sedang mengambil data cuaca...</Text>
          </View>
        )}

        {/* KONDISI UI 2: Error */}
        {error && !loading && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* KONDISI UI 3: Sukses */}
        {weatherData && !loading && !error && (
          <View style={styles.resultCard}>
            <Text style={styles.cityName}>{weatherData.kota}</Text>
            <Text style={styles.country}>{weatherData.negara}</Text>
            
            <View style={styles.badgeTime}>
              <Text style={styles.timeIndicator}>
                {weatherData.isDay === 1 ? '☀️ SIANG HARI' : '🌙 MALAM HARI'}
              </Text>
            </View>

            <Text style={styles.emoji}>{info.emoji}</Text>
            <Text style={styles.temp}>{weatherData.suhu}<Text style={styles.celcius}>°C</Text></Text>
            <Text style={styles.weatherLabel}>{info.label}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.windText}>💨 Kecepatan Angin</Text>
              <Text style={styles.windValue}>{weatherData.angin} km/jam</Text>
            </View>

            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <Text style={styles.refreshButtonText}>🔄 Perbarui Data</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* KONDISI UI 4: Kosong / Hint Awal */}
        {!searchInput && !loading && (
          <View style={styles.center}>
            <Text style={styles.hintText}>🔍 Mulai ketik nama kota untuk menjelajah</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // VARIASI WARNA BIRU PREMIUM & ADAPTIF
  containerDefault: { flex: 1, backgroundColor: '#1e3c72' }, // Awal/Kosong: Blue Sapphire Elegant
  containerDay: { flex: 1, backgroundColor: '#2a75d3' },     // Siang: Ocean Sky Blue
  containerNight: { flex: 1, backgroundColor: '#0f172a' },   // Malam: Deep Midnight Dark Blue

  content: { padding: 24, paddingTop: 70, minHeight: '100%' },
  
  // FONT SYSTEM MEMBERIKAN TAMPILAN BERSIH & ENTAK DIPANDANG MATA
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: '#ffffff', 
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: 'System'
  },
  subtitle: { 
    fontSize: 14, 
    color: 'rgba(255, 255, 255, 0.7)', 
    textAlign: 'center', 
    marginTop: 6,
    lineHeight: 20,
    fontFamily: 'System'
  },

  inputContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 30,
  },
  input: {
    height: 55,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'System'
  },
  
  center: { alignItems: 'center', marginTop: 50 },
  loadingText: { color: 'rgba(255, 255, 255, 0.8)', marginTop: 16, fontSize: 14, fontWeight: '500' },
  hintText: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, textAlign: 'center', marginTop: 20 },

  errorCard: {
    backgroundColor: 'rgba(211, 47, 47, 0.15)',
    borderRadius: 16,
    padding: 16,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#ff4d4d',
  },
  errorText: { color: '#ff8a8a', fontSize: 14, fontWeight: '600', textAlign: 'center' },

  // KARTU GLASMORPHISM PREMIUM (Putih bersih dengan bayangan lembut)
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 24,
    padding: 24,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  cityName: { fontSize: 28, fontWeight: '800', color: '#111827', letterSpacing: 0.3 },
  country: { fontSize: 14, color: '#6b7280', fontWeight: '500', marginTop: 2, textTransform: 'uppercase' },
  
  badgeTime: {
    backgroundColor: '#eff6ff', // Background badge biru soft
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 12,
  },
  timeIndicator: { fontSize: 11, color: '#1e40af', fontWeight: '700', letterSpacing: 0.8 },
  
  emoji: { fontSize: 72, marginVertical: 10 },
  temp: { fontSize: 56, fontWeight: '800', color: '#111827', letterSpacing: -1 },
  celcius: { fontSize: 32, fontWeight: '400', color: '#4b5563' },
  weatherLabel: { fontSize: 18, color: '#374151', fontWeight: '600', marginTop: 2 },
  
  divider: { height: 1, backgroundColor: '#e5e7eb', alignSelf: 'stretch', marginVertical: 20 },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  windText: { fontSize: 14, color: '#4b5563', fontWeight: '500' },
  windValue: { fontSize: 14, color: '#111827', fontWeight: '700' },
  
  // TOMBOL REFRESH BIRU GELAP PREMIUM
  refreshButton: {
    backgroundColor: '#1e3c72',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
    shadowColor: '#1e3c72',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});