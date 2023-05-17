import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import mqtt from 'mqtt/dist/mqtt'
import MQTT from 'mqtt'

import mqttClient from 'u8-mqtt/esm/web/index.js'

function App() {
  const [count, setCount] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState(false)
  const [messages, setMessages] = useState([])

  // useEffect(() => {
    
  //   // const client = mqtt.connect('wss://test.mosquitto.org', {port: 8080})
  //   // const client = MQTT.connect('wss://test.mosquito.org', {port: 8080})
  //   // const client = mqtt.connect('wss://broker.hivemq.com', {port: 8000})

  //   client.on('connect', () => setConnectionStatus(true))
  //   client.on('message', (topic, payload, packet) => {
  //     setMessages(messages.concat(payload.toString()))
  //   })
  // }, [])

  /**
   mosquitto_pub -t 'u8-mqtt/demo-simple/oi_pi2' -m "oi"
   Error: A network protocol error occurred when communicating with the broker.
   */

  let client
  useEffect(() => {
    async function connect() {
      client = mqttClient()
      // .with_websock('wss://test.mosquitto.org:8081')
      .with_websock('ws://localhost:8081')
      // .with_websock('wss://127.0.0.1:8081')
        .with_autoreconnect()
  
        await client.connect()

        client.subscribe_topic(
          'u8-mqtt/demo-simple/:topic',
          (packet, params, context) => {
            console.log('topic packet', params, packet, packet.json());
            console.log( packet);
            console.log(packet.json());
          }
        )

        await client.json_send(
          'u8-mqtt/demo-simple/:topic',
          {
            note: 'from web bundle example',
            live: new Date().toISOString()
          }
        )
    }  

    connect()

    return () => client.disconnect()
  }, [])

  return (
    <>
      <div>
        <h2>{connectionStatus ? 'Conectado' : 'Não conectado'} </h2>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <hr />
      <h3>Messages:</h3>
      {messages.map(m => (
        <h2>{m}</h2>
      ))}
    </>
  )
}

export default App
