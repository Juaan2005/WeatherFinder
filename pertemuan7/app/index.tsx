// App.js — DompetKu
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

const formatRp = (n) =>
  "Rp " + Number(n).toLocaleString("id-ID");

export default function App() {
  const [transaksi, setTransaksi] = useState([]);
  const [ket, setKet] = useState("");
  const [nominal, setNominal] = useState("");

  const { saldo, totalMasuk, totalKeluar } = useMemo(() => {
    let m = 0, k = 0;
    transaksi.forEach((t) =>
      t.tipe === "masuk" ? (m += t.nominal) : (k += t.nominal)
    );
    return { saldo: m - k, totalMasuk: m, totalKeluar: k };
  }, [transaksi]);

  const tambah = (tipe) => {
    const n = Number(nominal);
    if (!ket.trim() || !nominal || isNaN(n) || n <= 0) {
      Alert.alert("Oops!", "Isi nama transaksi & nominal (>0) ya Bro!");
      return;
    }
    const baru = {
      id: Date.now().toString(),
      ket: ket.trim(),
      nominal: n,
      tipe, // "masuk" | "keluar"
    };
    setTransaksi((prev) => [baru, ...prev]);
    setKet("");
    setNominal("");
  };

  const renderItem = ({ item }) => {
    const masuk = item.tipe === "masuk";
    return (
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemKet}>{item.ket}</Text>
          <Text style={styles.itemTipe}>
            {masuk ? "Pemasukan" : "Pengeluaran"}
          </Text>
        </View>
        <Text style={[styles.itemNominal, { color: masuk ? "#16a34a" : "#dc2626" }]}>
          {masuk ? "+ " : "- "}{formatRp(item.nominal)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Dashboard Saldo */}
        <View style={styles.header}>
          <Text style={styles.title}>💳 DompetKu</Text>
          <Text style={styles.label}>Total Saldo</Text>
          <Text style={styles.saldo}>{formatRp(saldo)}</Text>
          <View style={styles.row}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Pemasukan</Text>
              <Text style={[styles.statValue, { color: "#86efac" }]}>
                {formatRp(totalMasuk)}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Pengeluaran</Text>
              <Text style={[styles.statValue, { color: "#fca5a5" }]}>
                {formatRp(totalKeluar)}
              </Text>
            </View>
          </View>
        </View>

        {/* Form Input */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nama transaksi (cth: Beli Kopi)"
            placeholderTextColor="#94a3b8"
            value={ket}
            onChangeText={setKet}
          />
          <TextInput
            style={styles.input}
            placeholder="Nominal (Rp)"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={nominal}
            onChangeText={setNominal}
          />
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#16a34a" }]}
              onPress={() => tambah("masuk")}
            >
              <Text style={styles.btnText}>+ Pemasukan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#dc2626" }]}
              onPress={() => tambah("keluar")}
            >
              <Text style={styles.btnText}>- Pengeluaran</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Riwayat */}
        <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={styles.empty}>Belum ada transaksi Bro!</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f1f5f9" },
  header: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  label: { color: "#cbd5e1", fontSize: 13 },
  saldo: { color: "#fff", fontSize: 32, fontWeight: "bold", marginVertical: 4 },
  row: { flexDirection: "row", gap: 10, marginTop: 10 },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 10,
    borderRadius: 12,
  },
  statLabel: { color: "#cbd5e1", fontSize: 12 },
  statValue: { fontSize: 15, fontWeight: "600", marginTop: 2 },
  form: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 14,
    color: "#0f172a",
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemKet: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  itemTipe: { fontSize: 12, color: "#64748b", marginTop: 2 },
  itemNominal: { fontSize: 15, fontWeight: "bold" },
  empty: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 40,
    fontStyle: "italic",
  },
});
