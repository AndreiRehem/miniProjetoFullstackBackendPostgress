import { Sequelize } from "sequelize";
import { sequelize } from "../database";

import { initUser } from "./User";
import { initConversation } from "./Conversation";
import { initMessage } from "./Message";

const User = initUser(sequelize);
const Conversation = initConversation(sequelize);
const Message = initMessage(sequelize);

const db = {
  sequelize,
  Sequelize,
  User,
  Conversation,
  Message,
};

Object.values(db).forEach((model: any) => {
  if (model?.associate) {
    model.associate(db);
  }
});

export default db;
