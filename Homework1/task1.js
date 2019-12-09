process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    process.stdout.write(`${chunk.split('').reverse().join('')}\n`);
  }
});
