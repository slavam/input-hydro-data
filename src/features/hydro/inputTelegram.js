import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { useSaveHydroDataQuery } from '../api/apiSlice'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import { icePhenomena, waterBodies } from '../../components/dictionaries'

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
let showResponse = false

export const InputHydroTelegram = ({postCode})=>{
  
  const [hydroData, setHydroData] = useState(null)
  const {
    data: response = {},
    isSuccess,
  } = useSaveHydroDataQuery(hydroData)
  const hydroPostCode = postCode //'99999' //process.env.REACT_APP_CODE_83028
  
  const [term, setTerm] = useState('08')
  const [contentIndex, setContentIndex] = useState('1')
  let today = new Date()
  let currYear = today.getFullYear()
  let currMonth = today.getMonth()
  let lastDay = 32 - new Date(currYear, currMonth, 32).getDate()
  let d = today.getUTCDate()
  let currDay = d>9 ? d : ('0'+d)
  
  const [waterLevel, setWaterLevel] = useState(0)
  const [waterLevel21, setWaterLevel21] = useState(null)
  const [waterLevelDeviation, setWaterLevelDeviation] = useState(0)
  const [wlDeviation21, setWLDeviation21]=useState(0)
  const [waterTemperature, setWaterTemperature] = useState(0)
  const [waterTemperature21, setWaterTemperature21] = useState(0)
  const [airTemperature, setAirTemperature] = useState(null)
  const [airTemperature21, setAirTemperature21] = useState(null)
  const [telegram, setTelegram] = useState(`HHZZ ${hydroPostCode} ${currDay}${term}${contentIndex} 10000 20000=`)
  
  const waterLevelJsx = (id, wl)=>{
    return (<Form.Group className="mb-3" >
      <Form.Label>Уровень воды над нулем поста (Группа 1)</Form.Label>
      <Form.Control id={id} type="number" value={wl} onChange={waterLevelChanged} min="-999" max="4999" pattern="^-?[0-9]{1,4}$"/>
      <Form.Text className="text-muted">В сантиметрах</Form.Text>
    </Form.Group>)
  }
  const waterLevelChanged = (e)=>{
    let wl = e.target.value
    if(/^-?[0-9]{1,4}$/.test(wl)){
      wl = +wl>4999 ? 4999 : wl
      wl = +wl<-999 ? -999 : wl
    }else
      wl = 0
    let g1 = +wl >= 0 ? wl.toString().padStart(4,'0') : (5000+Math.abs(+wl)).toString()      
    let newText
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
      default:
        break;
    }
    setTelegram(newText)
  }
  const wlDeviationJsx=(id,wld)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Изменение уровня воды (Группа 2)</Form.Label>
      <Form.Control id={id} type="number" value={wld} onChange={waterLevelDeviationChanged} min="-999" max="999" pattern="^-?[0-9]{1,3}$"/>
      <Form.Text className="text-muted">В сантиметрах</Form.Text>
    </Form.Group>)
  }
  const waterLevelDeviationChanged = (e)=>{
    let wld = e.target.value 
    if(!/^-?[0-9]{1,3}$/.test(e.target.value))
      wld = '0'
    let g2 = +wld === 0 ? '0000' : (+wld>0 ? (wld.toString().padStart(3,'0')+'1') : (Math.abs(+wld).toString().padStart(3,'0')+'2'))
    let newText
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
      default:
        break;
    }
    setTelegram(newText)
  }
  const waterTemperatureJsx=(id,wt)=>{
    return (<Form.Group className="mb-3" controlId="formWaterTemperature">
      <Form.Label>Температура воды</Form.Label>
      <Form.Control id={id} type="number" value={wt} onChange={waterTemperatureChanged} min="0.0" max="9.9" step="0.1" pattern='^[0-9]$|(^[0-9][.,][0-9]?$)'/>
      <Form.Text className="text-muted">С точностью до десятых</Form.Text>
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
    }
    setTelegram(newText)
  }
  const airTemperatureJsx=(id,aTemp)=>{
    return(<Form.Group className="mb-3" >
      <Form.Control id={id} type="number" value={aTemp} onChange={airTemperatureChanged} min="-49" max="49" pattern="^-?[0-9]$|^-?[0-4][0-9]$"/>
    </Form.Group>)
  }
  const airTemperatureChanged=(e)=>{
    let at = e.target.value
    if(/^-?[0-9]$|^-?[0-4][0-9]$/.test(at)){
      at = +at>49 ? 49 : at
      at = +at<-49 ? -49 : at
    }else{
      at=0
    }
    let newText
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
      default:
        break;
    }
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
  const newG5 = k=>{
    let start151 = telegram.indexOf(' 5')
    let allG5 = combineG5()
    return telegram.slice(0,start151)+allG5+telegram.slice(start151+allG5.length+k*6)
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
    ipChar[0] = ipAddon[0] = null
    let newText = telegram.replace(/ 5..../g,'')
    setTelegram(newText)
  }
  const group5Jsx=(id,ipChange,iiChange)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Выберите характеристику явления</Form.Label>
      <Form.Select id={id+'ip'} onChange={ipChange} menuPortalTarget={document.body}>
        {Object.keys(icePhenomena).map(ip => {if(+ip>10) return <option value={ip}>{icePhenomena[ip]}</option>})}
      </Form.Select>
      <Form.Label>Выберите характеристику или интенсивность явления</Form.Label>
      <Form.Select id={id+'ipi'} onChange={iiChange}>
        {Object.keys(icePhenomena).map(ip => <option value={ip}>{icePhenomena[ip]}</option>)}
      </Form.Select>
    </Form.Group>)
  }
  const ip1CodeChanged = e=>{
    let ip = e.target.value
    switch (e.target.id) {
      case 'g151ip':
        ipChar[0] = ip
        setIp1(ip)
        break;
      case 'g152ip':
        setIp2(ip)
        ipChar[1] = ip
        break;
      case 'g153ip':
        ipChar[2] = ip
        setIp3(ip)
        break;
      case 'g154ip':
        ipChar[3] = ip
        setIp4(ip)
        break;
      case 'g155ip':
        ipChar[4] = ip
        setIp5(ip)
        break;
    }
    setTelegram(newG5(0))
  }
  const ii1CodeChanged = e=>{
    let ii = +e.target.value>9? e.target.value : '0'+e.target.value
    switch (e.target.id) {
      case 'g151ipi':
        setIi1(ii)
        ipAddon[0] = ii    
        break;
      case 'g152ipi':
        setIi2(ii)
        ipAddon[1] = ii    
        break;
      case 'g153ipi':
        setIi3(ii)
        ipAddon[2] = ii    
        break;
      case 'g154ipi':
        setIi4(ii)
        ipAddon[3] = ii    
        break;
      case 'g155ipi':
        setIi5(ii)
        ipAddon[4] = ii    
        break;
    }
    setTelegram(newG5(0))
  }
  const showGroup152=()=>{
    ipChar[1] = 11
    ipAddon[1] = '01'
    setIp2(11)
    setIi2(1)
    setTelegram(newG5(-1))
  }
  const hideGroup152=()=>{
    ipChar[1] = ipAddon[1] = null
    setIp2(11)
    setIi2(1)
    setTelegram(newG5(1))
  }
  
  const showGroup153=()=>{
    ipChar[2] = 11
    ipAddon[2] = '01'
    setIp3(11)
    setIi3(1)
    setTelegram(newG5(-1))
  }
  const hideGroup153=()=>{
    ipChar[2] = ipAddon[2] = null
    setIp3(11)
    setIi3(1)
    setTelegram(newG5(1))
  }
  
  const showGroup154=()=>{
    ipChar[3] = 11
    ipAddon[3] = '01'
    setIp4(11)
    setIi4(1)
    setTelegram(newG5(-1))
  }
  const hideGroup154=()=>{
    ipChar[3] = ipAddon[3] = null
    setIp4(11)
    setIi4(1)
    setTelegram(newG5(1))
  }
  
  const showGroup155=()=>{
    ipChar[4] = 11
    ipAddon[4] = '01'
    setIp5(11)
    setIi5(1)
    setTelegram(newG5(-1))
  }
  const hideGroup155=()=>{
    ipChar[4] = ipAddon[4] = null
    setIp5(11)
    setIi5(1)
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
    return telegram.slice(0,start16)+allG6+telegram.slice(start16+allG6.length+k*6)
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
    let newText = telegram.replace(/ 6..../g,'')
    setTelegram(newText)
  }
  const group6Jsx = (id,wbChange,wbiChange)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Выберите характеристику объекта</Form.Label>
      <Form.Select id={id+'wb'} onChange={wbChange} >
        {Object.keys(waterBodies).map(wb => {if(+wb===0 || +wb>10) return <option value={wb}>{waterBodies[wb]}</option>})}
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
  }
  const showGroup163=()=>{
    wbChar[2]=wbAddon[2] = '00'
    setTelegram(changeG6(-1)) //'show'))
  }
  const hideGroup163=()=>{
    wbChar[2]=wbAddon[2] = null
    setTelegram(changeG6(1)) //'hide'))
  }
  const showGroup164=()=>{
    wbChar[3]=wbAddon[3]='00'
    setTelegram(changeG6(-1)) //'show'))
  }
  const hideGroup164=()=>{
    wbChar[3]=ipAddon[3]= null
    setTelegram(changeG6(1)) //'hide'))
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
    setWaterLevel(0)
    setWaterLevelDeviation(0)
    setContentIndex(1)
    setActiveKeys([])
    setTelegram(`HHZZ ${hydroPostCode} ${currDay}${term}${contentIndex} 10000 20000=`)
  }
  const section2submit=(j,obsDate,wl,wld,waterTemp,airTemp,ipChar2,ipAddon2,wbChar2,wbAddon2,iceThickness,snowThickness,precipitation,pDuration)=>{
    let ret = {}
    ret["obsDate2"+j]=obsDate
    ret['waterLevel2'+j]=wl
    ret['wlDeviation2'+j]=wld
    if(waterTemp)
      ret['waterTemp2'+j]=waterTemp
    if(airTemp)
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
    if(waterLevel21){
      let s2 = section2submit(1,obsDate21,waterLevel21,wlDeviation21,waterTemperature21,
        airTemperature21,ipCharS2[0],ipAddonS2[0],wbCharS2[0],wbAddonS2[0],iceThickness,snowThickness,precipitation21,pDuration21)
      hydroData = {...hydroData, ...s2}
      // alert(JSON.stringify(hydroData).replace(/\\/g,""))
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
        let startS2 = telegram.indexOf(' 922')
        let start27 = telegram.indexOf(' 7',startS2)
        newText = telegram.slice(0,start27+2)+`${(+it).toString().padStart(3, "0")}`+telegram.slice(start27+5)
      default:
        break;
    }
    setTelegram(newText)
  }
  const group7SnowJsx=(id,snowT)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Высота снежного покрова</Form.Label>
      <Form.Control id={id} type="number" value={snowT} onChange={snowThicknessChanged} min="0" max="9" pattern='[0-9]'/>
      <Form.Text className="text-muted">Цифра кода</Form.Text>
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
        let startS2 = telegram.indexOf(' 922')
        let start27 = telegram.indexOf(' 7',startS2)
        newText = telegram.slice(0,start27+5)+(+st).toString()+telegram.slice(start27+6)
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
      <Form.Label>Количество осадков</Form.Label>
      <Form.Control id={id} type="number" value={precipitation} onChange={precipitationChanged} min="0" max="999" pattern='[0-9]{1,3}'/>
      <Form.Text className="text-muted">Цифры кода</Form.Text>
    </Form.Group>
    )
  }
  const pDurationJsx=(id,durationPrecipitation)=>{
    return(<Form.Group className="mb-3" >
      <Form.Label>Продолжительность выпадения осадков</Form.Label>
      <Form.Control id={id} type="number" value={durationPrecipitation} onChange={durationPrecipitationChanged} min="0" max="4"  pattern='^0?[0-4]$'/>
      <Form.Text className="text-muted">Цифра кода</Form.Text>
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
  const [wcHour, setWcHour] = useState(9)
  const [wcWaterLevel, setWcWaterLevel] = useState(null)
  const [waterConsumption, setWaterConsumption] = useState(null)
  const [riverArea, setRiverArea] = useState(null)
  const [maxDepth, setMaxDepth] = useState(null)
  const showSection6=()=>{
    setContentIndex(2)
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
    if(waterLevel21===null){
      setContentIndex(1)
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
    let newText
    switch (e.target.id) {
      case 'section6date':
        setWcDate(od)
        wcMonth = od.slice(5,7)
        wcDay = od.slice(8,10)
        newText = telegram.replace(/ 966../g, ` 966${wcMonth}`).replace(/ 5....=/,` 5${wcDay}${wcHour.toString().padStart(2,'0')}=`)
        break;
      case 'section2date1':
        setObsDate21(od)
        newText = telegram.replace(/ 922../g, ` 922${od.slice(8,10)}`)
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
    setWcHour(wch)
    let newText = telegram.slice(0,-3)+wch.toString().padStart(2,'0')+'='
    setTelegram(newText)
  }
  const waterConsumptionChanged=e=>{
    if(/[0-9]+([.,][0-9]+)?/.test(e.target.value)){
      let wc = +e.target.value
      wc = wc>999999.0? 999999.0 : wc
      wc = wc<0.0? 0.0 : wc
      setWaterConsumption(parseFloat(wc))
      let exp = wc.toExponential()
      exp = Number(exp.slice(exp.lastIndexOf('e')+1))
      let num = exp >=0? exp+1 : 0
      let pointPos = e.target.value.lastIndexOf('.')<0? 0:e.target.value.lastIndexOf('.')
      let val = wc<1.? e.target.value.slice(pointPos+1,pointPos+4).padEnd(3,'0') : Number(e.target.value.replace('.','').padEnd(3,'0')).toString().slice(0,3) //padStart(3,'0').slice(0,3) 
      let startSection6 = telegram.indexOf(' 966')
      let newText = telegram.slice(0,startSection6+14)+`${num}${val}`+telegram.slice(startSection6+18)
      setTelegram(newText) //+`>>${e.target.value}<<`)
    }else{setWaterConsumption(0)}
  }
  const riverAreaChanged=e=>{
    if(/[0-9]+([.,][0-9]+)?/.test(e.target.value)){
      let ra = +e.target.value
      ra = ra>999999.0? 999999.0 : ra
      ra = ra<0.0? 0.0 : ra
      setRiverArea(parseFloat(ra))
      let exp = ra.toExponential()
      exp = Number(exp.slice(exp.lastIndexOf('e')+1))
      let num = exp >=0? exp+1 : 0
      let pointPos = e.target.value.lastIndexOf('.')
      let val = ra<1.? e.target.value.slice(pointPos+1,pointPos+4).padEnd(3,'0') : Number(e.target.value.replace('.','').padEnd(3,'0')).toString().slice(0,3)
      let startSection6 = telegram.indexOf(' 966')
      let newText = telegram.slice(0,startSection6+20)+`${num}${val}`+telegram.slice(startSection6+24)
      setTelegram(newText)
    }else{setRiverArea(parseFloat(1))}
  }
  const maxDepthChanged=e=>{
    if(/^[0-9]{1,4}$/.test(e.target.value)){
      let md = +e.target.value
      setMaxDepth(md)
      let l = telegram.length
      let newText = telegram.slice(0,l-11)+md.toString().padStart(4,'0')+telegram.slice(l-7)
      setTelegram(newText)
    }else setMaxDepth(1)
  }
  // section2
  const showSection21=()=>{
    setContentIndex(2)
    setWaterLevel21(0)
    setWLDeviation21(0.0)
    let startSection6 = telegram.indexOf(' 966')
    let startSection21 = startSection6>=0? startSection6 : telegram.length-1
    let newText = telegram.slice(0,15)+'2'+telegram.slice(16)
    let obsDay = obsDate21.slice(8,10)
    newText =newText.slice(0,startSection21)+` 922${obsDay} 10000 20000`+telegram.slice(startSection21)
    setTelegram(newText)
  }
  const hideSection21=()=>{
    setWaterLevel21(null)
    setWLDeviation21(null)
    let startSection2 = telegram.indexOf(' 922')
    let stopSection2 = telegram.indexOf(' 966')>=0? telegram.indexOf(' 966') : telegram.length-1
    let newText = telegram
    if(wcWaterLevel===null){
      setContentIndex(1)
      newText = telegram.slice(0,15)+'1'+telegram.slice(16)
    }
    newText = newText.slice(0,startSection2)+telegram.slice(stopSection2)
    setTelegram(newText)
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
    let newText = telegram.slice(0,startSection2+18)+telegram.slice(startSection2+24)
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
  
  const combineS2G5=(j)=>{
    let ret = ''
    for (let i = 0; i < ipCharS2[j].length; i++){
      ret += ipCharS2[j][i]===null? '':` 5${ipCharS2[j][i]}${ipAddonS2[j][i]}`
    }
    return ret
  }
  const newS2G5 =(j,k)=>{
    let startS2=telegram.indexOf(' 922')
    let startS2G5 = startS2+(telegram[startS2+19]==='4'? 18+6 : 18)
    let allG5 = combineS2G5(j)
    return telegram.slice(0,startS2G5)+allG5+telegram.slice(startS2G5+allG5.length+k*6)
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
  const hideGroupS2G5=(j,i)=>{
    ipCharS2[j][i] = ipAddonS2[j][i] = null
    setTelegram(newS2G5(j,1))
  }
  const hideGroupS21G51=()=>{
    hideGroupS2G5(0,0)
  }
  const hideGroupS21G52=()=>{
    hideGroupS2G5(0,1)
  }
  const hideGroupS21G53=()=>{
    hideGroupS2G5(0,2)
  }
  const hideGroupS21G54=()=>{
    hideGroupS2G5(0,3)
  }
  const hideGroupS21G55=()=>{
    hideGroupS2G5(0,4)
  }
  const ip2CodeChanged = e=>{
    let ip = e.target.value
    switch (e.target.id) {
      case 'g2151ip':
        ipCharS2[0][0] = ip
        break;
      case 'g2152ip':
        ipCharS2[0][1] = ip
        break
      case 'g2153ip':
        ipCharS2[0][2] = ip
        break
      case 'g2154ip':
        ipCharS2[0][3] = ip
        break
      case 'g2155ip':
        ipCharS2[0][4] = ip
        break
    }
    setTelegram(newS2G5(0,0))
  }
  const ii2CodeChanged = e=>{
    let ii = +e.target.value<10? '0'+e.target.value : e.target.value
    switch (e.target.id) {
      case 'g2151ii':
        ipAddonS2[0][0] = ii
        break;
      case 'g2152ii':
        ipAddonS2[0][1] = ii
        break
      case 'g2153ii':
        ipAddonS2[0][2] = ii
        break
      case 'g2154ii':
        ipAddonS2[0][3] = ii
        break
      case 'g2155ii':
        ipAddonS2[0][4] = ii
        break
    }
    setTelegram(newS2G5(0,0))
  }
  const combineS2G6=(j)=>{
    let ret = ''
    for (let i = 0; i < wbCharS2[j].length; i++){
      ret += wbCharS2[j][i]===null? '':` 6${wbCharS2[j][i]}${wbAddonS2[j][i]}`
    }
    return ret
  }
  const newS2G6 =(j,k)=>{
    let startS2=telegram.indexOf(' 922')
    let startS2G6 = telegram.indexOf(" 6", startS2)
    let allG6 = combineS2G6(j)
    return telegram.slice(0,startS2G6)+allG6+telegram.slice(startS2G6+allG6.length+k*6)
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
  const hideGroupS2G6=(j,i)=>{
    wbCharS2[j][i] = wbAddonS2[j][i] = null
    setTelegram(newS2G6(j,1))
  }
  const hideGroupS21G61=()=>{
    hideGroupS2G6(0,0)
  }
  const hideGroupS21G62=()=>{
    hideGroupS2G6(0,1)
  }
  const hideGroupS21G63=()=>{
    hideGroupS2G6(0,2)
  }
  const hideGroupS21G64=()=>{
    hideGroupS2G6(0,3)
  }
  const hideGroupS21G65=()=>{
    hideGroupS2G6(0,4)
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
                    <Accordion>
                      <Accordion.Item eventKey="21">
                        <Accordion.Header>Экземпляр 3</Accordion.Header>
                        <Accordion.Body onEnter={showGroupS21G53} onExited={hideGroupS21G53}>
                          {group5Jsx('g2153',ip2CodeChanged,ii2CodeChanged)}
                          <Accordion>
                            <Accordion.Item eventKey="22">
                              <Accordion.Header>Экземпляр 4</Accordion.Header>
                              <Accordion.Body onEnter={showGroupS21G54} onExited={hideGroupS21G54}>
                                {group5Jsx('g2154',ip2CodeChanged,ii2CodeChanged)}
                                <Accordion>
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
              <Accordion>
                <Accordion.Item eventKey="25">
                  <Accordion.Header>Экземпляр 2</Accordion.Header>
                  <Accordion.Body onEnter={showGroupS21G62} onExited={hideGroupS21G62}>
                    {group6Jsx('s21g62',wb2CodeChanged,wbi2CodeChanged)}
                    <Accordion>
                      <Accordion.Item eventKey="26">
                        <Accordion.Header>Экземпляр 3</Accordion.Header>
                        <Accordion.Body onEnter={showGroupS21G63} onExited={hideGroupS21G63}>
                          {group6Jsx('s21g63',wb2CodeChanged,wbi2CodeChanged)}
                          <Accordion>
                            <Accordion.Item eventKey="27">
                              <Accordion.Header>Экземпляр 4</Accordion.Header>
                              <Accordion.Body onEnter={showGroupS21G64} onExited={hideGroupS21G64}>
                                {group6Jsx('s21g64',wb2CodeChanged,wbi2CodeChanged)}
                                <Accordion>
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
          <Form.Label>Расход воды (Группа 2)</Form.Label>
          <Form.Control type="number" value={waterConsumption} onChange={waterConsumptionChanged} step="any" pattern="[0-9]+([.,][0-9]+)?"/>
          <Form.Text className="text-muted">
            Метры кубические за секунду (м<sup>3</sup>/с)
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="form-river-cross-sectional-area">
          <Form.Label>Площадь сечения реки (Группа 3)</Form.Label>
          <Form.Control type="number" value={riverArea} onChange={riverAreaChanged} pattern="[0-9]+([.,][0-9]+)?" step="any"/>
          <Form.Text className="text-muted">
            Метры квадратные (м<sup>2</sup>)
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="form-max-depth">
          <Form.Label>Максимальная глубина (Группа 4)</Form.Label>
          <Form.Control type="number" value={maxDepth} onChange={maxDepthChanged} min="1" max="9999" pattern='[0-9]{1,4}'/>
          <Form.Text className="text-muted">
            В сантиметрах
          </Form.Text>
        </Form.Group>
      </Accordion.Body>
    </Accordion.Item>
  </Accordion>
  const telegramCard = <Card
    bg={'Primary'}
    text={'black'}
    style={{ width: '18rem', position: 'fixed', width: '380px', top: '60px',left: '10px'}}
    className="mb-2">
    <Card.Body>
      <Card.Title>Текст телеграммы</Card.Title>
      <Card.Text>
        {telegram}
      </Card.Text>
    </Card.Body>
  </Card>
  const myForm =
    <Form onSubmit={handleSubmit(onSubmit)} onReset={reset}> 
      <Form.Label>Раздел 1</Form.Label>
      {waterLevelJsx('group11',waterLevel)}
      {wlDeviationJsx('group12',waterLevelDeviation)}
      <Accordion alwaysOpen activeKey={activeKeys}  onSelect={handleSelect}>
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
                  <Accordion>
                    <Accordion.Item eventKey="4">
                      <Accordion.Header>Экземпляр 3</Accordion.Header>
                      <Accordion.Body onEnter={showGroup153} onExited={hideGroup153}>
                        {group5Jsx('g153',ip1CodeChanged,ii1CodeChanged)}
                        <Accordion>
                          <Accordion.Item eventKey="5">
                            <Accordion.Header>Экземпляр 4</Accordion.Header>
                            <Accordion.Body onEnter={showGroup154} onExited={hideGroup154}>
                              {group5Jsx('g154',ip1CodeChanged,ii1CodeChanged)}
                              <Accordion>
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
            <Accordion>
              <Accordion.Item eventKey="8">
                <Accordion.Header>Экземпляр 2</Accordion.Header>
                <Accordion.Body onEnter={showGroup162} onExited={hideGroup162}>
                  {group6Jsx('g162',wb1CodeChanged,wbi1CodeChanged)}
                  <Accordion>
                    <Accordion.Item eventKey="9">
                      <Accordion.Header>Экземпляр 3</Accordion.Header>
                      <Accordion.Body onEnter={showGroup163} onExited={hideGroup163}>
                        {group6Jsx('g163',wb1CodeChanged,wbi1CodeChanged)}
                        <Accordion>
                          <Accordion.Item eventKey="10">
                            <Accordion.Header>Экземпляр 4</Accordion.Header>
                            <Accordion.Body onEnter={showGroup164} onExited={hideGroup164}>
                              {group6Jsx('g164',wb1CodeChanged,wbi1CodeChanged)}
                              <Accordion>
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
      {additionSection6}
      <Button variant="primary" type="submit">
        Сохранить
      </Button>
    </Form>

  let content
  content = <div>
    {/* {telegramCard} */}
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