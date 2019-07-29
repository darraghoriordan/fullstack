import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'

export const environmentHasPreApprovalAtStage = (
  item: ri.Release,
  environmentName: string
): boolean => {
  let environmentState = item.environments.find(x => x.name == environmentName)
  if (!environmentState) {
    return false
  }
  let approval = environmentState.preDeployApprovals.find(
    x => (x.approvalType = ri.ApprovalType.PreDeploy)
  )
  if (!approval) {
    return false
  }
  return approval.status == ri.ApprovalStatus.Approved
}

export const environmentStateIsAsExpected = (
  item: ri.Release,
  environmentName: string,
  expectedStatesMask: ri.EnvironmentStatus
): boolean => {
  let environmentState = item.environments.find(x => x.name == environmentName)
  if (!environmentState) {
    return false
  }

  return environmentState.status === (environmentState.status & expectedStatesMask)
}
