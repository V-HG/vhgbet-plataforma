import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useState } from 'react';

// SEU BACKEND NO RENDER
const API_URL = 'https://vhgbet-plataforma.onrender.com';

export default function App() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

 const fazerLogin = async () => {
    // ... validações ...
    try {
      // O truque: O LocalStrategy do NestJS geralmente espera um campo "username"
      // ou podemos configurar para receber "email" ou "cpf".
      // Vamos tentar mandar como "username" que é o padrão universal,
      // ou manter a chave que seu AuthController espera.
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        // Se o seu backend espera 'email', mandamos o CPF nesse campo para "enganar" ele
        // Se o seu backend espera 'username', mude para username: cpf
        email: cpf, 
        password: password
      });

      // 2. Se der certo, salva o token
      const userToken = response.data.access_token;
      setToken(userToken);
      
      // 3. Busca os dados do perfil
      buscarPerfil(userToken);

    } catch (error: any) {
      console.log(error);
      if (error.response) {
         Alert.alert('Erro de Login', `O servidor recusou: ${error.response.status} (Verifique senha)`);
      } else {
         Alert.alert('Erro de Conexão', 'O servidor não respondeu. Verifique sua internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  const buscarPerfil = async (meuToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${meuToken}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.log('Erro ao buscar perfil');
    }
  };

  // --- TELA DE LOGADO (DASHBOARD) ---
  if (token && userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>🤑</Text>
        <Text style={styles.titulo}>Olá, {userData.name}!</Text>
        <Text style={styles.subtitulo}>Saldo: R$ {userData.wallet?.balance || '0.00'}</Text>
        
        <View style={styles.card}>
           <Text style={styles.texto}>Você está no App Nativo!</Text>
           <Text style={styles.textoPequeno}>ID: {userData.id}</Text>
        </View>

        <TouchableOpacity style={styles.botaoSair} onPress={() => { setToken(null); setUserData(null); }}>
          <Text style={styles.textoBotao}>Sair</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- TELA DE LOGIN ---
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>VHGBet Mobile 📱</Text>
      <Text style={styles.subtitulo}>Entre para jogar</Text>

      <View style={styles.inputArea}>
        <Text style={styles.label}>Email / CPF</Text>
       <Text style={styles.label}>CPF (Apenas números)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="00011122233" 
          value={cpf} // Usando a variavel cpf
          onChangeText={setCpf}
          keyboardType="numeric" // Teclado numérico facilita muito!
          maxLength={11} // Trava em 11 digitos
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Sua senha..." 
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.botao} onPress={fazerLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.textoBotao}>ENTRAR</Text>}
      </TouchableOpacity>
      
      <StatusBar style="auto" />
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitulo: { fontSize: 18, color: '#666', marginBottom: 30 },
  emoji: { fontSize: 60, marginBottom: 20 },
  inputArea: { width: '100%', marginBottom: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 5, marginLeft: 5, fontWeight: 'bold' },
  input: { width: '100%', height: 50, backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 15, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  botao: { width: '100%', height: 55, backgroundColor: '#007AFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  botaoSair: { marginTop: 20, width: '50%', height: 50, backgroundColor: '#ff4444', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  textoBotao: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 10, width: '100%', alignItems: 'center', marginVertical: 20 },
  texto: { fontSize: 16, color: '#333' },
  textoPequeno: { fontSize: 12, color: '#999', marginTop: 5 }
});
