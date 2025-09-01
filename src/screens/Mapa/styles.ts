import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f7f8fa',
        width: '100%',
        marginTop: 80,
    },
    title: {
        color: '#005C6D',
        fontSize: 32,
        fontWeight: 'bold',
        paddingHorizontal: 24,
        fontFamily: 'PlusJakartaSans_700Bold',
    },
        phaseMapContainer: {
        width: "100%",
        alignItems: "center",
        position: "relative",
        marginTop: 32,
    },

    phaseItem: {
        width: "100%",
        alignItems: "center",
        marginBottom: 30,
    },

    phaseCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        shadowOpacity: 0.9,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        position: "relative",
    },

    phaseNumber: {
        fontSize: 36,
        fontWeight: "bold",
    },

    iconBlocked: {
        position: "absolute",
        width: 28,
        height: 28,
        top: 12,
        right: 12,
        tintColor: "#bbb",
    },

    crownPlaceholder: {
        position: "absolute",
        top: -18,
        backgroundColor: "#FEC946",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#B8860B",
        shadowOpacity: 0.7,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
    },

    playText: {
        position: 'absolute',
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },

    crownIcon: {
        width: 20,
        height: 20,
        resizeMode: "contain",
        marginRight: 6,
    },

    crownNumber: {
        fontWeight: "700",
        color: "#5A3E00",
        fontSize: 18,
    },
        subjectTitle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "600",
        textTransform: "capitalize",
    },

    lineContainer: {
        width: 6,
        alignItems: "center",
        marginTop: 10,
    },
});