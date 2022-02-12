import { Sequelize } from "sequelize";

const { DataTypes } = Sequelize;

const PlayerModel = (instance) =>
  instance.define("Player", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    money: {
      type: DataTypes.BIGINT,
      defaultValue: 20,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    pin: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });

async function createPlayer(model, name, pin) {
  try {
    return await model.create({
      name: name,
      pin: pin,
    });
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function findAllPlayers(model) {
  try {
    return await model.findAll();
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function findPlayerByLogin(model, name, pin) {
  return await model.findOne({ where: { name: name, pin: pin } });
}

async function findPlayerByID(model, id) {
  return await model.findOne({ where: { id: id } });
}

async function updatePlayerByID(model, id, options) {
  try {
    return await model.update(
      {
        name: options.name,
        pin: options.pin,
        isAdmin: options.isAdmin,
        money: options.money,
      },
      {
        where: {
          id: id,
        },
      }
    );
  } catch (err) {
    console.error(err);
    return false;
  }
}

export {
  PlayerModel,
  createPlayer,
  findAllPlayers,
  updatePlayerByID,
  findPlayerByID,
  findPlayerByLogin,
};
