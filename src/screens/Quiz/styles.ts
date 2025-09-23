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

    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginTop: 52,
        textAlign: 'center',
        width: '80%',
        alignSelf: 'center',
        maxWidth: '90%',
    },

    arrow: {
        marginTop: 22,
        marginLeft: 16,
        alignSelf: 'flex-start',
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

    questionCounter: {
        marginTop: 6,
        marginHorizontal: 16,
        fontSize: 20,
        fontFamily: "PlusJakartaSans_400Regular",
        color: "#909496",
    },

    question: {
        marginTop: 20,
        marginHorizontal: 16,
    },

    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    timerIcon: {
        width: 24,
        height: 24,
        marginRight: 4,
        resizeMode: 'contain',
    },

    timerTextContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        minWidth: 80,
    },

    timerLabel: {
        fontSize: 12,
        color: '#233D4D',
        marginBottom: 2,
    },

    timerText: {
        fontSize: 14,
        color: '#233D4D',
    },

    questionText: {
        fontSize: 15,
        color: '#233D4D',
        textAlign: 'justify',
        fontFamily: 'PlusJakartaSans_400Regular',
        marginBottom: 18,
    },

    optionsContainer: {
        width: '100%',
        paddingHorizontal: 16,
    },

    optionButton: {
        backgroundColor: '#005C6D',
        borderRadius: 12,
        padding: 10,
        marginBottom: 20,
        marginHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    optionText: {
        fontSize: 15,
        fontFamily: 'PlusJakartaSans_400Regular',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    questionTextContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        marginBottom: 18,
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    floatingPencil: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    floatingBoard: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },

});