import WorkItemDetails from './Common/WorkItemDetails'

export class SlackPostingService {
  postWorkItems(
    buildNumber: number,
    buildUri: string,
    workItemDetails: WorkItemDetails[],
    channel: string,
    apiKey: string
  ) {}
  postReleasingMessage(
    buildNumber: number,
    buildUri: string,
    releasePersonDisplayName: string,
    apiKey: string
  ) {}
}
