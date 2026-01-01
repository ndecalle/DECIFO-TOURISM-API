const cloudinary = require('cloudinary').v2;
const { PassThrough } = require('stream');
const dotenv = require('dotenv');

dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

function makeUnconfiguredStub() {
  const errMsg = 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.';
  return {
    uploader: {
      upload_stream: (opts = {}, cb = () => {}) => {
        const err = new Error(errMsg);
        // call callback with error and return a passthrough stream so piping doesn't crash immediately
        process.nextTick(() => cb(err));
        const stream = new PassThrough();
        process.nextTick(() => stream.end());
        return stream;
      },
      destroy: async () => {
        throw new Error(errMsg);
      }
    }
  };
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary env vars are not set. Upload endpoints will return a clear configuration error.');
  module.exports = makeUnconfiguredStub();
} else {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
  });

  module.exports = cloudinary;
}
