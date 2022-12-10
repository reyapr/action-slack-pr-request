const core = require("@actions/core");
const axios = require('axios');

(async () => {
  try {
  
    const mappedSlackUserIds = JSON.parse(core.getInput('mapped-slack-user-id'))
    const prUrl = core.getInput('pr-url')
    
    const reviewers = JSON.parse(core.getInput('pr-reviewers')).map(d => d.login)
    const slackUserIds = reviewers.map(name => mappedSlackUserIds[name])
    const mentionText = slackUserIds.reduce((curr, acc) => {
      curr += `<@${acc}> `
      return curr
    }, '')
    
    const payload = {
      text: `Hi ${mentionText} \n Please review this PR: ${prUrl}`
    }

    await axios.post(
      `${core.getInput('slack-webhook-url')}`, 
      payload);
  } catch (error) {
    console.log(error)
    core.setFailed(error.message);
  }
})();