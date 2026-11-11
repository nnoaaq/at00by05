# AWS LAMBDA DYNAMODB TIETOKANTA

## /measurement/save

- Pakollisia kenttiä sensorId, sensorName, timeStamp
- Valinnaisia kenttiä temperature, humidity
- Voi lähettää taulukossa

```json
[
  {
    "sensorId": "tuplatesti",
    "sensorName": "tuplatesti",
    "timeStamp": 1795388467,
    "temperature": 12.5
  },
  {
    "sensorId": "tuplatesti",
    "sensorName": "tuplatesti",
    "timeStamp": 1796398467,
    "temperature": 22.5
  }
]
```

- Voi lähettää yksittäisen objektin

```json
{
  "sensorId": "yksitesti",
  "sensorName": "yksitesti",
  "timeStamp": 1795388667,
  "temperature": -25.5,
  "humidity": 12
}
```
