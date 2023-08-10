import { Alert, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import xlsxfile from './Users.json'
import * as XLSX from 'xlsx'
import RNFS from 'react-native-fs';
import { PERMISSIONS, check } from 'react-native-permissions';


const ChangeToExcel = () => {

  const handleXLSX = async()=>{

  

  const workBook = XLSX.utils.book_new();
  const workSheet = XLSX.utils.json_to_sheet(xlsxfile);
  XLSX.utils.book_append_sheet(workBook,workSheet,'xlsxfile');
  const writefile = XLSX.write(workBook,{bookType:'xlsx', type:'binary'});

  const filePath = `${RNFS.CachesDirectoryPath}/temp.xlsx`
  const date = new Date();
  const fileName = `ExcelData${date.getMinutes()}`

  try{
    await RNFS.writeFile(filePath, writefile,'ascii');
    const destinationPath = `${RNFS.DownloadDirectoryPath}/${fileName}.xlsx`;
    await RNFS.moveFile(filePath, destinationPath);
    Alert.alert("File Exported Successfully", `Exported to ${destinationPath}`);
  } catch(error){
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
        handleXLSX();
        console.log("Permission granted");
      } else {
        // Permission denied
        console.log("Permission denied");
      }
    } else {
      // Already have Permission (calling our exportDataToExcel function)
      handleXLSX();
    }
  } catch (e) {
    console.log('Error while checking permission');
    console.log(e);
    return
  }

}

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={()=>requestPermissionExternalStorage()}>
        <Text style={styles.btntxt}>Download xlsx</Text>
      </TouchableOpacity>
    </View>
  )
  }
export default ChangeToExcel
  
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center'
    },
    btn:{
        height:45,
        width:'50%',
        backgroundColor:'#ccc',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        elevation:5
    },
    btntxt:{
      color:'#fff',
      fontWeight:'300',
      fontSize:26
    }
})