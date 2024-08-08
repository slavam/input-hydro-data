import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { useSaveHydroDataQuery } from '../api/apiSlice'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import { icePhenomena, waterBodies, periodTime } from '../../components/dictionaries'

const ipCharS2 = new Array(5) //.fill(null)
for(let i=0; i<ipCharS2.length; i++){ipCharS2[i]= new Array(5).fill(null)}
const ipAddonS2 = new Array(5) //.fill(null)
for(let i=0; i<ipAddonS2.length; i++){ipAddonS2[i]= new Array(5).fill(null)}
const wbCharS2 = new Array(5) //.fill(null)
for(let i=0; i<ipCharS2.length; i++){wbCharS2[i]= new Array(5).fill(null)}
const wbAddonS2 = new Array(5) //.fill(null)
for(let i=0; i<ipAddonS2.length; i++){wbAddonS2[i]= new Array(5).fill(null)}
const ipChar = new Array(5).fill(null)
const ipAddon = new Array(5).fill(null)
const wbChar = new Array(5).fill(null)
const wbAddon = new Array(5).fill(null)
const periods = new Array(5).fill(null)
const avgWl = new Array(5).fill(null)
const maxWl = new Array(5).fill(null)
const minWl = new Array(5).fill(null)
// const avgWc = new Array(5).fill(null)
// const maxWc = new Array(5).fill(null)
// const minWc = new Array(5).fill(null)
let showResponse = false
let today = new Date()
let d = today.getUTCDate()
let currDay = d>9 ? d : ('0'+d)
const url = window.location.href
const postCode = (url.indexOf('postCode')>-1)?url.slice(-5):'99999'
// const [telegram, setTelegram] = useState(`HHZZ ${postCode} ${currDay}081 10000 20000=`)

export const InputHydroTelegram = ()=>{
  
  const [hydroData, setHydroData] = useState(null)
  const {
    data: response = {},
    isSuccess,
  } = useSaveHydroDataQuery(hydroData)
  // const hydroPostCode = postCode //===null? '99999':postCode //'99999' //process.env.REACT_APP_CODE_83028
  
  const [term, setTerm] = useState('08')
  // const [contentIndex, setContentIndex] = useState('1')
  // let today = new Date()
  let currYear = today.getFullYear()
  let currMonth = today.getMonth()
  let lastDay = 32 - new Date(currYear, currMonth, 32).getDate()
  // let d = today.getUTCDate()
  // let currDay = d>9 ? d : ('0'+d)
  
  const [waterLevel, setWaterLevel] = useState(0)
  const [waterLevel21, setWaterLevel21] = useState(null)
  const [waterLevel22, setWaterLevel22] = useState(null)
  const [waterLevelDeviation, setWaterLevelDeviation] = useState(0)
  const [wlDeviation21, setWLDeviation21]=useState(0)
  const [wlDeviation22, setWLDeviation22]=useState(0)
  const [waterTemperature, setWaterTemperature] = useState(null)
  const [waterTemperature21, setWaterTemperature21] = useState(null)
  const [waterTemperature22, setWaterTemperature22] = useState(null)
  const [airTemperature, setAirTemperature] = useState(null)
  const [airTemperature21, setAirTemperature21] = useState(null)
  const [airTemperature22, setAirTemperature22] = useState(null)
  const [telegram, setTelegram] = useState(`HHZZ ${postCode} ${currDay}081 10000 20000=`)
  
  const waterLevelJsx = (id, wl)=>{
    return (<Form.Group className="mb-3" >
      <Form.Label>Уровень воды над нулем поста в сантиметрах (Группа 1)</Form.Label>
      <Form.Control id={id} type="number" value={wl} onChange={waterLevelChanged} min="-999" max="4999" pattern="^-?[0-9]{1,4}$"/>
    </Form.Group>)
  }

  // matches.forEach((match) => {
  //   ...     console.log("match found at " + match.index);
  //   ... });
  // matches = [...s.matchAll(/a/g)]
  // [
  //   [ 'a', index: 0, input: 'abracadabra', groups: undefined ],
  //   [ 'a', index: 3, input: 'abracadabra', groups: undefined ],
  //   [ 'a', index: 5, input: 'abracadabra', groups: undefined ],
  //   [ 'a', index: 7, input: 'abracadabra', groups: undefined ],
  //   [ 'a', index: 10, input: 'abracadabra', groups: undefined ]
  // ]

  const startSection22=()=>{
    return(telegram.indexOf(' 922',telegram.indexOf(' 922')+1))
  }
  const waterLevelChanged = (e)=>{
    let wl = e.target.value
    if(/^-?[0-9]{1,4}$/.test(wl)){
      wl = +wl>4999 ? 4999 : wl
      wl = +wl<-999 ? -999 : wl
    }else
      wl = 0
    let g1 = +wl >= 0 ? wl.toString().padStart(4,'0') : (5000+Math.abs(+wl)).toString()      
    let newText = telegram
    switch (e.target.id) {
      case 'group11':
        setWaterLevel(wl)
        newText = telegram.slice(0,18)+`${g1}`+telegram.slice(22)   
        break;
      case 'group61':
        setWcWaterLevel(wl)
        let startSection6 = telegram.indexOf(' 966')
        newText = telegram.slice(0,startSection6+8)+g1+telegram.slice(startSection6+12) 
        break
      case 'group211':
        setWaterLevel21(wl)
        let startSection21 = telegram.indexOf(' 922')
        newText = telegram.slice(0,startSection21+8)+g1+telegram.slice(startSection21+12) 
        break
      case 'group212':
        setWaterLevel22(wl)
        let startS22=startSection22()
        newText = telegram.slice(0,startS22+8)+g1+telegram.slice(startS22+12) 
        break
      default:
        break;
    }
    setTelegram(newText)
  }
  const wlDeviationJsx=(id,wld)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Изменение уровня воды в сантиметрах (Группа 2)</Form.Label>
      <Form.Control id={id} type="number" value={wld} onChange={waterLevelDeviationChanged} min="-999" max="999" pattern="^-?[0-9]{1,3}$"/>
    </Form.Group>)
  }
  const waterLevelDeviationChanged = (e)=>{
    let wld = e.target.value 
    if(!/^-?[0-9]{1,3}$/.test(e.target.value))
      wld = '0'
    let g2 = +wld === 0 ? '0000' : (+wld>0 ? (wld.toString().padStart(3,'0')+'1') : (Math.abs(+wld).toString().padStart(3,'0')+'2'))
    let newText = telegram
    switch (e.target.id) {
      case "group12":
        setWaterLevelDeviation(wld)
        newText = telegram.slice(0,24)+`${g2}`+telegram.slice(28)   
        break;
      case 'group221':
        setWLDeviation21(wld)
        let startSection21 = telegram.indexOf(' 922')
        newText = telegram.slice(0,startSection21+14)+g2+telegram.slice(startSection21+18) 
        break
      case 'group222':
        setWLDeviation22(wld)
        let startS22=startSection22()
        newText = telegram.slice(0,startS22+14)+g2+telegram.slice(startS22+18) 
        break
      default:
        break;
    }
    setTelegram(newText)
  }
  const waterTemperatureJsx=(id,wt)=>{
    return (<Form.Group className="mb-3" >
      <Form.Label>Температура воды с точностью до десятых</Form.Label>
      <Form.Control id={id} type="number" value={wt} onChange={waterTemperatureChanged} min="0.0" max="9.9" step="0.1" pattern='^[0-9]$|(^[0-9][.,][0-9]?$)'/>
    </Form.Group>)
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
    let newText = telegram.replace(/\/\//,'00')
    setTelegram(newText)
  }
  const hideAirTemperature=()=>{
    setAirTemperature(null)
    let newText = telegram.slice(0,32)+'//'+telegram.slice(34)
    setTelegram(newText)
  }
  const waterTemperatureChanged = (e)=>{
    let wt = e.target.value
    if(!/^[0-9]$|(^[0-9][.,][0-9]?$)/.test(e.target.value)){
      let s = e.target.value.length<1? '00':e.target.value
      wt = s.indexOf('.')>=0? s.slice(0,3):s[1]
    }
    let newText
    switch (e.target.id) {
      case 'wTemp1':
        setWaterTemperature(wt)
        newText = telegram.slice(0,30)+`${wt>=1 ? wt*10 : '0'+(wt*10)}`+telegram.slice(32)
        break;
      case 'wTemp21':
        setWaterTemperature21(wt)
        let startSection2 = telegram.indexOf(' 922')
        newText = telegram.slice(0,startSection2+20)+`${+wt>=1 ? +wt*10 : '0'+(10*wt).toString()}`+telegram.slice(startSection2+22)
        break
      case 'wTemp22':
        setWaterTemperature22(wt)
        let startS22=startSection22()
        newText = telegram.slice(0,startS22+20)+`${+wt>=1 ? +wt*10 : '0'+(10*wt).toString()}`+telegram.slice(startS22+22)
        break
      default:
        newText = telegram
    }
    setTelegram(newText)
  }
  const airTemperatureJsx=(id,aTemp)=>{
    return(<Form.Group className="mb-3" >
      <Form.Control id={id} type="number" value={aTemp} onChange={airTemperatureChanged} min="-49" max="49" pattern="^-?[0-9]$|^-?[0-9][0-9]$"/>
    </Form.Group>)
  }
  const airTemperatureChanged=(e)=>{
    let at = e.target.value
    if(/^-?[0-9]$|^-?[0-9]{2}$/.test(at)){
      at = +at>49 ? 49 : at
      at = +at<-49 ? -49 : at
    }else{
      at=0
    }
    let newText = telegram
    switch (e.target.id) {
      case 'aTemp1':
        setAirTemperature(at)
        newText = telegram.slice(0,32)+`${+at<0 ? 50-at : (+at>=0 && +at<10 ? (+at).toString().padStart(2,'0') : at)}`+telegram.slice(34)// +'>'+at+'<'    
        break;
      case 'aTemp21':
        setAirTemperature21(at)
        let startSection2 = telegram.indexOf(' 922')
        newText = telegram.slice(0,startSection2+22)+`${+at<0 ? 50-at : (+at>=0 && +at<10 ? (+at).toString().padStart(2,'0') : at)}`+telegram.slice(startSection2+24)
        break
      case 'aTemp22':
        setAirTemperature22(at)
        let startS22=startSection22()
        newText = telegram.slice(0,startS22+22)+`${+at<0 ? 50-at : (+at>=0 && +at<10 ? (+at).toString().padStart(2,'0') : at)}`+telegram.slice(startS22+24)
        break
      default:
        break;
    }
    setTelegram(newText)
  }
  const combineG5=()=>{
    let ret = ''
    for (let i = 0; i < ipChar.length; i++){
      ret += ipChar[i]===null? '':` 5${ipChar[i]}${ipAddon[i]}`
    }
    return ret
  }
  const newG5 = k=>{
    let start151 = telegram.indexOf(' 5')
    let allG5 = combineG5()
    return start151>0? telegram.slice(0,start151)+allG5+telegram.slice(start151+allG5.length+k*6) : telegram
  }
  const showGroup15=()=>{
    ipChar[0] = 11
    ipAddon[0] = '01'
    let g152 = ipChar[1]===null?'':` 5${ipChar[1]}${ipAddon[1]}`
    let g153 = ipChar[2]===null?'':` 5${ipChar[2]}${ipAddon[2]}`
    let g154 = ipChar[3]===null?'':` 5${ipChar[3]}${ipAddon[3]}`
    let g155 = ipChar[4]===null?'':` 5${ipChar[4]}${ipAddon[4]}`
    let g5 = ` 51101${g152}${g153}${g154}${g155}`
    let start15 = telegram[29]==='4'? 28+6 : 28
    let newText = telegram.slice(0,start15)+g5+telegram.slice(start15)
    setTelegram(newText)
  }
  const hideGroup15=()=>{
    ipChar[0] = ipAddon[0] = null
    if(telegram.indexOf(' 5')>0){
      let newText = telegram.replace(/ 5..../g,'')
      setTelegram(newText)
    }
    filterKeys(2,6)
  }
  const group5Jsx=(id,ipChange,iiChange)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Выберите характеристику явления</Form.Label>
      <Form.Select id={id+'ip'} onChange={ipChange} menuPortalTarget={document.body}>
        {Object.keys(icePhenomena).map(ip => {return (+ip>10? <option value={ip}>{icePhenomena[ip]}</option> : null)})}
      </Form.Select>
      <Form.Label>Выберите характеристику или интенсивность явления</Form.Label>
      <Form.Select id={id+'ipi'} onChange={iiChange}>
        {Object.keys(icePhenomena).map(ip => <option value={ip}>{icePhenomena[ip]}</option>)}
      </Form.Select>
    </Form.Group>)
  }
  const ip1CodeChanged = e=>{
    let ip = e.target.value
    let i = +e.target.id[3]-1
    ipChar[i] = ip
    setTelegram(newG5(0))
  }
  const ii1CodeChanged = e=>{
    let ii = +e.target.value>9? e.target.value : '0'+e.target.value
    let i = +e.target.id[3]-1
    ipAddon[i] = ii
    setTelegram(newG5(0))
  }
  const showGroup152=()=>{
    ipChar[1] = 11
    ipAddon[1] = '01'
    setTelegram(newG5(-1))
  }
  const hideGroup152=()=>{
    ipChar[1] = ipAddon[1] = null
    setTelegram(newG5(1))
    filterKeys(3,6)
  }
  const showGroup153=()=>{
    ipChar[2] = 11
    ipAddon[2] = '01'
    setTelegram(newG5(-1))
  }
  const hideGroup153=()=>{
    ipChar[2] = ipAddon[2] = null
    setTelegram(newG5(1))
    filterKeys(4,6)
  }
  const showGroup154=()=>{
    ipChar[3] = 11
    ipAddon[3] = '01'
    setTelegram(newG5(-1))
  }
  const hideGroup154=()=>{
    ipChar[3] = ipAddon[3] = null
    setTelegram(newG5(1))
    filterKeys(5,6)
  }
  const showGroup155=()=>{
    ipChar[4] = 11
    ipAddon[4] = '01'
    setTelegram(newG5(-1))
  }
  const hideGroup155=()=>{
    ipChar[4] = ipAddon[4] = null
    setTelegram(newG5(1))
  }
