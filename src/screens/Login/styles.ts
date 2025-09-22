// styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F8F7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
 logo: {
     marginTop: 40,
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    bottom:150
  },
  title: {
     fontSize: 25,
    fontWeight: "bold",
    marginBottom: 50,
    textAlign: 'left',
    color: '#005C6D',
    fontFamily: 'Verdana',
    letterSpacing: 0.5,
    lineHeight: 34,
    left:10,
    bottom:30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 18,
  },
  textInput: {
    height: 40,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 4,
    backgroundColor: 'transparent',
  },
  underline: {
    height: 2,
    backgroundColor: '#005C6D',
    width: '100%',
    marginTop: -2,
  },
  error: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 2,
  },
  forgotPassword: {
    color: '#005C6D',
    fontWeight: 'bold',
    marginBottom: 40,
  right:115,
    //como deixar para esquerda?
     
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: '#005C6D',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonTextPrimary: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cadastroContainer: {
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  cadastroText: {
    color: '#333',
    fontSize: 15,
  },
  cadastroLink: {
    color: '#005C6D',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
