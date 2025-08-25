// styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB", // fundo mais claro que branco puro
  },
  logo: {
    marginTop: 40,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'left',
    color: '#005C6D',
    fontFamily: 'Verdana',
    letterSpacing: 0.5,
    lineHeight: 34,
  },
  inputContainer: {
    marginBottom: 24,
  },
  textInput: {
    height: 44,
    color: '#004854',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 0,
    fontFamily: 'Verdana',
    fontSize: 16,
  },
  underline: {
    height: 2,
    backgroundColor: '#005C6D',
    borderRadius: 2,
  },
  error: {
    color: '#D93025',
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    color: '#004854',
    left: 5,
    fontSize: 13,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: '#005C6D',
    paddingVertical: 16,
    borderRadius: 40,
    marginRight: 8,
    alignItems: 'center',
    elevation: 3, // sombra Android
    shadowColor: '#000', // sombra iOS
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonSecondary: {
    flex: 1,
    borderColor: '#005C6D',
    borderWidth: 1.5,
    paddingVertical: 16,
    borderRadius: 40,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonTextPrimary: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Verdana',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  buttonTextSecondary: {
    color: '#005C6D',
    fontWeight: '600',
    fontFamily: 'Verdana',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
