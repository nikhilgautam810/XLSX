import { Alert, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as XLSX from 'xlsx'
import RNFS from 'react-native-fs';
import { check, PERMISSIONS } from 'react-native-permissions';



const ExportMultipleXLSX = ({ finalData }) => {
    const handleXlSXData = async () => {

        const obj = {
            sheet: {},
            sheetNames: []
        };
        //An object obj is created to hold information about the Excel sheets and their names.

        finalData.forEach((item) => {
            item['json'] = XLSX.utils.json_to_sheet(item.data);
            obj.sheet[item.category] = item.json;
            obj.sheetNames.push(item.category);
        });
        // This loop iterates through each item in finalData. For each item, 
        // it converts the item.data array into a sheet using json_to_sheet from the XLSX.utils module. 
        // Then, it adds this sheet to the obj.sheet object using the category as the key. 
        // It also adds the category to the obj.sheetNames array.

        const workbook = XLSX.utils.book_new();
        obj.sheetNames.forEach((name) => {
        XLSX.utils.book_append_sheet(workbook, obj.sheet[name], name);
        });
        // Here, a new Excel workbook is created using XLSX.utils.book_new(). 
        // Then, each sheet from obj.sheet is appended to the workbook using XLSX.utils.book_append_sheet.


        const writeXLSX = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
        //The XLSX.write function is used to convert the workbook into Excel format, and the result is stored in writeXLSX.



        const tempFilePath = `${RNFS.CachesDirectoryPath}/temp.xlsx`;
        const date = new Date();
        const filename = `ExcelData${Math.floor(date.getMinutes())}`
        try {
            // Write the Excel data to a temporary file
            await RNFS.writeFile(tempFilePath, writeXLSX, 'ascii');

            // Move the temporary file to the desired download location
            const destinationPath = `${RNFS.DownloadDirectoryPath}/${filename}.xlsx`;
            await RNFS.moveFile(tempFilePath, destinationPath);

            Alert.alert("File Exported Successfully", `Exported to ${destinationPath}`);
        } catch (error) {
            console.error('Error writing or moving file:', error);
        }


    };

    const requestPermissionExternalStorage = async () => {

        try {
            // Check for Permission (check if permission is already given or not)
            let isPermitedExternalStorage = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

            if (!isPermitedExternalStorage) {

                // Ask for permission
                const granted = await PermissionsAndroid.request(
                    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
                    {
                        title: "Storage permission needed",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );


                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Permission Granted (calling our exportDataToExcel function)
                    handleXlSXData();
                    console.log("Permission granted");
                } else {
                    // Permission denied
                    console.log("Permission denied");
                }
            } else {
                // Already have Permission (calling our exportDataToExcel function)
                handleXlSXData();
            }
        } catch (e) {
            console.log('Error while checking permission');
            console.log(e);
            return
        }

    };


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.btn} onPress={() => requestPermissionExternalStorage()}>
                <Text style={styles.btntxt}>Download file</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ExportMultipleXLSX

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'

    },
    btntxt: {
        fontSize: 25,
        fontWeight: '300',
        color: '#fff'
    },
    btn: {
        backgroundColor: '#B39CD0',
        height: 50,
        width: '50%',
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5

    }
})