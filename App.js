import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ExportXLSX from './Component/ExportXLSX'
import ExportMultipleXLSX from './Component/ExportMultipleXLSX';
import ChangeToExcel from './Component/LocalJsonToExcel/ChangeToExcel';

const App = () => {
  const [newsData, setNewsData] = useState([]);
  const [finalData, setFinalData] = useState([]);




  const getNewsData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/albums');
    const result1 = await response.json();
    setTimeout(()=>{

      const data = [{
        category: 'albums',
        data: result1
      }];
      setNewsData(data);
    },1000)
    

  }
  const getPostData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const result = await response.json();

    setTimeout(()=>{

      const res = [...newsData]
      res.push({
        category: 'Post',
        data: result
      })
      
      setFinalData(res);
    },1000)
    
  }
  // console.log(newsData)

  // useEffect(() => {
  //     getNewsData();
  // }, [])
  // useEffect(() => {
  //     getPostData();
  // }, [newsData])


  return (

    // <ExportXLSX apiData={apiData} />
    // <ExportMultipleXLSX finalData={finalData}/>
<ChangeToExcel/>



  )
}

export default App

const styles = StyleSheet.create({})