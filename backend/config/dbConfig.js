const mongoURI = "mongodb://127.0.0.1:27017/compiler";

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

module.exports = {
  mongoURI,
  mongoOptions,
};
