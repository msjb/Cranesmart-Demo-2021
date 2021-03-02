<template>
  <div class="container">
    <h1>Mike Bessette - 2021/03/01</h1>
    <div class="row">
      <div class="col-lg" v-for="(device, index) in devices" :key="index">
        <div class="card">
          <div class="card-header">
            {{ device.name }}
          </div>
          <div class="card-body">
            <p class="card-text">
              <b>{{ device.value }}</b>
              <br />
              <i>{{ device.timestamp | formatDate }}</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
let socket = io.connect('http://localhost:3000')

export default {
  name: "Devices",
  data () {
    // devices requires array, as per spec
    let devices = [
      {
        id: 1,
        name: 'Load',
        value: 0,
        timestamp: new Date()
      },
      {
        id: 2,
        name: 'Block Height',
        value: 0,
        timestamp: new Date()
      },
      {
        id: 3,
        name: 'Pressure',
        value: 0,
        timestamp: new Date()
      }
    ];

    // map device id to array index
    let index = {};
    for (let i = 0; i < devices.length; i++) {
      index[devices[i].id] = i;
    }

    return {
      devices: devices,
      index: index
    }
  },
  created() {

    setInterval(function() {
      // only required so the event emits the assumed data structure
      let deviceNames = {
        1: 'Load',
        2: 'Block Height',
        3: 'Pressure'
      };

      let id = Math.floor(Math.random() * 3) + 1;
      socket.emit('sensor-update', {
        id: id,
        name: deviceNames[id],
        value: Math.floor(Math.random() * 1000),
        timestamp: new Date()
      });
    }, 100);


    socket.on('update-client', (data) => {
      let index = this.index[data.id];
      let currentValue = this.devices[index].value;
      // only update value on actual change
      if (data.value !== currentValue) {
        this.devices[index].value = data.value;
      }
      // always update timestamp
      this.devices[index].timestamp = data.timestamp;
    })
  }
}
</script>