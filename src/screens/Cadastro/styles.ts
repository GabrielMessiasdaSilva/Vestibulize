// styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f8ececff",
  },
  logoContainer: {
    alignItems: "flex-end",

  },
    logo: {
        marginTop: 50,
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 24,

    },
  headerContent: {
    marginBottom: 20,
  },
    title: {
        fontSize: 26,
        fontWeight: '100',
        marginBottom: 30,
        marginTop: 50,
        textAlign: 'left',
        color: '#005C6D',
        fontFamily: 'Verdana',

    },
  inputContainer: {
    marginBottom: 24,
    position: "relative",
  },
  textInput: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingRight: 40, 
    fontSize: 16,
  },
  underline: {
    height: 2,
    backgroundColor: "#004854",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    transform: [{ scaleX: 0 }],
  },
  showPasswordButton: {
    position: "absolute",
    right: 0,
    bottom: 10,
    height: 20,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
 buttonPrimary: {
        flex: 1,
        backgroundColor: '#005C6D',
        padding: 16,
        borderRadius: 40,
        marginRight: 8,
        alignItems: 'center',
    },
    buttonSecondary: {
        flex: 1,
        borderColor: '#005C6D',
        borderWidth: 1,
        padding: 16,
        borderRadius: 40,
        marginLeft: 8,
        alignItems: 'center',
    },
    buttonTextPrimary: {
        color: '#fff',
        fontWeight: '600',
        fontFamily: 'Verdana',

    },
    buttonTextSecondary: {
        color: '#004854',
        fontWeight: '600',
        fontFamily: 'Verdana',

    },

});
