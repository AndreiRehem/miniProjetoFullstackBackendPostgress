import { DataTypes, Sequelize, Model } from "sequelize";

export class Message extends Model {
  public id!: string;
  public conversationId!: string;
  public role!: "user" | "model";
  public text!: string;
  public timestamp!: Date;

  static associate(models: any) {
    this.belongsTo(models.Conversation, { foreignKey: "conversationId", as: "conversation" });
  }
}

export const initMessage = (sequelize: Sequelize) => {
  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      conversationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("user", "model"),
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: false,
    }
  );

  return Message;
};
