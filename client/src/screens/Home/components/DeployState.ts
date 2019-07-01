export interface DeployState {
  order: number
  name: string
  currentBranch: string
  currentBranchUri: string
  deployedOn: Date
  deployedBy: string
  workItemNumber: string
  workItemTitle: string
  workItemUri: string
}