// group6
  const combineG6=()=>{
    let ret = ''
    for (let i = 0; i < wbChar.length; i++){
      ret += wbChar[i]===null? '':` 6${wbChar[i]}${wbAddon[i]}`
    }
    return ret
  }
  const changeG6=(k)=>{
    let allG6 = combineG6()
    let start16 = telegram.indexOf(' 6')
    return start16>0? telegram.slice(0,start16)+allG6+telegram.slice(start16+allG6.length+k*6) : telegram
  }
  const showGroup16=()=>{
    wbChar[0] = '00'
    wbAddon[0] = '00'
    let g162 = wbChar[1]===null?'':` 6${wbChar[1]}${wbAddon[1]}`
    let g163 = wbChar[2]===null?'':` 6${wbChar[2]}${wbAddon[2]}`
    let g164 = wbChar[3]===null?'':` 6${wbChar[3]}${wbAddon[3]}`
    let g165 = wbChar[4]===null?'':` 6${wbChar[4]}${wbAddon[4]}`
    let g6 = ` 60000${g162}${g163}${g164}${g165}`
    let start16 = (telegram[29]==='4'? 28+6 : 28) + combineG5().length
    let newText = telegram.slice(0,start16)+g6+telegram.slice(start16)
    setTelegram(newText)
  }
  const hideGroup16=()=>{
    wbChar[0] = wbAddon[0] = null
    if(telegram.indexOf(' 6')>0){
      let newText = telegram.replace(/ 6..../g,'')
      setTelegram(newText)
    }
    filterKeys(7,11)
  }
  const group6Jsx = (id,wbChange,wbiChange)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Выберите характеристику объекта</Form.Label>
      <Form.Select id={id+'wb'} onChange={wbChange} >
        {Object.keys(waterBodies).map(wb => {return (+wb===0 || +wb>10)? <option value={wb}>{waterBodies[wb]}</option> : null})}
      </Form.Select>
      <Form.Label>Выберите характеристику объекта или интенсивность явления</Form.Label>
      <Form.Select id={id+'wbi'} onChange={wbiChange}>
        {Object.keys(waterBodies).map(wb => <option value={wb}>{waterBodies[wb]}</option>)}
      </Form.Select>
    </Form.Group>)
  }
  const wb1CodeChanged = e=>{
    let wb = +e.target.value>9? e.target.value : '0'+e.target.value
    let i = +e.target.id[3]-1 // 'g161wb'
    wbChar[i] = wb
    setTelegram(changeG6(0))
  }
  const wbi1CodeChanged = e=>{
    let wbi = +e.target.value>9? e.target.value : '0'+e.target.value
    let i = +e.target.id[3]-1 // 'g161wbi'
    wbAddon[i] = wbi
    setTelegram(changeG6(0))
  }
  const showGroup162=()=>{
    wbChar[1]=wbAddon[1] = '00'
    setTelegram(changeG6(-1))
  }
  const hideGroup162=()=>{
    wbChar[1] = wbAddon[1] = null
    setTelegram(changeG6(1))
    filterKeys(8,11)
  }
  const showGroup163=()=>{
    wbChar[2]=wbAddon[2] = '00'
    setTelegram(changeG6(-1)) //'show'))
  }
  const hideGroup163=()=>{
    wbChar[2]=wbAddon[2] = null
    setTelegram(changeG6(1)) //'hide'))
    filterKeys(9,11)
  }
  const showGroup164=()=>{
    wbChar[3]=wbAddon[3]='00'
    setTelegram(changeG6(-1)) //'show'))
  }
  const hideGroup164=()=>{
    wbChar[3]=ipAddon[3]= null
    setTelegram(changeG6(1)) //'hide'))
    filterKeys(10,11)
  }
  const showGroup165=()=>{
    wbChar[4]=wbAddon[4] = '00'
    setTelegram(changeG6(-1)) //'show'))
  }
  const hideGroup165=()=>{
    wbChar[4]=ipAddon[4] = null
    setTelegram(changeG6(1)) //'hide'))
  }
  
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({})

  const [activeKeys, setActiveKeys] = useState(["0"]);
  const handleSelect = (eventKey) => setActiveKeys(eventKey);
  const myReset = ()=>{
    // setTelegram('')
    setWaterLevel(0)
    setWaterLevelDeviation(0)
    // setContentIndex(1)
    setActiveKeys([])
    setTelegram(`HHZZ ${postCode} ${currDay}081 10000 20000=`)
    // setTelegram(`HHZZ ${hydroPostCode} ${currDay}081 10000 20000=`) //${term}${contentIndex} 10000 20000=`)
  }
  const section3submit=(j,period,avgWl,maxWl,minWl,maxLevelDate,maxLevelHour)=>{
    let ret={}
    ret["period"+j]=period
    if(avgWl!==null)
      ret['avgWl'+j]=avgWl
    if(maxWl!==null){
      ret['maxWl'+j]=maxWl
      if(maxLevelDate!==null){
        ret['mlDate'+j]=maxLevelDate
        ret['mlHour'+j]= (+maxLevelHour>9)? maxLevelHour : ('0'+maxLevelHour)
      }
    }
    if(minWl!==null)
      ret['minWl'+j]=minWl
    // if(avgWc!==null)
    //   ret['avgWc'+j]=avgWc
    // if(maxWc!==null)
    //   ret['maxWc'+j]=maxWc
    // if(minWc!==null)
    //   ret['minWc'+j]=minWc
    // if(maxLevelDate!==null){
    // if (maxWl!==null){
    //   ret['mlDate'+j]=maxLevelDate
    //   ret['mlHour+j']=maxLevelHour
    // }
    return ret
  }
  const section2submit=(j,obsDate,wl,wld,waterTemp,airTemp,ipChar2,ipAddon2,wbChar2,wbAddon2,iceThickness,snowThickness,precipitation,pDuration)=>{
    let ret = {}
    ret["obsDate2"+j]=obsDate
    ret['waterLevel2'+j]=wl
    ret['wlDeviation2'+j]=wld
    if(waterTemp!==null)
      ret['waterTemp2'+j]=waterTemp
    if(airTemp!==null)
      ret['airTemperature2'+j]=airTemp
    if(ipChar2[0]!==null)
      for (let i = 0; i < 5; i++) {
        if(ipChar2[i]!==null){
          ret = {...ret,[`ip${i*2}`]:ipChar2[i]}
          if(ipAddon2[i]>10){ // character
            if(ipAddon2[i]!==ipChar2[i])
              ret = {...ret,[`ip${i*2+1}`]:ipAddon2[i]}
          }else //intense
            ret = {...ret,[`ii${i*2+1}`]:ipAddon2[i]}
        }
      }
    if(wbChar2[0]!==null)
      for (let i = 0; i < 5; i++) {
        if(wbChar2[i]!==null){
          ret = {...ret,[`wb${i*2}`]:wbChar2[i]}
          if(wbAddon2[i]>10){
            if(wbAddon2[i]!==wbChar2[i])
              ret = {...ret,[`wb${i*2+1}`]:wbAddon2[i]}
          }else
            ret = {...ret,[`wi${i*2+1}`]:wbAddon2[i]}
        }
      }
    if(iceThickness!==null)
      ret["iThickness2"+j]=iceThickness
    if(snowThickness!==null)
      ret["sThickness2"+j]=snowThickness
    if(precipitation!==null)
      ret["precipitation2"+j]=precipitation
    if(pDuration!==null)
      ret["pDuration2"+j]=pDuration
    return ret
  }
  const onSubmit = () => {
    let hydroData = {
      telegram,
      hydroPostCode: postCode,
      waterLevel,
      waterLevelDeviation
    }
    if(waterTemperature!==null)
      hydroData["waterTemperature"] = waterTemperature
    if(airTemperature!==null)
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
    if(waterLevel21!==null){
      let s2 = section2submit(1,obsDate21,waterLevel21,wlDeviation21,waterTemperature21,
        airTemperature21,ipCharS2[0],ipAddonS2[0],wbCharS2[0],wbAddonS2[0],iceThickness21,snowThickness21,precipitation21,pDuration21)
      hydroData = {...hydroData, ...s2}
      // alert(JSON.stringify(hydroData).replace(/\\/g,""))
    }
    if(waterLevel22!==null){
      if(obsDate21 === obsDate22){
        alert("Разделы 922 должны иметь разные даты")
        return
      }
      let s22 = section2submit(2,obsDate22,waterLevel22,wlDeviation22,waterTemperature22,
        airTemperature22,ipCharS2[1],ipAddonS2[1],wbCharS2[1],wbAddonS2[1],iceThickness22,snowThickness22,precipitation22,pDuration22)
      hydroData = {...hydroData, ...s22}
      // alert(JSON.stringify(hydroData).replace(/\\/g,""))
    }
    if(periods[0]!==null){
      let s3 = section3submit(0,periods[0],avgWl[0],maxWl[0],minWl[0],maxLevelDate,maxLevelHour)
      hydroData = {...hydroData, ...s3}
    }
    setHydroData(hydroData)
    showResponse = true
    myReset()
  }
  // group7
  let formGroup17
  const [iceThickness, setIceThickness] = useState(null)
  const [snowThickness, setSnowThickness] = useState(null)
  const getStartG17=()=>{
    return (telegram[29]==='4'? 28+6 : 28) + (ipChar[0]===null? 0 : combineG5().length) + (wbChar[0]===null? 0 : combineG6().length)
  }
  const showGroup17=()=>{
    setIceThickness(1)
    setSnowThickness(0)
    let start17 = getStartG17()
    let newText = telegram.slice(0,start17)+' 70010'+telegram.slice(start17)
    setTelegram(newText)
  }
  const hideGroup17=()=>{
    setIceThickness(null)
    setSnowThickness(null)
    let newText = telegram.replace(/ 7..../, "")
    setTelegram(newText)
  }
  const group7IceJsx=(id,iceT)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Толщина льда в сантиметрах</Form.Label>
      <Form.Control id={id} type="number" value={iceT} onChange={iceThicknessChanged} min="1" max="999" pattern='[0-9]{1,3}'/>
    </Form.Group>)
  }
  const iceThicknessChanged=e=>{
    let it = e.target.value
    it = +it<1? 1 : it
    it = +it>999? 999 : it
    let newText = telegram
    switch (e.target.id) {
      case 's1g7':
        setIceThickness(it)
        let start17 = telegram.indexOf(' 7')
        newText = telegram.slice(0,start17+2)+`${it.toString().padStart(3, "0")}`+telegram.slice(start17+5)
        break;
      case 's2g7':
        setIceThickness21(it)
        let start27 = telegram.indexOf(' 7',telegram.indexOf(' 922'))
        newText = telegram.slice(0,start27+2)+`${(+it).toString().padStart(3, "0")}`+telegram.slice(start27+5)
        break
      case 's22g7':
        setIceThickness22(it)
        let start227 = telegram.indexOf(' 7',startSection22())
        newText = telegram.slice(0,start227+2)+`${(+it).toString().padStart(3, "0")}`+telegram.slice(start227+5)
        break
      default:
        break;
    }
    setTelegram(newText)
  }
  const group7SnowJsx=(id,snowT)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Высота снежного покрова (цифра кода)</Form.Label>
      <Form.Control id={id} type="number" value={snowT} onChange={snowThicknessChanged} min="0" max="9" pattern='[0-9]'/>
      {/* <Form.Text className="text-muted">Цифра кода</Form.Text> */}
    </Form.Group>)
  }
  const snowThicknessChanged=e=>{
    let st = e.target.value
    if(!/^0?[0-9]$/.test(st))
      st=0
    let newText = telegram
    switch (e.target.id) {
      case 's1g7':
        setSnowThickness(+st)
        let start17 = telegram.indexOf(' 7')
        newText = telegram.slice(0,start17+5)+(+st).toString()+telegram.slice(start17+6)    
        break;
      case 's2g7':
        setSnowThickness21(st)
        let start27 = telegram.indexOf(' 7',telegram.indexOf(' 922'))
        newText = telegram.slice(0,start27+5)+(+st).toString()+telegram.slice(start27+6)
        break
      case 's22g7':
        setSnowThickness22(st)
        let start227 = telegram.indexOf(' 7',startSection22())
        newText = telegram.slice(0,start227+5)+(+st).toString()+telegram.slice(start227+6)
        break
      default:
        break;
    }
    setTelegram(newText)
  }
  if(((d+0) % 5 === 0) || (d === lastDay)){
    formGroup17 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}> {/*</Accordion><Accordion flush>*/}
      <Accordion.Item eventKey="13">
        <Accordion.Header>Лёд/Снег (Группа 7)</Accordion.Header>
        <Accordion.Body onEnter={showGroup17} onExited={hideGroup17}>
          {group7IceJsx('s1g7',iceThickness)}
          {group7SnowJsx('s1g7',snowThickness)}
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
  const precipitationJsx = (id,precipitation)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Количество осадков (цифры кода)</Form.Label>
      <Form.Control id={id} type="number" value={precipitation} onChange={precipitationChanged} min="0" max="999" pattern='[0-9]{1,3}'/>
    </Form.Group>
    )
  }
  const pDurationJsx=(id,durationPrecipitation)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Продолжительность выпадения осадков (цифра кода)</Form.Label>
      <Form.Control id={id} type="number" value={durationPrecipitation} onChange={durationPrecipitationChanged} min="0" max="4"  pattern='^0?[0-4]$'/>
    </Form.Group>)
  }
  const precipitationChanged=e=>{
    let p=e.target.value
    if(!/^[0-9]{1,3}$/.test(p))
      p=0
    let newText = telegram
    switch (e.target.id) {
      case 's1g0':
        setPrecipitation(p)
        let start10 = getStartG10()
        newText = telegram.slice(0,start10+2)+(+p).toString().padStart(3,'0')+telegram.slice(start10+5)    
        break;
      case 's2g0':
        setPrecipitation21(p)
        let start20 = getStartG20()
        newText = telegram.slice(0,start20+2)+(+p).toString().padStart(3,'0')+telegram.slice(start20+5)    
        break
      case 's22g0':
        setPrecipitation22(p)
        let start220 = getStartS22G0()
        newText = telegram.slice(0,start220+2)+(+p).toString().padStart(3,'0')+telegram.slice(start220+5)    
        break
      default:
        break;
    }
    setTelegram(newText)
  }
  const durationPrecipitationChanged=e=>{
    let dp = e.target.value
    if(!/^0?[0-4]$/.test(dp))
      dp=0
    let newText = telegram
    switch (e.target.id) {
      case 's1g0':
        setDurationPrecipitation(+dp)
        let start10 = getStartG10()
        newText = telegram.slice(0,start10+5)+(+dp).toString()+telegram.slice(start10+6)    
        break;
      case 's2g0':
        setPDuration21(dp)
        let start20 = getStartG20()
        newText = telegram.slice(0,start20+5)+(+dp).toString()+telegram.slice(start20+6)
        break
      case 's22g0':
        setPDuration22(dp)
        let start220 = getStartS22G0()
        newText = telegram.slice(0,start220+5)+(+dp).toString()+telegram.slice(start220+6)
        break
      default:
        break;
    }
    setTelegram(newText)
  }
  // section 966 water consumption
  let wcMonth = (currMonth+1).toString().padStart(2,'0')
  let wcDay = currDay
  const [wcDate, setWcDate] = useState(today.toISOString().slice(0,10))
  const [obsDate21, setObsDate21]=useState(today.toISOString().slice(0,10))
  const [obsDate22, setObsDate22]=useState(today.toISOString().slice(0,10))
  const [maxLevelDate, setMaxLevelDate] = useState(null) //today.toISOString().slice(0,10))
  const [wcHour, setWcHour] = useState(9)
  const [maxLevelHour, setMaxLevelHour] = useState(9)
  const [wcWaterLevel, setWcWaterLevel] = useState(null)
  const [waterConsumption, setWaterConsumption] = useState(null)
  const [riverArea, setRiverArea] = useState(null)
  const [maxDepth, setMaxDepth] = useState(null)
  const showSection6=()=>{
    setWcWaterLevel(0)
    setWaterConsumption(0.0)
    setRiverArea(1)
    setMaxDepth(1)
    setWcHour(9)
    let startSection6 = telegram.length-1
    let newText = telegram.slice(0,15)+'2'+telegram.slice(16)
    newText =newText.slice(0,startSection6)+` 966${wcMonth} 10000 20000 30001 40001 5${wcDay}09=`
    setTelegram(newText)
  }
  const hideSection6=()=>{
    setWcWaterLevel(null)
    setWaterConsumption(null)
    setRiverArea(null)
    setMaxDepth(null)
    let startSection6 = telegram.indexOf(' 966')
    let newText = telegram
    if(waterLevel22===null && waterLevel21===null && periods[0]===null){
      newText = telegram.slice(0,15)+'1'+telegram.slice(16)
    }
    newText = newText.slice(0,startSection6)+'='
    setTelegram(newText)
  }
  const dateObservationJsx=(id,obsDate)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Дата измерения</Form.Label>
      <Form.Control id={id} type="date" value={obsDate} onChange={wcDateChanged}  />
    </Form.Group>)
  }
  const wcDateChanged=e=>{
    let od = e.target.value
    let newText = telegram
    switch (e.target.id) {
      case 'section6date':
        setWcDate(od)
        wcMonth = od.slice(5,7)
        wcDay = od.slice(8,10)
        newText = telegram.replace(/ 966../g, ` 966${wcMonth}`).replace(/ 5....=/,` 5${wcDay}${wcHour.toString().padStart(2,'0')}=`)
        break;
      case 'section2date1':
        setObsDate21(od)
        newText = telegram.replace(/ 922../, ` 922${od.slice(8,10)}`)
        break
      case 'section2date2':
        setObsDate22(od)
        let startDate22 = startSection22() //telegram.indexOf(' 922',telegram.indexOf(' 922')+1)
        newText = telegram.slice(0,startDate22+4)+od.slice(8,10)+telegram.slice(startDate22+6)
        break
      case 'max-level-date':
        setMaxLevelDate(od)
        let startS3G7 = telegram.indexOf(' 7',telegram.indexOf(' 933'))
        newText = telegram.slice(0,startS3G7+2)+od.slice(8,10)+telegram.slice(startS3G7+4)
        break
      default:
        break;
    }
    setTelegram(newText)
  }
  const wcHourChanged=e=>{
    let wch = +e.target.value
    wch = wch>23? 23:wch
    wch = wch<0? 0:wch
    let newText = telegram
    if(e.target.id==='max-level-hour'){
      setMaxLevelHour(wch)
      let startS3G7 = telegram.indexOf(' 7',telegram.indexOf(' 933'))
      newText = telegram.slice(0,startS3G7+4)+wch.toString().padStart(2,'0')+telegram.slice(startS3G7+6)
    }else{
      setWcHour(wch)
      newText = telegram.slice(0,-3)+wch.toString().padStart(2,'0')+'='
    }
    setTelegram(newText)
  }
  const waterConsumptionChanged=e=>{
    let startSection6 = telegram.indexOf(' 966')
    let newText = telegram
    if(/^[0-9]+([.,][0-9]+)?$/.test(e.target.value)){
      let wc = +e.target.value
      wc = wc>999999.0? 999999.0 : wc
      wc = wc<0.0? 0.0 : wc
      setWaterConsumption(parseFloat(wc))
      let exp = wc.toExponential()
      exp = Number(exp.slice(exp.lastIndexOf('e')+1))
      let num = exp >=0? exp+1 : 0
      let pointPos = e.target.value.lastIndexOf('.')<0? 0:e.target.value.lastIndexOf('.')
      let val = wc<1.? e.target.value.slice(pointPos+1,pointPos+4).padEnd(3,'0') : Number(e.target.value.replace('.','')).toString().padEnd(3,'0').slice(0,3)
      newText = telegram.slice(0,startSection6+14)+`${num}${val}`+telegram.slice(startSection6+18)
      setTelegram(newText) //+`>>${e.target.value}<<`)
    }else{
      setWaterConsumption(0)
      newText = telegram.slice(0,startSection6+14)+`0000`+telegram.slice(startSection6+18)
      setTelegram(newText)
    }
  }
  const riverAreaChanged=e=>{
    let startSection6 = telegram.indexOf(' 966')
    let newText = telegram
    if(/^[0-9]+([.,][0-9]+)?$/.test(e.target.value)){
      let ra = +e.target.value
      ra = ra>999999.0? 999999.0 : ra
      ra = ra<0.0? 0.0 : ra
      setRiverArea(parseFloat(ra))
      let exp = ra.toExponential()
      exp = Number(exp.slice(exp.lastIndexOf('e')+1))
      let num = exp >=0? exp+1 : 0
      let pointPos = e.target.value.lastIndexOf('.')<0? 0:e.target.value.lastIndexOf('.')
      let val = ra<1.? e.target.value.slice(pointPos+1,pointPos+4).padEnd(3,'0') : Number(e.target.value.replace('.','')).toString().padEnd(3,'0').slice(0,3)
      newText = telegram.slice(0,startSection6+20)+`${num}${val}`+telegram.slice(startSection6+24)
    }else{
      setRiverArea(parseFloat(1))
      newText = telegram.slice(0,startSection6+20)+`0001`+telegram.slice(startSection6+24)
    }
    setTelegram(newText)
  }
  const maxDepthChanged=e=>{
    let newText = telegram
    if(/^[0-9]{1,4}$/.test(e.target.value)){
      let md = +e.target.value
      setMaxDepth(md)
      let l = telegram.length
      newText = telegram.slice(0,l-11)+md.toString().padStart(4,'0')+telegram.slice(l-7)
    }else setMaxDepth(1)
    setTelegram(newText)
  }
  // section2
  const showSection21=()=>{
    setWaterLevel21(0)
    setWLDeviation21(0.0)
    let startS3 = telegram.indexOf(' 933')
    let startS6 = telegram.indexOf(' 966')
    let startS2 = startS3>0? startS3: (startS6>0? startS6 : telegram.length-1)
    let newText = telegram.slice(0,15)+'2'+telegram.slice(16)
    let obsDay = obsDate21.slice(8,10)
    newText =newText.slice(0,startS2)+` 922${obsDay} 10000 20000`+newText.slice(startS2)
    setTelegram(newText)
  }
  const hideSection21=()=>{
    setWaterLevel21(null)
    setWLDeviation21(null)
    let startS2 = telegram.indexOf(' 922')
    let startS3 = telegram.indexOf(' 933')
    let stopS2 = startS3>0? startS3: (telegram.indexOf(' 966')>=0? telegram.indexOf(' 966') : telegram.length-1)
    let newText = telegram
    if(wcWaterLevel===null && periods[0]===null && waterLevel22===null){
      newText = telegram.slice(0,15)+'1'+telegram.slice(16)
    }
    newText = newText.slice(0,startS2)+newText.slice(stopS2)
    setTelegram(newText)
    filterKeys(16,28)
  }
  const showSection22=()=>{
    setWaterLevel22(0)
    setWLDeviation22(0.0)
    let newText = telegram
    newText = telegram.slice(0,15)+'2'+telegram.slice(16)
    let startSection6 = telegram.indexOf(' 966')
    let startS22 = startSection6>0? startSection6 : telegram.length-1
    let obsDay = obsDate22.slice(8,10)
    newText =newText.slice(0,startS22)+` 922${obsDay} 10000 20000`+newText.slice(startS22)
    setTelegram(newText)
  }
  const hideSection22=()=>{
    setWaterLevel22(null)
    setWLDeviation22(null)
    let newText = telegram
    if(wcWaterLevel===null && waterLevel21===null && periods[0]===null){
      newText = telegram.slice(0,15)+'1'+telegram.slice(16)
    }
    let startS22=startSection22()
    let stopSection22 = telegram.indexOf(' 966')>=0? telegram.indexOf(' 966') : telegram.length-1
    newText = newText.slice(0,startS22)+newText.slice(stopSection22)
    setTelegram(newText)
    filterKeys(31,43)
  }
  const showGroup241=()=>{
    setWaterTemperature21(0)
    if(airTemperature21 !== null)
      setAirTemperature21(0)
    let startSection2 = telegram.indexOf(' 922')
    let newText = telegram.slice(0,startSection2+18)+` 400${airTemperature21===null? '//':'00'}`+telegram.slice(startSection2+18)
    setTelegram(newText)
  }
  const hideGroup241=()=>{
    setWaterTemperature21(null)
    setAirTemperature21(null)
    let startSection2 = telegram.indexOf(' 922')
    let newText = startSection2>0? telegram.slice(0,startSection2+18)+telegram.slice(startSection2+24):telegram
    setTelegram(newText)
  }
  const showAirTemperature21=()=>{
    setAirTemperature21(0)
    let startSection2 = telegram.indexOf(' 922')
    let newText = telegram.slice(0,startSection2+22)+'00'+telegram.slice(startSection2+24) // replace(/\/\//g,'00')
    setTelegram(newText)
  }
  const hideAirTemperature21=()=>{
    setAirTemperature21(null)
    let startSection2 = telegram.indexOf(' 922')
    let newText = telegram.slice(0,startSection2+22)+'//'+telegram.slice(startSection2+24)
    setTelegram(newText)
  }
  const showGroup242=()=>{
    setWaterTemperature22(0)
    if(airTemperature22 !== null)
      setAirTemperature22(0)
    let startS22 = startSection22()
    let newText = telegram.slice(0,startS22+18)+` 400${airTemperature22===null? '//':'00'}`+telegram.slice(startS22+18)
    setTelegram(newText)
  }
  const hideGroup242=()=>{
    setWaterTemperature22(null)
    setAirTemperature22(null)
    let startS22=startSection22() //  = telegram.indexOf(' 922')
    let newText = telegram.slice(0,startS22+18)+telegram.slice(startS22+24)
    setTelegram(newText)
  }
  const showAirTemperature22=()=>{
    setAirTemperature22(0)
    let startS22=startSection22() //  = telegram.indexOf(' 922')
    let newText = telegram.slice(0,startS22+22)+'00'+telegram.slice(startS22+24)
    setTelegram(newText)
  }
  const hideAirTemperature22=()=>{
    setAirTemperature22(null)
    let startS22=startSection22() //  = telegram.indexOf(' 922')
    let newText = telegram.slice(0,startS22+22)+'//'+telegram.slice(startS22+24)
    setTelegram(newText)
  }
  const combineS2G5=(j)=>{
    let ret = ''
    for (let i = 0; i < ipCharS2[j].length; i++){
      ret += ipCharS2[j][i]===null? '':` 5${ipCharS2[j][i]}${ipAddonS2[j][i]}`
    }
    return ret
  }
  const newS2G5 =(j,k)=>{
    let startS2
    switch (j) {
      case 0:
        startS2=telegram.indexOf(' 922')
        break;
      case 1:
        startS2=startSection22() 
        break;
      default:
        break;
    }
    let startS2G5 = startS2+(telegram[startS2+19]==='4'? 18+6 : 18)
    let allG5 = combineS2G5(j)
    return startS2>0? telegram.slice(0,startS2G5)+allG5+telegram.slice(startS2G5+allG5.length+k*6): telegram
  }
  const showGroupS2G5=(j,i)=>{
    ipCharS2[j][i] = 11
    ipAddonS2[j][i] = '01'
    let nt = newS2G5(j,-1)
    setTelegram(nt)
  }
  const showGroupS21G51=()=>{
    showGroupS2G5(0,0)
  }
  const showGroupS21G52=()=>{
    showGroupS2G5(0,1)
  }
  const showGroupS21G53=()=>{
    showGroupS2G5(0,2)
  }
  const showGroupS21G54=()=>{
    showGroupS2G5(0,3)
  }
  const showGroupS21G55=()=>{
    showGroupS2G5(0,4)
  }
  const showGroupS22G51=()=>{
    showGroupS2G5(1,0)
  }
  const showGroupS22G52=()=>{
    showGroupS2G5(1,1)
  }
  const showGroupS22G53=()=>{
    showGroupS2G5(1,2)
  }
  const showGroupS22G54=()=>{
    showGroupS2G5(1,3)
  }
  const showGroupS22G55=()=>{
    showGroupS2G5(1,4)
  }
  const hideGroupS2G5=(j,i)=>{
    ipCharS2[j][i] = ipAddonS2[j][i] = null
    setTelegram(newS2G5(j,1))
  }
  const hideGroupS21G51=()=>{
    hideGroupS2G5(0,0)
    filterKeys(19,23)
  }
  const hideGroupS21G52=()=>{
    hideGroupS2G5(0,1)
    filterKeys(20,23)
  }
  const hideGroupS21G53=()=>{
    hideGroupS2G5(0,2)
    filterKeys(21,23)
  }
  const hideGroupS21G54=()=>{
    hideGroupS2G5(0,3)
    filterKeys(22,23)
  }
  const hideGroupS21G55=()=>{
    hideGroupS2G5(0,4)
  }
  const hideGroupS22G51=()=>{
    hideGroupS2G5(1,0)
    filterKeys(34,38)
  }
  const hideGroupS22G52=()=>{
    hideGroupS2G5(1,1)
    filterKeys(35,38)
  }
  const hideGroupS22G53=()=>{
    hideGroupS2G5(1,2)
    filterKeys(36,38)
  }
  const hideGroupS22G54=()=>{
    hideGroupS2G5(1,3)
    filterKeys(37,38)
  }
  const hideGroupS22G55=()=>{
    hideGroupS2G5(1,4)
  }
  const ip2CodeChanged = e=>{
    let ip = e.target.value
    let j = +e.target.id[2]-1 // 'g2151ip'
    let i = +e.target.id[4]-1 
    ipCharS2[j][i] = ip
    setTelegram(newS2G5(j,0))
  }
  const ii2CodeChanged = e=>{
    let ii = +e.target.value<10? '0'+e.target.value : e.target.value
    let j = +e.target.id[2]-1 // 'g2151ii'
    let i = +e.target.id[4]-1 
    ipAddonS2[j][i] = ii
    setTelegram(newS2G5(j,0))
  }
  const combineS2G6=(j)=>{
    let ret = ''
    for (let i = 0; i < wbCharS2[j].length; i++){
      ret += wbCharS2[j][i]===null? '':` 6${wbCharS2[j][i]}${wbAddonS2[j][i]}`
    }
    return ret
  }
  const newS2G6 =(j,k)=>{
    let startS2
    switch (j) {
      case 0:
        startS2=telegram.indexOf(' 922')
        break;
      case 1:
        startS2=startSection22()
        break;
      default:
        break;
    }
    let startS2G6 = telegram.indexOf(" 6", startS2)
    let allG6 = combineS2G6(j)
    return startS2>0? telegram.slice(0,startS2G6)+allG6+telegram.slice(startS2G6+allG6.length+k*6): telegram
  }
  const wb2CodeChanged = e=>{
    let wb = +e.target.value<10? '0'+e.target.value : e.target.value
    let j = +e.target.id[2]-1 // 's21g61wb'
    let i = +e.target.id[5]-1 // 's21g61wb'
    wbCharS2[j][i] = wb
    setTelegram(newS2G6(j,0))
  }
  const wbi2CodeChanged = e=>{
    let wbi = +e.target.value<10? '0'+e.target.value : e.target.value
    let j = +e.target.id[2]-1 // 's21g61wb'
    let i = +e.target.id[5]-1 // 's21g61wb'
    wbAddonS2[j][i] = wbi
    setTelegram(newS2G6(j,0))
  }
  
  const showGroupS2G6=(j,i)=>{
    wbCharS2[j][i] = wbAddonS2[j][i] = '00'
    setTelegram(newS2G6(j,-1))
  }
  const showGroupS21G61=()=>{
    showGroupS2G6(0,0)
  }
  const showGroupS21G62=()=>{
    showGroupS2G6(0,1)
  }
  const showGroupS21G63=()=>{
    showGroupS2G6(0,2)
  }
  const showGroupS21G64=()=>{
    showGroupS2G6(0,3)
  }
  const showGroupS21G65=()=>{
    showGroupS2G6(0,4)
  }
  const showGroupS22G61=()=>{
    showGroupS2G6(1,0)
  }
  const showGroupS22G62=()=>{
    showGroupS2G6(1,1)
  }
  const showGroupS22G63=()=>{
    showGroupS2G6(1,2)
  }
  const showGroupS22G64=()=>{
    showGroupS2G6(1,3)
  }
  const showGroupS22G65=()=>{
    showGroupS2G6(1,4)
  }
  const hideGroupS2G6=(j,i)=>{
    wbCharS2[j][i] = wbAddonS2[j][i] = null
    setTelegram(newS2G6(j,1))
  }
  const hideGroupS21G61=()=>{
    hideGroupS2G6(0,0)
    filterKeys(24,28)
  }
  const hideGroupS21G62=()=>{
    hideGroupS2G6(0,1)
    filterKeys(25,28)
  }
  const hideGroupS21G63=()=>{
    hideGroupS2G6(0,2)
    filterKeys(26,28)
  }
  const hideGroupS21G64=()=>{
    hideGroupS2G6(0,3)
    filterKeys(27,28)
  }
  const hideGroupS21G65=()=>{
    hideGroupS2G6(0,4)
  }
  const hideGroupS22G61=()=>{
    hideGroupS2G6(1,0)
    filterKeys(39,43)
  }
  const hideGroupS22G62=()=>{
    hideGroupS2G6(1,1)
    filterKeys(40,43)
  }
  const hideGroupS22G63=()=>{
    hideGroupS2G6(1,2)
    filterKeys(41,43)
  }
  const hideGroupS22G64=()=>{
    hideGroupS2G6(1,3)
    filterKeys(42,43)
  }
  const hideGroupS22G65=()=>{
    hideGroupS2G6(1,4)
  }
  let formGroup27 = null
  const [iceThickness21, setIceThickness21] = useState(null)
  const [snowThickness21, setSnowThickness21] = useState(null)
  const getStartG27=()=>{
    let startSection2 = telegram.indexOf(' 922')
    let startS2G4 = telegram.indexOf(' 4',startSection2)
    let startS2G5 = telegram.indexOf(' 5',startSection2)
    let startS2G6 = telegram.indexOf(' 6',startSection2)
    if(startS2G6>0)
      return startS2G6+combineS2G6(0).length
    else if(startS2G5>0)
      return startS2G5+combineS2G5(0).length
    else if(startS2G4>0)
      return startS2G4+6
    else 
      return startSection2+18
  }
  const showGroup27=()=>{
    setIceThickness21(1)
    setSnowThickness21(0)
    let start27 = getStartG27()
    let newText = telegram.slice(0,start27)+' 70010'+telegram.slice(start27)
    setTelegram(newText)
  }
  const hideGroup27=()=>{
    setIceThickness21(null)
    setSnowThickness21(null)
    let startS2G7 = telegram.indexOf(' 7',telegram.indexOf(' 922'))
    let newText = telegram.slice(0,startS2G7)+telegram.slice(startS2G7+6)
    setTelegram(newText)
  }
  if(((d+0) % 5 === 0) || (d === lastDay)){
    formGroup27 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}> {/*</Accordion><Accordion flush>*/}
      <Accordion.Item eventKey="29">
        <Accordion.Header>Лёд/Снег (Группа 7)</Accordion.Header>
        <Accordion.Body onEnter={showGroup27} onExited={hideGroup27}>
          {group7IceJsx('s2g7',iceThickness21)}
          {group7SnowJsx('s2g7',snowThickness21)}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  }
  let formS22Group7 = null
  const [iceThickness22, setIceThickness22] = useState(null)
  const [snowThickness22, setSnowThickness22] = useState(null)
  const getStartS22G7=()=>{
    let startS22=startSection22()
    let startS2G4 = telegram.indexOf(' 4',startS22)
    let startS2G5 = telegram.indexOf(' 5',startS22)
    let startS2G6 = telegram.indexOf(' 6',startS22)
    if(startS2G6>0)
      return startS2G6+combineS2G6(1).length
    else if(startS2G5>0)
      return startS2G5+combineS2G5(1).length
    else if(startS2G4>0)
      return startS2G4+6
    else 
      return startS22+18
  }
  const showS22Group7=()=>{
    setIceThickness22(1)
    setSnowThickness22(0)
    let start27 = getStartS22G7()
    let newText = telegram.slice(0,start27)+' 70010'+telegram.slice(start27)
    setTelegram(newText)
  }
  const hideS22Group7=()=>{
    setIceThickness22(null)
    setSnowThickness22(null)
    let startS22G7 = telegram.indexOf(' 7',startSection22()) //telegram.indexOf(' 922',telegram.indexOf(' 922')+1))
    let newText = telegram.slice(0,startS22G7)+telegram.slice(startS22G7+6)
    setTelegram(newText)
  }
  if(((d+0) % 5 === 0) || (d === lastDay)){ // true || 
    formS22Group7 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
      <Accordion.Item eventKey="44">
        <Accordion.Header>Лёд/Снег (Группа 7)</Accordion.Header>
        <Accordion.Body onEnter={showS22Group7} onExited={hideS22Group7}>
          {group7IceJsx('s22g7',iceThickness22)}
          {group7SnowJsx('s22g7',snowThickness22)}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  }

  let formGroup20 = null
  const [precipitation21, setPrecipitation21] = useState(null)
  const [pDuration21, setPDuration21] = useState(null)
  const getStartG20=()=>{
    let startSection2 = telegram.indexOf(' 922')
    let startS2G4 = telegram.indexOf(' 4',startSection2)
    let startS2G5 = telegram.indexOf(' 5',startSection2)
    let startS2G6 = telegram.indexOf(' 6',startSection2)
    let startS2G7 = telegram.indexOf(' 7',startSection2)
    if(startS2G7>0)
      return startS2G7+6
    else if(startS2G6>0)
      return startS2G6+combineS2G6(0).length
    else if(startS2G5>0)
      return startS2G5+combineS2G5(0).length
    else if(startS2G4>0)
      return startS2G4+6
    else 
      return startSection2+18
  }
  const showGroup20=()=>{
    setPrecipitation21(0)
    setPDuration21(0)
    let start20 = getStartG20()
    let newText = telegram.slice(0,start20)+' 00000'+telegram.slice(start20)
    setTelegram(newText)
  }
  const hideGroup20=()=>{
    setPrecipitation21(null)
    setPDuration21(null)
    let start20 = getStartG20()
    let newText = telegram.slice(0,start20)+telegram.slice(start20+6)
    setTelegram(newText)
  }
  formGroup20 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
    <Accordion.Item eventKey="30">
      <Accordion.Header>Осадки (Группа 0)</Accordion.Header>
      <Accordion.Body onEnter={showGroup20} onExited={hideGroup20}>
        {precipitationJsx('s2g0',precipitation21)}
        {pDurationJsx('s2g0',pDuration21)}
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>

  let formS22Group0 = null
  const [precipitation22, setPrecipitation22] = useState(null)
  const [pDuration22, setPDuration22] = useState(null)
  const getStartS22G0=()=>{
    let startS22 = startSection22()
    let startS2G4 = telegram.indexOf(' 4',startS22)
    let startS2G5 = telegram.indexOf(' 5',startS22)
    let startS2G6 = telegram.indexOf(' 6',startS22)
    let startS2G7 = telegram.indexOf(' 7',startS22)
    if(startS2G7>0)
      return startS2G7+6
    else if(startS2G6>0)
      return startS2G6+combineS2G6(1).length
    else if(startS2G5>0)
      return startS2G5+combineS2G5(1).length
    else if(startS2G4>0)
      return startS2G4+6
    else 
      return startS22+18
  }
  const showS22Group0=()=>{
    setPrecipitation22(0)
    setPDuration22(0)
    let start20 = getStartS22G0()
    let newText = telegram.slice(0,start20)+' 00000'+telegram.slice(start20)
    setTelegram(newText)
  }
  const hideS22Group0=()=>{
    setPrecipitation22(null)
    setPDuration22(null)
    let start20 = getStartS22G0()
    let newText = telegram.slice(0,start20)+telegram.slice(start20+6)
    setTelegram(newText)
  }
  formS22Group0 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
    <Accordion.Item eventKey="45">
      <Accordion.Header>Осадки (Группа 0)</Accordion.Header>
      <Accordion.Body onEnter={showS22Group0} onExited={hideS22Group0}>
        {precipitationJsx('s22g0',precipitation22)}
        {pDurationJsx('s22g0',pDuration22)}
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
  const filterKeys = (from,to)=>{
    let res=activeKeys.filter(k=> +k<=from || +k>to)
    setActiveKeys(res)
  }
  const additionSection22 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
    <Accordion.Item eventKey="31">
      <Accordion.Header>Данные за прошедшие сутки (Раздел 2 экземпляр 2)</Accordion.Header>
      <Accordion.Body onEnter={showSection22} onExited={hideSection22}>
        {dateObservationJsx('section2date2',obsDate22)}
        {waterLevelJsx('group212',waterLevel22)}
        {wlDeviationJsx('group222',wlDeviation22)}
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey="32">
            <Accordion.Header>Температура воды и воздуха (Группа 4)</Accordion.Header>
            <Accordion.Body onEnter={showGroup242} onExited={hideGroup242}>
              {waterTemperatureJsx('wTemp22',waterTemperature22)}
              <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                <Accordion.Item eventKey="33" >
                  <Accordion.Header>Температура воздуха</Accordion.Header>
                  <Accordion.Body onEnter={showAirTemperature22} onExited={hideAirTemperature22}>
                    {airTemperatureJsx('aTemp22',airTemperature22)}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey="34">
            <Accordion.Header>Ледовые явления (Группа 5)</Accordion.Header>
            <Accordion.Body onEnter={showGroupS22G51} onExit={hideGroupS22G51}>
              {group5Jsx('g2251',ip2CodeChanged,ii2CodeChanged)}
              <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                <Accordion.Item eventKey="35" id="accordion-ip2" >
                  <Accordion.Header>Экземпляр 2</Accordion.Header>
                  <Accordion.Body onEnter={showGroupS22G52} onExited={hideGroupS22G52}>
                    {group5Jsx('g2252',ip2CodeChanged,ii2CodeChanged)}
                    <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                      <Accordion.Item eventKey="36">
                        <Accordion.Header>Экземпляр 3</Accordion.Header>
                        <Accordion.Body onEnter={showGroupS22G53} onExited={hideGroupS22G53}>
                          {group5Jsx('g2253',ip2CodeChanged,ii2CodeChanged)}
                          <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                            <Accordion.Item eventKey="37">
                              <Accordion.Header>Экземпляр 4</Accordion.Header>
                              <Accordion.Body onEnter={showGroupS22G54} onExited={hideGroupS22G54}>
                                {group5Jsx('g2254',ip2CodeChanged,ii2CodeChanged)}
                                <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                                  <Accordion.Item eventKey="38">
                                    <Accordion.Header>Экземпляр 5</Accordion.Header>
                                    <Accordion.Body onEnter={showGroupS22G55} onExited={hideGroupS22G55}>
                                      {group5Jsx('g2255',ip2CodeChanged,ii2CodeChanged)}
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
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey="39">
            <Accordion.Header>Состояние водного объекта (Группа 6)</Accordion.Header>
            <Accordion.Body onEnter={showGroupS22G61} onExited={hideGroupS22G61}>
              {group6Jsx('s22g61',wb2CodeChanged,wbi2CodeChanged)}
              <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                <Accordion.Item eventKey="40">
                  <Accordion.Header>Экземпляр 2</Accordion.Header>
                  <Accordion.Body onEnter={showGroupS22G62} onExited={hideGroupS22G62}>
                    {group6Jsx('s22g62',wb2CodeChanged,wbi2CodeChanged)}
                    <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                      <Accordion.Item eventKey="41">
                        <Accordion.Header>Экземпляр 3</Accordion.Header>
                        <Accordion.Body onEnter={showGroupS22G63} onExited={hideGroupS22G63}>
                          {group6Jsx('s22g63',wb2CodeChanged,wbi2CodeChanged)}
                          <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                            <Accordion.Item eventKey="42">
                              <Accordion.Header>Экземпляр 4</Accordion.Header>
                              <Accordion.Body onEnter={showGroupS22G64} onExited={hideGroupS22G64}>
                                {group6Jsx('s22g64',wb2CodeChanged,wbi2CodeChanged)}
                                <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                                  <Accordion.Item eventKey="43">
                                    <Accordion.Header>Экземпляр 5</Accordion.Header>
                                    <Accordion.Body onEnter={showGroupS22G65} onExited={hideGroupS22G65}>
                                      {group6Jsx('s22g65',wb2CodeChanged,wbi2CodeChanged)}
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
        {formS22Group7}
        {formS22Group0}
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
  const additionSection2 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
    <Accordion.Item eventKey="16">
      <Accordion.Header>Данные за прошедшие сутки (Раздел 2)</Accordion.Header>
      <Accordion.Body onEnter={showSection21} onExited={hideSection21}>
        {dateObservationJsx('section2date1',obsDate21)}
        {waterLevelJsx('group211',waterLevel21)}
        {wlDeviationJsx('group221',wlDeviation21)}
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey="17">
            <Accordion.Header>Температура воды и воздуха (Группа 4)</Accordion.Header>
            <Accordion.Body onEnter={showGroup241} onExited={hideGroup241}>
              {waterTemperatureJsx('wTemp21',waterTemperature21)}
              <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                <Accordion.Item eventKey="18" >
                  <Accordion.Header>Температура воздуха</Accordion.Header>
                  <Accordion.Body onEnter={showAirTemperature21} onExited={hideAirTemperature21}>
                    {airTemperatureJsx('aTemp21',airTemperature21)}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey="19">
            <Accordion.Header>Ледовые явления (Группа 5)</Accordion.Header>
            <Accordion.Body onEnter={showGroupS21G51} onExit={hideGroupS21G51}>
              {group5Jsx('g2151',ip2CodeChanged,ii2CodeChanged)}
              <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                <Accordion.Item eventKey="20" id="accordion-ip2" >
                  <Accordion.Header>Экземпляр 2</Accordion.Header>
                  <Accordion.Body onEnter={showGroupS21G52} onExited={hideGroupS21G52}>
                    {group5Jsx('g2152',ip2CodeChanged,ii2CodeChanged)}
                    <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                      <Accordion.Item eventKey="21">
                        <Accordion.Header>Экземпляр 3</Accordion.Header>
                        <Accordion.Body onEnter={showGroupS21G53} onExited={hideGroupS21G53}>
                          {group5Jsx('g2153',ip2CodeChanged,ii2CodeChanged)}
                          <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                            <Accordion.Item eventKey="22">
                              <Accordion.Header>Экземпляр 4</Accordion.Header>
                              <Accordion.Body onEnter={showGroupS21G54} onExited={hideGroupS21G54}>
                                {group5Jsx('g2154',ip2CodeChanged,ii2CodeChanged)}
                                <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                                  <Accordion.Item eventKey="23">
                                    <Accordion.Header>Экземпляр 5</Accordion.Header>
                                    <Accordion.Body onEnter={showGroupS21G55} onExited={hideGroupS21G55}>
                                      {group5Jsx('g2155',ip2CodeChanged,ii2CodeChanged)}
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
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey="24">
            <Accordion.Header>Состояние водного объекта (Группа 6)</Accordion.Header>
            <Accordion.Body onEnter={showGroupS21G61} onExited={hideGroupS21G61}>
              {group6Jsx('s21g61',wb2CodeChanged,wbi2CodeChanged)}
              <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                <Accordion.Item eventKey="25">
                  <Accordion.Header>Экземпляр 2</Accordion.Header>
                  <Accordion.Body onEnter={showGroupS21G62} onExited={hideGroupS21G62}>
                    {group6Jsx('s21g62',wb2CodeChanged,wbi2CodeChanged)}
                    <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                      <Accordion.Item eventKey="26">
                        <Accordion.Header>Экземпляр 3</Accordion.Header>
                        <Accordion.Body onEnter={showGroupS21G63} onExited={hideGroupS21G63}>
                          {group6Jsx('s21g63',wb2CodeChanged,wbi2CodeChanged)}
                          <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                            <Accordion.Item eventKey="27">
                              <Accordion.Header>Экземпляр 4</Accordion.Header>
                              <Accordion.Body onEnter={showGroupS21G64} onExited={hideGroupS21G64}>
                                {group6Jsx('s21g64',wb2CodeChanged,wbi2CodeChanged)}
                                <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                                  <Accordion.Item eventKey="28">
                                    <Accordion.Header>Экземпляр 5</Accordion.Header>
                                    <Accordion.Body onEnter={showGroupS21G65} onExited={hideGroupS21G65}>
                                      {group6Jsx('s21g65',wb2CodeChanged,wbi2CodeChanged)}
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
        {formGroup27}
        {formGroup20}
        {additionSection22}
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
  //additionsection3
  const showSection31=()=>{
    let newText = telegram
    newText = telegram.slice(0,15)+'2'+telegram.slice(16)
    let startS3 = telegram.indexOf(' 966')>0? telegram.indexOf(' 966') : telegram.length-1
    periods[0] = '01'
    newText = newText.slice(0,startS3)+` 93301`+newText.slice(startS3)
    setTelegram(newText)
  }
  const hideSection31=()=>{
    periods[0]=null
    let newText = telegram
    if(wcWaterLevel===null && waterLevel21===null && waterLevel22===null){
      newText = telegram.slice(0,15)+'1'+telegram.slice(16)
    }
    let startS3 = telegram.indexOf(' 933')
    let startS6 = telegram.indexOf(' 966')
    if(startS3>0){
      newText = newText.slice(0, startS3)+(startS6>0? newText.slice(startS6):'=')
      setTelegram(newText)
    }
    filterKeys(46,50)
  }
  const periodChange=e=>{
    let p = +e.target.value>9? e.target.value : '0'+e.target.value
    let i = +e.target.id[2]-1
    periods[i] = p
    let startS3 = telegram.indexOf(' 933')
    let newText = telegram.slice(0,startS3+4)+p+telegram.slice(startS3+6) 
    setTelegram(newText)
  }
  const s3periodJsx=(id,periodChange)=>{
    return(<Form.Group className='mb-3' controlId='s31'>
      <Form.Label>Выберите период времени</Form.Label>
      <Form.Select id={id} onChange={periodChange} menuPortalTarget={document.body}>
        {Object.keys(periodTime).map(pt => { return <option value={pt}>{periodTime[pt]}</option>})}
      </Form.Select>
    </Form.Group>
  )}
  const waterLevelS3Changed = (e)=>{
    let wl = e.target.value
    if(/^-?[0-9]{1,4}$/.test(wl)){
      wl = +wl>4999 ? 4999 : wl
      wl = +wl<-999 ? -999 : wl
    }else
      wl = 0
    let g1 = +wl >= 0 ? wl.toString().padStart(4,'0') : (5000+Math.abs(+wl)).toString()      
    let newText = telegram
    let i = +e.target.id[3]-1
    let avgMaxMin = e.target.id[2]
    let startS3 = telegram.indexOf(' 933')
    if(avgMaxMin==='1'){
      avgWl[i]=wl
      newText = telegram.slice(0,startS3+8)+g1+telegram.slice(startS3+12)
    }else if(avgMaxMin==='2'){
      maxWl[i]=wl
      let shift = telegram[startS3+7]==='1'? 14:8
      newText = telegram.slice(0,startS3+shift)+g1+telegram.slice(startS3+shift+4)
    } else {
      minWl[i]=wl
      let shift = (telegram[startS3+7]==='1'? 14:8)+(telegram.indexOf(' 2',startS3)>0? 6:0)
      newText = telegram.slice(0,startS3+shift)+g1+telegram.slice(startS3+shift+4)
    }
    setTelegram(newText)
  }
  const waterLevelS3Jsx = (id, wl)=>{
    return (<Form.Group className="mb-3" >
      <Form.Control id={id} type="number" value={wl} onChange={waterLevelS3Changed} min="-999" max="4999" pattern="^-?[0-9]{1,4}$"/>
    </Form.Group>)
  }
  const showSection31g1=()=>{
    let startS3 = telegram.indexOf(' 933')
    avgWl[0]=0
    let newText = telegram.slice(0,startS3+6)+' 10000'+telegram.slice(startS3+6)
    setTelegram(newText)
  }
  const hideSection31g1=()=>{
    let startS3 = telegram.indexOf(' 933')
    avgWl[0]=null
    let newText = startS3>0? telegram.slice(0,startS3+6)+telegram.slice(startS3+12): telegram
    setTelegram(newText)
  }
  const showSection31g2=()=>{
    let startS3 = telegram.indexOf(' 933')
    maxWl[0]=0
    let shift = telegram[startS3+7]==='1'? 12:6
    let newText = telegram.slice(0,startS3+shift)+' 20000'+telegram.slice(startS3+shift)
    setTelegram(newText)
  }
  const hideSection31g2=()=>{
    let startS3 = telegram.indexOf(' 933')
    let startG2 = telegram.indexOf(' 2',startS3)
    maxWl[0]=null
    let newText = startS3>0? telegram.slice(0,startG2)+telegram.slice(startG2+6): telegram
    setTelegram(newText)
    filterKeys(48,49)
    // alert(newText+'===hg2====')
  }
  const showSection31g3=()=>{
    let startS3 = telegram.indexOf(' 933')
    minWl[0]=0
    let shift = (telegram[startS3+7]==='1'? 12:6)+(telegram.indexOf(' 2',startS3)>0? 6:0)
    let newText = telegram.slice(0,startS3+shift)+' 30000'+telegram.slice(startS3+shift)
    setTelegram(newText)
  }
  const hideSection31g3=()=>{
    let startS3 = telegram.indexOf(' 933')
    let startG3 = telegram.indexOf(' 3',startS3)
    minWl[0]=null
    let newText = startS3>0? telegram.slice(0,startG3)+telegram.slice(startG3+6): telegram
    setTelegram(newText)
  }

  // const waterConsumptionS3Changed=e=>{
  //   let startS3 = telegram.indexOf(' 933')
  //   let newText = telegram
  //   let i = +e.target.id[3]-1
  //   let avgMaxMin = e.target.id[2]
  //   if(/^[0-9]+([.,][0-9]+)?$/.test(e.target.value)){
  //     let wc = +e.target.value
  //     wc = wc>999999.0? 999999.0 : wc
  //     wc = wc<0.0? 0.0 : wc
  //     let exp = wc.toExponential()
  //     exp = Number(exp.slice(exp.lastIndexOf('e')+1))
  //     let num = exp >=0? exp+1 : 0
  //     let pointPos = e.target.value.lastIndexOf('.')<0? 0:e.target.value.lastIndexOf('.')
  //     let val = wc<1.? e.target.value.slice(pointPos+1,pointPos+4).padEnd(3,'0') : Number(e.target.value.replace('.','')).toString().padEnd(3,'0').slice(0,3)
      // if(avgMaxMin==='1'){
      //   avgWc[i]=parseFloat(wc)
      //   let startG4 = telegram.indexOf(' 4',startS3)
      //   newText = telegram.slice(0,startG4+2)+`${num}${val}`+telegram.slice(startG4+6)
      // }else if(avgMaxMin==='2'){
      //   maxWc[i]=wc
      //   let startG5 = telegram.indexOf(' 5',startS3)
      //   newText = telegram.slice(0,startG5+2)+`${num}${val}`+telegram.slice(startG5+6)
      // } else {
      //   minWc[i]=wc
      //   let startG6 = telegram.indexOf(' 6',startS3)
      //   newText = telegram.slice(0,startG6+2)+`${num}${val}`+telegram.slice(startG6+6)
      // }
      // newText = telegram.slice(0,startSection6+14)+`${num}${val}`+telegram.slice(startSection6+18)
      // setTelegram(newText) //+`>>${e.target.value}<<`)
      //}else{
      // avgWc[i]=0
      // newText = telegram.slice(0,startS3+14)+`0000`+telegram.slice(startS3+18)
      // setTelegram(newText)
    // }
    // setTelegram(newText)
  // }
  // const waterConsumptionS3Jsx = (id, wc)=>{
  //   return <Form.Group className="mb-3" >
  //     <Form.Control id={id} type="number" value={wc} onChange={waterConsumptionS3Changed} step="any" pattern="^[0-9]+([.,][0-9]+)?$"/>
  //   </Form.Group>
  // }
  // const showSection31g4=()=>{
  //   let startS3 = telegram.indexOf(' 933')
  //   avgWc[0]=0
  //   let startG4 = startS3+(telegram[startS3+7]==='1'? 12:6)+(telegram.indexOf(' 2',startS3)>0? 6:0)+(telegram.indexOf(' 3',startS3)>0? 6:0)
  //   let newText = telegram.slice(0,startG4)+' 40000'+telegram.slice(startG4)
  //   setTelegram(newText)
  // }
  // const hideSection31g4=()=>{
  //   let startS3 = telegram.indexOf(' 933')
  //   let startG4 = telegram.indexOf(' 4',startS3)
  //   avgWc[0]=null
  //   let newText = telegram.slice(0,startG4)+telegram.slice(startG4+6)
  //   setTelegram(newText)
  // }
  // const showSection31g5=()=>{
  //   let startS3 = telegram.indexOf(' 933')
  //   maxWc[0]=0
  //   let startG5 = startS3+(telegram[startS3+7]==='1'? 12:6)+
  //     (telegram.indexOf(' 2',startS3)>0? 6:0)+
  //     (telegram.indexOf(' 3',startS3)>0? 6:0)+
  //     (telegram.indexOf(' 4',startS3)>0? 6:0)
  //   let newText = telegram.slice(0,startG5)+' 50000'+telegram.slice(startG5)
  //   setTelegram(newText)
  // }
  // const hideSection31g5=()=>{
  //   let startS3 = telegram.indexOf(' 933')
  //   let startG5 = telegram.indexOf(' 5',startS3)
  //   maxWc[0]=null
  //   let newText = telegram.slice(0,startG5)+telegram.slice(startG5+6)
  //   setTelegram(newText)
  // }
  // const showSection31g6=()=>{
  //   let startS3 = telegram.indexOf(' 933')
  //   minWc[0]=0
  //   let startG6 = startS3+(telegram[startS3+7]==='1'? 12:6)+
  //     (telegram.indexOf(' 2',startS3)>0? 6:0)+
  //     (telegram.indexOf(' 3',startS3)>0? 6:0)+
  //     (telegram.indexOf(' 4',startS3)>0? 6:0)+
  //     (telegram.indexOf(' 5',startS3)>0? 6:0)
  //   let newText = telegram.slice(0,startG6)+' 60000'+telegram.slice(startG6)
  //   setTelegram(newText)
  // }
  // const hideSection31g6=()=>{
  //   let startS3 = telegram.indexOf(' 933')
  //   let startG6 = telegram.indexOf(' 6',startS3)
  //   minWc[0]=null
  //   let newText = telegram.slice(0,startG6)+telegram.slice(startG6+6)
  //   setTelegram(newText)
  // }
  const showMaxLevelMoment=()=>{
    setMaxLevelDate(today.toISOString().slice(0,10))
    setMaxLevelHour(9)
    let startG7 = telegram.indexOf(' 966')>0? telegram.indexOf(' 966') : telegram.length-1
    let newText = telegram.slice(0,startG7)+` 7${currDay}09`+telegram.slice(startG7)
    setTelegram(newText)
  }
  const hideMaxLevelMoment=()=>{
    setMaxLevelDate(null)
    setMaxLevelHour(null)
    let startG7=telegram.indexOf(' 7',telegram.indexOf(' 933'))
    let newText = startG7>0? telegram.slice(0,startG7)+telegram.slice(startG7+6): telegram
    // if(startG7>-1){
    //   newText = telegram.slice(0,startG7)+telegram.slice(startG7+6)
      // alert(newText+'++++hg7+++++')
    // }
    setTelegram(newText)
  }
  const additionSection31 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
    <Accordion.Item eventKey='46'>
      <Accordion.Header>Данные о средних и экстремальных значениях уровня воды (Раздел 3)</Accordion.Header>
      <Accordion.Body onEnter={showSection31} onExit={hideSection31}>
        {s3periodJsx('ex1',periodChange)}
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey='47'>
            <Accordion.Header>Средний уровень воды за период в сантиметрах (Группа 1)</Accordion.Header>
            <Accordion.Body onEnter={showSection31g1} onExit={hideSection31g1}>
              {waterLevelS3Jsx('wl11',avgWl[0])}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey='48'>
            <Accordion.Header>Высший уровень воды за период в сантиметрах (Группа 2)</Accordion.Header>
            <Accordion.Body onEnter={showSection31g2} onExit={hideSection31g2}>
              {waterLevelS3Jsx('wl21',maxWl[0])}
              <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                <Accordion.Item eventKey="49">
                  <Accordion.Header>Время прохождения наивысшего уровня воды (Группа 7)</Accordion.Header>
                  <Accordion.Body onEnter={showMaxLevelMoment} onExited={hideMaxLevelMoment}>
                    {dateObservationJsx('max-level-date',maxLevelDate)}
                    <Form.Group className="mb-3" >
                      <Form.Label>Час (время местное)</Form.Label>
                      <Form.Control id='max-level-hour' type="number" value={maxLevelHour} onChange={wcHourChanged} min='0' max='23' pattern='[012][0-9]' />
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey='50'>
            <Accordion.Header>Низший уровень воды за период в сантиметрах (Группа 3)</Accordion.Header>
            <Accordion.Body onEnter={showSection31g3} onExit={hideSection31g3}>
              {waterLevelS3Jsx('wl31',minWl[0])}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {/* <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey='50'>
            <Accordion.Header>Средний расход воды за период (Группа 4)</Accordion.Header>
            <Accordion.Body onEnter={showSection31g4} onExit={hideSection31g4}>
              {waterConsumptionS3Jsx('wс11',avgWc[0])}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey='51'>
            <Accordion.Header>Наибольший расход воды за период (Группа 5)</Accordion.Header>
            <Accordion.Body onEnter={showSection31g5} onExit={hideSection31g5}>
              {waterConsumptionS3Jsx('wс21',maxWc[0])}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
          <Accordion.Item eventKey='52'>
            <Accordion.Header>Наименьший расход воды за период (Группа 6)</Accordion.Header>
            <Accordion.Body onEnter={showSection31g6} onExit={hideSection31g6}>
              {waterConsumptionS3Jsx('wс31',minWc[0])}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion> */}
        
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
  const additionSection6 = <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
    <Accordion.Item eventKey="14">
      <Accordion.Header>Расход воды (Раздел 6)</Accordion.Header>
      <Accordion.Body onEnter={showSection6} onExited={hideSection6}>
        {dateObservationJsx('section6date',wcDate)}
        <Form.Group className="mb-3" controlId="form-observed-hour">
          <Form.Label>Час измерения расхода воды</Form.Label>
          <Form.Control type="number" value={wcHour} onChange={wcHourChanged} min='0' max='23' pattern='[012][0-9]' />
        </Form.Group>
        {waterLevelJsx('group61',wcWaterLevel)}
        <Form.Group className="mb-3" controlId="form-water-consumption">
          <Form.Label>Расход воды м<sup>3</sup>/с (Группа 2)</Form.Label>
          <Form.Control type="number" value={waterConsumption} onChange={waterConsumptionChanged} step="any" pattern="^[0-9]+([.,][0-9]+)?$"/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="form-river-cross-sectional-area">
          <Form.Label>Площадь сечения реки м<sup>2</sup> (Группа 3)</Form.Label>
          <Form.Control type="number" value={riverArea} onChange={riverAreaChanged} pattern="^[0-9]+([.,][0-9]+)?$" step="any"/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="form-max-depth">
          <Form.Label>Максимальная глубина в сантиметрах (Группа 4)</Form.Label>
          <Form.Control type="number" value={maxDepth} onChange={maxDepthChanged} min="1" max="9999" pattern='[0-9]{1,4}'/>
        </Form.Group>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
  const telegramCard = <div class="fixed-top">
  <Card
    bg='info'
    text={'black'}
    style={{ position: 'fixed', width: '380px', top: '60px',left: '10px'}}
    className="mb-2">
    <Card.Body>
      {/* <Card.Title>Текст телеграммы</Card.Title> */}
      <Card.Text>
        {telegram}
      </Card.Text>
    </Card.Body>
  </Card>
  </div>
  const myForm =
    <Form onSubmit={handleSubmit(onSubmit)} onReset={reset}> 
      <Form.Label>Раздел 1</Form.Label>
      {waterLevelJsx('group11',waterLevel)}
      {wlDeviationJsx('group12',waterLevelDeviation)}
      <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect} >
        <Accordion.Item eventKey="15">
          <Accordion.Header>Температура воды и воздуха (Группа 4)</Accordion.Header>
          <Accordion.Body onEnter={showGroup14} onExited={hideGroup14}>
            {waterTemperatureJsx('wTemp1',waterTemperature)}
            <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
              <Accordion.Item eventKey="1" >
                <Accordion.Header>Температура воздуха</Accordion.Header>
                <Accordion.Body onEnter={showAirTemperature} onExited={hideAirTemperature}>
                  {airTemperatureJsx('aTemp1',airTemperature)}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Ледовые явления (Группа 5)</Accordion.Header>
          <Accordion.Body onEnter={showGroup15} onExited={hideGroup15}>
            {group5Jsx('g151',ip1CodeChanged,ii1CodeChanged)}
            <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
              <Accordion.Item eventKey="3" id="accordion-ip2" >
                <Accordion.Header>Экземпляр 2</Accordion.Header>
                <Accordion.Body onEnter={showGroup152} onExited={hideGroup152}>
                  {group5Jsx('g152',ip1CodeChanged,ii1CodeChanged)}
                  <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                    <Accordion.Item eventKey="4">
                      <Accordion.Header>Экземпляр 3</Accordion.Header>
                      <Accordion.Body onEnter={showGroup153} onExited={hideGroup153}>
                        {group5Jsx('g153',ip1CodeChanged,ii1CodeChanged)}
                        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                          <Accordion.Item eventKey="5">
                            <Accordion.Header>Экземпляр 4</Accordion.Header>
                            <Accordion.Body onEnter={showGroup154} onExited={hideGroup154}>
                              {group5Jsx('g154',ip1CodeChanged,ii1CodeChanged)}
                              <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                                <Accordion.Item eventKey="6">
                                  <Accordion.Header>Экземпляр 5</Accordion.Header>
                                  <Accordion.Body onEnter={showGroup155} onExited={hideGroup155}>
                                    {group5Jsx('g155',ip1CodeChanged,ii1CodeChanged)}
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
      <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
        <Accordion.Item eventKey="7">
          <Accordion.Header>Состояние водного объекта (Группа 6)</Accordion.Header>
          <Accordion.Body onEnter={showGroup16} onExited={hideGroup16}>
            {group6Jsx('g161',wb1CodeChanged,wbi1CodeChanged)}
            <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
              <Accordion.Item eventKey="8">
                <Accordion.Header>Экземпляр 2</Accordion.Header>
                <Accordion.Body onEnter={showGroup162} onExited={hideGroup162}>
                  {group6Jsx('g162',wb1CodeChanged,wbi1CodeChanged)}
                  <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                    <Accordion.Item eventKey="9">
                      <Accordion.Header>Экземпляр 3</Accordion.Header>
                      <Accordion.Body onEnter={showGroup163} onExited={hideGroup163}>
                        {group6Jsx('g163',wb1CodeChanged,wbi1CodeChanged)}
                        <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                          <Accordion.Item eventKey="10">
                            <Accordion.Header>Экземпляр 4</Accordion.Header>
                            <Accordion.Body onEnter={showGroup164} onExited={hideGroup164}>
                              {group6Jsx('g164',wb1CodeChanged,wbi1CodeChanged)}
                              <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
                                <Accordion.Item eventKey="11">
                                  <Accordion.Header>Экземпляр 5</Accordion.Header>
                                  <Accordion.Body onEnter={showGroup165} onExited={hideGroup165}>
                                    {group6Jsx('g165',wb1CodeChanged,wbi1CodeChanged)}
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
      <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
        <Accordion.Item eventKey="12">
          <Accordion.Header>Осадки (Группа 0)</Accordion.Header>
          <Accordion.Body onEnter={showGroup10} onExited={hideGroup10}>
            {precipitationJsx('s1g0',precipitation)}
            {pDurationJsx('s1g0',durationPrecipitation)}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {additionSection2}
      {additionSection31}
      {additionSection6}
      <Button variant="primary" type="submit">
        Сохранить
      </Button>
    </Form>

  let content
  content = <div>
    {telegramCard}
    <p>{telegram}</p>
    {myForm}
  </div>
  if(showResponse && isSuccess && response.response){ // .failed_count==="0") && (response.response.success_count !== '0')){
    let csdnSection1 = response.response.response.failed_count==='0'? 'В ЦСДН сохранены данные.':'Ошибка при сохранении данных.'
    // let csdnSection6 = !!(response.response.response_water_consumption && (response.response.response_water_consumption.failed_count==='0'))?'В ЦСДН сохранены данные раздела 6':'Ошибка при сохранении данных раздела 6'
    let localDB = response.response.message ? `${response.response.message}` : ''
    // setTelegram(`HHZZ ${postCode} ${currDay}081 10000 20000=`)
    alert(`${csdnSection1} ${localDB}`)
    
    showResponse = false
  // }else{
    // console.log("Не удалось сохранить данные")
    // alert("Не удалось сохранить данные")
    // showResponse = false
  }
  return (
    <section>
      <h2>Ввод гидротелеграмм</h2>
      {content}
    </section>
  )
}