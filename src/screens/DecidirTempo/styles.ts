import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f7f8fa',
        width: '100%',
        paddingTop: 22,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginTop: 16,
    },

    exitButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    exitText: {
        marginLeft: 4,
        fontSize: 20,
        color: "#004854",
    },
    livesBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FDECEC",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginTop: 26,
    },
    livesText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#B71C1C",
    },
    instructions: {
        marginTop: 20,
        marginHorizontal: 16,
        fontSize: 32,
        fontFamily: "PlusJakartaSans_700Bold",
        color: "#005C6D",
    },
});