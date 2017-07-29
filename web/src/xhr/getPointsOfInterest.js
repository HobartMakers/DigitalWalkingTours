

export default function getPointsOfInterest(lat, long, radius){
  return fetch(`https://tascode.com/govhack2017/points.php?x=${lat}&y=${long}&radius=${radius}`, {
    //method: 'get',
    headers: {
      'Content-Type': 'application/json',
      
    },
    mode: 'cors',
  })
  .then(response => {
    return response.json()
    .then(result => {
      if(response.status != 200){
        throw new Error(result.message)
      }
      return result
    })
  })  
}
