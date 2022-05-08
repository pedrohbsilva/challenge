const fs = require('fs');

function formatPhone(phone){
  let phoneOnlyText = phone.replace(')','')
  phoneOnlyText = phoneOnlyText.replace('(','')
  phoneOnlyText = phoneOnlyText.split(' ')
  phoneOnlyText = phoneOnlyText.join('')
  if(!isNaN(phoneOnlyText) && phoneOnlyText.length > 9){
    return `55${phoneOnlyText}`
  }
  return undefined
}

function validEmail(email){
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function formatEmail(email){
  if(validEmail(email)){
    return email
  }
  return undefined
}

function readCSV() {
  const data = fs.readFileSync('input.csv', 'utf8');
  const arrayData = data.split('\n')
  return arrayData
}

function createAddress(key, value) {
  const [type, ...data] = key.split(' ')
  if (value[key] === '') {
    return undefined
  }
  if (value[key].indexOf('/') !== -1) {
    const address = value[key].split('/').map((phoneOrEmail) => ({
      type: type,
      tags: data,
      address: type == 'phone' ? formatPhone(phoneOrEmail) : formatEmail(phoneOrEmail)
    }))
    return address
  }
  if(type == 'phone' && formatPhone(value[key]) === undefined){
    return undefined
  }
  if(type == 'email' && formatEmail(value[key]) === undefined){
    return undefined
  }
  return {
    type: type,
    tags: data,
    address: type == 'phone' ? formatPhone(value[key]) : formatEmail(value[key])
  }
}

function createClasses(classInfo) {
  if (classInfo.indexOf(' / ') !== -1) {
    return [...classInfo.replaceAll(/"/g, '').split(' / ')]
  }
  if (classInfo.indexOf(' - ') !== -1) {
    return [...classInfo.replaceAll(/"/g, '').split(' - ')]
  }
  return classInfo
}

function mountJson(arrayOfObject) {
  let fullname = ''
  let eid = ''
  let invisible = ''
  const classes = []
  const addresses = []

  arrayOfObject.map((item) => {
    if (Object.keys(item) == 'fullname' && item?.fullname !== '') {
      fullname = item?.fullname
    }
    if (Object.keys(item) == 'eid' && item?.eid !== '') {
      eid = item?.eid
    }
    if (Object.keys(item) == 'invisible') {
      invisible = item.invisible === '1' || item.invisible === 'yes'
    }
    if (Object.keys(item) == 'see_all') {
      see_all = item.see_all === '1' || item.see_all === 'yes'
    }
    if (Object.keys(item) == 'class' && item?.class !== '') {
      const resultClass = createClasses(item.class)
      if (typeof resultClass == 'string') {
        classes.push(resultClass)
        return
      }
      else {
        classes.push(...resultClass)
      }
    }

    Object.keys(item).forEach((key) => {
      if (key.includes('email') || key.includes('phone')) {
        const resultAddress = createAddress(key, item)
        if (resultAddress?.length !== undefined) {
          resultAddress.map((item) => {
            addresses.push(item)
          })
        }
        if (resultAddress !== undefined && resultAddress?.length === undefined) {
          let existAddress = addresses.findIndex(({address}) => resultAddress.address === address)
          if(existAddress === -1){
            addresses.push(resultAddress)
          }
          else{
            addresses[existAddress].tags = [...new Set([...addresses[existAddress].tags ,...resultAddress.tags])];            
          }
        }
      }
    })
  })

  return {
    fullname,
    eid,
    classes: classes.length === 1 ? classes[0] : classes,
    addresses,
    invisible,
    see_all
  }
}

function changeForJson() {
  const dataFromCSV = readCSV()
  const [header, ...data] = dataFromCSV
  const itemsFromHeader = header
    .replaceAll(',', '-')
    .replaceAll('- ', ' ')
    .replaceAll(/"/g, '')
    .split('-')

  let outputJson = []

  for (let index = 0; index < data.length; index++) {
    const removeCommaFromSpaceImproper = data[index].replace(', ', ' - ')
    const arrayFromData = removeCommaFromSpaceImproper.replaceAll(',', ',-').split(',')

    const convertInArrayOfObject = arrayFromData.map((value, index) => {
      return {
        [itemsFromHeader[index]]: value.replace('-', '')
      }
    })
    const resultOfMount = mountJson(convertInArrayOfObject)
    const existStudent = outputJson.findIndex(({fullname}) => fullname === resultOfMount.fullname)
    
    if(existStudent !== -1){
        outputJson[existStudent].fullname = outputJson[existStudent].fullname,
        outputJson[existStudent].eid = outputJson[existStudent].eid,
        outputJson[existStudent].classes = [...outputJson[existStudent].classes, ...resultOfMount.classes],
        outputJson[existStudent].addresses = [...outputJson[existStudent].addresses, ...resultOfMount.addresses],
        outputJson[existStudent].invisible = outputJson[existStudent].invisible || resultOfMount.invisible,
        outputJson[existStudent].see_all = outputJson[existStudent].see_all|| resultOfMount.see_all
    }
    else{
      outputJson.push(resultOfMount)
    }
  }
  fs.writeFileSync('output.json', JSON.stringify(outputJson, null, 4));
}

changeForJson()

