import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#f7f8fa',
    },
    title: {
        color: "#005C6D",
        fontSize: 32,
        marginBottom: 24,
        fontFamily: "PlusJakartaSans_700Bold",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
        paddingTop: 70,
    },
    local: {
        width: '100%',
        height: 400,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    text: {
        fontSize: 20,
        color: '#005C6D',
        fontFamily: "PlusJakartaSans_600SemiBold",
    },
    card: {
        backgroundColor: "#F0F6F7",
        borderRadius: 20,
        padding: 16,
        marginTop: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    cardHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    durationText: {
        marginLeft: 8,
        color: "#005C6D",
        fontSize: 24,
        fontWeight: "600",
    },

    badge: {
        backgroundColor: "#CEE7F0",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },

    badgeText: {
        color: "#005C6D",
        fontWeight: "700",
        fontSize: 13,
    },

    locationName: {
        marginTop: 16,
        marginLeft: 3,
        fontSize: 16,
        color: "#2A8091",
        fontFamily: "PlusJakartaSans_400Regular",
    },

    buttonContainer: {
        marginTop: 12,
        alignItems: "flex-start",
    },

    knowMoreButton: {
        backgroundColor: "#005C6D",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },

    knowMoreText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 15,
    },
});