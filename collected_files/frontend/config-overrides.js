module.exports = function override(config, env) {
  if (env === 'development' && config.devServer) {
    config.devServer.allowedHosts = 'all'; // Разрешить все хосты
    config.devServer.host = '0.0.0.0'; // Хост для подключения
    config.devServer.port = 3000; // Убедитесь, что порт указан явно
  }
  return config;
};
