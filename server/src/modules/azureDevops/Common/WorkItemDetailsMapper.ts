import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces'
import WorkItemDetails from './WorkItemDetails'

export class WorkItemDetailsMapper {
  map(workItems: WorkItem[]) {
    return workItems.filter(x => x != null).map(this.mapSingle)
  }

  mapSingle(workItem: WorkItem): WorkItemDetails {
    let wi = new WorkItemDetails()

    let assignedTo = workItem.fields['System.AssignedTo']
    let testerName = workItem.fields['Cin7Scrum.TestedBy']
    wi.creator = assignedTo ? assignedTo.displayName : 'Unassigned'
    wi.id = workItem.id
    wi.area = this.getLastPartOfAreaPath(workItem.fields['System.AreaPath'])
    wi.testerName = testerName ? testerName.displayName : 'Unassigned'
    wi.title = workItem.fields['System.Title'] || 'No title set'
    wi.url = workItem._links.html.href
    return wi
  }

  getLastPartOfAreaPath = (rawArea: string): string => {
    if (!rawArea || rawArea == '') {
      return 'Unknown' // a bit conflicted over returning default values. maybe null is better
    }

    return rawArea.split('\\').pop()
  }
}
