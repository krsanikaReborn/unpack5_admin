const currentHost = "dev";

const env = {
  dev: {
    apiServer: "http://47eac90d-4c1e-4737-9b84-c0ff8fc0098f.mock.pstmn.io",
    imgServer: "https://b5selfie-temp.s3.ap-northeast-2.amazonaws.com",
  },
  local: {
    apiServer: "http://localhost:3000",
    imgServer: "http://localhost:8080",
  },
  prod: {
    apiServer: "http://192.168.0.10:3000",
    imgServer: "http://192.168.0.10:8080",
  },
};

const getHostUrl = () => {
  return env[currentHost];
};
