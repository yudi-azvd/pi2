import './style.css'


const par = document.querySelector<HTMLParagraphElement>('#app p')!
const scan = document.querySelector<HTMLButtonElement>('button')!

scan.addEventListener('click', async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: [0x00FF, 0x00EE] },
        { name: 'GATTS_DEMO' },
        { name: 'ESP_GATTS_DEMO' },
      ],
      // acceptAllDevices: true,
      // optionalServices: ['battery_service'],
    })

    console.log(device.name);
    
    const server = await device.gatt?.connect()
    const service = await server?.getPrimaryService(0x00FF)
    const characteristic = await service?.getCharacteristic(0xFF01)
    
    await characteristic?.startNotifications()

    characteristic?.addEventListener('characteristicvaluechanged', (e) => {
      const value = e.target.value.getUint8()
      const view: DataView = e.target.value

      var arr = [
        view.getUint8(0),
        view.getUint8(1),
        view.getUint8(2),
        view.getUint8(3),
      ]

      arr = arr.map(item => item.toString(16))

      console.log({arr});

      par.innerText = arr.join(', ')
    })

    // characteristic?.removeEventListener()

    characteristic?.readValue()
    const b = new SourceBuffer()
    await characteristic?.writeValue(b)
  }

  catch (e) {
    console.log(e);

  }
})


par.innerText = 'oi'