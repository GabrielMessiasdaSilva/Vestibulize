// styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB", // fundo mais leve
  },
  logoContainer: {
    alignItems: "flex-end",
  },
  logo: {
    marginTop: 40,
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 32,
  },
  headerContent: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    marginTop: 40,
    textAlign: "left",
    color: "#005C6D",
    fontFamily: "Verdana",
    letterSpacing: 0.5,
    lineHeight: 34,
  },
  inputContainer: {
    marginBottom: 28,
    position: "relative",
  },
  textInput: {
    height: 46,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingRight: 40,
    fontSize: 16,
    color: "#004854",
    fontFamily: "Verdana",
  },
  underline: {
    height: 2,
    backgroundColor: "#005C6D",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    borderRadius: 2,
    transform: [{ scaleX: 0 }],
  },
  showPasswordButton: {
    position: "absolute",
    right: 0,
    bottom: 12,
    height: 24,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "#D93025",
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: "#005C6D",
    paddingVertical: 16,
    borderRadius: 40,
    marginRight: 8,
    alignItems: "center",
    elevation: 3, // Android sombra
    shadowColor: "#000", // iOS sombra
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonSecondary: {
    flex: 1,
    borderColor: "#005C6D",
    borderWidth: 1.5,
    paddingVertical: 16,
    borderRadius: 40,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonTextPrimary: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "Verdana",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  buttonTextSecondary: {
    color: "#005C6D",
    fontWeight: "600",
    fontFamily: "Verdana",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
