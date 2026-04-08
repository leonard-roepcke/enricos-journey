const fs = require('fs');
const path = require('path');
const Mega = require('megajs');

// MEGA file link (shared link with key)
const MEGA_LINK = 'https://mega.nz/file/rGx3hYaI#15Qrx-te0hYspdFAA3w6qDwisSAjHcVQ2JMGZyAFNsE';
const outPath = path.join(__dirname, '..', 'public', 'enricos-mega.jpg');

console.log('Downloading MEGA file to:', outPath);

const file = new Mega.File({ url: MEGA_LINK });

file.once('ready', function() {
  const stream = file.download();
  const out = fs.createWriteStream(outPath);
  stream.pipe(out);
  out.on('finish', () => {
    console.log('Download finished:', outPath);
  });
  out.on('error', (err) => {
    console.error('Write error:', err);
    process.exit(1);
  });
});

file.on('error', function(err) {
  console.error('MEGA error:', err);
  process.exit(1);
});
