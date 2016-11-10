/**
 * Module dependencies
 */
var ft = require('./fileTools');
var formatTools = require('./formatTools');

/**
 * Generate a Mongoose model
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateModel(path, modelName, modelFields, generateMethod, cb) {
    var fields = formatTools.getFieldsForModelTemplate(modelFields);
    var schemaName = modelName + 'Schema';

    var model = ft.loadTemplateSync('model.js');
    model = model.replace(/{modelName}/g, modelName);
    model = model.replace(/{schemaName}/g, schemaName);
    model = model.replace(/{fields}/, fields);

    if (generateMethod == 't') {
        ft.createDirIfIsNotDefined(path, 'models', function () {
            ft.writeFile(path + '/models/' + modelName + '.js', model, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Model.js', model, null, cb);
        });
    }
}

/**
 * Generate a Express router
 * @param {string} path
 * @param {string} modelName
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateRouter(path, modelName, generateMethod, cb) {
    var router = ft.loadTemplateSync('router.js');
    router = router.replace(/{controllerName}/g, modelName);

    if (generateMethod == 't') {
        ft.createDirIfIsNotDefined(path, 'routes', function () {
            router = router.replace(/{controllerPath}/g, '\'../controllers/' + modelName + '.js\'');
            ft.writeFile(path + '/routes/' + modelName + 'Routes.js', router, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            router = router.replace(/{controllerPath}/g, '\'./' + modelName + '.js\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Routes.js', router, null, cb);
        });
    }
}

/**
 * Generate Controller
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateController(path, modelName, modelFields, generateMethod, cb) {
    var controller = ft.loadTemplateSync('controller.js');

    var updateFields = '';
    var createFields = '\r';

    modelFields.forEach(function (f, index, fields) {
        var field = f.name;

        updateFields += modelName + '.' + field + ' = req.body.' + field + ' ? req.body.' + field + ' : ' +
            modelName + '.' + field + ';';
        updateFields += '\r\t\t\t';

        createFields += '\t\t\t' + field + ' : req.body.' + field;
        createFields += ((fields.length - 1) > index) ? ',\r' : '\r';
    });

    controller = controller.replace(/{modelName}/g, modelName);
    controller = controller.replace(/{name}/g, modelName);
    controller = controller.replace(/{pluralName}/g, formatTools.pluralize(modelName));
    controller = controller.replace(/{controllerName}/g, modelName);
    controller = controller.replace(/{createFields}/g, createFields);
    controller = controller.replace(/{updateFields}/g, updateFields);

    if (generateMethod == 't') {
        ft.createDirIfIsNotDefined(path, 'controllers', function () {
            controller = controller.replace(/{modelPath}/g, '\'../models/' + modelName + '.js\'');
            ft.writeFile(path + '/controllers/' + modelName + '.js', controller, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            controller = controller.replace(/{modelPath}/g, '\'./' + modelName + '.js\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Controller.js', controller, null, cb);
        });
    }
}

module.exports = {
    generateModel: generateModel,
    generateRouter: generateRouter,
    generateController: generateController
};
