const Sequelize = require('sequelize')
const sequelize = require('../conn')

const schema = {
  customerNum: Sequelize.INTEGER,
  isOpen: Sequelize.BOOLEAN,
  tableNum: Sequelize.INTEGER,
  subtotal: Sequelize.INTEGER,
  tax: Sequelize.INTEGER,
  tip: Sequelize.INTEGER,
}

const config = {
  timestamps: true,
  updatedAt: false,
  createdAt: 'time',
}

module.exports = sequelize.define('tab', schema, config)
