process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    chunk = chunk.split('').reverse().join('') + '\n';
    process.stdout.write(`${chunk}`);
  }
});
