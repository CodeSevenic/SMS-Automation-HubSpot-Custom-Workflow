require('dotenv').config();
const {
  getAllCustomActions,
  archiveAction,
  updateAction,
  updateOneAction,
} = require('../api-queries/custom-actions');
const appId = 1454472;
const developerApiKey = process.env.DEV_API;

exports.getCustomActions = async (req, res) => {
  const actions = await getAllCustomActions();
  res.status(200).json({
    actions: actions,
  });
};

exports.archiveActions = async (req, res) => {
  // const actions = await getAllCustomActions();

  // actions.forEach(async (action) => {
  // if (action.id !== '31040352') {
  const response = await archiveAction('31097494', appId, developerApiKey);
  // }
  // });

  res.status(200).json({
    response: response,
  });
};

exports.updateAction = async (req, res) => {
  const actions = await getAllCustomActions();

  let results;

  actions.forEach(async (action) => {
    if (action.id === '31040352') {
      results = await updateAction(appId, action.id, developerApiKey);
    }
  });

  res.status(200).json({
    results: results,
  });
};

exports.updateSpecificAction = async (req, res) => {
  const response = updateOneAction(appId, '31097494', developerApiKey);

  res.status(200).json({
    response: response,
  });
};
