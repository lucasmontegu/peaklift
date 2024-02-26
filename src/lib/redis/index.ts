import { Query } from "@upstash/query";
import { Redis } from "@upstash/redis";

export const q = new Query({
  redis: Redis.fromEnv({ automaticDeserialization: false }),
});



