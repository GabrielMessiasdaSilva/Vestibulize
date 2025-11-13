import { StyleSheet } from 'react-native';
const NAV_BAR_HEIGHT = 80;
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

    questionCounter: {
        marginTop: 6,
        marginHorizontal: 18,
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
        marginTop: 14,
    },

    timerIcon: {
        width: 24,
        height: 24,
        marginRight: 4,
        resizeMode: 'contain',
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

    faseBox: {
        flexDirection: "row",
        alignItems: "center",
    },

    placeholderText: {
        marginTop: 8,
        color: '#AAA',
        fontSize: 12,
    },

    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f7f8fa",
    },
    mathjaxContainer: {
        backgroundColor: 'transparent',
        marginBottom: 10,
    },

    questionImage: {
        width: '95%',
        aspectRatio: 1.5,
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },

    imagePlaceholder: {
        width: '95%',
        aspectRatio: 1.5,
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EEE',
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        alignItems: 'center',
    },

    optionButtonSelected: {
        backgroundColor: '#008e11ff',
        borderColor: '#005a6a',
    },

    optionTextSelected: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },

    navContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: NAV_BAR_HEIGHT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00839A',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 3,
    },

    navButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },

    navButtonDisabled: {
        backgroundColor: '#E0E0E0',
        elevation: 0,
    },

    finishButton: {
        backgroundColor: '#B20000',
    },

    finishButtonText: {
        color: '#FFFFFF',
    },
});