var DataTypes = require("sequelize").DataTypes;
var _pro_stu = require("./pro_stu");
var _programs = require("./programs");
var _student = require("./student");
var _teacher = require("./teacher");
var _user = require("./user");

function initModels(sequelize) {
  var pro_stu = _pro_stu(sequelize, DataTypes);
  var programs = _programs(sequelize, DataTypes);
  var student = _student(sequelize, DataTypes);
  var teacher = _teacher(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  pro_stu.belongsTo(programs, { as: "pro", foreignKey: "pro_id"});
  programs.hasMany(pro_stu, { as: "pro_stus", foreignKey: "pro_id"});
  pro_stu.belongsTo(student, { as: "stu", foreignKey: "stu_id"});
  student.hasMany(pro_stu, { as: "pro_stus", foreignKey: "stu_id"});
  programs.belongsTo(teacher, { as: "teacher", foreignKey: "teacher_id"});
  teacher.hasMany(programs, { as: "programs", foreignKey: "teacher_id"});
  student.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(student, { as: "students", foreignKey: "user_id"});

  return {
    pro_stu,
    programs,
    student,
    teacher,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
