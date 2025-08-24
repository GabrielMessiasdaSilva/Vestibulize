// styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: "#f8ececff",

    },
    logo: {
        marginTop: 50,
        width: 100,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'flex-end',
        marginBottom: 24,

    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        marginBottom: 40,
        marginTop: 50,
        textAlign: 'left',
        color: '#005C6D',
        fontFamily: 'Verdana',

    },
    inputContainer: {
        marginBottom: 20,
    },
    textInput: {
        height: 40,
        color: '#004854',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingHorizontal: 0,
        fontFamily: 'Verdana',

    },
    underline: {
        height: 2,
        backgroundColor: '#004854',
    },
    error: {
        color: 'red',
        marginTop: 4,
        fontSize: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 120,
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
    forgotPassword: {
        alignSelf: 'flex-start',
        marginBottom: 20,
        color: '#004854',
        left: 5,
        fontSize: 13,
    },
});
