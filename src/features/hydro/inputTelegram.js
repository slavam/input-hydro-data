import React, { useState } from 'react'
import { useForm } from "react-hook-form"
// import classnames from 'classnames'
// import { Spinner } from '../../components/Spinner'
import { useSaveHydroDataQuery } from '../api/apiSlice'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Accordion from 'react-bootstrap/Accordion'
import { icePhenomena, waterBodies } from '../../components/dictionaries'
// import { AccordionEventKey } from 'react-bootstrap/AccordionContext'

const ipChar = new Array(5).fill(null)
const ipAddon = new Array(5).fill(null)
const wbChar = new Array(5).fill(null)
const wbAddon = new Array(5).fill(null)
let showResponse = false

export const InputHydroTelegram = ({postCode})=>{
  
  const [hydroData, setHydroData] = useState(null)
  const {
    data: response = {},
    isSuccess,
  } = useSaveHydroDataQuery(hydroData)
  // const saveHydroTelegram = useSaveHydroDataQuery(hydroData)
  const hydroPostCode = postCode //'99999' //process.env.REACT_APP_CODE_83028
  
  const [term, setTerm] = useState('08')
  const [contentIndex, setContentIndex] = useState('1')
  let today = new Date()
  let currYear = today.getFullYear()
  let currMonth = today.getMonth()
  let lastDay = 32 - new Date(currYear, currMonth, 32).getDate()
  let d = today.getUTCDate()
  let currDay = d>9 ? d : ('0'+d)
  // const group03 = `${currDay}${term}${contentIndex}`
  
  const [group11, setGroup11] = useState('10000')
  const [waterLevel, setWaterLevel] = useState(0)
  const [group12, setGroup12] = useState('20000')
  const [waterLevelDeviation, setWaterLevelDeviation] = useState(0)
  const [waterTemperature, setWaterTemperature] = useState(0)
  const [airTemperature, setAirTemperature] = useState(null)
  const [telegram, setTelegram] = useState(`HHZZ ${hydroPostCode} ${currDay}${term}${contentIndex} 10000 20000=`) //useState(`HHZZ ${hydroPostCode} ${group03} ${group11} ${group12}=`) 
  
  const waterLevelChanged = (e)=>{
    let wl = e.target.value
    if(/[-]*[0-9]{1,4}/.test(wl)){
      wl = wl>4999 ? 4999 : wl
      wl = wl<-999 ? -999 : wl
    }else
      wl = 0
    setWaterLevel(wl)
    let g1 = wl >= 0 ? wl.toString().padStart(4,'0') : (5000+Math.abs(wl)).toString()
    setGroup11(`1${g1}`)
    let newText = telegram.slice(0,18)+`${g1}`+telegram.slice(22) 
    setTelegram(newText)
  }
  const waterLevelDeviationChanged = (e)=>{
    let wld = e.target.value //[0]==='-'? e.target.value.padStart()
    if(/^[-]*[0-9]{1,3}$/.test(e.target.value)){
      // wld = wld>999 ? 999 : wld
      // wld = wld<-999 ? -999 : wld
    }else{
      wld = '0'
    }
    setWaterLevelDeviation(wld)
    let g2 = +wld === 0 ? '0000' : (wld>0 ? (wld.toString().padStart(3,'0')+'1') : (Math.abs(wld).toString().padStart(3,'0')+'2'))
    setGroup12(`2${g2}`)
    let newText = telegram.slice(0,24)+`${g2}`+telegram.slice(28) 
    setTelegram(newText)
  }
  const showGroup14=()=>{
    setWaterTemperature(0)
    if(airTemperature !== null)
      setAirTemperature(0)
    let newText = telegram.slice(0,28)+` 400${airTemperature===null? '//':'00'}`+telegram.slice(28)
    setTelegram(newText)
  }
  const hideGroup14=()=>{
    setWaterTemperature(null)
    let newText = telegram.replace(/ 4..../g, "")
    setTelegram(newText)
  }
  const showAirTemperature=()=>{
    setAirTemperature(0)
    let newText = telegram.replace(/\/\//g,'00')
    setTelegram(newText)
  }
  const hideAirTemperature=()=>{
    setAirTemperature(null)
    let newText = telegram.slice(0,32)+'//'+telegram.slice(34)
    setTelegram(newText)
  }
  const waterTemperatureChanged = (e)=>{
    let wt = e.target.value
    if(/^[0-9]$|(^[0-9][\.,][0-9]{0,1}$)/.test(e.target.value)){
    }else{
      let s = e.target.value.length<1? '00':e.target.value
      wt = s.indexOf('.')>=0? s.slice(0,3):s[1]
    }
    setWaterTemperature(wt)
    let newText = telegram.slice(0,30)+`${wt>=1 ? wt*10 : '0'+(wt*10)}`+telegram.slice(32) //+'>'+e.target.value+'<'
    setTelegram(newText)
  }
  const airTemperatureChanged=(e)=>{
    let at = e.target.value
    if(/^-{0,1}[0-9]$|^-{0,1}[0-4][0-9]$/.test(at)){
      at = +at>49 ? 49 : at
      at = +at<-49 ? -49 : at
    }else{
      if(at[0]==='-')
        at = at.length>3? at.slice(0,3): at //(at.length===1? '-1':at)
      else
        at = at.length>2? at.slice(0,2): at
    }
    setAirTemperature(at)
    let newText = telegram.slice(0,32)+`${at<0 ? 50-at : (at>=0 && at<10 ? '0'+at : at)}`+telegram.slice(34) //+'>'+at+'<'
    setTelegram(newText)
  }
  const [ip1,setIp1] = useState(11)
  const [ii1,setIi1] = useState(1)
  const [ip2,setIp2] = useState(11)
  const [ii2,setIi2] = useState(1)
  const [ip3,setIp3] = useState(11)
  const [ii3,setIi3] = useState(1)
  const [ip4,setIp4] = useState(11)
  const [ii4,setIi4] = useState(1)
  const [ip5,setIp5] = useState(11)
  const [ii5,setIi5] = useState(1)
  const combineG5=()=>{
    let ret = ''
    for (let i = 0; i < ipChar.length; i++){
      ret += ipChar[i]===null? '':` 5${ipChar[i]}${ipAddon[i]}`
    }
    return ret
  }
  const showGroup15=()=>{
    ipChar[0] = 11
    ipAddon[0] = '01'
    setIp1(11)
    setIi1(1)
    let g152 = ipChar[1]===null?'':` 5${ip2}${ii2}`
    let g153 = ipChar[2]===null?'':` 5${ip3}${ii3}`
    let g154 = ipChar[3]===null?'':` 5${ip4}${ii4}`
    let g155 = ipChar[4]===null?'':` 5${ip5}${ii5}`
    let g5 = ` 51101${g152}${g153}${g154}${g155}`
    let start15 = telegram[29]==='4'? 28+6 : 28
    let newText = telegram.slice(0,start15)+g5+telegram.slice(start15)
    setTelegram(newText)
  }
  const hideGroup15=()=>{
    ipChar[0] = null
    ipAddon[0] = null
    let newText = telegram.replace(/ 5..../g,'')
    setTelegram(newText)
  }
  // let start151
  const ip1CodeChanged = e=>{
    let ip1 = e.target.value
    setIp1(ip1)
    ipChar[0] = ip1
    let start151 = telegram[29]==='4'? 28+6 : 28
    let newText = telegram.slice(0,start151+2)+ip1+telegram.slice(start151+4)
    setTelegram(newText)
  }
  const ii1CodeChanged = e=>{
    let ii = +e.target.value>9? e.target.value : '0'+e.target.value
    setIi1(ii)
    ipAddon[0] = ii
    let start151 = telegram[29]==='4'? 28+6 : 28
    let newText = telegram.slice(0,start151+4)+ii+telegram.slice(start151+6) //+'>'+cursorPosition+'<'
    setTelegram(newText)
  }
  
  const showGroup152=()=>{
    ipChar[1] = 11
    ipAddon[1] = '01'
    setIp2(11)
    setIi2(1)
    let start151 = telegram.indexOf(' 5')
    let newText = telegram.slice(0,start151+6)+` 51101`+telegram.slice(start151+6) //${ip2}`+telegram.slice(start151+6)
    setTelegram(newText)
  }
  const hideGroup152=()=>{
    ipChar[1] = null
    ipAddon[1] = null
    setIp2(11)
    setIi2(1)
    let start152 = telegram.indexOf(' 5')+6
    let newText = telegram.slice(0,start152)+telegram.slice(start152+6)
    setTelegram(newText)
  }
  const newG5 = k=>{
    let start151 = telegram.indexOf(' 5')
    let allG5 = combineG5()
    return telegram.slice(0,start151)+allG5+telegram.slice(start151+allG5.length+k*6)
  }
  const ip2CodeChanged = e=>{
    let ip = e.target.value
    setIp2(ip)
    ipChar[1] = ip
    // let start151 = telegram.indexOf(' 5')
    // let allG5 = combineG5()
    // let newText = telegram.slice(0,start151)+allG5+telegram.slice(start151+allG5.length)
    // setTelegram(newText)
    setTelegram(newG5(0))
  }
  const ii2CodeChanged = e=>{
    let ii = +e.target.value>9? e.target.value : '0'+e.target.value
    setIi2(ii)
    ipAddon[1] = ii
    // let start151 = telegram.indexOf(' 5')
    // let allG5 = combineG5()
    // let newText = telegram.slice(0,start151)+allG5+telegram.slice(start151+allG5.length)
    // setTelegram(newText)
    setTelegram(newG5(0))
  }
  
  const showGroup153=()=>{
    if(ipChar[1]===null) return
    ipChar[2] = 11
    ipAddon[2] = '01'
    setIp3(11)
    setIi3(1)
    setTelegram(newG5(-1))
  }
  const hideGroup153=()=>{
    ipChar[2] = null
    ipAddon[2] = null
    setIp3(11)
    setIi3(1)
    // let allG5 = combineG5()
    // let start151 = telegram.indexOf(' 5')
    // let newText = telegram.slice(0,start151)+allG5+telegram.slice(start151+allG5.length+6)
    // setTelegram(newText)
    setTelegram(newG5(1))
  }
  const ip3CodeChanged = e=>{
    let ip = e.target.value
    setIp3(ip)
    ipChar[2] = ip
    // let start151 = telegram.indexOf(' 5')
    // let allG5 = combineG5()
    // let newText = telegram.slice(0,start151)+allG5+telegram.slice(start151+allG5.length)
    // setTelegram(newText)
    setTelegram(newG5(0))
  }
  const ii3CodeChanged = e=>{
    let ii = +e.target.value>9? e.target.value : '0'+e.target.value
    setIi3(ii)
    ipAddon[2] = ii
    // let start151 = telegram.indexOf(' 5')
    // let allG5 = combineG5()
    // let newText = telegram.slice(0,start151)+allG5+telegram.slice(start151+allG5.length)
    // setTelegram(newText)
    setTelegram(newG5(0))
  }
  
  const showGroup154=()=>{
    ipChar[3] = 11
    ipAddon[3] = '01'
    setIp4(11)
    setIi4(1)
    setTelegram(newG5(-1))
    // let start151 = telegram.indexOf(' 5')
    // let allG5 = combineG5()
    // let newText = telegram.slice(0,start151)+allG5+telegram.slice(start151+allG5.length-6)
    // setTelegram(newText)
  }
  const hideGroup154=()=>{
    ipChar[3] = null
    ipAddon[3] = null
    setIp4(11)
    setIi4(1)
    setTelegram(newG5(1))
  }
  const ip4CodeChanged = e=>{
    let ip = e.target.value
    setIp4(ip)
    ipChar[3] = ip
    setTelegram(newG5(0))
  }
  const ii4CodeChanged = e=>{
    let ii = +e.target.value>9? e.target.value : '0'+e.target.value
    setIi4(ii)
    ipAddon[3] = ii
    setTelegram(newG5(0))
  }
  
  const showGroup155=()=>{
    ipChar[4] = 11
    ipAddon[4] = '01'
    setIp5(11)
    setIi5(1)
    setTelegram(newG5(-1))
  }
  const hideGroup155=()=>{
    ipChar[4] = null
    ipAddon[4] = null
    setIp5(11)
    setIi5(1)
    setTelegram(newG5(1))
  }
  const ip5CodeChanged = e=>{
    let ip = e.target.value
    setIp5(ip)
    ipChar[4] = ip
    setTelegram(newG5(0))
  }
  const ii5CodeChanged = e=>{
    let ii = +e.target.value>9? e.target.value : '0'+e.target.value
    setIi5(ii)
    ipAddon[4] = ii
    setTelegram(newG5(0))
  }
  
// group6
  const [wb1,setWb1] = useState('00')
  const [wbi1,setWbi1] = useState('00')
  const [wb2,setWb2] = useState('00')
  const [wbi2,setWbi2] = useState('00')
  const [wb3,setWb3] = useState('00')
  const [wbi3,setWbi3] = useState('00')
  const [wb4,setWb4] = useState('00')
  const [wbi4,setWbi4] = useState('00')
  const [wb5,setWb5] = useState('00')
  const [wbi5,setWbi5] = useState('00')
  const combineG6=()=>{
    let ret = ''
    for (let i = 0; i < wbChar.length; i++){
      ret += wbChar[i]===null? '':` 6${wbChar[i]}${wbAddon[i]}`
    }
    return ret
  }
  const changeG6=(op='change')=>{
    let allG6 = combineG6()
    let start16 = telegram.indexOf(' 6')
    if(op==='change')
      return telegram.slice(0,start16)+allG6+telegram.slice(start16+allG6.length)
    else if(op==='show')
      return telegram.slice(0,start16)+allG6+telegram.slice(start16+allG6.length-6)
    else 
      return telegram.slice(0,start16)+allG6+telegram.slice(start16+allG6.length+6)
  }
  const showGroup16=()=>{
    wbChar[0] = '00'
    wbAddon[0] = '00'
    setWb1('00')
    setWbi1('00')
    let g162 = wbChar[1]===null?'':` 6${wb2}${wbi2}`
    let g163 = wbChar[2]===null?'':` 6${wb3}${wbi3}`
    let g164 = wbChar[3]===null?'':` 6${wb4}${wbi4}`
    let g165 = wbChar[4]===null?'':` 6${wb5}${wbi5}`
    let g6 = ` 60000${g162}${g163}${g164}${g165}`
    let start16 = (telegram[29]==='4'? 28+6 : 28) + combineG5().length
    let newText = telegram.slice(0,start16)+g6+telegram.slice(start16)
    setTelegram(newText)
  }
  const hideGroup16=()=>{
    wbChar[0] = null
    wbAddon[0] = null
    let newText = telegram.replace(/ 6..../g,'')
    setTelegram(newText)
  }
  const wb1CodeChanged = (e)=>{
    let wb = e.target.value //.padStart(4,'0').slice(0,4)
    setWb1(wb)
    wbChar[0] = wb
    setTelegram(changeG6())
  }
  const wbi1CodeChanged = e=>{
    let wbi = +e.target.value>9? e.target.value : '0'+e.target.value
    setWbi1(wbi)
    wbAddon[0] = wbi
    setTelegram(changeG6())
  }
  const showGroup162=()=>{
    wbChar[1]=wbAddon[1] = '00'
    setWb2('00')
    setWbi2('00')
    setTelegram(changeG6('show'))
  }
  const hideGroup162=()=>{
    wbChar[1] = wbAddon[1] = null
    setWb2('00')
    setWbi2('00')
    setTelegram(changeG6('hide'))
  }
  const wb2CodeChanged = (e)=>{
    let wb = e.target.value
    setWb2(wb)
    wbChar[1] = wb
    setTelegram(changeG6())
  }
  const wbi2CodeChanged = e=>{
    let wbi = +e.target.value>9? e.target.value : '0'+e.target.value
    setWbi2(wbi)
    wbAddon[1] = wbi
    setTelegram(changeG6())
  }
  // const wb2Changed = (e)=>{
  //   let wb2 = e.target.value.padStart(4,'0').slice(0,4)
  //   wb2 = +wb2>9191? '9191' : wb2
  //   setWb2(wb2)
  //   wbChar[1] = wb2.slice(0,2)
  //   wbAddon[1] = wb2.slice(2)
  //   setTelegram(changeG6())
  // }
  const showGroup163=()=>{
    wbChar[2]=wbAddon[2] = '00'
    setWb3('00')
    setWbi3('00')
    setTelegram(changeG6('show'))
  }
  const hideGroup163=()=>{
    wbChar[2]=wbAddon[2] = null
    setWb3('00')
    setWbi3('00')
    setTelegram(changeG6('hide'))
  }
  const wb3CodeChanged = (e)=>{
    let wb = e.target.value
    setWb3(wb)
    wbChar[2] = wb
    setTelegram(changeG6())
  }
  const wbi3CodeChanged = e=>{
    let wbi = +e.target.value>9? e.target.value : '0'+e.target.value
    setWbi3(wbi)
    wbAddon[2] = wbi
    setTelegram(changeG6())
  }
  // const wb3Changed = (e)=>{
  //   let wb3 = e.target.value.padStart(4,'0').slice(0,4)
  //   wb3 = +wb3>9191? '9191' : wb3
  //   setWb3(wb3)
  //   wbChar[2] = wb3.slice(0,2)
  //   wbAddon[2] = wb3.slice(2)
  //   setTelegram(changeG6())
  // }
  const showGroup164=()=>{
    wbChar[3]=wbAddon[3]='00'
    setWb4('00')
    setWbi3('00')
    setTelegram(changeG6('show'))
  }
  const hideGroup164=()=>{
    wbChar[3]=ipAddon[3]= null
    setWb4('00')
    setWbi4('00')
    setTelegram(changeG6('hide'))
  }
  const wb4CodeChanged = (e)=>{
    let wb = e.target.value
    setWb4(wb)
    wbChar[3] = wb
    setTelegram(changeG6())
  }
  const wbi4CodeChanged = e=>{
    let wbi = +e.target.value>9? e.target.value : '0'+e.target.value
    setWbi4(wbi)
    wbAddon[3] = wbi
    setTelegram(changeG6())
  }
  // const wb4Changed = (e)=>{
  //   let wb4 = e.target.value.padStart(4,'0').slice(0,4)
  //   wb4 = +ip4>9191? '9191' : wb4
  //   setWb4(wb4)
  //   wbChar[3] = wb4.slice(0,2)
  //   wbAddon[3] = wb4.slice(2)
  //   setTelegram(changeG6())
  // }
  const showGroup165=()=>{
    wbChar[4]=wbAddon[4] = '00'
    setWb5('00')
    setWbi5('00')
    setTelegram(changeG6('show'))
  }
  const hideGroup165=()=>{
    wbChar[4]=ipAddon[4] = null
    setWb5('00')
    setWbi5('00')
    setTelegram(changeG6('hide'))
  }
  const wb5CodeChanged = (e)=>{
    let wb = e.target.value
    setWb5(wb)
    wbChar[4] = wb
    setTelegram(changeG6())
  }
  const wbi5CodeChanged = e=>{
    let wbi = +e.target.value>9? e.target.value : '0'+e.target.value
    setWbi5(wbi)
    wbAddon[4] = wbi
    setTelegram(changeG6())
  }
  // const wb5Changed = (e)=>{
  //   let wb5 = e.target.value.padStart(4,'0').slice(0,4)
  //   wb5 = +wb5>9191? '9191' : wb5
  //   setWb5(wb5)
  //   wbChar[4] = wb5.slice(0,2)
  //   wbAddon[4] = wb5.slice(2)
  //   setTelegram(changeG6())
  // }

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({})

  const [activeKeys, setActiveKeys] = useState(["0"]);
  const handleSelect = (eventKey) => setActiveKeys(eventKey);
  // const handleToggleClick = () => {
  //   const index = activeKeys.indexOf("0");
  //   if (index > -1) {
  //     activeKeys.splice(index, 1);
  //     setActiveKeys([...activeKeys]);
  //   } else {
  //     setActiveKeys(activeKeys.concat("0"));
  //   }
  // }
  // const handleCollapseClick = () => {
  //   setActiveKeys([]);
  // }
  const myReset = ()=>{
    setWaterLevel(0)
    setWaterLevelDeviation(0)
    setActiveKeys([])
    setTelegram(`HHZZ ${hydroPostCode} ${currDay}${term}${contentIndex} 10000 20000=`)
  }

  const onSubmit = (data) => {
    let hydroData = {
      telegram,
      hydroPostCode,
      waterLevel,
      waterLevelDeviation
    }
    if(waterTemperature)
      hydroData["waterTemperature"] = waterTemperature
    if(airTemperature)
      hydroData["airTemperature"] = airTemperature
    if(ipChar[0]!==null){
      for (let i = 0; i < 5; i++) {
        if(ipChar[i]!==null){
          hydroData = {...hydroData,[`ip${i*2}`]:ipChar[i]}
          if(ipAddon[i]>10){ // character
            if(ipAddon[i]!==ipChar[i])
              hydroData = {...hydroData,[`ip${i*2+1}`]:ipAddon[i]}
          }else //intense
            hydroData = {...hydroData,[`ii${i*2+1}`]:ipAddon[i]}
        }
      }
    }
    if(wbChar[0]!==null){
      for (let i = 0; i < 5; i++) {
        if(wbChar[i]!==null){
          hydroData = {...hydroData,[`wb${i*2}`]:wbChar[i]}
          if(wbAddon[i]>10){
            if(wbAddon[i]!==wbChar[i])
              hydroData = {...hydroData,[`wb${i*2+1}`]:wbAddon[i]}
          }else
            hydroData = {...hydroData,[`wi${i*2+1}`]:wbAddon[i]}
        }
      }
    }
    if(iceThickness!==null)
      hydroData["iceThickness"]=iceThickness
    if(snowThickness!==null)
      hydroData["snowThickness"]=snowThickness
    if(precipitation!==null)
      hydroData["precipitation"]=precipitation
    if(durationPrecipitation!==null)
      hydroData["durationPrecipitation"]=durationPrecipitation
    if(wcWaterLevel!==null){ // section6
      hydroData["wcDate"]=wcDate
      hydroData["wcHour"]=wcHour
      hydroData["wcWaterLevel"]=wcWaterLevel
      hydroData["waterConsumption"]=waterConsumption
      hydroData["riverArea"]=riverArea
      hydroData["maxDepth"]=maxDepth
    }
    setHydroData(hydroData)
    showResponse = true
    myReset()
    
  }
  
  let formGroup17
  const [iceThickness, setIceThickness] = useState(null)
  const [snowThickness, setSnowThickness] = useState(null)
  const getStartG17=()=>{
    return (telegram[29]==='4'? 28+6 : 28) + (ipChar[0]===null? 0 : combineG5().length) + (wbChar[0]===null? 0 : combineG6().length)
  }
  const showGroup17=()=>{
    setIceThickness(1)
    setSnowThickness(0)
    // setSymbolIT('001')
    let start17 = getStartG17()
    let newText = telegram.slice(0,start17)+' 70010'+telegram.slice(start17)
    setTelegram(newText)
  }
  const hideGroup17=()=>{
    setIceThickness(null)
    setSnowThickness(null)
    let newText = telegram.replace(/ 7..../g, "")
    setTelegram(newText)
  }
  const iceThicknessChanged=e=>{
    let it = +e.target.value
    it = it<1? 1 : it
    it = it>999? 999 : it
    setIceThickness(it)
    let start17 = telegram.indexOf(' 7')
    let newText = telegram.slice(0,start17+2)+`${it.toString().padStart(3, "0")}`+telegram.slice(start17+5)
    setTelegram(newText)
  }
  const snowThicknessChanged=e=>{
    let st = +e.target.value
    setSnowThickness(st)
    let start17 = telegram.indexOf(' 7')
    let newText = telegram.slice(0,start17+5)+st+telegram.slice(start17+6)
    setTelegram(newText)
  }
  if(((d+0) % 5 === 0) || (d === lastDay)){
    formGroup17 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}> {/*</Accordion><Accordion flush>*/}
      <Accordion.Item eventKey="13">
        <Accordion.Header>Лёд/Снег (Группа 7)</Accordion.Header>
        <Accordion.Body onEnter={showGroup17} onExited={hideGroup17}>
          <Form.Group className="mb-3" controlId="form-ice-thickness">
            <Form.Label>Толщина льда</Form.Label>
            <Form.Control type="number" value={iceThickness} onChange={iceThicknessChanged} min="1" max="999" pattern='[0-9]{3}'/>
            <Form.Text className="text-muted">
              В сантиметрах
            </Form.Text>
          </Form.Group>
          <br/>
          <Form.Group className="mb-3" controlId="form-snow-thickness">
            <Form.Label>Высота снежного покрова</Form.Label>
            <Form.Control type="number" value={snowThickness} onChange={snowThicknessChanged} min="0" max="9"  pattern='[0-9]'/>
            <Form.Text className="text-muted">
              Цифра кода
            </Form.Text>
          </Form.Group>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  }
  // group10
  const [precipitation, setPrecipitation] = useState(null)
  const [durationPrecipitation, setDurationPrecipitation] = useState(null)
  const getStartG10=()=>{
    return (telegram[29]==='4'? 28+6 : 28)+(ipChar[0]===null? 0 : combineG5().length)+(wbChar[0]===null? 0 : combineG6().length)+(iceThickness===null? 0 : 6)
  }
  const showGroup10=()=>{
    setPrecipitation('000')
    setDurationPrecipitation(0)
    let start10 = getStartG10()
    let newText = telegram.slice(0,start10)+' 00000'+telegram.slice(start10)
    setTelegram(newText)
  }
  const hideGroup10=()=>{
    setPrecipitation(null)
    setDurationPrecipitation(null)
    let start10 = getStartG10()
    let newText = telegram.slice(0,start10)+telegram.slice(start10+6)
    setTelegram(newText)
  }
  const precipitationChanged=e=>{
    let p = e.target.value.padStart(3,'0').slice(0,3)
    p = +p<0? '000' : p
    p = +p>999? '999' : p
    setPrecipitation(p)
    let start10 = getStartG10()
    let newText = telegram.slice(0,start10+2)+p+telegram.slice(start10+5)
    setTelegram(newText)
  }
  const durationPrecipitationChanged=e=>{
    let dp = +e.target.value
    setDurationPrecipitation(dp)
    let start10 = getStartG10()
    let newText = telegram.slice(0,start10+5)+dp+telegram.slice(start10+6)
    setTelegram(newText)
  }
  // section 966 water consumption
  let wcMonth = (currMonth+1).toString().padStart(2,'0')
  let wcDay = currDay
  const [wcDate, setWcDate] = useState(today.toISOString().slice(0,10))
  const [wcHour, setWcHour] = useState(9)
  const [wcWaterLevel, setWcWaterLevel] = useState(null)
  const [waterConsumption, setWaterConsumption] = useState(null)
  const [riverArea, setRiverArea] = useState(null)
  const [maxDepth, setMaxDepth] = useState(null)
  // const section6 = ` 966${wcMonth} 10000 20000 30000 40001 5${wcDay}09`
  const showSection6=()=>{
    setWcWaterLevel(0)
    setWaterConsumption(0.0)
    setRiverArea(1)
    setMaxDepth(1)
    setWcHour(9)
    let startSection6 = telegram.length-1
    let newText = telegram.slice(0,startSection6)+` 966${wcMonth} 10000 20000 30000 40001 5${wcDay}09=`
    setTelegram(newText)
  }
  const hideSection6=()=>{
    setWcWaterLevel(null)
    setWaterConsumption(null)
    setRiverArea(null)
    setMaxDepth(null)
    let startSection6 = telegram.indexOf(' 966')
    let newText = telegram.slice(0,startSection6)+'='
    setTelegram(newText)
  }
  const wcDateChanged=e=>{
    setWcDate(e.target.value)
    wcMonth = e.target.value.slice(5,7)
    wcDay = e.target.value.slice(8,10)
    let newText = telegram.replace(/ 966../g, ` 966${wcMonth}`).replace(/ 5....=/,` 5${wcDay}${wcHour.toString().padStart(2,'0')}=`) 
    setTelegram(newText)
  }
  const wcHourChanged=e=>{
    let wch = +e.target.value
    wch = wch>23? 23:wch
    wch = wch<0? 0:wch
    setWcHour(wch)
    let newText = telegram.slice(0,-3)+wch.toString().padStart(2,'0')+'='
    setTelegram(newText)
  }
  const wcWaterLevelChanged=e=>{
    let wl = +e.target.value
    wl = wl>4999 ? 4999 : wl
    wl = wl<-999 ? -999 : wl
    setWcWaterLevel(wl)
    let g1 = wl >= 0 ? wl.toString().padStart(4,'0') : (5000+Math.abs(wl)).toString()
    let startSection6 = telegram.indexOf(' 966')
    let newText = telegram.slice(0,startSection6+8)+g1+telegram.slice(startSection6+12) 
    setTelegram(newText)
  }
  const waterConsumptionChanged=e=>{
    let wc = +e.target.value
    wc = wc>999999? 999999 : wc
    wc = wc<0.0? 0.0 : wc
    setWaterConsumption(wc)
    let exp = wc.toExponential()
    exp = Number(exp.slice(exp.lastIndexOf('e')+1))
    let num = exp >=0? exp+1 : 0
    let pointPos = e.target.value.lastIndexOf('.')<0? 0:e.target.value.lastIndexOf('.')
    let val = wc<1.? e.target.value.slice(pointPos+1,pointPos+4).padEnd(3,'0') : Number(e.target.value.replace('.','').padEnd(3,'0')).toString().slice(0,3) //padStart(3,'0').slice(0,3) 
    let startSection6 = telegram.indexOf(' 966')
    let newText = telegram.slice(0,startSection6+14)+`${num}${val}`+telegram.slice(startSection6+18)
    setTelegram(newText) //+`>>${e.target.value}<<`)
  }
  const riverAreaChanged=e=>{
    if(/[0-9]+([\.,][0-9]+)?/.test(e.target.value)){
      let ra = +e.target.value
      setRiverArea(ra)
      let exp = ra.toExponential()
      exp = Number(exp.slice(exp.lastIndexOf('e')+1))
      let num = exp >=0? exp+1 : 0
      let pointPos = e.target.value.lastIndexOf('.')
      let val = ra<1.? e.target.value.slice(pointPos+1,pointPos+4).padEnd(3,'0') : Number(e.target.value.replace('.','').padEnd(3,'0')).toString().slice(0,3)
      let startSection6 = telegram.indexOf(' 966')
      let newText = telegram.slice(0,startSection6+20)+`${num}${val}`+telegram.slice(startSection6+24)
      setTelegram(newText)
    }else{setRiverArea(1)}
    // ra = ra>999999? 999999 : ra
    // ra = ra<0.0? 0.0 : ra
  }
  const maxDepthChanged=e=>{
    let md = +e.target.value //.padStart(4,'0').slice(0,4)
    md = md<1? 1 : md
    md = md>9999? 9999 : md
    setMaxDepth(md)
    let l = telegram.length
    let newText = telegram.slice(0,l-11)+md.toString().padStart(4,'0')+telegram.slice(l-7)
    setTelegram(newText)
  }
  let ipCodes = []
  for (let index = 11; index < 78; index++){
    ipCodes.push(index);
  }
  // const ipCodeChanged = e=>{
  //   let ip2 = e.target.value+'01' //.padStart(4,'0').slice(0,4)
  //   // ip2 = +ip2>7777? '7777' : ip2
  //   setIp2(ip2)
  //   ipChar[1] = ip2.slice(0,2)
  //   ipAddon[1] = ip2.slice(2)
  //   let start151 = telegram.indexOf(' 5')
  //   let allG5 = combineG5()
  //   let newText = telegram.slice(0,start151)+allG5+telegram.slice(start151+allG5.length)
  //   setTelegram(newText)
  // }
  // const a = [1,2,3,4,5]
  // let i = 0
  // options77 = a.map(num => {i++; return <options value={i}>{i}</options>})
  // [1,2,3,4,5].forEach(function(currentValue, index, array) {
  //   options77.push(<options value={index}>ooo</options>)
  // });
  // options77.push(<option value={i}>One</option>)
  // options77.push(<option value="2">Two</option>)
  // const icePhI = icePhenomenaIntens+icePhenomena
  // alert(JSON.stringify(icePhI))
  const additionSection6 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}> {/*</Accordion><Accordion flush>*/}
    <Accordion.Item eventKey="14">
      <Accordion.Header>Расход воды (Раздел 6)</Accordion.Header>
      <Accordion.Body onEnter={showSection6} onExited={hideSection6}>
        <Form.Group className="mb-3" controlId="form-observed-date">
          <Form.Label>Дата измерения расхода воды</Form.Label>
          <Form.Control type="date" value={wcDate} onChange={wcDateChanged}  />
        </Form.Group>
        <br/>
        <Form.Group className="mb-3" controlId="form-observed-hour">
          <Form.Label>Час измерения расхода воды</Form.Label>
          <Form.Control type="number" value={wcHour} onChange={wcHourChanged} min='0' max='23' pattern='[012][0-9]' />
        </Form.Group>
        <br/>
        <Form.Group className="mb-3" controlId="form-wc-water-level">
          <Form.Label>Уровень воды (Группа 1)</Form.Label>
          <Form.Control type="number" value={wcWaterLevel} onChange={wcWaterLevelChanged} min="-999" max="4999" pattern='[0-9]{4}'/>
          <Form.Text className="text-muted">
            Уровень воды над нулем поста в сантиметрах
          </Form.Text>
        </Form.Group>
        <br/>
        <Form.Group className="mb-3" controlId="form-water-consumption">
          <Form.Label>Расход воды (Группа 2)</Form.Label>
          <Form.Control type="number" value={waterConsumption} onChange={waterConsumptionChanged} min="0.0" max="99999.0" step="1" />
          <Form.Text className="text-muted">
            Метры кубические за секунду (м<sup>3</sup>/с)
          </Form.Text>
        </Form.Group>
        <br/>
        <Form.Group className="mb-3" controlId="form-river-cross-sectional-area">
          <Form.Label>Площадь сечения реки (Группа 3)</Form.Label>
          <Form.Control type="number" value={riverArea} onChange={riverAreaChanged} min="0.0" max="99999.0" pattern="[0-9]+([\.,][0-9]+)?" />
          <Form.Text className="text-muted">
            Метры квадратные (м<sup>2</sup>)
          </Form.Text>
        </Form.Group>
        <br/>
        <Form.Group className="mb-3" controlId="form-max-depth">
          <Form.Label>Максимальная глубина (Группа 4)</Form.Label>
          <Form.Control type="number" value={maxDepth} onChange={maxDepthChanged} min="1" max="9999" pattern='[0-9]{4}'/>
          <Form.Text className="text-muted">
            В сантиметрах
          </Form.Text>
        </Form.Group>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
  const myForm =
    <Form onSubmit={handleSubmit(onSubmit)} onReset={reset}> 
      <Form.Label>Раздел 1</Form.Label>
      <Form.Group className="mb-3" controlId="formWaterLevel">
        <Form.Label>Уровень воды (Группа 1)</Form.Label>
        <Form.Control type="number" value={waterLevel} onChange={waterLevelChanged} min="-999" max="4999" pattern="[-]*[0-9]{1,3}"/>
        <Form.Text className="text-muted">
          Уровень воды над нулем поста в сантиметрах
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formWaterLevelDeviation">
        <Form.Label>Изменение уровня воды (Группа 2)</Form.Label>
        <Form.Control type="number" value={waterLevelDeviation} onChange={waterLevelDeviationChanged} min="-999" max="999" pattern="[-]*[0-9]{1,3}"/>
        <Form.Text className="text-muted">
          Изменение уровня воды в сантиметрах
        </Form.Text>
      </Form.Group>
      {/* <Accordion flush> */}
      <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
        <Accordion.Item eventKey="15">
          <Accordion.Header>Температура воды и воздуха (Группа 4)</Accordion.Header>
          <Accordion.Body onEnter={showGroup14} onExited={hideGroup14}>
            <Form.Group className="mb-3" controlId="formWaterTemperature">
              <Form.Label>Температура воды</Form.Label>
              <Form.Control type="number" value={waterTemperature} onChange={waterTemperatureChanged} min="0.0" max="9.9" step="0.1" pattern='^[0-9]$|(^[0-9][\.,][0-9]{0,1}$)'/>
              <Form.Text className="text-muted">
                С точностью до десятых
              </Form.Text>
            </Form.Group>
            {/* <Accordion flush> */}
            <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
              <Accordion.Item eventKey="1" >
                <Accordion.Header>Температура воздуха</Accordion.Header>
                <Accordion.Body onEnter={showAirTemperature} onExited={hideAirTemperature}>
                  <Form.Group className="mb-3" controlId="formAirTemperature">
                    {/* <Form.Label>Температура воды</Form.Label> */}
                    <Form.Control type="number" value={airTemperature} onChange={airTemperatureChanged} min="-49" max="49" pattern="^-{0,1}[0-9]$|^-{0,1}[0-4][0-9]$"/>
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* <Accordion flush > */}
      <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Ледовые явления (Группа 5)</Accordion.Header>
          <Accordion.Body onEnter={showGroup15} onExited={hideGroup15}>
            <Form.Group className="mb-3" controlId="formIcePhenomena">
              <Form.Label>Выберите характеристику явления</Form.Label>
              <Form.Select onChange={ip1CodeChanged}>
                {Object.keys(icePhenomena).map(ip => {if(+ip>10) return <option value={ip}>{icePhenomena[ip]}</option>})}
              </Form.Select>
              <Form.Label>Выберите характеристику или интенсивность явления</Form.Label>
              <Form.Select onChange={ii1CodeChanged}>
                {Object.keys(icePhenomena).map(ip => <option value={ip}>{icePhenomena[ip]}</option>)}
              </Form.Select>
            </Form.Group>
            <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
              <Accordion.Item eventKey="3" id="accordion-ip2" >
                <Accordion.Header>Экземпляр 2</Accordion.Header>
                <Accordion.Body onEnter={showGroup152} onExited={hideGroup152}>
                  <Form.Group className="mb-3" controlId="formIp2">
                    <Form.Label>Выберите характеристику явления</Form.Label>
                    <Form.Select onChange={ip2CodeChanged} defaultValue={"11"}>
                      {Object.keys(icePhenomena).map(ip => {if(+ip>10) return <option value={ip}>{icePhenomena[ip]}</option>})}
                    </Form.Select>
                    <Form.Label>Выберите характеристику или интенсивность явления</Form.Label>
                    <Form.Select onChange={ii2CodeChanged}>
                      {Object.keys(icePhenomena).map(ip => <option value={ip}>{icePhenomena[ip]}</option>)}
                    </Form.Select>
                    {/* <Form.Control type="number" value={ip2} onChange={e=>ip2Changed(e)} min="1101" max="7777" pattern="[0-9]{4}"/> */}
                  </Form.Group>
                  <Accordion>
                    <Accordion.Item eventKey="4">
                      <Accordion.Header>Экземпляр 3</Accordion.Header>
                      <Accordion.Body onEnter={showGroup153} onExited={hideGroup153}>
                        <Form.Group className="mb-3" controlId="formIp3" >
                          <Form.Label>Выберите характеристику явления</Form.Label>
                          <Form.Select onChange={ip3CodeChanged} defaultValue={"11"}>
                            {Object.keys(icePhenomena).map(ip => {if(+ip>10) return <option value={ip}>{icePhenomena[ip]}</option>})}
                          </Form.Select>
                          <Form.Label>Выберите характеристику или интенсивность явления</Form.Label>
                          <Form.Select onChange={ii3CodeChanged}>
                            {Object.keys(icePhenomena).map(ip => <option value={ip}>{icePhenomena[ip]}</option>)}
                          </Form.Select>
                        </Form.Group>
                        <Accordion>
                          <Accordion.Item eventKey="5">
                            <Accordion.Header>Экземпляр 4</Accordion.Header>
                            <Accordion.Body onEnter={showGroup154} onExited={hideGroup154}>
                              <Form.Group className="mb-3" controlId="formIp4">
                                <Form.Label>Выберите характеристику явления</Form.Label>
                                <Form.Select onChange={ip4CodeChanged} defaultValue={"11"}>
                                  {Object.keys(icePhenomena).map(ip => {if(+ip>10) return <option value={ip}>{icePhenomena[ip]}</option>})}
                                </Form.Select>
                                <Form.Label>Выберите характеристику или интенсивность явления</Form.Label>
                                <Form.Select onChange={ii4CodeChanged}>
                                  {Object.keys(icePhenomena).map(ip => <option value={ip}>{icePhenomena[ip]}</option>)}
                                </Form.Select>
                                {/* <Form.Control type="number" value={ip4} onChange={ip4Changed} min="1101" max="7777" pattern="[0-9]{4}" /> */}
                              </Form.Group>
                              <Accordion>
                                <Accordion.Item eventKey="6">
                                  <Accordion.Header>Экземпляр 5</Accordion.Header>
                                  <Accordion.Body onEnter={showGroup155} onExited={hideGroup155}>
                                    <Form.Group className="mb-3" controlId="formIp5">
                                      <Form.Label>Выберите характеристику явления</Form.Label>
                                      <Form.Select onChange={ip5CodeChanged} defaultValue={"11"}>
                                        {Object.keys(icePhenomena).map(ip => {if(+ip>10) return <option value={ip}>{icePhenomena[ip]}</option>})}
                                      </Form.Select>
                                      <Form.Label>Выберите характеристику или интенсивность явления</Form.Label>
                                      <Form.Select onChange={ii5CodeChanged}>
                                        {Object.keys(icePhenomena).map(ip => <option value={ip}>{icePhenomena[ip]}</option>)}
                                      </Form.Select>
                                      {/* <Form.Control type="number" value={ip5} onChange={ip5Changed} min="1101" max="7777" pattern="[0-9]{4}" /> */}
                                    </Form.Group>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* <Accordion flush> */}
      <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
        <Accordion.Item eventKey="7">
          <Accordion.Header>Состояние водного объекта (Группа 6)</Accordion.Header>
          <Accordion.Body onEnter={showGroup16} onExited={hideGroup16}>
            <Form.Group className="mb-3" controlId="formStateWaterBody">
              <Form.Label>Выберите характеристику объекта</Form.Label>
              <Form.Select onChange={wb1CodeChanged} defaultValue={"0"}>
                {Object.keys(waterBodies).map(wb => {if(+wb==0 || +wb>10) return <option value={wb}>{waterBodies[wb]}</option>})}
              </Form.Select>
              <Form.Label>Выберите характеристику объекта или интенсивность явления</Form.Label>
              <Form.Select onChange={wbi1CodeChanged}>
                {Object.keys(waterBodies).map(wb => <option value={wb}>{waterBodies[wb]}</option>)}
              </Form.Select>
            </Form.Group>
            <Accordion>
              <Accordion.Item eventKey="8">
                <Accordion.Header>Экземпляр 2</Accordion.Header>
                <Accordion.Body onEnter={showGroup162} onExited={hideGroup162}>
                  <Form.Group className="mb-3" controlId="form-wb2">
                    <Form.Label>Выберите характеристику объекта</Form.Label>
                    <Form.Select onChange={wb2CodeChanged} defaultValue={"0"}>
                      {Object.keys(waterBodies).map(wb => {if(+wb==0 || +wb>10) return <option value={wb}>{waterBodies[wb]}</option>})}
                    </Form.Select>
                    <Form.Label>Выберите характеристику объекта или интенсивность явления</Form.Label>
                    <Form.Select onChange={wbi2CodeChanged}>
                      {Object.keys(waterBodies).map(wb => <option value={wb}>{waterBodies[wb]}</option>)}
                    </Form.Select>
                  </Form.Group>
                  <Accordion>
                    <Accordion.Item eventKey="9">
                      <Accordion.Header>Экземпляр 3</Accordion.Header>
                      <Accordion.Body onEnter={showGroup163} onExited={hideGroup163}>
                        <Form.Group className="mb-3" controlId="form-wb3">
                          <Form.Label>Выберите характеристику объекта</Form.Label>
                          <Form.Select onChange={wb3CodeChanged} defaultValue={"0"}>
                            {Object.keys(waterBodies).map(wb => {if(+wb==0 || +wb>10) return <option value={wb}>{waterBodies[wb]}</option>})}
                          </Form.Select>
                          <Form.Label>Выберите характеристику объекта или интенсивность явления</Form.Label>
                          <Form.Select onChange={wbi3CodeChanged}>
                            {Object.keys(waterBodies).map(wb => <option value={wb}>{waterBodies[wb]}</option>)}
                          </Form.Select>
                        </Form.Group>
                        <Accordion>
                          <Accordion.Item eventKey="10">
                            <Accordion.Header>Экземпляр 4</Accordion.Header>
                            <Accordion.Body onEnter={showGroup164} onExited={hideGroup164}>
                              <Form.Group className="mb-3" controlId="form-wb4">
                                <Form.Label>Выберите характеристику объекта</Form.Label>
                                <Form.Select onChange={wb4CodeChanged} defaultValue={"0"}>
                                  {Object.keys(waterBodies).map(wb => {if(+wb==0 || +wb>10) return <option value={wb}>{waterBodies[wb]}</option>})}
                                </Form.Select>
                                <Form.Label>Выберите характеристику объекта или интенсивность явления</Form.Label>
                                <Form.Select onChange={wbi4CodeChanged}>
                                  {Object.keys(waterBodies).map(wb => <option value={wb}>{waterBodies[wb]}</option>)}
                                </Form.Select>
                              </Form.Group>
                              <Accordion>
                                <Accordion.Item eventKey="11">
                                  <Accordion.Header>Экземпляр 5</Accordion.Header>
                                  <Accordion.Body onEnter={showGroup165} onExited={hideGroup165}>
                                    <Form.Group className="mb-3" controlId="form-wb5">
                                      <Form.Label>Выберите характеристику объекта</Form.Label>
                                      <Form.Select onChange={wb5CodeChanged} defaultValue={"0"}>
                                        {Object.keys(waterBodies).map(wb => {if(+wb==0 || +wb>10) return <option value={wb}>{waterBodies[wb]}</option>})}
                                      </Form.Select>
                                      <Form.Label>Выберите характеристику объекта или интенсивность явления</Form.Label>
                                      <Form.Select onChange={wbi5CodeChanged}>
                                        {Object.keys(waterBodies).map(wb => <option value={wb}>{waterBodies[wb]}</option>)}
                                      </Form.Select>
                                    </Form.Group>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {formGroup17}
      {/* <Accordion flush> */}
      <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
        <Accordion.Item eventKey="12">
          <Accordion.Header>Осадки (Группа 0)</Accordion.Header>
          <Accordion.Body onEnter={showGroup10} onExited={hideGroup10}>
            <Form.Group className="mb-3" controlId="form-precipitation">
              <Form.Label>Количество осадков</Form.Label>
              <Form.Control type="text" value={precipitation} onChange={precipitationChanged} min="000" max="999" pattern='[0-9]{3}'/>
              <Form.Text className="text-muted">
                Цифры кода
              </Form.Text>
            </Form.Group>
            <br/>
            <Form.Group className="mb-3" controlId="form-duration-precipitation">
              <Form.Label>Продолжительность выпадения осадков</Form.Label>
              <Form.Control type="number" value={durationPrecipitation} onChange={durationPrecipitationChanged} min="0" max="4"  pattern='[0-9]'/>
              <Form.Text className="text-muted">
                Цифра кода
              </Form.Text>
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {additionSection6}
      <Button variant="primary" type="submit">
        Сохранить
      </Button>
      {/* <br/>
      <Button onClick={handleToggleClick} >Toggle First</Button>
      <Button onClick={handleCollapseClick}>Collapse All</Button> */}
    </Form>

  let content
  content = <div>
    <p>{telegram}</p>
    {myForm}
  </div>
  if(showResponse && isSuccess && response.response){ // .failed_count==="0") && (response.response.success_count !== '0')){
    let csdnSection1 = response.response.response.failed_count==='0'? 'В ЦСДН сохранены данные.':'Ошибка при сохранении данных.'
    // let csdnSection6 = !!(response.response.response_water_consumption && (response.response.response_water_consumption.failed_count==='0'))?'В ЦСДН сохранены данные раздела 6':'Ошибка при сохранении данных раздела 6'
    let localDB = response.response.message ? `${response.response.message}` : ''
    alert(`${csdnSection1} ${localDB}`)
    showResponse = false
  }
  return (
    <section>
      <h2>Ввод гидротелеграмм</h2>
      {content}
    </section>
  )
}