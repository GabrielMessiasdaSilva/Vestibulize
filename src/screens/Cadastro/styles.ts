// styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F4F8F7",
    alignItems: "center",
    justifyContent: "center",
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
    bottom:100
  },
  title: {
     fontSize: 26,
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
    width: "100%",
    marginBottom: 18,
    position: "relative",
  },
  textInput: {
    height: 40,
    fontSize: 16,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 4,
    backgroundColor: "transparent",
  },
  underline: {
    height: 2,
    backgroundColor: "#00839A",
    width: "100%",
    marginTop: -2,
  },
  error: {
    color: "#D32F2F",
    fontSize: 13,
    marginTop: 2,
  },
  showPasswordButton: {
    position: "absolute",
    right: 0,
    top: 8,
    padding: 4,
  },
  cadastroButton: {
    backgroundColor: "#005C6D",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    width: "100%",
  },
  cadastroButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});