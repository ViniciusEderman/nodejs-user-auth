const redis = require("redis");

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (err) => {
  console.error("Erro ao conectar ao Redis:", err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Conectado ao Redis com sucesso");
  } catch (error) {
    console.error("Erro na conexão com o Redis:", error);
  }
})();

const Cache = async (req, res, next) => {
  const key = "users";

  try {
    console.log(`Verificando cache para a chave: ${key}`);
    const cacheData = await redisClient.get(key);

    if (cacheData) {
      console.log('Dados encontrados no cache.');
      return res.json(JSON.parse(cacheData));
    } 
    else {
      res.saveToCache = async (data) => {
        console.log('Salvando dados no cache.');
        await redisClient.set(key, JSON.stringify(data), { EX: 3600 });
      };
    }
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};

const CacheUserByID = async (req, res, next) => {
  const { id } = req.params;
  const key = `user:${id}`;

  try {
    const cacheData = await redisClient.get(key);

    if(!cacheData) {
      res.saveToCache = async (data) => {
        await redisClient.set(
          key,
          JSON.stringify(data), {
          EX: 3600
        });
      }
      return next();
    }

    return res.json(JSON.parse(cacheData));
  } catch (error) {
    console.log(error);
    next();
  }
}

module.exports = { Cache, CacheUserByID };
