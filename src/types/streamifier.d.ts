declare module 'streamifier' {
  import { Readable } from 'stream';

  export function createReadStream(buffer: Buffer): Readable;
  const streamifier: {
    createReadStream: (buffer: Buffer) => Readable;
  };
  export default streamifier;
}