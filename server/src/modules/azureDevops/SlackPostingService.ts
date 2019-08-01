import WorkItemDetails from './Common/WorkItemDetails'
import { IncomingWebhook } from '@slack/webhook'
import { SLACK_WEBHOOK_URL } from '../../modules/common/consts'
import { StagingEnvironmentState } from './StagingEnvironment/StagingEnvironmentState'
import logger from '../logging/logger'

export class SlackPostingService {
  private readonly slackClient: IncomingWebhook
  constructor() {
    this.slackClient = new IncomingWebhook(SLACK_WEBHOOK_URL)
  }

  async postMessageLine(messageLine: string) {
    await this.slackClient.send({
      text: messageLine,
      username: 'Release Tool',
      icon_emoji: ':rolled_up_newspaper:',
    })
  }

  postStagingWorkItems(stagingBuild: StagingEnvironmentState) {
    let messages = this.getStagingMessages(stagingBuild)
    logger.info('slack messages', messages)
    messages.forEach(message => this.postMessageLine(message))
  }

  postDeployingMessage(buildNumber: number, buildUri: string) {
    this.postMessageLine(
      `<!channel> PRODUCTION deploy starting :sun_behind_cloud: " + "*" + "Cloud" + "*" + " :sun_behind_cloud: Build : <${buildUri}|${buildNumber}>`
    )
  }

  postDeployedMessage(buildNumber: number, buildUri: string) {
    this.postMessageLine(
      `<!channel> PRODUCTION deploy complete :sun_behind_cloud: " + "*" + "Cloud" + "*" + " :sun_behind_cloud: Build : <${buildUri}|${buildNumber}>`
    )
  }

  getStagingMessages(stagingBuild: StagingEnvironmentState): string[] {
    let dataToSendToSlack: string[] = []
    dataToSendToSlack.push(
      `<!channel> STAGING deploy starting :sun_behind_cloud: " + "*" + "Cloud" + "*" + " :sun_behind_cloud: Build : <${
        stagingBuild.buildUri
      }|${stagingBuild.buildNumber}>`
    )
    //select distinct categories
    const distinctCategories = [...new Set(stagingBuild.workitems.map(x => x.area))]
    // for each cat
    let iconCounter = 0
    distinctCategories.forEach(category => {
      dataToSendToSlack.push(`*${category}*`)
      let categoryWorkItems = stagingBuild.workitems.filter(x => x.area == category)

      categoryWorkItems
        .map(workItem => {
          let workItemString = this.mapWorkItemToSlackMessage(workItem, iconCounter)
          iconCounter++
          return workItemString
        })
        .forEach((x: string) => dataToSendToSlack.push(x))
    })
    return dataToSendToSlack
  }

  mapWorkItemToSlackMessage(workItem: WorkItemDetails, index: number): string {
    return `>${this.icons[index]}*<${workItem.url}|${workItem.id}>* - ${workItem.title} - \`${
      workItem.creator
    }\` - _Tester: ${workItem.testerName} `
  }

  icons: string[] = [
    ':one: ',
    ':two: ',
    ':three: ',
    ':four: ',
    ':five: ',
    ':six: ',
    ':seven: ',
    ':eight: ',
    ':nine: ',
    ':dog: ',
    ':ghost: ',
    ':alien: ',
    ':robot_face: ',
    ':100: ',
    ':japanese_goblin: ',
    ':rabbit: ',
    ':japanese_ogre: ',
    ':octopus: ',
    ':monkey: ',
    ':boar: ',
    ':turtle: ',
    ':snail: ',
    ':whale2: ',
    ':wolf: ',
    ':fox_face: ',
    ':bat: ',
    ':deer: ',
    ':panda_face: ',
    ':koala: ',
    ':bear: ',
    ':giraffe_face: ',
    ':hamster: ',
    ':lion_face: ',
    ':tiger: ',
    ':horse: ',
    ':goat: ',
    ':owl: ',
    ':eagle: ',
    ':bird: ',
    ':dove_of_peace: ',
    ':turkey: ',
    ':rooster: ',
    ':bee: ',
    ':butterfly: ',
    ':scorpion: ',
    ':dragon: ',
    ':crab: ',
    ':beetle: ',
    ':spades: ',
    ':hearts: ',
    ':clubs: ',
    ':diamonds: ',
    ':game_die: ',
    ':cyclone: ',
    ':tornado: ',
    ':gear: ',
    ':crystal_ball: ',
    ':scales: ',
    ':fleur_de_lis: ',
    ':wakanda: ',
  ]

  iconsTwo: string[] = [
    ':1train: ',
    ':2train: ',
    ':3train: ',
    ':4train: ',
    ':5train: ',
    ':6train: ',
    ':7train: ',
    ':8train: ',
    ':9train: ',
    ':penguin: ',
    ':frog: ',
    ':dolphin: ',
    ':fish: ',
    ':tropical_fish: ',
    ':shark: ',
  ]
}
