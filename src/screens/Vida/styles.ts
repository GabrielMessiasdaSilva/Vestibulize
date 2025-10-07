import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");
 
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingTop: 40
  },
  bottomContent: {
    width: width*1.5,
    flex: 1,
    backgroundColor: "#B71C1C",
    borderTopLeftRadius: width,
    borderTopRightRadius: width,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 30,
  },
  backText: {
    color: "#B71C1C",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});