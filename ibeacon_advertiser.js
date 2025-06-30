const bleno = require('@stoprocent/bleno');

const BEACON_UUID = 'e2c56db5dffb48d2b060d0f5a71096e0';
const MAJOR = 0; // 0x0000 - 0xffff
const MINOR = 0; // 0x0000 - 0xffff
const MEASURED_POWER = -59; // -128 - 127

bleno.on('stateChange', async function(state) {
  if (state === 'poweredOn') {
    console.log('Bluetooth is powered on. Starting advertisement...');
    try {
      bleno.startAdvertisingIBeacon(
        BEACON_UUID, 
        MAJOR, 
        MINOR, 
        MEASURED_POWER
      );
      console.log('Advertisement started successfully.');
      console.log('Advertising iBeacon...');
    } catch (err) {
      console.error('Error starting advertisement:', err);
    }
  } else {
    console.log('Bluetooth is not powered on. State:', state);
    if (bleno.state === 'advertising') {
        await bleno.stopAdvertising();
    }
  }
});


bleno.on('startAdvertisingIBeacon', function(error) {
  if (error) {
    console.error('Advertising start error (event):', error);
  } else {
    console.log('Advertising started (event) successfully!');
  }
});

bleno.on('advertisingStop', function() {
  console.log('Advertising stopped.');
});

process.on('SIGINT', async function() {
  console.log('Stopping advertising and exiting...');
  if (bleno.state === 'advertising' || bleno.state === 'poweredOn') {
      await bleno.stopAdvertising();
  }
  process.exit();
});