function checkObjectFields(res, obj){
  for(let i in obj){
    if(!obj[i]){
      return res.status(400).json({ 
        message: 'Не все обязательные поля заполнены' 
      });
    }
  }
}

module.exports = {
  checkObjectFields
}