import { DataTypes, Sequelize, Model } from "sequelize";

export class Conversation extends Model {
  public id!: string;
  public userId!: string;
  public modelName!: string;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    this.hasMany(models.Message, { foreignKey: "conversationId", as: "messages" });
  }
}

export const initConversation = (sequelize: Sequelize) => {
  Conversation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      modelName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Conversation",
      tableName: "conversations",
      timestamps: true,
    }
  );

  return Conversation;
};
